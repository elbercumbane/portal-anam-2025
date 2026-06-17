# Script PowerShell para Instalar e Configurar PostgreSQL Automaticamente
# Execute como Administrador: PowerShell -ExecutionPolicy Bypass -File instalar-postgresql-automatico.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalação Automática PostgreSQL" -ForegroundColor Green
Write-Host "  Base de Dados ANAM" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está executando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botão direito no PowerShell e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar se PostgreSQL já está instalado
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if ($psqlPath) {
    Write-Host "✓ PostgreSQL já está instalado em: $psqlPath" -ForegroundColor Green
    $postgresInstalled = $true
} else {
    Write-Host "PostgreSQL não encontrado. Será necessário instalar manualmente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Execute o instalador" -ForegroundColor Yellow
    Write-Host "3. Durante a instalação:" -ForegroundColor Yellow
    Write-Host "   - Anote a senha do usuário 'postgres'" -ForegroundColor Yellow
    Write-Host "   - Use a porta padrão: 5432" -ForegroundColor Yellow
    Write-Host "4. Após instalar, execute este script novamente" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Solicitar senha do PostgreSQL
Write-Host ""
$postgresPassword = Read-Host "Digite a senha do usuário 'postgres'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Definir variável de ambiente para senha
$env:PGPASSWORD = $plainPassword

Write-Host ""
Write-Host "Criando base de dados ANAM..." -ForegroundColor Yellow

# Criar base de dados ANAM
$createDbResult = & $psqlPath -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'ANAM';" 2>&1
if ($LASTEXITCODE -eq 0) {
    $dbExists = $createDbResult -match "1 row"
    
    if (-not $dbExists) {
        Write-Host "Criando base de dados ANAM..." -ForegroundColor Yellow
        & $psqlPath -U postgres -c "CREATE DATABASE ANAM;" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Base de dados ANAM criada com sucesso!" -ForegroundColor Green
        } else {
            Write-Host "ERRO ao criar base de dados ANAM" -ForegroundColor Red
            pause
            exit 1
        }
    } else {
        Write-Host "✓ Base de dados ANAM já existe" -ForegroundColor Green
    }
} else {
    Write-Host "ERRO ao verificar base de dados. Verifique a senha do PostgreSQL." -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Criando tabela membros..." -ForegroundColor Yellow

# Executar script SQL para criar tabela
$scriptPath = Join-Path $PSScriptRoot "sql\create-database-anam.sql"
if (Test-Path $scriptPath) {
    & $psqlPath -U postgres -d ANAM -f $scriptPath 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Tabela 'membros' criada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Pode haver erros ao criar tabela. Verificando..." -ForegroundColor Yellow
    }
} else {
    Write-Host "ERRO: Script SQL não encontrado em: $scriptPath" -ForegroundColor Red
    pause
    exit 1
}

# Verificar se a tabela foi criada
Write-Host ""
Write-Host "Verificando tabela membros..." -ForegroundColor Yellow
$checkTable = & $psqlPath -U postgres -d ANAM -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'membros';" 2>&1
if ($checkTable -match "1") {
    Write-Host "✓ Tabela 'membros' existe na base de dados ANAM!" -ForegroundColor Green
} else {
    Write-Host "AVISO: Tabela 'membros' pode não ter sido criada. Verifique manualmente." -ForegroundColor Yellow
}

# Limpar senha da memória
$env:PGPASSWORD = ""

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração Concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure a senha do PostgreSQL no arquivo:" -ForegroundColor Yellow
Write-Host "   portalmassinga\backend\src\main\resources\application.properties" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Inicie o backend:" -ForegroundColor Yellow
Write-Host "   cd portalmassinga\backend" -ForegroundColor Cyan
Write-Host "   .\mvnw.cmd spring-boot:run" -ForegroundColor Cyan
Write-Host ""
pause
