@echo off
title SafeTrail - Tourist Safety App
color 0A

echo.
echo ====================================================
echo  🚀 SafeTrail - Tourist Safety App Quick Start
echo ====================================================
echo.

echo 📊 Starting Backend Server...
cd /d "%~dp0backend"
start "SafeTrail Backend" cmd /k "python -m uvicorn demo_server:app --host 127.0.0.1 --port 8000 --reload"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server...
cd /d "%~dp0frontend"
start "SafeTrail Frontend" cmd /k "npm start"

echo.
echo ⏳ Waiting for frontend to initialize...
timeout /t 10 /nobreak >nul

echo.
echo ====================================================
echo  ✅ SafeTrail is starting up!
echo ====================================================
echo.
echo 🎯 Access Points:
echo    • Web App: http://localhost:3000
echo    • API Docs: http://127.0.0.1:8000/docs
echo.
echo 🔑 Demo Credentials:
echo    • Tourist: tourist@demo.com / demo123
echo    • Authority: authority@demo.com / demo123
echo.
echo 📝 Note: Two command windows will open for the servers
echo    Close them to stop the application
echo.

set /p choice="Would you like to open the app in your browser? (y/n): "
if /i "%choice%"=="y" (
    echo 🌐 Opening app in browser...
    start http://localhost:3000
)

echo.
echo ✨ SafeTrail is ready to use!
echo Press any key to exit this window...
pause >nul
