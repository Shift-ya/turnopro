# Simple local backend startup script for turnow (PowerShell)
# No Docker, no complex profiles - just hardcoded localhost

Write-Host "Starting turnow backend..." -ForegroundColor Green
Set-Location -Path "C:\Users\dante\Documents\turnow\backend"

# Check if JAR exists
if (-not (Test-Path "target\turnow-backend-1.0.0-SNAPSHOT.jar")) {
    Write-Host "JAR not found. Building..." -ForegroundColor Yellow
    mvn clean package -DskipTests -q
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Spring Boot on port 8080"
Write-Host "Database: turnow (localhost:5432)"
Write-Host "Context path: /api"
Write-Host "========================================"
Write-Host ""

java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
