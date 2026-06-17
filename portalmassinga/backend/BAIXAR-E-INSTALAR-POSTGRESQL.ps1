# Script para Baixar e Instalar PostgreSQL Automaticamente
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Download e Instalacao PostgreSQL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se ja esta instalado
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
if ($psqlPath) {
    Write-Host "PostgreSQL ja esta instalado em: $psqlPath" -ForegroundColor Green
    Write-Host "Execute o script SETUP-COMPLETO-AUTOMATICO.bat para configurar a base de dados." -ForegroundColor Yellow
    pause
    exit 0
}

Write-Host "PostgreSQL nao encontrado. Iniciando download..." -ForegroundColor Yellow
Write-Host ""

# URL do instalador PostgreSQL (versao mais recente)
$downloadUrl = "https://get.enterprisedb.com/postgresql/postgresql-16.1-1-windows-x64.exe"
$installerPath = "$env:TEMP\postgresql-installer.exe"

Write-Host "Baixando instalador do PostgreSQL..." -ForegroundColor Yellow
Write-Host "URL: $downloadUrl" -ForegroundColor Cyan
Write-Host ""

try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download concluido!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Abrindo instalador..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "INSTRUCOES IMPORTANTES:" -ForegroundColor Yellow
    Write-Host "1. Durante a instalacao, ANOTE A SENHA do usuario 'postgres'" -ForegroundColor Red
    Write-Host "2. Use a porta padrao: 5432" -ForegroundColor Yellow
    Write-Host "3. Escolha o locale: Portuguese, Brazil" -ForegroundColor Yellow
    Write-Host "4. Apos instalar, execute: SETUP-COMPLETO-AUTOMATICO.bat" -ForegroundColor Yellow
    Write-Host ""
    
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host ""
    Write-Host "Instalacao concluida!" -ForegroundColor Green
    Write-Host "Agora execute: SETUP-COMPLETO-AUTOMATICO.bat" -ForegroundColor Yellow
    
} catch {
    Write-Host "ERRO ao baixar instalador: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, baixe manualmente:" -ForegroundColor Yellow
    Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
}

pause
