@echo off
REM ToolVibe - Start Everything (Backend + Frontend)
REM Just double-click this file to run everything!

cd /d "%~dp0"

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         ToolVibe E-Commerce - Full Startup               ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if backend venv exists
if not exist backend\venv (
    echo ERROR: Virtual environment not found!
    echo Please run: backend\setup.bat first
    pause
    exit /b 1
)

REM Start backend in background
echo [1/3] Starting Backend Server...
start "ToolVibe Backend" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn main:app --reload --port 3001"

REM Wait for backend to start
echo [2/3] Waiting for backend to initialize... (4 seconds)
timeout /t 4 /nobreak

REM Open frontend - Option 1: Try HTTP server
echo [3/3] Opening Frontend in Browser...

REM Check if we can reach localhost:3001
timeout /t 1 /nobreak

REM Open the local HTML file directly
start "" "D:\ToolVepe2\2times\page1.html"

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                 ✓ Everything Started!                    ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║  Backend:   http://localhost:3001                        ║
echo ║  API Docs:  http://localhost:3001/docs                  ║
echo ║  Frontend:  Opening in browser now...                   ║
echo ║                                                           ║
echo ║  Test User:                                              ║
echo ║  Email:     danilodrobotun@gmail.com                    ║
echo ║  Password:  7878tata9898                                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo Note: Backend window will open. Don't close it!
echo To stop: Close the backend window or press Ctrl+C
echo.
