# Script para iniciar backend com Java 17
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO BACKEND COM JAVA 17" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Java 17
& "$PSScriptRoot\instalar-java17.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Java 17 não está instalado!" -ForegroundColor Red
    Write-Host "Por favor, instale Java 17 primeiro." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO BACKEND" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Verificar se mvnw existe
if (-not (Test-Path ".\mvnw.cmd")) {
    Write-Host "❌ mvnw.cmd não encontrado!" -ForegroundColor Red
    pause
    exit 1
}

# Verificar PostgreSQL
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPort = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if (-not $pgPort) {
    Write-Host "⚠️ PostgreSQL pode não estar rodando!" -ForegroundColor Yellow
    Write-Host "Certifique-se de que o PostgreSQL está iniciado." -ForegroundColor Yellow
    Write-Host ""
}

# Verificar porta 8081
Write-Host "Verificando porta 8081..." -ForegroundColor Yellow
$port8081 = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($port8081) {
    Write-Host "⚠️ Porta 8081 já está em uso!" -ForegroundColor Yellow
    Write-Host "Processo: $($port8081.OwningProcess)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Compilando e iniciando backend..." -ForegroundColor Yellow
Write-Host "Backend estará disponível em: http://localhost:8081/api" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host ""

# Iniciar backend
.\mvnw.cmd spring-boot:run
