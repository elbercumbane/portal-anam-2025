@echo off
echo ========================================
echo   Portal da Associacao - Iniciar Tudo
echo   Frontend + Backend
echo ========================================
echo.

REM Verificar se estamos no diretório correto
if not exist "frontend" (
    echo ERRO: Execute este script na raiz do projeto (portalmassinga)
    echo Diretorio atual: %CD%
    pause
    exit /b 1
)

if not exist "backend" (
    echo ERRO: Execute este script na raiz do projeto (portalmassinga)
    echo Diretorio atual: %CD%
    pause
    exit /b 1
)

REM Verificar dependências do frontend
if not exist "frontend\node_modules" (
    echo AVISO: Dependencias do frontend nao encontradas!
    echo Instalando dependencias do frontend...
    cd frontend
    call npm install
    cd ..
)

REM Verificar dependências do backend
if not exist "backend\node_modules" (
    echo AVISO: Dependencias do backend nao encontradas!
    echo Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo Iniciando Backend e Frontend...
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Pressione Ctrl+C para parar ambos os servicos
echo.

REM Iniciar Backend em uma nova janela
echo Iniciando Backend...
start "Backend - Portal Massinga" cmd /k "cd /d %~dp0backend && echo === BACKEND === && npm run dev"

REM Aguardar um pouco para o backend iniciar
timeout /t 3 /nobreak >nul

REM Iniciar Frontend em uma nova janela
echo Iniciando Frontend...
start "Frontend - Portal Massinga" cmd /k "cd /d %~dp0frontend && echo === FRONTEND === && npm start"

echo.
echo ========================================
echo   Servicos iniciados com sucesso!
echo ========================================
echo.
echo Acesse:
echo   - Frontend: http://localhost:4200
echo   - Backend:  http://localhost:3000
echo   - Health:   http://localhost:3000/health
echo.
echo Para parar os servicos, feche as janelas do terminal
echo.

pause

