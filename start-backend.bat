@echo off
REM Simple local backend startup script for turnow
REM No Docker, no complex profiles - just hardcoded localhost

echo Starting turnow backend...
cd /d C:\Users\dante\Documents\turnow\backend

REM Load local environment variables (optional)
REM This sets variables only for this shell session (and child processes)
if exist ".env.local" (
    echo Loading environment from .env.local...
    for /f "usebackq tokens=1* delims==" %%A in (`findstr /v /r "^# ^$" ".env.local"`) do (
        set "%%A=%%B"
    )
) else (
    echo No .env.local found; using application defaults.
)

REM Check if JAR exists
if not exist target\turnow-backend-1.0.0-SNAPSHOT.jar (
    echo JAR not found. Building...
    call mvn clean package -DskipTests -q
    if errorlevel 1 (
        echo Build failed!
        exit /b 1
    )
)

echo.
echo ========================================
echo Starting Spring Boot on port 8080
echo Database: (from env vars if provided)
echo Context path: /api
echo ========================================
echo.

java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
