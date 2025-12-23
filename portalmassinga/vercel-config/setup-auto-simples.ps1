# Script Automático Simplificado de Setup e Deploy no Vercel
# Windows PowerShell

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Automatico - Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Vercel CLI
Write-Host "[1/5] Verificando Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha ao instalar Vercel CLI!" -ForegroundColor Red
        pause
        exit 1
    }
}
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Verificar Login
Write-Host "[2/5] Verificando login..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Fazendo login..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO: Falha no login!" -ForegroundColor Red
        pause
        exit 1
    }
} else {
    Write-Host "Logado como: $loginCheck" -ForegroundColor Green
}
Write-Host ""

# Instalar dependencias
Write-Host "[3/5] Verificando dependencias..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "..\backend"
$frontendPath = Join-Path $PSScriptRoot "..\frontend"

if (Test-Path $backendPath) {
    Set-Location $backendPath
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias do backend..." -ForegroundColor Yellow
        npm install
    }
}

if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    if (-not (Test-Path "node_modules")) {
        Write-Host "Instalando dependencias do frontend..." -ForegroundColor Yellow
        npm install
    }
}
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Deploy Backend
Write-Host "[4/5] Deploy do Backend..." -ForegroundColor Yellow
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "Siga as instrucoes:" -ForegroundColor Cyan
    Write-Host "  - Link para projeto existente? N" -ForegroundColor White
    Write-Host "  - Nome do projeto? portal-anam-backend" -ForegroundColor White
    Write-Host "  - Diretorio? ./" -ForegroundColor White
    Write-Host ""
    vercel --yes
}
Write-Host ""

# Deploy Frontend
Write-Host "[5/5] Build e Deploy do Frontend..." -ForegroundColor Yellow
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    Write-Host "Fazendo build..." -ForegroundColor Cyan
    npm run build:prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Siga as instrucoes:" -ForegroundColor Cyan
        Write-Host "  - Link para projeto existente? N" -ForegroundColor White
        Write-Host "  - Nome do projeto? portal-anam-frontend" -ForegroundColor White
        Write-Host "  - Diretorio? ./" -ForegroundColor White
        Write-Host ""
        vercel --yes
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Concluido!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Configure variaveis de ambiente no dashboard do Vercel" -ForegroundColor White
Write-Host "2. Consulte env.example.txt para ver quais variaveis sao necessarias" -ForegroundColor White
Write-Host "3. Faca novo deploy apos configurar as variaveis" -ForegroundColor White
Write-Host ""

pause

