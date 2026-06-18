import re
import tempfile
import threading
import time
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask

from utils.anki_helpers import write_anki_package
from utils.gemini_deck_builder import (
    SUPPORTED_TRANSLATION_LANGUAGES,
    DeckBuildError,
    build_deck,
)
from utils.word_reader import SUPPORTED_EXTENSIONS, read_words


app = FastAPI(title="Anki Vocabulary Creator API", version="1.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_SIZE = 2 * 1024 * 1024
jobs = {}
jobs_lock = threading.Lock()


def safe_file_name(value: str) -> str:
    normalized = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", value).strip(" .")
    normalized = re.sub(r"\s+", "_", normalized)
    return normalized[:100] or "vocabulario_aleman"


def remove_directory(path: Path) -> None:
    if not path.exists():
        return
    for child in path.iterdir():
        child.unlink()
    path.rmdir()


def update_job(job_id: str, **changes) -> None:
    with jobs_lock:
        if job_id in jobs:
            jobs[job_id].update(changes)


def public_job(job_id: str):
    with jobs_lock:
        job = jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="El proceso no existe.")
        data = {
            key: job[key]
            for key in (
                "id",
                "status",
                "stage",
                "progress",
                "processed_words",
                "total_words",
                "completed_batches",
                "total_batches",
                "error",
            )
        }
        started_at = job["started_at"]

    elapsed = max(0, time.monotonic() - started_at)
    data["elapsed_seconds"] = round(elapsed)
    if 5 < data["progress"] < 95:
        work_progress = max(1, data["progress"] - 5)
        estimated_total = elapsed * 90 / work_progress
        data["remaining_seconds"] = max(0, round(estimated_total - elapsed))
    else:
        data["remaining_seconds"] = 0
    if data["status"] == "ready":
        data["download_url"] = f"/api/decks/jobs/{job_id}/download"
    return data


def process_deck_job(
    job_id: str,
    words,
    deck_name: str,
    output_path: Path,
    target_language: str,
) -> None:
    try:
        update_job(
            job_id,
            status="processing",
            stage="Preparando los lotes de palabras…",
            progress=5,
        )

        def report_progress(
            completed_batches,
            total_batches,
            processed_words,
            total_words,
        ):
            progress = 5 + round((completed_batches / total_batches) * 85)
            next_batch = min(completed_batches + 1, total_batches)
            stage = (
                f"Analizando lote {next_batch} de {total_batches} con Gemini…"
                if completed_batches < total_batches
                else "Terminando las tarjetas…"
            )
            update_job(
                job_id,
                stage=stage,
                progress=progress,
                processed_words=processed_words,
                total_words=total_words,
                completed_batches=completed_batches,
                total_batches=total_batches,
            )

        deck = build_deck(
            words,
            deck_name,
            progress_callback=report_progress,
            target_language=target_language,
        )
        if not deck.notes:
            raise DeckBuildError(
                "No se pudieron crear tarjetas con las palabras enviadas."
            )

        update_job(
            job_id,
            stage="Empaquetando la baraja de Anki…",
            progress=95,
            processed_words=len(deck.notes),
        )
        write_anki_package(deck, output_path)
        update_job(
            job_id,
            status="ready",
            stage="Baraja terminada",
            progress=100,
            processed_words=len(deck.notes),
        )
    except DeckBuildError as error:
        remove_directory(output_path.parent)
        update_job(
            job_id,
            status="error",
            stage="No se pudo crear la baraja",
            error=str(error),
        )
    except Exception as error:
        remove_directory(output_path.parent)
        update_job(
            job_id,
            status="error",
            stage="No se pudo crear la baraja",
            error=f"Ha ocurrido un error inesperado: {error}",
        )


def remove_job(job_id: str, working_directory: Path) -> None:
    remove_directory(working_directory)
    with jobs_lock:
        jobs.pop(job_id, None)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/decks/jobs", status_code=202)
async def create_deck_job(
    file: UploadFile = File(...),
    deck_name: str = Form(..., min_length=1, max_length=100),
    target_language: str = Form("es"),
):
    if target_language not in SUPPORTED_TRANSLATION_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail="El idioma de traducción seleccionado no es válido.",
        )
    extension = Path(file.filename or "").suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="El archivo debe tener formato TXT o CSV.",
        )

    content = await file.read(MAX_UPLOAD_SIZE + 1)
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail="El archivo supera el límite de 2 MB.",
        )

    working_directory = Path(tempfile.mkdtemp(prefix="anki-creator-"))
    input_path = working_directory / f"input{extension}"
    output_name = f"{safe_file_name(deck_name)}.apkg"
    output_path = working_directory / output_name

    try:
        input_path.write_bytes(content)
        words = read_words(input_path)
        if not words:
            raise HTTPException(
                status_code=400,
                detail="No se encontraron palabras válidas en el archivo.",
            )
    except HTTPException:
        remove_directory(working_directory)
        raise
    except UnicodeDecodeError as error:
        remove_directory(working_directory)
        raise HTTPException(
            status_code=400,
            detail="No se pudo leer el archivo. Guárdalo con codificación UTF-8.",
        ) from error
    except Exception as error:
        remove_directory(working_directory)
        raise HTTPException(status_code=500, detail=str(error)) from error

    job_id = uuid.uuid4().hex
    total_batches = (len(words) + 9) // 10
    with jobs_lock:
        jobs[job_id] = {
            "id": job_id,
            "status": "queued",
            "stage": "Preparando tu archivo…",
            "progress": 2,
            "processed_words": 0,
            "total_words": len(words),
            "completed_batches": 0,
            "total_batches": total_batches,
            "error": "",
            "started_at": time.monotonic(),
            "working_directory": working_directory,
            "output_path": output_path,
            "output_name": output_name,
            "target_language": target_language,
        }

    threading.Thread(
        target=process_deck_job,
        args=(
            job_id,
            words,
            deck_name.strip(),
            output_path,
            target_language,
        ),
        daemon=True,
    ).start()
    return public_job(job_id)


@app.get("/api/decks/jobs/{job_id}")
def get_deck_job(job_id: str):
    return public_job(job_id)


@app.get("/api/decks/jobs/{job_id}/download")
def download_deck_job(job_id: str):
    with jobs_lock:
        job = jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="El proceso no existe.")
        if job["status"] != "ready":
            raise HTTPException(
                status_code=409,
                detail="La baraja todavía no está lista.",
            )
        output_path = job["output_path"]
        output_name = job["output_name"]
        working_directory = job["working_directory"]
        processed_words = job["processed_words"]

    return FileResponse(
        output_path,
        media_type="application/octet-stream",
        filename=output_name,
        background=BackgroundTask(
            remove_job,
            job_id,
            working_directory,
        ),
        headers={
            "X-Words-Processed": str(processed_words),
            "Access-Control-Expose-Headers": (
                "Content-Disposition,X-Words-Processed"
            ),
        },
    )


FRONTEND_DIST = Path(__file__).parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount(
        "/",
        StaticFiles(directory=FRONTEND_DIST, html=True),
        name="frontend",
    )
