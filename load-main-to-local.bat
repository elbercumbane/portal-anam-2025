@echo off
chcp 65001 >nul
echo ========================================
echo   Carregar Código do Main para Local
echo   Portal ANAM - Sincronização Completa
echo ========================================
echo.

REM Verificar se está em um repositório Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Git não está instalado ou não está no PATH!
    echo.
    echo Por favor, instale o Git primeiro.
    echo Download: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Verificando se é um repositório Git...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Esta pasta não é um repositório Git!
    echo.
    echo Para inicializar um repositório:
    echo   git init
    echo   git remote add origin [URL_DO_REPOSITORIO]
    echo.
    pause
    exit /b 1
)

echo.
echo [1/5] Verificando branch atual...
echo.
git branch --show-current
set CURRENT_BRANCH=%errorlevel%

echo.
echo [2/5] Verificando mudanças locais não commitadas...
echo.
git status --short
git diff --quiet
set HAS_CHANGES=%errorlevel%

if %HAS_CHANGES% neq 0 (
    echo.
    echo ⚠️  ATENÇÃO: Você tem mudanças locais não commitadas!
    echo.
    echo O que deseja fazer?
    echo 1. Descartar todas as mudanças locais e carregar o main (RECOMENDADO para atualizar)
    echo 2. Fazer stash das mudanças (salvar temporariamente)
    echo 3. Cancelar e fazer commit das mudanças primeiro
    echo.
    set /p choice="Digite sua escolha (1-3): "
    
    if "%choice%"=="1" (
        echo.
        echo Descartando mudanças locais...
        git reset --hard HEAD
        git clean -fd
        echo Mudanças locais descartadas!
    ) else if "%choice%"=="2" (
        echo.
        echo Salvando mudanças em stash...
        git stash push -m "Stash antes de carregar main - %date% %time%"
        echo Mudanças salvas em stash!
        echo Para recuperar depois: git stash pop
    ) else (
        echo.
        echo Operação cancelada.
        echo Faça commit das suas mudanças primeiro e execute o script novamente.
        echo.
        pause
        exit /b 0
    )
)

echo.
echo [3/5] Buscando atualizações do repositório remoto...
echo.
git fetch origin main
if %errorlevel% neq 0 (
    echo.
    echo AVISO: Erro ao fazer fetch do origin/main
    echo Verificando se o remote 'origin' está configurado...
    git remote -v
    echo.
    set /p continue="Deseja continuar mesmo assim? (s/n): "
    if /i not "%continue%"=="s" (
        echo Operação cancelada.
        pause
        exit /b 1
    )
)

echo.
echo [4/5] Verificando branch atual e mudando para main se necessário...
echo.
git branch --show-current >nul 2>&1
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

if not "%CURRENT_BRANCH%"=="main" (
    echo Você está no branch: %CURRENT_BRANCH%
    echo Mudando para o branch main...
    git checkout main
    if %errorlevel% neq 0 (
        echo.
        echo Branch main não existe localmente. Criando a partir do origin/main...
        git checkout -b main origin/main
        if %errorlevel% neq 0 (
            echo.
            echo ERRO: Não foi possível criar o branch main.
            echo Verifique se o remote está configurado corretamente.
            pause
            exit /b 1
        )
    )
) else (
    echo Você já está no branch main.
)

echo.
echo [5/5] Carregando código do main...
echo.
echo Fazendo pull do origin/main...
git pull origin main
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao fazer pull do main!
    echo.
    echo Possíveis causas:
    echo - Conflitos que precisam ser resolvidos
    echo - Problemas de conexão
    echo - Branch remoto não encontrado
    echo.
    echo Tentando fazer reset hard para o origin/main...
    set /p reset="Deseja fazer reset hard para origin/main? (s/n): "
    if /i "%reset%"=="s" (
        git reset --hard origin/main
        git clean -fd
        echo Reset hard concluído!
    ) else (
        echo Operação cancelada.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   Sincronização Concluída!
echo ========================================
echo.
echo Status do repositório:
git status --short
echo.
echo Último commit:
git log -1 --oneline
echo.
echo Branch atual:
git branch --show-current
echo.

echo ========================================
echo   Próximos Passos
echo ========================================
echo.
echo 1. Limpe os caches e faça build limpo:
echo    Execute: sync-and-build.bat
echo.
echo 2. Ou limpe manualmente:
echo    - Delete a pasta .angular
echo    - Delete a pasta dist
echo    - Execute: npm install
echo    - Execute: npm run build:prod
echo.
echo 3. Limpe o cache do navegador:
echo    - Ctrl+Shift+Delete
echo    - Ou F12 -^> Application -^> Clear storage
echo.

set /p clean_now="Deseja executar sync-and-build.bat agora para limpar caches? (s/n): "
if /i "%clean_now%"=="s" (
    echo.
    echo Executando sync-and-build.bat...
    call sync-and-build.bat
) else (
    pause
)
