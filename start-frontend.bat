@echo off
REM Simple frontend startup script for turnow
REM Connects to backend on localhost:8080/api

echo Starting turnow frontend...
cd /d C:\Users\dante\Documents\turnow

REM Check if node_modules exists
if not exist node_modules (
    echo Dependencies not found. Installing...
    call npm install
    if errorlevel 1 (
        echo npm install failed!
        exit /b 1
    )
)

echo.
echo ========================================
echo Starting Vite dev server
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080/api
echo ========================================
echo.

npm run dev
