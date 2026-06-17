@echo off
chcp 65001 >nul
title Verificar Membros Cadastrados
color 0A

cd /d "%~dp0"

powershell.exe -ExecutionPolicy Bypass -File "VERIFICAR-MEMBROS.ps1"

pause
