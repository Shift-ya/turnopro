@echo off
REM Simple local backend startup script for turnow
REM No Docker, no complex profiles - just hardcoded localhost

echo Starting turnow backend...
cd /d C:\Users\dante\Documents\turnow\backend

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
echo Database: turnow (localhost:5432)
echo Context path: /api
echo ========================================
echo.

java -jar target/turnow-backend-1.0.0-SNAPSHOT.jar
