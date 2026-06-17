@echo off
echo ========================================
echo   Criar Base de Dados ANAM - PostgreSQL
echo ========================================
echo.

REM Tentar encontrar o psql.exe
set PSQL_PATH=
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PSQL_PATH=%%i\bin\psql.exe
        goto :found
    )
)

:found
if "%PSQL_PATH%"=="" (
    echo ERRO: PostgreSQL nao encontrado!
    echo.
    echo Por favor, instale o PostgreSQL primeiro ou execute manualmente:
    echo 1. Abra o pgAdmin4
    echo 2. Clique com botao direito em "Databases"
    echo 3. Selecione "Create" ^> "Database..."
    echo 4. Nome: ANAM
    echo 5. Clique em "Save"
    echo.
    pause
    exit /b 1
)

echo PostgreSQL encontrado em: %PSQL_PATH%
echo.

REM Solicitar senha do PostgreSQL
set /p POSTGRES_PASSWORD="Digite a senha do usuario postgres: "

echo.
echo Criando base de dados ANAM...
"%PSQL_PATH%" -U postgres -c "CREATE DATABASE ANAM;" -W
if errorlevel 1 (
    echo.
    echo ERRO ao criar base de dados!
    echo Verifique se o PostgreSQL esta rodando e se a senha esta correta.
    pause
    exit /b 1
)

echo.
echo Base de dados ANAM criada com sucesso!
echo.
echo Agora execute o script SQL para criar a tabela:
echo 1. Abra o pgAdmin4
echo 2. Conecte-se a base de dados ANAM
echo 3. Abra o arquivo: sql\create-database-anam.sql
echo 4. Execute o script (F5)
echo.
pause
