# Script de Deploy do Frontend no Vercel
# Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Frontend - Vercel" -ForegroundColor Cyan
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

# Navegar para a pasta do frontend
$frontendPath = Join-Path $PSScriptRoot "..\frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "ERRO: Pasta do frontend não encontrada!" -ForegroundColor Red
    Write-Host "Caminho esperado: $frontendPath" -ForegroundColor Yellow
    pause
    exit 1
}

Set-Location $frontendPath
Write-Host "Diretório: $frontendPath" -ForegroundColor Green
Write-Host ""

# Verificar se está logado no Vercel
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

# Verificar se precisa fazer build
Write-Host "Verificando se precisa fazer build..." -ForegroundColor Yellow
if (-not (Test-Path "dist\associacao-portal")) {
    Write-Host "Build não encontrado. Fazendo build..." -ForegroundColor Yellow
    Write-Host ""
    npm run build:prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro no build!" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host ""
}

# Perguntar se é deploy de produção
Write-Host "Tipo de deploy:" -ForegroundColor Yellow
Write-Host "  1. Preview (desenvolvimento)" -ForegroundColor Cyan
Write-Host "  2. Production (produção)" -ForegroundColor Cyan
Write-Host ""
$deployType = Read-Host "Escolha (1 ou 2)"

if ($deployType -eq "2") {
    Write-Host ""
    Write-Host "Fazendo deploy de PRODUÇÃO..." -ForegroundColor Green
    Write-Host ""
    vercel --prod
} else {
    Write-Host ""
    Write-Host "Fazendo deploy de PREVIEW..." -ForegroundColor Green
    Write-Host ""
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Lembre-se de:" -ForegroundColor Yellow
    Write-Host "  - Verificar a variável API_URL no dashboard" -ForegroundColor Yellow
    Write-Host "  - Testar o frontend após o deploy" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
}

Write-Host ""
pause

