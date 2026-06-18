$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Join-Path $projectRoot ".venv\Scripts\python.exe"
$frontend = Join-Path $projectRoot "frontend"

if (-not (Test-Path $python)) {
    throw "No se encontró el entorno virtual en .venv."
}

if (-not (Test-Path (Join-Path $frontend "dist\index.html"))) {
    Push-Location $frontend
    try {
        npm run build
    }
    finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "Wortdeck está arrancando en http://localhost:8000" -ForegroundColor Green
Write-Host "Para usarlo desde el móvil, abre http://IP-DE-TU-ORDENADOR:8000"
Write-Host "Pulsa Ctrl+C para detenerlo."
Write-Host ""

& $python -m uvicorn app:app --app-dir (Join-Path $projectRoot "backend") --host 0.0.0.0 --port 8000
