@echo off
echo ========================================
echo   Portal da Associacao - Instalacao
echo   Sistema Operacional: Windows
echo ========================================
echo.

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js versao 18 ou superior:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar se npm esta instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado!
    echo.
    echo Por favor, reinstale o Node.js que inclui o npm:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js e npm encontrados!
echo.

REM Mostrar versoes
echo Versoes instaladas:
node --version
npm --version
echo.

REM Limpar cache do npm (recomendado para Windows)
echo Limpando cache do npm...
npm cache clean --force
echo.

REM Instalar dependencias
echo Instalando dependencias...
echo Isso pode demorar alguns minutos...
echo.
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha na instalacao das dependencias!
    echo.
    echo Tentativas de solucao:
    echo 1. Execute como Administrador
    echo 2. Desative temporariamente o antivirus
    echo 3. Execute: npm cache clean --force
    echo 4. Execute: npm install --force
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Instalacao concluida com sucesso!
echo ========================================
echo.
echo Para executar a aplicacao:
echo   npm start
echo.
echo Para desenvolvimento:
echo   npm run start:dev
echo.
echo Para build de producao:
echo   npm run build:prod
echo.
pause
