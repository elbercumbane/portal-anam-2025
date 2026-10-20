# Script para iniciar o backend Spring Boot
Write-Host "Iniciando backend Spring Boot..." -ForegroundColor Cyan
Write-Host ""

# Verificar se o Maven Wrapper existe
if (-not (Test-Path ".\mvnw.cmd")) {
    Write-Host "ERRO: mvnw.cmd nao encontrado!" -ForegroundColor Red
    Write-Host "Certifique-se de estar na pasta backend/" -ForegroundColor Yellow
    exit 1
}

# Verificar se o PostgreSQL esta rodando
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPort = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if (-not $pgPort) {
    Write-Host "AVISO: PostgreSQL pode nao estar rodando!" -ForegroundColor Yellow
    Write-Host "Certifique-se de que o PostgreSQL esta iniciado." -ForegroundColor Yellow
    Write-Host ""
}

# Verificar se a porta 8080 esta livre
Write-Host "Verificando porta 8080..." -ForegroundColor Yellow
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    Write-Host "ERRO: Porta 8080 ja esta em uso!" -ForegroundColor Red
    Write-Host "Processo: $($port8080.OwningProcess)" -ForegroundColor Gray
    Write-Host "Encerre o processo antes de continuar." -ForegroundColor Yellow
    exit 1
}

Write-Host "OK - Porta 8080 esta livre" -ForegroundColor Green
Write-Host ""

# Compilar e iniciar o backend
Write-Host "Compilando projeto..." -ForegroundColor Yellow
.\mvnw.cmd clean install -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha na compilacao!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Iniciando backend..." -ForegroundColor Yellow
Write-Host "Backend estara disponivel em: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host ""

# Iniciar o Spring Boot
.\mvnw.cmd spring-boot:run

