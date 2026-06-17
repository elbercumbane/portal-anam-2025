@echo off
chcp 65001 >nul
title Levantar Backend com Docker - Portal ANAM
color 0A

echo.
echo ========================================
echo   LEVANTANDO BACKEND COM DOCKER
echo   Portal ANAM
echo ========================================
echo.
echo Este script vai:
echo   1. Parar containers existentes
echo   2. Construir imagens Docker
echo   3. Subir PostgreSQL e Backend
echo.
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Docker nao esta instalado ou nao esta rodando!
    echo Por favor, instale o Docker Desktop e inicie-o.
    pause
    exit /b 1
)

echo [1/4] Parando containers existentes...
docker-compose down
echo.

echo [2/4] Construindo imagens Docker...
docker-compose build
if errorlevel 1 (
    echo ERRO: Falha ao construir imagens!
    pause
    exit /b 1
)
echo.

echo [3/4] Subindo containers...
docker-compose up -d
if errorlevel 1 (
    echo ERRO: Falha ao subir containers!
    pause
    exit /b 1
)
echo.

echo [4/4] Aguardando servicos iniciarem...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   BACKEND LEVANTADO COM SUCESSO!
echo ========================================
echo.
echo Servicos disponiveis:
echo   PostgreSQL: localhost:5432
echo   Backend API: http://localhost:8081/api
echo   Membros: http://localhost:8081/api/membros
echo.
echo Para ver os logs:
echo   docker-compose logs -f backend
echo.
echo Para parar os servicos:
echo   docker-compose down
echo.
echo ========================================
echo.

pause
