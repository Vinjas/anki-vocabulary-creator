import hashlib
import json
import os

import genanki
from dotenv import load_dotenv

from utils.anki_helpers import (
    build_gender_info,
    format_german_word,
    get_part_of_speech_and_color,
)


BACKEND_DIRECTORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BACKEND_DIRECTORY, ".env"))
load_dotenv(os.path.join(BACKEND_DIRECTORY, "..", ".env"))

SUPPORTED_TRANSLATION_LANGUAGES = {
    "es": "Spanish",
    "en": "English",
    "fr": "French",
    "it": "Italian",
    "pt": "Portuguese",
    "nl": "Dutch",
    "pl": "Polish",
    "ru": "Russian",
    "uk": "Ukrainian",
    "tr": "Turkish",
    "ar": "Arabic",
    "zh": "Simplified Chinese",
    "ja": "Japanese",
    "ko": "Korean",
    "hi": "Hindi",
}


def build_anki_model(target_language):
    language_name = SUPPORTED_TRANSLATION_LANGUAGES[target_language]
    model_id = create_deck_id(f"Wortdeck model v2:{target_language}")
    return genanki.Model(
        model_id,
        f"Bidirectional German - {language_name}",
        fields=[
            {"name": "GermanWord"},
            {"name": "TranslationWord"},
            {"name": "PartOfSpeech"},
            {"name": "GermanExample"},
            {"name": "TranslationExample"},
            {"name": "Color"},
            {"name": "GenderInfo"},
        ],
        templates=[
        {
            "name": f"German → {language_name}",
            "qfmt": '''<div style="font-size: 32px; text-align: center; color: {{Color}}; font-weight: bold; margin-bottom: 10px;">
                {{GermanWord}}
            </div>
            <div style="font-size: 14px; text-align: center; color: #666; margin-top: 15px;">
                <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px;">{{PartOfSpeech}}</span>
                {{GenderInfo}}
            </div>
            <div style="font-size: 16px; text-align: center; color: #fff; margin-top: 20px; font-style: italic;">
                {{GermanExample}}
            </div>''',
            "afmt": '''{{FrontSide}}
                <hr id="answer">
                <div style="font-size: 24px; text-align: center; margin: 15px 0;">
                    <b>{{TranslationWord}}</b>
                </div>
                <div style="font-size: 16px; text-align: center; color: #fff; font-style: italic;">
                    {{TranslationExample}}
                </div>''',
        },
        {
            "name": f"{language_name} → German",
            "qfmt": '''<div style="font-size: 32px; text-align: center; font-weight: bold; margin-bottom: 10px;">
                {{TranslationWord}}
            </div>
            <div style="font-size: 14px; text-align: center; color: #666; margin-top: 15px;">
                <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px;">{{PartOfSpeech}}</span>
            </div>
            <div style="font-size: 16px; text-align: center; color: #444; margin-top: 20px; font-style: italic;">
                {{TranslationExample}}
            </div>''',
            "afmt": '''{{FrontSide}}
                <hr id="answer">
                <div style="font-size: 24px; text-align: center; color: {{Color}}; margin: 15px 0;">
                    <b>{{GermanWord}}</b>
                </div>
                <div style="font-size: 14px; text-align: center; color: #666;">
                    {{GenderInfo}}
                </div>
                <div style="font-size: 16px; text-align: center; color: #555; font-style: italic;">
                    {{GermanExample}}
                </div>''',
        },
        ],
    )


RESPONSE_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "german_word": {"type": "string"},
            "translation_word": {"type": "string"},
            "part_of_speech": {"type": "string"},
            "gender": {"type": "string"},
            "article": {"type": "string"},
            "plural": {"type": "string"},
            "german_example": {"type": "string"},
            "translation_example": {"type": "string"},
        },
        "required": [
            "german_word",
            "translation_word",
            "part_of_speech",
            "gender",
            "article",
            "plural",
            "german_example",
            "translation_example",
        ],
    },
}


class DeckBuildError(RuntimeError):
    """An error that prevents the deck generation from continuing."""


def _friendly_gemini_error(error):
    message = str(error)
    normalized = message.upper()

    if "API_KEY_INVALID" in normalized or "API KEY NOT VALID" in normalized:
        return DeckBuildError(
            "La clave de Gemini no es válida. Actualiza GEMINI_API_KEY "
            "en backend/.env y reinicia el servidor."
        )
    if "RESOURCE_EXHAUSTED" in normalized or "QUOTA" in normalized:
        return DeckBuildError(
            "La cuota de Gemini se ha agotado. Revisa los límites de tu "
            "proyecto de Google AI e inténtalo de nuevo."
        )
    if (
        "UNAVAILABLE" in normalized
        or "HIGH DEMAND" in normalized
        or "OVERLOADED" in normalized
    ):
        return DeckBuildError(
            "Gemini está recibiendo demasiadas solicitudes en este momento. "
            "Es un problema temporal del servicio; espera un minuto y vuelve "
            "a intentarlo."
        )
    if "NOT_FOUND" in normalized and "MODEL" in normalized:
        return DeckBuildError(
            "El modelo de Gemini configurado no está disponible. Revisa "
            "GEMINI_MODEL en backend/.env."
        )
    if (
        "CONNECTION" in normalized
        or "SOCKET" in normalized
        or "TIMED OUT" in normalized
    ):
        return DeckBuildError(
            "No se pudo conectar con Gemini. Comprueba la conexión a "
            "Internet del servidor e inténtalo de nuevo."
        )

    return None


def _get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        api_key = os.getenv("DEEPL_API_KEY")
        if api_key:
            print(
                "⚠️ DEEPL_API_KEY is deprecated for this project. "
                "Rename it to GEMINI_API_KEY in your .env file."
            )

    placeholder_values = {
        "",
        "replace_with_your_gemini_api_key",
        "your_api_key",
    }
    if not api_key or api_key.strip() in placeholder_values:
        raise DeckBuildError(
            "La clave de Gemini no está configurada. Sustituye "
            "GEMINI_API_KEY en backend/.env por una clave real y reinicia "
            "el servidor."
        )

    try:
        from google import genai
    except ImportError as error:
        raise RuntimeError(
            "The google-genai package is missing. "
            "Install the dependencies from requirements.txt."
        ) from error

    return genai.Client(api_key=api_key)


def build_batch_prompt(word_batch, target_language="es"):
    if target_language not in SUPPORTED_TRANSLATION_LANGUAGES:
        raise ValueError(f"Unsupported target language: {target_language}")
    language_name = SUPPORTED_TRANSLATION_LANGUAGES[target_language]
    words_json = json.dumps(word_batch, ensure_ascii=False)
    return f"""
    You are an expert German-{language_name} linguist creating flashcard data.
    Analyze every German word in this JSON array: {words_json}

    Words may be conjugated, declined, pluralized, or inflected. Normalize each
    one to its most basic form or infinitive. The example sentence may use an
    inflected or conjugated form.

    Return one valid JSON array containing exactly one object for every input
    word, in the same order. Each object must use this exact structure:
    {{
      "german_word": "Normalized German word; capitalize nouns",
      "translation_word": "Primary {language_name} translation",
      "part_of_speech": "POS tag such as NOUN, VERB, ADJ, or ADV",
      "gender": "Neut, Fem, Masc, or N/A",
      "article": "German article such as das, or N/A",
      "plural": "German plural form, or N/A",
      "german_example": "Example sentence in German",
      "translation_example": "{language_name} translation of the example sentence"
    }}

    Return only the JSON array.
    """


def create_batches(items, batch_size):
    """Split a list into batches."""
    for start in range(0, len(items), batch_size):
        yield items[start : start + batch_size]


def create_deck_id(deck_name):
    """Create a stable Anki-compatible ID from the deck name."""
    digest = hashlib.sha256(deck_name.encode("utf-8")).digest()
    return (1 << 30) + (int.from_bytes(digest[:4], "big") % (1 << 30))


def build_deck(
    words,
    deck_name="German Vocabulary",
    batch_size=10,
    progress_callback=None,
    target_language="es",
):
    """Build an Anki deck from a list of German words."""
    if target_language not in SUPPORTED_TRANSLATION_LANGUAGES:
        raise DeckBuildError("El idioma de traducción seleccionado no es válido.")
    deck_id = create_deck_id(deck_name)
    deck = genanki.Deck(deck_id, deck_name)
    anki_model = build_anki_model(target_language)
    batches = list(create_batches(words, batch_size))
    batch_count = len(batches)
    gemini_client = _get_gemini_client()
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    print(
        f"Splitting {len(words)} words into "
        f"{batch_count} batches of up to {batch_size}..."
    )
    if progress_callback:
        progress_callback(0, batch_count, 0, len(words))

    for batch_index, word_batch in enumerate(batches, start=1):
        print(f"\n--- Processing batch {batch_index}/{batch_count} ---")

        try:
            prompt = build_batch_prompt(word_batch, target_language)
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": RESPONSE_SCHEMA,
                },
            )
            entries = json.loads(response.text)

            if not isinstance(entries, list):
                raise ValueError("Gemini returned JSON that is not an array")

            if len(entries) != len(word_batch):
                print(
                    f"  WARNING: Expected {len(word_batch)} entries, "
                    f"but Gemini returned {len(entries)}."
                )

            for entry in entries:
                german_word = format_german_word(entry)
                translation_word = entry.get("translation_word", "Error")
                part_of_speech, color = get_part_of_speech_and_color(entry)
                german_example = entry.get("german_example", "Error")
                translation_example = entry.get("translation_example", "Error")
                gender_info = build_gender_info(entry)

                note = genanki.Note(
                    model=anki_model,
                    fields=[
                        german_word,
                        translation_word,
                        part_of_speech,
                        german_example,
                        translation_example,
                        color,
                        gender_info,
                    ],
                )
                deck.add_note(note)

            print(f"  Processed {len(entries)} entries")

        except Exception as error:
            fatal_error = _friendly_gemini_error(error)
            if fatal_error:
                raise fatal_error from error
            print(f"ERROR while processing batch {batch_index}: {error}")
            print("   This batch will be skipped.")
        finally:
            if progress_callback:
                progress_callback(
                    batch_index,
                    batch_count,
                    len(deck.notes),
                    len(words),
                )

    return deck
