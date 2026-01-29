@echo off
echo ========================================
echo Criando base de dados anam2025
echo ========================================
echo.

REM Tentar encontrar o psql no caminho padrão do PostgreSQL
set PSQL_PATH=
if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\16\bin\psql.exe
) else if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\15\bin\psql.exe
) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\14\bin\psql.exe
) else if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\13\bin\psql.exe
) else if exist "C:\Program Files\PostgreSQL\12\bin\psql.exe" (
    set PSQL_PATH=C:\Program Files\PostgreSQL\12\bin\psql.exe
)

if "%PSQL_PATH%"=="" (
    echo ERRO: PostgreSQL nao encontrado!
    echo.
    echo Por favor, execute manualmente no pgAdmin4:
    echo 1. Abra o pgAdmin4
    echo 2. Clique com botao direito em "Databases"
    echo 3. Selecione "Create" ^> "Database..."
    echo 4. Nome: anam2025
    echo 5. Clique em "Save"
    echo.
    echo Ou execute no Query Tool:
    echo CREATE DATABASE anam2025;
    echo.
    pause
    exit /b 1
)

echo PostgreSQL encontrado em: %PSQL_PATH%
echo.
echo Criando base de dados anam2025...
echo.

"%PSQL_PATH%" -U postgres -c "CREATE DATABASE anam2025;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Base de dados anam2025 criada com sucesso!
    echo ========================================
    echo.
    echo Agora execute o script SQL para criar as tabelas:
    echo sql\create-database-anam2025.sql
    echo.
) else (
    echo.
    echo AVISO: Nao foi possivel criar a base de dados automaticamente.
    echo Isso pode acontecer se:
    echo - A base de dados ja existe
    echo - As credenciais estao incorretas
    echo - O PostgreSQL nao esta rodando
    echo.
    echo Por favor, crie manualmente no pgAdmin4:
    echo 1. Abra o pgAdmin4
    echo 2. Clique com botao direito em "Databases"
    echo 3. Selecione "Create" ^> "Database..."
    echo 4. Nome: anam2025
    echo 5. Clique em "Save"
    echo.
)

pause

