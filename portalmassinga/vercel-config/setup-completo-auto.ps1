# Script AutomÃ¡tico Completo de Setup e Deploy no Vercel
# Windows PowerShell - Faz tudo automaticamente

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup AutomÃ¡tico - Vercel" -ForegroundColor Cyan
Write-Host "  ConfiguraÃ§Ã£o e Deploy Completo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# PASSO 1: Verificar e Instalar Vercel CLI
# ============================================
Write-Host "[1/7] Verificando Vercel CLI..." -ForegroundColor Yellow

$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Vercel CLI nÃ£o encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "âŒ Erro ao instalar Vercel CLI!" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "âœ… Vercel CLI instalado!" -ForegroundColor Green
} else {
    Write-Host "âœ… Vercel CLI jÃ¡ instalado" -ForegroundColor Green
}

Write-Host ""

# ============================================
# PASSO 2: Verificar Login no Vercel
# ============================================
Write-Host "[2/7] Verificando login no Vercel..." -ForegroundColor Yellow

$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "NÃ£o estÃ¡ logado. Fazendo login..." -ForegroundColor Yellow
    Write-Host "Siga as instruÃ§Ãµes na janela do navegador que serÃ¡ aberta." -ForegroundColor Cyan
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "âŒ Erro no login!" -ForegroundColor Red
        pause
        exit 1
    }
} else {
    Write-Host "âœ… Logado como: $loginCheck" -ForegroundColor Green
}

Write-Host ""

# ============================================
# PASSO 3: Verificar DependÃªncias
# ============================================
Write-Host "[3/7] Verificando dependÃªncias..." -ForegroundColor Yellow

$backendPath = Join-Path $PSScriptRoot "..\backend"
$frontendPath = Join-Path $PSScriptRoot "..\frontend"

# Backend
if (Test-Path $backendPath) {
    Set-Location $backendPath
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependÃªncias do backend..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "âŒ Erro ao instalar dependÃªncias do backend!" -ForegroundColor Red
            pause
            exit 1
        }
    } else {
        Write-Host "âœ… DependÃªncias do backend OK" -ForegroundColor Green
    }
}

# Frontend
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependÃªncias do frontend..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "âŒ Erro ao instalar dependÃªncias do frontend!" -ForegroundColor Red
            pause
            exit 1
        }
    } else {
        Write-Host "âœ… DependÃªncias do frontend OK" -ForegroundColor Green
    }
}

Write-Host ""

# ============================================
# PASSO 4: Configurar VariÃ¡veis de Ambiente
# ============================================
Write-Host "[4/7] ConfiguraÃ§Ã£o de VariÃ¡veis de Ambiente" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANTE: Configure as variÃ¡veis de ambiente no dashboard do Vercel" -ForegroundColor Cyan
Write-Host "ApÃ³s o deploy, acesse: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "VariÃ¡veis necessÃ¡rias estÃ£o em: vercel-config\env.example.txt" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Deseja configurar variÃ¡veis agora? (S/N)"
if ($continue -eq "S" -or $continue -eq "s") {
    Write-Host ""
    Write-Host "VocÃª pode configurar as variÃ¡veis:" -ForegroundColor Yellow
    Write-Host "  1. Manualmente no dashboard apÃ³s o deploy" -ForegroundColor Cyan
    Write-Host "  2. Via Vercel CLI (serÃ¡ solicitado durante o deploy)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host ""

# ============================================
# PASSO 5: Deploy do Backend
# ============================================
Write-Host "[5/7] Deploy do Backend..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path $backendPath) {
    Set-Location $backendPath
    
    Write-Host "Iniciando deploy do backend..." -ForegroundColor Cyan
    Write-Host "Siga as instruÃ§Ãµes interativas:" -ForegroundColor Yellow
    Write-Host "  - Link para projeto existente? N (primeira vez)" -ForegroundColor Cyan
    Write-Host "  - Nome do projeto? portal-anam-backend" -ForegroundColor Cyan
    Write-Host "  - DiretÃ³rio? ./" -ForegroundColor Cyan
    Write-Host ""
    
    vercel --yes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "âœ… Backend deployado com sucesso!" -ForegroundColor Green
        
        # Tentar obter a URL do backend
        $backendUrl = vercel ls --json 2>&1 | ConvertFrom-Json | Select-Object -First 1 -ExpandProperty url -ErrorAction SilentlyContinue
        if ($backendUrl) {
            Write-Host "URL do Backend: https://$backendUrl" -ForegroundColor Green
            $global:BackendUrl = "https://$backendUrl"
        }
    } else {
        Write-Host "âš ï¸  Deploy do backend pode ter tido problemas. Verifique manualmente." -ForegroundColor Yellow
    }
} else {
    Write-Host "âš ï¸  Pasta do backend nÃ£o encontrada. Pulando..." -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# PASSO 6: Build e Deploy do Frontend
# ============================================
Write-Host "[6/7] Build e Deploy do Frontend..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    # Build do frontend
    Write-Host "Fazendo build do frontend..." -ForegroundColor Cyan
    npm run build:prod
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "âŒ Erro no build do frontend!" -ForegroundColor Red
        Write-Host "Continuando mesmo assim..." -ForegroundColor Yellow
    } else {
        Write-Host "âœ… Build concluÃ­do!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Iniciando deploy do frontend..." -ForegroundColor Cyan
    Write-Host "Siga as instruÃ§Ãµes interativas:" -ForegroundColor Yellow
    Write-Host "  - Link para projeto existente? N (primeira vez)" -ForegroundColor Cyan
    Write-Host "  - Nome do projeto? portal-anam-frontend" -ForegroundColor Cyan
    Write-Host "  - DiretÃ³rio? ./" -ForegroundColor Cyan
    Write-Host ""
    
    vercel --yes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "âœ… Frontend deployado com sucesso!" -ForegroundColor Green
        
        # Tentar obter a URL do frontend
        $frontendUrl = vercel ls --json 2>&1 | ConvertFrom-Json | Select-Object -First 1 -ExpandProperty url -ErrorAction SilentlyContinue
        if ($frontendUrl) {
            Write-Host "URL do Frontend: https://$frontendUrl" -ForegroundColor Green
            $global:FrontendUrl = "https://$frontendUrl"
        }
    } else {
        Write-Host "âš ï¸  Deploy do frontend pode ter tido problemas. Verifique manualmente." -ForegroundColor Yellow
    }
} else {
    Write-Host "âš ï¸  Pasta do frontend nÃ£o encontrada. Pulando..." -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# PASSO 7: Resumo e PrÃ³ximos Passos
# ============================================
Write-Host "[7/7] Resumo e PrÃ³ximos Passos" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  âœ… Setup ConcluÃ­do!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($global:BackendUrl) {
    Write-Host "Backend: $($global:BackendUrl)" -ForegroundColor Green
}
if ($global:FrontendUrl) {
    Write-Host "Frontend: $($global:FrontendUrl)" -ForegroundColor Green
}

Write-Host ""
Write-Host "PRÃ“XIMOS PASSOS IMPORTANTES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure as variÃ¡veis de ambiente no dashboard do Vercel:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "2. Para o BACKEND, adicione:" -ForegroundColor Yellow
Write-Host "   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD" -ForegroundColor White
Write-Host "   - JWT_SECRET (gere uma chave segura)" -ForegroundColor White
Write-Host "   - NODE_ENV=production" -ForegroundColor White
if ($global:FrontendUrl) {
    Write-Host "   - CORS_ORIGIN=$($global:FrontendUrl)" -ForegroundColor White
    Write-Host "   - FRONTEND_URL=$($global:FrontendUrl)" -ForegroundColor White
    Write-Host "   - ALLOWED_ORIGINS=$($global:FrontendUrl)" -ForegroundColor White
}
Write-Host ""
Write-Host "3. Para o FRONTEND, adicione:" -ForegroundColor Yellow
if ($global:BackendUrl) {
    Write-Host "   - API_URL=$($global:BackendUrl)/api" -ForegroundColor White
} else {
    Write-Host "   - API_URL=https://seu-backend.vercel.app/api" -ForegroundColor White
}
Write-Host ""
Write-Host "4. Apos configurar as variaveis, faca novo deploy" -ForegroundColor Yellow
Write-Host "   cd backend; vercel --prod" -ForegroundColor White
Write-Host "   cd frontend; vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "Veja a documentacao em: vercel-config/README.md" -ForegroundColor Cyan
Write-Host ""

pause


