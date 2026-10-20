# Script para verificar se o backend esta rodando
Write-Host "Verificando status do backend..." -ForegroundColor Cyan

# Verificar se a porta 8080 esta em uso
Write-Host ""
Write-Host "Verificando porta 8080..." -ForegroundColor Yellow
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    Write-Host "OK - Porta 8080 esta em uso" -ForegroundColor Green
    Write-Host "   Processo: $($port8080.OwningProcess)" -ForegroundColor Gray
    $process = Get-Process -Id $port8080.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "   Nome: $($process.ProcessName)" -ForegroundColor Gray
        Write-Host "   Caminho: $($process.Path)" -ForegroundColor Gray
    }
} else {
    Write-Host "ERRO - Porta 8080 NAO esta em uso - Backend nao esta rodando!" -ForegroundColor Red
}

# Testar conexao HTTP
Write-Host ""
Write-Host "Testando conexao HTTP..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "OK - Backend esta respondendo!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO - Backend NAO esta respondendo: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar PostgreSQL
Write-Host ""
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPort = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if ($pgPort) {
    Write-Host "OK - PostgreSQL esta rodando na porta 5432" -ForegroundColor Green
} else {
    Write-Host "AVISO - PostgreSQL pode nao estar rodando na porta 5432" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verificacao concluida!" -ForegroundColor Cyan

