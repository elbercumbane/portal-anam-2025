# =====================================================
# Script PowerShell - Setup Completo Base de Dados
# =====================================================
# Este script executa o setup completo da base de dados
# Execute: .\executar-setup-completo.ps1
# =====================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 SETUP COMPLETO - BASE DE DADOS ANAM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurações
$DB_NAME = "anam2025"
$DB_USER = "postgres"
$DB_HOST = "localhost"
$DB_PORT = "5432"

# Solicitar senha do PostgreSQL
$securePassword = Read-Host "Digite a senha do PostgreSQL" -AsSecureString
$DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
)

Write-Host ""
Write-Host "📋 Verificando conexão com PostgreSQL..." -ForegroundColor Yellow

# Verificar se PostgreSQL está acessível
$env:PGPASSWORD = $DB_PASSWORD
$testConnection = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d postgres -c "SELECT 1;" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao conectar ao PostgreSQL!" -ForegroundColor Red
    Write-Host "   Verifique se PostgreSQL está rodando e as credenciais estão corretas." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Conexão estabelecida!" -ForegroundColor Green
Write-Host ""

# Verificar se base de dados existe
Write-Host "🔍 Verificando se base de dados '$DB_NAME' existe..." -ForegroundColor Yellow
$dbExists = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" 2>&1

if ([string]::IsNullOrWhiteSpace($dbExists)) {
    Write-Host "📦 Criando base de dados '$DB_NAME'..." -ForegroundColor Yellow
    & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d postgres -c "CREATE DATABASE $DB_NAME;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de dados criada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar base de dados!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️  Base de dados '$DB_NAME' já existe." -ForegroundColor Blue
}

Write-Host ""

# Executar script de setup completo
Write-Host "🏗️  Executando script de criação de tabelas..." -ForegroundColor Yellow
$scriptPath = Join-Path $PSScriptRoot "SCRIPT-SETUP-COMPLETO.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Arquivo não encontrado: $scriptPath" -ForegroundColor Red
    exit 1
}

& psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ SETUP COMPLETO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Configurar application.properties" -ForegroundColor White
    Write-Host "   2. Iniciar o backend" -ForegroundColor White
    Write-Host "   3. (Opcional) Executar initialize-home-content.sql" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao executar script!" -ForegroundColor Red
    Write-Host "   Verifique os erros acima." -ForegroundColor Red
    exit 1
}

# Limpar senha da memória
$DB_PASSWORD = $null
$env:PGPASSWORD = $null
