# Simple frontend startup script for turnow (PowerShell)
# Connects to backend on localhost:8080/api

Write-Host "Starting turnow frontend..." -ForegroundColor Green
Set-Location -Path "C:\Users\dante\Documents\turnow"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies not found. Installing..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm install failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Vite dev server"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend API: http://localhost:8080/api"
Write-Host "========================================"
Write-Host ""

npm run dev
