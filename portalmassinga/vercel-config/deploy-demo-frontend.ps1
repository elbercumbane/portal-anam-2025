# Deploy apenas do Frontend na Vercel (link de demonstração)
# Usa npx vercel - não exige instalação global do Vercel CLI

$ErrorActionPreference = "Stop"
$frontendPath = Join-Path $PSScriptRoot "..\frontend"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Demo - Frontend (Vercel)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $frontendPath)) {
    Write-Host "ERRO: Pasta do frontend nao encontrada: $frontendPath" -ForegroundColor Red
    exit 1
}

# Verificar login
Write-Host "Verificando login na Vercel..." -ForegroundColor Yellow
$whoami = & npx --yes vercel whoami 2>$null
$loginOk = $LASTEXITCODE -eq 0
if (-not $loginOk) {
    Write-Host ""
    Write-Host "Voce precisa fazer login na Vercel primeiro." -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute no terminal (vai abrir o browser):" -ForegroundColor Yellow
    Write-Host "  cd $frontendPath" -ForegroundColor White
    Write-Host "  npx vercel login" -ForegroundColor White
    Write-Host ""
    Write-Host "Depois de fazer login, execute este script novamente:" -ForegroundColor Yellow
    Write-Host "  .\deploy-demo-frontend.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Logado como: $whoami" -ForegroundColor Green
Write-Host ""

Set-Location $frontendPath
Write-Host "Diretorio: $frontendPath" -ForegroundColor Green
Write-Host "Iniciando deploy (preview)..." -ForegroundColor Yellow
Write-Host ""

& npx --yes vercel --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deploy concluido. O link de demonstracao foi mostrado acima." -ForegroundColor Green
    Write-Host "Para deploy de producao (link estavel): cd frontend; npx vercel --prod --yes" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Erro no deploy. Verifique a mensagem acima." -ForegroundColor Red
    exit 1
}

Write-Host ""
