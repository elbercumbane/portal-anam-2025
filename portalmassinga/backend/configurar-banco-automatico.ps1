# Script PowerShell para Configurar Base de Dados ANAM Automaticamente
# Execute este script APOS instalar o PostgreSQL

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuracao Automatica" -ForegroundColor Green
Write-Host "  Base de Dados ANAM" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Encontrar psql
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if (-not $psqlPath) {
    Write-Host "ERRO: PostgreSQL nao encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o PostgreSQL primeiro." -ForegroundColor Yellow
    Write-Host "Baixe em: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "PostgreSQL encontrado em: $psqlPath" -ForegroundColor Green
Write-Host ""

# Solicitar senha
$postgresPassword = Read-Host "Digite a senha do usuario 'postgres'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$env:PGPASSWORD = $plainPassword

Write-Host ""
Write-Host "Verificando se a base de dados ANAM existe..." -ForegroundColor Yellow

# Verificar se base de dados existe
$dbCheck = & $psqlPath -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'ANAM';" 2>&1
$dbExists = $dbCheck -match "1 row"

if (-not $dbExists) {
    Write-Host "Criando base de dados ANAM..." -ForegroundColor Yellow
    & $psqlPath -U postgres -c "CREATE DATABASE ANAM;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de dados ANAM criada!" -ForegroundColor Green
    } else {
        Write-Host "ERRO ao criar base de dados" -ForegroundColor Red
        $env:PGPASSWORD = ""
        pause
        exit 1
    }
} else {
    Write-Host "Base de dados ANAM ja existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "Criando tabela membros..." -ForegroundColor Yellow

# Executar script SQL
$scriptPath = Join-Path $PSScriptRoot "sql\create-database-anam.sql"
if (Test-Path $scriptPath) {
    $result = & $psqlPath -U postgres -d ANAM -f $scriptPath 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Script SQL executado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Verifique os erros acima" -ForegroundColor Yellow
        Write-Host $result -ForegroundColor Yellow
    }
} else {
    Write-Host "ERRO: Script SQL nao encontrado: $scriptPath" -ForegroundColor Red
    $env:PGPASSWORD = ""
    pause
    exit 1
}

# Verificar tabela
Write-Host ""
Write-Host "Verificando tabela membros..." -ForegroundColor Yellow
$tableCheck = & $psqlPath -U postgres -d ANAM -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros';" 2>&1
if ($tableCheck -match "1") {
    Write-Host "Tabela 'membros' criada com sucesso!" -ForegroundColor Green
} else {
    Write-Host "AVISO: Tabela pode nao ter sido criada. Verifique manualmente." -ForegroundColor Yellow
}

# Limpar senha
$env:PGPASSWORD = ""

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuracao Concluida!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora configure a senha no application.properties:" -ForegroundColor Yellow
Write-Host "portalmassinga\backend\src\main\resources\application.properties" -ForegroundColor Cyan
Write-Host ""
pause
