# Anki Vocabulary Creator

Aplicación web responsive para convertir listas TXT o CSV de vocabulario
alemán en barajas bidireccionales de Anki.

## Estructura

- `backend/`: API FastAPI y generador de barajas.
- `frontend/`: interfaz React + TypeScript + Vite.

## Puesta en marcha

La forma más sencilla desde la raíz del proyecto:

```powershell
.\start.ps1
```

Después abre `http://localhost:8000`.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app:app --reload
```

Configura `GEMINI_API_KEY` en `backend/.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Vite enviará las peticiones `/api` al backend
en `http://localhost:8000`.

## Usarlo desde el móvil

Compila el frontend una vez y sirve toda la aplicación desde FastAPI:

```bash
cd frontend
npm install
npm run build
cd ../backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

Con el móvil y el ordenador en la misma red Wi-Fi, abre en el móvil
`http://IP-DE-TU-ORDENADOR:8000`. Al terminar una baraja, el botón **Guardar
baraja** abrirá el menú nativo de compartir/guardar cuando el navegador lo
permita; si no, descargará el archivo en la carpeta de descargas.

## Formato de entrada

Los TXT deben contener una palabra alemana por línea. Los CSV pueden contener
una palabra por fila o una columna llamada `german`, `deutsch`, `word`, `term`,
`alemán` o `palabra`.

## CLI y tests

El flujo anterior sigue disponible desde `backend/`:

```bash
python main.py ruta/a/palabras.csv
python -m unittest discover -s tests -v
```
