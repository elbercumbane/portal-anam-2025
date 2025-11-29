@echo off
echo ========================================
echo   Portal da Associacao - Verificacao
echo   Sistema Operacional: Windows
echo ========================================
echo.

echo Verificando sistema...
echo.

REM Verificar versao do Windows
echo [INFO] Sistema Operacional:
systeminfo | findstr /C:"OS Name" /C:"OS Version"
echo.

REM Verificar Node.js
echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Solucao: Instale o Node.js de https://nodejs.org/
    echo.
    set /p continue="Continuar mesmo assim? (s/n): "
    if /i not "%continue%"=="s" exit /b 1
) else (
    echo [OK] Node.js encontrado:
    node --version
)

echo.

REM Verificar npm
echo [INFO] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    echo.
    echo Solucao: Reinstale o Node.js que inclui o npm
    echo.
    set /p continue="Continuar mesmo assim? (s/n): "
    if /i not "%continue%"=="s" exit /b 1
) else (
    echo [OK] npm encontrado:
    npm --version
)

echo.

REM Verificar se estamos no diretorio correto
echo [INFO] Verificando diretorio do projeto...
if not exist "package.json" (
    echo [ERRO] package.json nao encontrado!
    echo.
    echo Solucao: Execute este script no diretorio raiz do projeto
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Diretorio do projeto correto
)

echo.

REM Verificar se node_modules existe
echo [INFO] Verificando dependencias...
if not exist "node_modules" (
    echo [AVISO] Dependencias nao instaladas
    echo.
    echo Execute: npm install
    echo Ou execute: install-windows.bat
    echo.
) else (
    echo [OK] Dependencias instaladas
)

echo.

REM Verificar portas disponiveis
echo [INFO] Verificando portas...
netstat -an | findstr ":4200" >nul
if %errorlevel% equ 0 (
    echo [AVISO] Porta 4200 ja esta em uso
    echo.
    echo Solucao: Pare outros servidores ou use outra porta
    echo.
) else (
    echo [OK] Porta 4200 disponivel
)

netstat -an | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo [AVISO] Porta 8080 ja esta em uso
    echo.
    echo Solucao: Pare outros servidores ou use outra porta
    echo.
) else (
    echo [OK] Porta 8080 disponivel
)

echo.

REM Verificar permissoes
echo [INFO] Verificando permissoes...
echo Testando escrita no diretorio atual...
echo test > test-permissions.tmp 2>nul
if exist "test-permissions.tmp" (
    echo [OK] Permissoes de escrita OK
    del test-permissions.tmp >nul 2>&1
) else (
    echo [AVISO] Problemas com permissoes de escrita
    echo.
    echo Solucao: Execute como Administrador
    echo.
)

echo.

REM Verificar antivirus
echo [INFO] Verificando antivirus...
wmic /namespace:\\root\securitycenter2 path antivirusproduct get displayName /format:list >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Antivirus detectado
    echo.
    echo Dica: Se houver problemas de instalacao, adicione este projeto
    echo as excecoes do antivirus ou desative temporariamente
    echo.
) else (
    echo [OK] Nenhum antivirus detectado ou nao acessivel
)

echo.

echo ========================================
echo   Verificacao concluida!
echo ========================================
echo.

set /p action="Deseja executar a instalacao agora? (s/n): "
if /i "%action%"=="s" (
    echo.
    echo Executando instalacao...
    call install-windows.bat
)

echo.
pause
