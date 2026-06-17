@echo off
chcp 65001 >nul
title Criar Base de Dados ANAM e Tabela Membros
color 0A

echo.
echo ========================================
echo   CRIAR BASE DE DADOS ANAM
echo   E TABELA MEMBROS
echo ========================================
echo.

set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe

if not exist "%PSQL_PATH%" (
    echo ERRO: PostgreSQL nao encontrado!
    echo Verifique se PostgreSQL esta instalado.
    pause
    exit /b 1
)

echo PostgreSQL encontrado!
echo.
set /p POSTGRES_PASSWORD="Digite a senha do usuario postgres: "
set PGPASSWORD=%POSTGRES_PASSWORD%

echo.
echo [1/2] Criando base de dados ANAM...

"%PSQL_PATH%" -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'ANAM';" >nul 2>&1
if errorlevel 1 (
    "%PSQL_PATH%" -U postgres -c "CREATE DATABASE ANAM;" 2>&1
    if errorlevel 1 (
        echo ERRO ao criar base de dados!
        echo Verifique a senha e tente novamente.
        set PGPASSWORD=
        pause
        exit /b 1
    )
    echo Base de dados ANAM criada com sucesso!
) else (
    echo Base de dados ANAM ja existe.
)

echo.
echo [2/2] Criando tabela membros...

if exist "sql\create-database-anam.sql" (
    "%PSQL_PATH%" -U postgres -d ANAM -f "sql\create-database-anam.sql" 2>&1
    if errorlevel 1 (
        echo AVISO: Verifique os erros acima.
        echo A tabela pode ser criada automaticamente pelo Hibernate ao iniciar o backend.
    ) else (
        echo Tabela membros criada com sucesso!
    )
) else (
    echo AVISO: Script SQL nao encontrado.
    echo A tabela sera criada automaticamente pelo Hibernate.
)

set PGPASSWORD=
echo.
echo ========================================
echo   CONCLUIDO!
echo ========================================
echo.
echo A base de dados ANAM e a tabela membros estao prontas!
echo.
pause
