# Script de Deploy Automático no Vercel
# Windows PowerShell - Deploy rápido sem interação

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Automático - Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI não encontrado!" -ForegroundColor Red
    Write-Host "Execute primeiro: vercel-config\setup-completo-auto.ps1" -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar login
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não está logado no Vercel!" -ForegroundColor Red
    Write-Host "Execute: vercel login" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Logado como: $loginCheck" -ForegroundColor Green
Write-Host ""

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
    Write-Host "🚀 Deploy de PRODUÇÃO" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "🚀 Deploy de PREVIEW" -ForegroundColor Green
}

Write-Host ""

# Deploy Backend
$backendPath = Join-Path $PSScriptRoot "..\backend"
if (Test-Path $backendPath) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Deploy Backend" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location $backendPath
    
    if ($prodFlag) {
        vercel --prod --yes
    } else {
        vercel --yes
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend deployado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no deploy do backend" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Build e Deploy Frontend
$frontendPath = Join-Path $PSScriptRoot "..\frontend"
if (Test-Path $frontendPath) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Build e Deploy Frontend" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location $frontendPath
    
    # Build
    Write-Host "Fazendo build..." -ForegroundColor Yellow
    npm run build:prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build concluído!" -ForegroundColor Green
        Write-Host ""
        
        # Deploy
        if ($prodFlag) {
            vercel --prod --yes
        } else {
            vercel --yes
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend deployado!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro no deploy do frontend" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Erro no build do frontend" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Deploy Concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

pause


