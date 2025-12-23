# Script de Deploy do Backend no Vercel
# Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Backend - Vercel" -ForegroundColor Cyan
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

# Navegar para a pasta do backend
$backendPath = Join-Path $PSScriptRoot "..\backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "ERRO: Pasta do backend não encontrada!" -ForegroundColor Red
    Write-Host "Caminho esperado: $backendPath" -ForegroundColor Yellow
    pause
    exit 1
}

Set-Location $backendPath
Write-Host "Diretório: $backendPath" -ForegroundColor Green
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
    Write-Host "  - Verificar as variáveis de ambiente no dashboard" -ForegroundColor Yellow
    Write-Host "  - Testar a API após o deploy" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
}

Write-Host ""
pause

