@echo off
echo ========================================
echo   Portal da Associacao - Iniciando
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

echo Iniciando servidor de desenvolvimento...
echo.
echo A aplicacao estara disponivel em:
echo   http://localhost:4200
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

REM Iniciar o servidor
npm start

pause
