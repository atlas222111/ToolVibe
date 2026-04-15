#!/usr/bin/env powershell

# ToolVibe - Start Everything (Backend + Frontend)
# Just double-click this file to run everything!

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "║         ToolVibe E-Commerce - Full Startup               ║" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if backend venv exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run: backend\setup.bat first" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start backend in background
Write-Host "[1/3] Starting Backend Server..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoProfile -Command `"cd 'd:\ToolVepe2\backend'; & 'venv\Scripts\python.exe' -m uvicorn main:app --reload --port 3001`"" `
    -PassThru `
    -WindowStyle Normal

# Wait for backend to start
Write-Host "[2/3] Waiting for backend to initialize... (3 seconds)" -ForegroundColor Green
Start-Sleep -Seconds 3

# Open frontend in default browser
Write-Host "[3/3] Opening Frontend in Browser..." -ForegroundColor Green
$frontendPath = Convert-Path "2 попытка\page1.html"
Start-Process -FilePath "file:///$frontendPath"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                 ✓ Everything Started!                    ║" -ForegroundColor Green
Write-Host "╠═══════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "║  Backend:   http://localhost:3001                        ║" -ForegroundColor Cyan
Write-Host "║  API Docs:  http://localhost:3001/docs                  ║" -ForegroundColor Cyan
Write-Host "║  Frontend:  Opening in browser now...                   ║" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "║  Test User:                                              ║" -ForegroundColor Yellow
Write-Host "║  Email:     danilodrobotun@gmail.com                    ║" -ForegroundColor Yellow
Write-Host "║  Password:  7878tata9898                                ║" -ForegroundColor Yellow
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Backend PID: $($backendProcess.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop backend: Close the backend window or press Ctrl+C" -ForegroundColor Gray
