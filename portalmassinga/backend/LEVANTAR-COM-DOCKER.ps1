# Script PowerShell para levantar backend com Docker
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LEVANTANDO BACKEND COM DOCKER" -ForegroundColor Green
Write-Host "  Portal ANAM" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Verificar Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Docker não está instalado ou não está rodando!" -ForegroundColor Red
    Write-Host "Por favor, instale o Docker Desktop e inicie-o." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[1/4] Parando containers existentes..." -ForegroundColor Yellow
docker-compose down
Write-Host ""

Write-Host "[2/4] Construindo imagens Docker..." -ForegroundColor Yellow
docker-compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Falha ao construir imagens!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Imagens construídas!" -ForegroundColor Green
Write-Host ""

Write-Host "[3/4] Subindo containers..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Falha ao subir containers!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Containers iniciados!" -ForegroundColor Green
Write-Host ""

Write-Host "[4/4] Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND LEVANTADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Serviços disponíveis:" -ForegroundColor Yellow
Write-Host "   PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:8081/api" -ForegroundColor Cyan
Write-Host "   Membros: http://localhost:8081/api/membros" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   Ver logs: docker-compose logs -f backend" -ForegroundColor Gray
Write-Host "   Parar: docker-compose down" -ForegroundColor Gray
Write-Host "   Status: docker-compose ps" -ForegroundColor Gray
Write-Host ""
Write-Host "Aguardando backend iniciar completamente..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar se backend está respondendo
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend está respondendo! Total de membros: $($response.Count)" -ForegroundColor Green
} catch {
    Write-Host "⏳ Backend ainda está iniciando. Aguarde mais alguns segundos." -ForegroundColor Yellow
    Write-Host "   Verifique os logs: docker-compose logs -f backend" -ForegroundColor Gray
}

Write-Host ""
