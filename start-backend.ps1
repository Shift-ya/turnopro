# Local backend startup script for turnow (PowerShell)
# Uses backend/.env.local (Supabase) and avoids hardcoded absolute paths.

Write-Host "Starting turnow backend..." -ForegroundColor Green

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"

if (-not (Test-Path $backendDir)) {
    Write-Host "Backend directory not found: $backendDir" -ForegroundColor Red
    exit 1
}

Set-Location -Path $backendDir

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
    Write-Host "Missing $envFile in $backendDir" -ForegroundColor Red
    Write-Host "Create backend/.env.local with Supabase variables before starting." -ForegroundColor Yellow
    exit 1
}

# Ensure required DB/JWT values exist for local Supabase startup.
$requiredVars = @("DATABASE_URL", "DATABASE_USER", "DATABASE_PASSWORD", "JWT_SECRET")
$missing = @()
foreach ($name in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        $missing += $name
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing required env vars: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Check backend/.env.local and retry." -ForegroundColor Yellow
    exit 1
}

# Supabase pooler (pgBouncer) can fail with server-side prepared statements.
# Force JDBC compatibility when using pooler URLs.
if ($env:DATABASE_URL -and $env:DATABASE_URL -match "pooler\.supabase\.com") {
    if ($env:DATABASE_URL -notmatch "prepareThreshold=") {
        if ($env:DATABASE_URL.Contains("?")) {
            $env:DATABASE_URL = "$($env:DATABASE_URL)&prepareThreshold=0"
        } else {
            $env:DATABASE_URL = "$($env:DATABASE_URL)?prepareThreshold=0"
        }
        Write-Host "Applied pgBouncer compatibility to DATABASE_URL (prepareThreshold=0)." -ForegroundColor DarkYellow
    }
}

# Default to dev profile if not explicitly set in env file.
if ([string]::IsNullOrWhiteSpace($env:SPRING_PROFILES_ACTIVE)) {
    $env:SPRING_PROFILES_ACTIVE = "dev"
}

# Always build first so local startup reflects latest code/config changes.
Write-Host "Building backend (skip tests)..." -ForegroundColor Yellow
mvn clean package -DskipTests -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Spring Boot on port 8080"
Write-Host "Database: (from env vars if provided)"
Write-Host "Spring profile: $($env:SPRING_PROFILES_ACTIVE)"
Write-Host "Context path: /api"
Write-Host "========================================"
Write-Host ""

java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
