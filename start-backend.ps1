# Simple local backend startup script for turnow (PowerShell)
# No Docker, no complex profiles - just hardcoded localhost

Write-Host "Starting turnow backend..." -ForegroundColor Green
Set-Location -Path "C:\Users\dante\Documents\turnow\backend"

# Load local environment variables (optional)
# NOTE: This sets variables only for this process (and child processes).
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "Loading environment from $envFile..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ([string]::IsNullOrWhiteSpace($line)) { return }
        if ($line.StartsWith("#")) { return }

        $idx = $line.IndexOf("=")
        if ($idx -lt 1) { return }

        $key = $line.Substring(0, $idx).Trim()
        $value = $line.Substring($idx + 1)

        # Strip surrounding quotes if present
        if ($value.Length -ge 2) {
            if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                $value = $value.Substring(1, $value.Length - 2)
            }
        }

        if (-not [string]::IsNullOrWhiteSpace($key)) {
            Set-Item -Path "Env:$key" -Value $value
        }
    }
} else {
    Write-Host "No $envFile found; using application defaults." -ForegroundColor DarkGray
}

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
Write-Host "Database: (from env vars if provided)"
Write-Host "Context path: /api"
Write-Host "========================================"
Write-Host ""

java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
