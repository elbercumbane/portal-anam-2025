@echo off
echo ========================================
echo   Deploy Rapido - Vercel
echo ========================================
echo.

REM Executar script PowerShell
powershell.exe -ExecutionPolicy Bypass -File "%~dp0deploy-auto.ps1"

pause


