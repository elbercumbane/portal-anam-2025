@echo off
chcp 65001 >nul
title Backend Portal ANAM - Spring Boot
color 0A

cd /d "%~dp0"

echo.
echo ========================================
echo   INICIANDO BACKEND PORTAL ANAM
echo ========================================
echo.
echo Backend estara disponivel em:
echo   http://localhost:8080/api
echo.
echo API de Membros:
echo   POST   http://localhost:8080/api/membros
echo   GET    http://localhost:8080/api/membros
echo.
echo ========================================
echo.

if not exist "mvnw.cmd" (
    echo ERRO: mvnw.cmd nao encontrado!
    echo Certifique-se de estar na pasta backend/
    pause
    exit /b 1
)

call mvnw.cmd spring-boot:run

pause
