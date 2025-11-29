@echo off
echo ========================================
echo   Portal da Associacao - Build
echo   Sistema Operacional: Windows
echo ========================================
echo.

REM Verificar se as dependencias estao instaladas
if not exist "node_modules" (
    echo ERRO: Dependencias nao encontradas!
    echo.
    echo Execute primeiro: install-windows.bat
    echo.
    pause
    exit /b 1
)

echo Limpando builds anteriores...
if exist "dist" rmdir /s /q "dist"

echo.
echo Escolha o tipo de build:
echo 1. Development
echo 2. Production (recomendado)
echo.
set /p choice="Digite sua escolha (1 ou 2): "

if "%choice%"=="1" (
    echo.
    echo Executando build de desenvolvimento...
    npm run build:dev
) else if "%choice%"=="2" (
    echo.
    echo Executando build de producao...
    npm run build:prod
) else (
    echo.
    echo Escolha invalida! Executando build de producao...
    npm run build:prod
)

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha no build!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build concluido com sucesso!
echo ========================================
echo.
echo Os arquivos estao em: dist/associacao-portal/
echo.
echo Para servir os arquivos de producao:
echo   npm run serve:dist
echo.
echo Ou abra diretamente o arquivo:
echo   dist/associacao-portal/index.html
echo.

set /p serve="Deseja servir os arquivos agora? (s/n): "
if /i "%serve%"=="s" (
    echo.
    echo Servindo arquivos em http://localhost:8080
    npm run serve:dist
)

pause
