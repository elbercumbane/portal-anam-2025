@echo off
REM =====================================================
REM SCRIPT AUTOMÁTICO - RECRIAR BASE DE DADOS ANAM (DOCKER)
REM =====================================================
REM Este script remove a base de dados existente,
REM cria uma nova base de dados ANAM e executa todos
REM os scripts necessários automaticamente via Docker.
REM
REM ATENÇÃO: Este script apaga todos os dados existentes!
REM =====================================================

echo.
echo ================================================
echo RECRIAR BASE DE DADOS ANAM - SETUP AUTOMATICO (DOCKER)
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
REM Nome do container PostgreSQL para ANAM (NÃO misturar com outras aplicações!)
set CONTAINER_NAME=anam-postgres
set PGUSER=postgres
set PGPASSWORD=admin123
set DBNAME=anam

REM Caminho do diretório SQL
set SQL_DIR=%~dp0

REM Verificar se o container está rodando
docker ps --filter "name=%CONTAINER_NAME%" --format "{{.Names}}" | findstr /C:"%CONTAINER_NAME%" >nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo AVISO: Container "%CONTAINER_NAME%" nao encontrado. Procurando outros containers PostgreSQL...
    echo.
    REM Tentar encontrar qualquer container PostgreSQL
    for /f "tokens=1" %%i in ('docker ps --filter "ancestor=postgres*" --format "{{.Names}}"') do (
        set CONTAINER_NAME=%%i
        echo Container PostgreSQL encontrado: %%i
        goto :container_found
    )
    echo.
    echo ERRO: Nenhum container PostgreSQL encontrado!
    echo.
    echo Containers disponiveis:
    docker ps --format "table {{.Names}}\t{{.Status}}"
    echo.
    pause
    exit /b 1
    :container_found
)

echo.
echo Container Docker encontrado: %CONTAINER_NAME%
echo.

REM =====================================================
REM PASSO 1: REMOVER BASE DE DADOS EXISTENTE
REM =====================================================
echo ================================================
echo PASSO 1: Removendo base de dados existente...
echo ================================================
echo.

REM Copiar script SQL para o container temporariamente
docker cp "%SQL_DIR%01-CRIAR-BASE-DADOS.sql" %CONTAINER_NAME%:/tmp/01-CRIAR-BASE-DADOS.sql

REM Executar script para remover e criar base de dados
docker exec -e PGPASSWORD=%PGPASSWORD% %CONTAINER_NAME% psql -U %PGUSER% -f /tmp/01-CRIAR-BASE-DADOS.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao criar base de dados!
    echo Verifique se o container esta rodando e se as credenciais estao corretas.
    echo.
    pause
    exit /b 1
)

echo.
echo Base de dados removida/criada com sucesso!
echo.

REM =====================================================
REM PASSO 2: CRIAR TABELAS E POPULAR DADOS
REM =====================================================
echo ================================================
echo PASSO 2: Criando tabelas e populando dados...
echo ================================================
echo.
echo Conectando a base de dados: %DBNAME%
echo.

REM Copiar script SQL para o container
docker cp "%SQL_DIR%02-SETUP-TABELAS-E-DADOS.sql" %CONTAINER_NAME%:/tmp/02-SETUP-TABELAS-E-DADOS.sql

REM Executar script para criar tabelas e dados
docker exec -e PGPASSWORD=%PGPASSWORD% %CONTAINER_NAME% psql -U %PGUSER% -d %DBNAME% -f /tmp/02-SETUP-TABELAS-E-DADOS.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERRO: Falha ao criar tabelas ou popular dados!
    echo.
    pause
    exit /b 1
)

echo.
echo Tabelas criadas e dados populados com sucesso!
echo.

REM =====================================================
REM PASSO 3: LIMPAR ARQUIVOS TEMPORARIOS
REM =====================================================
docker exec %CONTAINER_NAME% rm -f /tmp/01-CRIAR-BASE-DADOS.sql /tmp/02-SETUP-TABELAS-E-DADOS.sql

REM =====================================================
REM VERIFICAÇÃO FINAL
REM =====================================================
echo ================================================
echo VERIFICACAO FINAL
echo ================================================
echo.

REM Verificar se as tabelas foram criadas
docker exec -e PGPASSWORD=%PGPASSWORD% %CONTAINER_NAME% psql -U %PGUSER% -d %DBNAME% -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('home_content', 'membros', 'apoiantes', 'simpatizantes', 'member_applications', 'application_dependents') ORDER BY table_name;"

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
    echo Tabelas criadas:
    echo   - home_content
    echo   - membros
    echo   - apoiantes
    echo   - simpatizantes
    echo   - member_applications
    echo   - application_dependents
    echo.
    echo Proximos passos:
    echo   1. Verifique o arquivo application.properties
    echo   2. Inicie o backend Spring Boot
    echo   3. Teste a aplicacao
    echo.
)

pause
