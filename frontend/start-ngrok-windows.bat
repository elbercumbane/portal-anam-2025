@echo off
echo ========================================
echo   Portal da Associacao - Ngrok Setup
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

echo ngrok encontrado!
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

echo Iniciando servidor Angular para acesso publico...
echo.
echo O servidor estara disponivel em:
echo   http://localhost:4201
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

REM Iniciar o servidor Angular em background
start /b npm run start:ngrok

REM Aguardar um pouco para o servidor iniciar
timeout /t 5 /nobreak >nul

echo.
echo Servidor Angular iniciado!
echo.
echo Iniciando ngrok...
echo.
echo A aplicacao estara disponivel publicamente em alguns segundos...
echo.

REM Iniciar ngrok
ngrok http 4201

pause
