@echo off
echo ========================================
echo   Portal da Associacao - Dual Apps
echo   Sistema Operacional: Windows
echo ========================================
echo.

REM Verificar se as dependencias estao instaladas
if not exist "node_modules" (
    echo ERRO: Dependencias nao encontradas!
    echo.
    echo Execute primeiro: npm install
    echo.
    pause
    exit /b 1
)

echo Iniciando duas aplicacoes simultaneamente...
echo.
echo Aplicacao 1 (Angular): http://localhost:4200
echo Aplicacao 2 (Angular): http://localhost:4201
echo.
echo Pressione Ctrl+C para parar ambas as aplicacoes
echo.

REM Iniciar a primeira aplicacao na porta 4200
echo Iniciando aplicacao na porta 4200...
start "App-4200" cmd /k "ng serve --port 4200"

REM Aguardar um pouco para a primeira aplicacao iniciar
timeout /t 3 /nobreak >nul

REM Iniciar a segunda aplicacao na porta 4201
echo Iniciando aplicacao na porta 4201...
start "App-4201" cmd /k "ng serve --port 4201"

echo.
echo Ambas as aplicacoes foram iniciadas!
echo.
echo Acesse:
echo   - Aplicacao 1: http://localhost:4200
echo   - Aplicacao 2: http://localhost:4201
echo.
echo Para parar as aplicacoes, feche as janelas do terminal ou pressione Ctrl+C
echo.

pause
