# SafeTrail Quick Start Script
# This script starts both the backend and frontend servers

Write-Host "🚀 Starting SafeTrail Tourist Safety App..." -ForegroundColor Green
Write-Host ""

# Get the directory where this script is located
$AppDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend Server
Write-Host "📊 Starting Backend Server..." -ForegroundColor Yellow
$BackendProcess = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$AppDir\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; python -m uvicorn demo_server:app --host 127.0.0.1 --port 8000 --reload"
) -PassThru

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Yellow
$FrontendProcess = Start-Process powershell -ArgumentList @(
    "-NoExit", 
    "-Command",
    "Set-Location '$AppDir\frontend'; Write-Host '⚛️ Frontend Server Starting...' -ForegroundColor Cyan; npm start"
) -PassThru

# Wait for servers to initialize
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Check if servers are running
Write-Host ""
Write-Host "🔍 Checking server status..." -ForegroundColor Blue

# Check backend
try {
    $BackendCheck = Invoke-WebRequest -Uri "http://127.0.0.1:8000/docs" -Method GET -TimeoutSec 5
    if ($BackendCheck.StatusCode -eq 200) {
        Write-Host "✅ Backend Server: Running on http://127.0.0.1:8000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend Server: Not responding" -ForegroundColor Red
}

# Check frontend
try {
    $FrontendCheck = Test-NetConnection -ComputerName "127.0.0.1" -Port 3001 -InformationLevel Quiet
    if ($FrontendCheck) {
        Write-Host "✅ Frontend Server: Running on http://localhost:3001" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend Server: Not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Quick Access:" -ForegroundColor Magenta
Write-Host "   • Web App: http://localhost:3001" -ForegroundColor White
Write-Host "   • API Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Demo Credentials:" -ForegroundColor Magenta
Write-Host "   • Tourist: tourist@demo.com / demo123" -ForegroundColor White
Write-Host "   • Authority: authority@demo.com / demo123" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note: Keep both PowerShell windows open to maintain the servers" -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Optional: Open browser automatically
$OpenBrowser = Read-Host "Would you like to open the app in your browser? (y/n)"
if ($OpenBrowser -eq "y" -or $OpenBrowser -eq "Y") {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3001"
    Write-Host "🌐 Opening app in browser..." -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ SafeTrail is ready to use!" -ForegroundColor Green
