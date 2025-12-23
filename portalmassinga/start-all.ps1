# Script para iniciar Frontend e Backend automaticamente
# Portal da Associação e Massinga

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Portal da Associacao - Iniciar Tudo" -ForegroundColor Cyan
Write-Host "  Frontend + Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERRO: Execute este script na raiz do projeto (portalmassinga)" -ForegroundColor Red
    Write-Host "Diretório atual: $PWD" -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar dependências do frontend
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "AVISO: Dependências do frontend não encontradas!" -ForegroundColor Yellow
    Write-Host "Instalando dependências do frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Verificar dependências do backend
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "AVISO: Dependências do backend não encontradas!" -ForegroundColor Yellow
    Write-Host "Instalando dependências do backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "Iniciando Backend e Frontend..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione Ctrl+C para parar ambos os serviços" -ForegroundColor Cyan
Write-Host ""

# Iniciar Backend em uma nova janela
Write-Host "Iniciando Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '=== BACKEND ===' -ForegroundColor Cyan; npm run dev"

# Aguardar um pouco para o backend iniciar
Start-Sleep -Seconds 3

# Iniciar Frontend em uma nova janela
Write-Host "Iniciando Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '=== FRONTEND ===' -ForegroundColor Cyan; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Serviços iniciados com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse:" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:4200" -ForegroundColor Yellow
Write-Host "  - Backend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "  - Health:   http://localhost:3000/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para parar os serviços, feche as janelas do terminal" -ForegroundColor Cyan
Write-Host ""

