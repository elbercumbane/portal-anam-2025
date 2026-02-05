@echo off
REM =====================================================
REM Script Batch - Setup Completo Base de Dados
REM =====================================================
REM Execute: executar-setup-completo.bat
REM =====================================================

echo ========================================
echo 🚀 SETUP COMPLETO - BASE DE DADOS ANAM
echo ========================================
echo.

REM Configurações
set DB_NAME=anam2025
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

REM Solicitar senha
set /p DB_PASSWORD="Digite a senha do PostgreSQL: "

echo.
echo 📋 Verificando conexão com PostgreSQL...

REM Verificar conexão
set PGPASSWORD=%DB_PASSWORD%
psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d postgres -c "SELECT 1;" >nul 2>&1

if errorlevel 1 (
    echo ❌ Erro ao conectar ao PostgreSQL!
    echo    Verifique se PostgreSQL está rodando e as credenciais estão corretas.
    pause
    exit /b 1
)

echo ✅ Conexão estabelecida!
echo.

REM Verificar se base de dados existe
echo 🔍 Verificando se base de dados '%DB_NAME%' existe...
psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname = '%DB_NAME%';" >nul 2>&1

if errorlevel 1 (
    echo 📦 Criando base de dados '%DB_NAME%'...
    psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d postgres -c "CREATE DATABASE %DB_NAME%;" >nul 2>&1
    
    if errorlevel 1 (
        echo ❌ Erro ao criar base de dados!
        pause
        exit /b 1
    )
    
    echo ✅ Base de dados criada com sucesso!
) else (
    echo ℹ️  Base de dados '%DB_NAME%' já existe.
)

echo.

REM Executar script de setup completo
echo 🏗️  Executando script de criação de tabelas...
set SCRIPT_PATH=%~dp0SCRIPT-SETUP-COMPLETO.sql

if not exist "%SCRIPT_PATH%" (
    echo ❌ Arquivo não encontrado: %SCRIPT_PATH%
    pause
    exit /b 1
)

psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -f "%SCRIPT_PATH%"

if errorlevel 1 (
    echo.
    echo ❌ Erro ao executar script!
    echo    Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ SETUP COMPLETO COM SUCESSO!
echo ========================================
echo.
echo 📋 Próximos passos:
echo    1. Configurar application.properties
echo    2. Iniciar o backend
echo    3. (Opcional) Executar initialize-home-content.sql
echo.

REM Limpar senha
set DB_PASSWORD=
set PGPASSWORD=

pause
