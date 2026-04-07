@echo off
REM Student Performance System - Run Script (Windows)
REM This script starts all services for the Student Performance AI System

setlocal enabledelayedexpansion

echo 🚀 Starting Student Performance System...

REM Colors (using color codes)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

REM Function to check if a port is in use
:check_port
setlocal
set port=%1
set name=%2
netstat -an | find ":%port% " | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ❌ Port %port% (%name%) is already in use
    exit /b 1
)
exit /b 0

REM Function to start a service
:start_service
setlocal
set dir=%1
set command=%2
set name=%3

echo 📁 Starting %name% in %dir%...
cd "%dir%"

if "%command%"=="npm start" (
    start "npm_%name%" npm start
) else if "%command%"=="python app.py" (
    start "python_%name%" python app.py
) else (
    start "%name%" %command%
)

cd ..
echo ✅ %name% started
exit /b 0

REM Function to stop services
:stop_services
echo 🛑 Stopping all services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
echo ✅ Services stopped
exit /b 0

REM Main logic
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart

:start
REM Check if ports are available
call :check_port 3000 "Frontend (React)"
if %errorlevel% neq 0 exit /b 1
call :check_port 5000 "Backend (Node.js)"
if %errorlevel% neq 0 exit /b 1
call :check_port 8000 "AI Service (Flask)"
if %errorlevel% neq 0 exit /b 1

echo ⚠️  Make sure MongoDB is running on port 27017
echo    Start with: mongod
echo    Or Docker: docker run -d -p 27017:27017 mongo:latest
echo.

REM Start services
call :start_service "frontend" "npm start" "Frontend"
timeout /t 2 /nobreak >nul
call :start_service "backend" "npm start" "Backend"
timeout /t 2 /nobreak >nul
call :start_service "ai-service" "python app.py" "AI Service"

echo.
echo 🎉 All services started!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 🤖 AI Service: http://localhost:8000
echo.
echo Press any key to stop all services...
pause >nul
goto stop

:stop
call :stop_services
goto end

:restart
call :stop_services
timeout /t 2 /nobreak >nul
goto start

:end