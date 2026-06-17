@echo off
REM =====================================================
REM SCRIPT AUTOMÁTICO - RECRIAR BASE DE DADOS ANAM
REM =====================================================
REM Este script remove a base de dados existente,
REM cria uma nova base de dados ANAM e executa todos
REM os scripts necessários automaticamente.
REM
REM ATENÇÃO: Este script apaga todos os dados existentes!
REM =====================================================

echo.
echo ================================================
echo RECRIAR BASE DE DADOS ANAM - SETUP AUTOMATICO
echo ================================================
echo.
echo Este script vai:
echo   1. Remover a base de dados ANAM existente (se houver)
echo   2. Criar uma nova base de dados ANAM
echo   3. Criar todas as tabelas necessarias
echo   4. Popular dados iniciais
echo.
echo ATENCAO: Todos os dados existentes serao apagados!
echo.
echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

REM =====================================================
REM CONFIGURAÇÕES
REM =====================================================
REM IMPORTANTE: Altere a senha abaixo se sua senha do PostgreSQL for diferente
set PGHOST=localhost
set PGPORT=5432
set PGUSER=postgres
set PGPASSWORD=admin123
set DBNAME=anam

REM Caminho do diretório SQL
set SQL_DIR=%~dp0

REM Detectar caminho do psql
set PSQL_PATH=
where psql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set PSQL_PATH=psql
) else (
    REM Tentar caminhos comuns do PostgreSQL
    if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" (
        set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
    ) else if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
        set PSQL_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
    ) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
        set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
    ) else (
        echo ERRO: psql nao encontrado!
        echo Por favor, adicione o PostgreSQL ao PATH ou edite este script.
        pause
        exit /b 1
    )
)

REM Configurar variável de ambiente para senha (psql usa PGPASSWORD)
set PGPASSWORD=%PGPASSWORD%

echo.
echo ================================================
echo PASSO 1: Removendo base de dados existente...
echo ================================================
echo.
echo Conectando como usuario: %PGUSER%
echo.

REM Executar script para remover e criar base de dados
"%PSQL_PATH%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -f "%SQL_DIR%01-CRIAR-BASE-DADOS.sql"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao criar base de dados!
    echo Verifique se o PostgreSQL esta rodando e se as credenciais estao corretas.
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo PASSO 2: Criando tabelas e populando dados...
echo ================================================
echo.
echo Conectando a base de dados: %DBNAME%
echo.

REM Executar script para criar tabelas e dados
"%PSQL_PATH%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %DBNAME% -f "%SQL_DIR%02-SETUP-TABELAS-E-DADOS.sql"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao criar tabelas ou popular dados!
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo VERIFICACAO FINAL
echo ================================================
echo.

REM Verificar se as tabelas foram criadas
"%PSQL_PATH%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %DBNAME% -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('home_content', 'membros', 'apoiantes', 'simpatizantes', 'member_applications', 'application_dependents') ORDER BY table_name;"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo AVISO: Nao foi possivel verificar as tabelas.
    echo.
) else (
    echo.
    echo ================================================
    echo SUCESSO! Base de dados ANAM criada com sucesso!
    echo ================================================
    echo.
    echo Proximos passos:
    echo   1. Verifique o arquivo application.properties
    echo   2. Inicie o backend Spring Boot
    echo   3. Teste a aplicacao
    echo.
)

pause
