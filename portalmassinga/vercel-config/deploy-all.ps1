# Script de Deploy Completo (Backend + Frontend) no Vercel
# Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Completo - Vercel" -ForegroundColor Cyan
Write-Host "  Backend + Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Vercel CLI está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "ERRO: Vercel CLI não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale o Vercel CLI:" -ForegroundColor Yellow
    Write-Host "  npm install -g vercel" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Verificar login
Write-Host "Verificando login no Vercel..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Você precisa fazer login no Vercel primeiro!" -ForegroundColor Yellow
    Write-Host "Execute: vercel login" -ForegroundColor Yellow
    Write-Host ""
    $login = Read-Host "Deseja fazer login agora? (S/N)"
    if ($login -eq "S" -or $login -eq "s") {
        vercel login
    } else {
        Write-Host "Cancelado." -ForegroundColor Yellow
        pause
        exit 1
    }
} else {
    Write-Host "Logado como: $loginCheck" -ForegroundColor Green
    Write-Host ""
}

# Perguntar tipo de deploy
Write-Host "Tipo de deploy:" -ForegroundColor Yellow
Write-Host "  1. Preview (desenvolvimento)" -ForegroundColor Cyan
Write-Host "  2. Production (produção)" -ForegroundColor Cyan
Write-Host ""
$deployType = Read-Host "Escolha (1 ou 2)"

$prodFlag = ""
if ($deployType -eq "2") {
    $prodFlag = "--prod"
    Write-Host ""
    Write-Host "🚀 Fazendo deploy de PRODUÇÃO..." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "🚀 Fazendo deploy de PREVIEW..." -ForegroundColor Green
}

Write-Host ""

# ============================================
# DEPLOY BACKEND
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  1/2 - Deploy do Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "..\backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "Deploy do backend..." -ForegroundColor Yellow
    if ($prodFlag) {
        vercel --prod
    } else {
        vercel
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend deployado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no deploy do backend!" -ForegroundColor Red
        Write-Host "Continuando com o frontend..." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Pasta do backend não encontrada. Pulando..." -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# DEPLOY FRONTEND
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  2/2 - Deploy do Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $PSScriptRoot "..\frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    # Verificar build
    if (-not (Test-Path "dist\associacao-portal")) {
        Write-Host "Build não encontrado. Fazendo build..." -ForegroundColor Yellow
        npm run build:prod
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erro no build do frontend!" -ForegroundColor Red
            pause
            exit 1
        }
        Write-Host ""
    }
    
    Write-Host "Deploy do frontend..." -ForegroundColor Yellow
    if ($prodFlag) {
        vercel --prod
    } else {
        vercel
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend deployado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no deploy do frontend!" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Pasta do frontend não encontrada. Pulando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Concluído!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Verifique as variáveis de ambiente no dashboard do Vercel" -ForegroundColor Yellow
Write-Host "  2. Teste o backend: https://seu-backend.vercel.app/api/health" -ForegroundColor Yellow
Write-Host "  3. Teste o frontend: https://seu-frontend.vercel.app" -ForegroundColor Yellow
Write-Host "  4. Atualize CORS_ORIGIN e API_URL com as URLs reais" -ForegroundColor Yellow
Write-Host ""

pause

