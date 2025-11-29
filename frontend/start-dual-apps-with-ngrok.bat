@echo off
echo ========================================
echo   Portal da Associacao - Dual Apps + Ngrok
echo   Sistema Operacional: Windows
echo ========================================
echo.

REM Verificar se ngrok esta instalado
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: ngrok nao encontrado!
    echo.
    echo Instale o ngrok:
    echo 1. Baixe de: https://ngrok.com/download
    echo 2. Extraia o arquivo ngrok.exe
    echo 3. Adicione ao PATH ou coloque na pasta do projeto
    echo.
    pause
    exit /b 1
)

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
echo Aplicacao 1 (Local): http://localhost:4200
echo Aplicacao 2 (Publica via ngrok): http://localhost:4201
echo.
echo Pressione Ctrl+C para parar ambas as aplicacoes
echo.

REM Iniciar a primeira aplicacao na porta 4200 (local)
echo Iniciando aplicacao local na porta 4200...
start "App-Local-4200" cmd /k "ng serve --port 4200"

REM Aguardar um pouco para a primeira aplicacao iniciar
timeout /t 3 /nobreak >nul

REM Iniciar a segunda aplicacao na porta 4201 (para ngrok)
echo Iniciando aplicacao para ngrok na porta 4201...
start "App-Ngrok-4201" cmd /k "ng serve --host 0.0.0.0 --disable-host-check --port 4201"

REM Aguardar um pouco para a segunda aplicacao iniciar
timeout /t 5 /nobreak >nul

echo.
echo Aplicacoes iniciadas! Iniciando ngrok...
echo.

REM Iniciar ngrok para a aplicacao na porta 4201
echo Iniciando ngrok para a aplicacao na porta 4201...
start "Ngrok-4201" cmd /k "ngrok http 4201"

echo.
echo Todas as aplicacoes foram iniciadas!
echo.
echo Acesse:
echo   - Aplicacao Local: http://localhost:4200
echo   - Aplicacao Publica: http://localhost:4201
echo   - URL Publica: Verifique a janela do ngrok
echo.
echo Para parar as aplicacoes, feche as janelas do terminal ou pressione Ctrl+C
echo.

pause
