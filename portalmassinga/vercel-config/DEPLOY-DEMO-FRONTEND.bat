@echo off
echo ========================================
echo   Deploy Demo - So Frontend (Vercel)
echo ========================================
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0deploy-demo-frontend.ps1"

pause
