@echo off
chcp 65001 >nul
title Configuracao Automatica PostgreSQL + ANAM
color 0A

echo.
echo ========================================
echo   CONFIGURACAO AUTOMATICA COMPLETA
echo   PostgreSQL + Base de Dados ANAM
echo ========================================
echo.

REM Verificar se PostgreSQL esta instalado
echo [1/4] Verificando PostgreSQL...
set PSQL_PATH=
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PSQL_PATH=%%i\bin\psql.exe
        set PG_VERSION=%%~ni
        goto :found_psql
    )
)

:found_psql
if "%PSQL_PATH%"=="" (
    echo.
    echo [ERRO] PostgreSQL NAO ENCONTRADO!
    echo.
    echo ========================================
    echo   INSTALACAO NECESSARIA
    echo ========================================
    echo.
    echo Por favor, instale o PostgreSQL primeiro:
    echo.
    echo 1. Baixe em: https://www.postgresql.org/download/windows/
    echo 2. Execute o instalador
    echo 3. Durante a instalacao:
    echo    - ANOTE A SENHA do usuario 'postgres'
    echo    - Use a porta padrao: 5432
    echo    - Escolha locale: Portuguese, Brazil
    echo.
    echo 4. Apos instalar, execute este script novamente
    echo.
    echo ========================================
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL encontrado: %PG_VERSION%
echo       Caminho: %PSQL_PATH%
echo.

REM Solicitar senha
echo [2/4] Configuracao da base de dados...
set /p POSTGRES_PASSWORD="Digite a senha do usuario 'postgres': "
set PGPASSWORD=%POSTGRES_PASSWORD%

echo.
echo [3/4] Criando base de dados ANAM...

REM Verificar se base de dados existe
"%PSQL_PATH%" -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'ANAM';" >nul 2>&1
if errorlevel 1 (
    echo       Criando base de dados...
    "%PSQL_PATH%" -U postgres -c "CREATE DATABASE ANAM;" >nul 2>&1
    if errorlevel 1 (
        echo [ERRO] Falha ao criar base de dados!
        echo        Verifique a senha e tente novamente.
        set PGPASSWORD=
        pause
        exit /b 1
    )
    echo [OK] Base de dados ANAM criada!
) else (
    echo [OK] Base de dados ANAM ja existe.
)

echo.
echo [4/4] Criando tabela membros...

REM Executar script SQL
if exist "sql\create-database-anam.sql" (
    echo       Executando script SQL...
    "%PSQL_PATH%" -U postgres -d ANAM -f "sql\create-database-anam.sql" >nul 2>&1
    if errorlevel 1 (
        echo [AVISO] Verifique os erros acima.
    ) else (
        echo [OK] Script SQL executado!
    )
) else (
    echo [ERRO] Script SQL nao encontrado: sql\create-database-anam.sql
    set PGPASSWORD=
    pause
    exit /b 1
)

REM Verificar tabela
echo       Verificando tabela...
"%PSQL_PATH%" -U postgres -d ANAM -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros';" 2>&1 | findstr "1" >nul
if errorlevel 1 (
    echo [AVISO] Tabela pode nao ter sido criada. Verifique manualmente.
) else (
    echo [OK] Tabela membros verificada!
)

set PGPASSWORD=
echo.
echo ========================================
echo   CONFIGURACAO CONCLUIDA!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Configure a senha no application.properties:
echo    portalmassinga\backend\src\main\resources\application.properties
echo.
echo 2. Altere a linha:
echo    spring.datasource.password=%POSTGRES_PASSWORD%
echo.
echo 3. Inicie o backend:
echo    cd portalmassinga\backend
echo    .\mvnw.cmd spring-boot:run
echo.
echo ========================================
echo.
pause
