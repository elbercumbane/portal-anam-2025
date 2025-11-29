# Portal da Associacao - Script Ngrok para Windows
# PowerShell Script para configurar acesso publico

param(
    [string]$Port = "4201",
    [switch]$SkipNgrokCheck
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Portal da Associacao - Ngrok Setup" -ForegroundColor Cyan
Write-Host "  Sistema Operacional: Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Funcao para verificar se um comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Verificar se Node.js esta instalado
if (-not (Test-Command "node")) {
    Write-Host "ERRO: Node.js nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instale o Node.js de: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
    exit 1
}

# Verificar se ngrok esta instalado
if (-not $SkipNgrokCheck) {
    if (-not (Test-Command "ngrok")) {
        Write-Host "ERRO: ngrok nao encontrado!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Instale o ngrok:" -ForegroundColor Yellow
        Write-Host "1. Baixe de: https://ngrok.com/download" -ForegroundColor White
        Write-Host "2. Extraia o arquivo ngrok.exe" -ForegroundColor White
        Write-Host "3. Adicione ao PATH ou coloque na pasta do projeto" -ForegroundColor White
        Write-Host ""
        Read-Host "Pressione Enter para continuar"
        exit 1
    }
    Write-Host "ngrok encontrado!" -ForegroundColor Green
}

# Verificar se as dependencias estao instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "ERRO: Dependencias nao instaladas!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute primeiro: npm install" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
    exit 1
}

Write-Host "Dependencias encontradas!" -ForegroundColor Green
Write-Host ""

# Verificar se a porta esta em uso
$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "AVISO: Porta $Port ja esta em uso!" -ForegroundColor Yellow
    $response = Read-Host "Deseja usar outra porta? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        $Port = Read-Host "Digite a nova porta"
    }
}

Write-Host ""
Write-Host "Iniciando servidor Angular para acesso publico..." -ForegroundColor Yellow
Write-Host "Porta: $Port" -ForegroundColor Cyan
Write-Host ""

# Iniciar o servidor Angular em background
Write-Host "Iniciando servidor Angular..." -ForegroundColor Green
$angularJob = Start-Job -ScriptBlock {
    param($port)
    Set-Location $using:PWD
    npm run start:ngrok
} -ArgumentList $Port

# Aguardar um pouco para o servidor iniciar
Write-Host "Aguardando servidor iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verificar se o servidor esta rodando
$serverRunning = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $serverRunning) {
    Write-Host "ERRO: Servidor Angular nao iniciou corretamente!" -ForegroundColor Red
    Stop-Job $angularJob
    Remove-Job $angularJob
    Read-Host "Pressione Enter para continuar"
    exit 1
}

Write-Host "Servidor Angular iniciado com sucesso!" -ForegroundColor Green
Write-Host "Local: http://localhost:$Port" -ForegroundColor Cyan
Write-Host ""

if (-not $SkipNgrokCheck) {
    Write-Host "Iniciando ngrok..." -ForegroundColor Green
    Write-Host "A aplicacao estara disponivel publicamente em alguns segundos..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para parar: Pressione Ctrl+C" -ForegroundColor Red
    Write-Host ""
    
    # Iniciar ngrok
    ngrok http $Port
} else {
    Write-Host "Ngrok nao sera iniciado (--SkipNgrokCheck ativo)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para acessar publicamente, execute manualmente:" -ForegroundColor Cyan
    Write-Host "ngrok http $Port" -ForegroundColor White
    Write-Host ""
    Write-Host "Servidor rodando em: http://localhost:$Port" -ForegroundColor Green
    Read-Host "Pressione Enter para parar o servidor"
}

# Limpar o job do Angular
Stop-Job $angularJob -ErrorAction SilentlyContinue
Remove-Job $angularJob -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Servidor parado." -ForegroundColor Red
Read-Host "Pressione Enter para sair"
