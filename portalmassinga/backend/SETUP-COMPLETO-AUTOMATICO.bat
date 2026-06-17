@echo off
chcp 65001 >nul
title Setup Completo Automatico - Portal ANAM
color 0A

echo.
echo ========================================
echo   SETUP COMPLETO AUTOMATICO
echo   Portal ANAM - Backend
echo ========================================
echo.
echo Este script vai:
echo   1. Detectar PostgreSQL
echo   2. Criar base de dados ANAM
echo   3. Criar tabela membros
echo   4. Iniciar o backend
echo.
echo ========================================
echo.

REM Mudar para o diretório do script
cd /d "%~dp0"

REM Executar script PowerShell
powershell.exe -ExecutionPolicy Bypass -File "%~dp0SETUP-COMPLETO-AUTOMATICO.ps1"

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERRO NO SETUP
    echo ========================================
    echo.
    pause
    exit /b 1
)
