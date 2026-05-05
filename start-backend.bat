@echo off
setlocal EnableDelayedExpansion
REM Local backend startup script for turnow
REM Uses backend/.env.local (Supabase) and avoids hardcoded absolute paths.

echo Starting turnow backend...

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"

if not exist "%BACKEND_DIR%" (
    echo Backend directory not found: %BACKEND_DIR%
    exit /b 1
)

cd /d "%BACKEND_DIR%"

REM Load local environment variables (optional)
REM This sets variables only for this shell session (and child processes)
if exist ".env.local" (
    echo Loading environment from .env.local...
    for /f "usebackq delims=" %%L in (".env.local") do (
        set "line=%%L"
        if not "!line!"=="" if not "!line:~0,1!"=="#" (
            for /f "tokens=1* delims==" %%A in ("!line!") do set "%%A=%%B"
        )
    )
) else (
    echo Missing .env.local in %BACKEND_DIR%
    echo Create backend/.env.local with Supabase variables before starting.
    exit /b 1
)

if "%SPRING_PROFILES_ACTIVE%"=="" set "SPRING_PROFILES_ACTIVE=dev"

if "%DATABASE_URL%"=="" (
    echo Missing required env var: DATABASE_URL
    exit /b 1
)
if "%DATABASE_USER%"=="" (
    echo Missing required env var: DATABASE_USER
    exit /b 1
)
if "%DATABASE_PASSWORD%"=="" (
    echo Missing required env var: DATABASE_PASSWORD
    exit /b 1
)
if "%JWT_SECRET%"=="" (
    echo Missing required env var: JWT_SECRET
    exit /b 1
)

echo %DATABASE_URL% | findstr /i "pooler.supabase.com" >nul
if not errorlevel 1 (
    echo %DATABASE_URL% | findstr /i "prepareThreshold=" >nul
    if errorlevel 1 (
        echo %DATABASE_URL% | findstr "?" >nul
        if not errorlevel 1 (
            set "DATABASE_URL=%DATABASE_URL%&prepareThreshold=0"
        ) else (
            set "DATABASE_URL=%DATABASE_URL%?prepareThreshold=0"
        )
        echo Applied pgBouncer compatibility to DATABASE_URL (prepareThreshold=0).
    )
)

REM Always build first so startup reflects latest code/config changes
echo Building backend (skip tests)...
call mvn clean package -DskipTests -q
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo.
echo ========================================
echo Starting Spring Boot on port 8080
echo Database: (from env vars if provided)
echo Spring profile: %SPRING_PROFILES_ACTIVE%
echo Context path: /api
echo ========================================
echo.

java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
