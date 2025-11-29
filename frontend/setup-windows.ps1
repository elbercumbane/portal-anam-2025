# Portal da Associacao - Script de Configuracao para Windows
# PowerShell Script para instalacao e configuracao

param(
    [switch]$SkipNodeCheck,
    [switch]$ForceInstall,
    [string]$NodeVersion = "18"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Portal da Associacao - Instalacao" -ForegroundColor Cyan
Write-Host "  Sistema Operacional: Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Funcao para verificar se um comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Verificar se Node.js esta instalado
if (-not $SkipNodeCheck) {
    if (-not (Test-Command "node")) {
        Write-Host "ERRO: Node.js nao encontrado!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, instale o Node.js versao $NodeVersion ou superior:" -ForegroundColor Yellow
        Write-Host "https://nodejs.org/" -ForegroundColor Blue
        Write-Host ""
        Read-Host "Pressione Enter para continuar"
        exit 1
    }

    # Verificar versao do Node.js
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
    
    # Verificar se a versao e compativel
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "AVISO: Versao do Node.js pode ser incompativel!" -ForegroundColor Yellow
        Write-Host "Recomendado: Node.js 18 ou superior" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Verificar se npm esta instalado
if (-not (Test-Command "npm")) {
    Write-Host "ERRO: npm nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, reinstale o Node.js que inclui o npm:" -ForegroundColor Yellow
    Write-Host "https://nodejs.org/" -ForegroundColor Blue
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
    exit 1
}

$npmVersion = npm --version
Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
Write-Host ""

# Limpar cache do npm
Write-Host "Limpando cache do npm..." -ForegroundColor Yellow
try {
    npm cache clean --force
    Write-Host "Cache limpo com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Aviso: Nao foi possivel limpar o cache" -ForegroundColor Yellow
}
Write-Host ""

# Verificar se node_modules existe
if ((Test-Path "node_modules") -and -not $ForceInstall) {
    Write-Host "Dependencias ja instaladas encontradas." -ForegroundColor Yellow
    $response = Read-Host "Deseja reinstalar? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        Write-Host "Removendo dependencias existentes..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    }
}

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
Write-Host "Isso pode demorar alguns minutos..." -ForegroundColor Gray
Write-Host ""

try {
    npm install
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Instalacao concluida com sucesso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERRO: Falha na instalacao das dependencias!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tentativas de solucao:" -ForegroundColor Yellow
    Write-Host "1. Execute como Administrador" -ForegroundColor White
    Write-Host "2. Desative temporariamente o antivirus" -ForegroundColor White
    Write-Host "3. Execute: npm cache clean --force" -ForegroundColor White
    Write-Host "4. Execute: npm install --force" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
    exit 1
}

Write-Host ""
Write-Host "Comandos disponiveis:" -ForegroundColor Cyan
Write-Host "  npm start          - Iniciar servidor de desenvolvimento" -ForegroundColor White
Write-Host "  npm run start:dev  - Iniciar em modo desenvolvimento" -ForegroundColor White
Write-Host "  npm run build:prod - Build para producao" -ForegroundColor White
Write-Host "  npm test           - Executar testes" -ForegroundColor White
Write-Host ""

$startNow = Read-Host "Deseja iniciar a aplicacao agora? (s/n)"
if ($startNow -eq "s" -or $startNow -eq "S") {
    Write-Host ""
    Write-Host "Iniciando aplicacao..." -ForegroundColor Green
    Write-Host "A aplicacao estara disponivel em: http://localhost:4200" -ForegroundColor Cyan
    Write-Host ""
    npm start
}

Write-Host ""
Read-Host "Pressione Enter para sair"
