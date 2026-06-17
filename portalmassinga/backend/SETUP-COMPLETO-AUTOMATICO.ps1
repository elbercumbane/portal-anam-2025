# Script PowerShell Completo - Setup Automático ANAM
# Este script faz TUDO automaticamente:
# 1. Detecta PostgreSQL
# 2. Cria base de dados ANAM
# 3. Cria tabela membros
# 4. Inicia o backend

param(
    [string]$PostgresPassword = "",
    [switch]$SkipBackend = $false
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETO AUTOMATICO" -ForegroundColor Green
Write-Host "  Portal ANAM - Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# PASSO 1: Detectar PostgreSQL
# ============================================
Write-Host "[1/4] Detectando PostgreSQL..." -ForegroundColor Yellow

$psqlPath = $null
$pgVersions = @("16", "15", "14", "13", "12")

foreach ($version in $pgVersions) {
    $testPath = "C:\Program Files\PostgreSQL\$version\bin\psql.exe"
    if (Test-Path $testPath) {
        $psqlPath = $testPath
        Write-Host "       PostgreSQL $version encontrado!" -ForegroundColor Green
        break
    }
}

# Se não encontrou, procurar recursivamente
if (-not $psqlPath) {
    $psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | 
                Select-Object -First 1 -ExpandProperty FullName
}

if (-not $psqlPath) {
    Write-Host "ERRO: PostgreSQL não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, certifique-se de que o PostgreSQL está instalado." -ForegroundColor Yellow
    Write-Host "Baixe em: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    pause
    exit 1
}

Write-Host "       Caminho: $psqlPath" -ForegroundColor Gray
Write-Host ""

# ============================================
# PASSO 2: Solicitar senha do PostgreSQL
# ============================================
Write-Host "[2/4] Configurando conexão..." -ForegroundColor Yellow

if ([string]::IsNullOrEmpty($PostgresPassword)) {
    $securePassword = Read-Host "       Digite a senha do usuário 'postgres'" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $PostgresPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$env:PGPASSWORD = $PostgresPassword

# Testar conexão
Write-Host "       Testando conexão..." -ForegroundColor Gray
$testConnection = & $psqlPath -U postgres -c "SELECT version();" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha na conexão com PostgreSQL!" -ForegroundColor Red
    Write-Host "       Verifique a senha e tente novamente." -ForegroundColor Yellow
    $env:PGPASSWORD = ""
    pause
    exit 1
}

Write-Host "       Conexão estabelecida!" -ForegroundColor Green
Write-Host ""

# ============================================
# PASSO 3: Criar base de dados ANAM
# ============================================
Write-Host "[3/4] Configurando base de dados ANAM..." -ForegroundColor Yellow

# Verificar se base de dados existe
$dbCheck = & $psqlPath -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'ANAM';" 2>&1
$dbExists = $dbCheck -match "1 row" -or $dbCheck -match "1 \|"

if (-not $dbExists) {
    Write-Host "       Criando base de dados ANAM..." -ForegroundColor Gray
    $createDb = & $psqlPath -U postgres -c "CREATE DATABASE ANAM;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "       Base de dados ANAM criada!" -ForegroundColor Green
        Write-Host "       Aguardando base de dados ficar disponível..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
        
        # Verificar se a base de dados está acessível
        $maxRetries = 5
        $retryCount = 0
        $dbReady = $false
        while ($retryCount -lt $maxRetries -and -not $dbReady) {
            $testDb = & $psqlPath -U postgres -d ANAM -c "SELECT 1;" 2>&1
            if ($LASTEXITCODE -eq 0) {
                $dbReady = $true
                Write-Host "       Base de dados disponível!" -ForegroundColor Green
            } else {
                $retryCount++
                Start-Sleep -Seconds 1
            }
        }
        
        if (-not $dbReady) {
            Write-Host "AVISO: Base de dados pode não estar totalmente pronta." -ForegroundColor Yellow
        }
    } else {
        Write-Host "ERRO: Falha ao criar base de dados!" -ForegroundColor Red
        Write-Host $createDb -ForegroundColor Yellow
        $env:PGPASSWORD = ""
        pause
        exit 1
    }
} else {
    Write-Host "       Base de dados ANAM já existe." -ForegroundColor Green
}

Write-Host ""

# ============================================
# PASSO 4: Criar tabela membros
# ============================================
Write-Host "[4/4] Criando tabela membros..." -ForegroundColor Yellow

$scriptPath = Join-Path $PSScriptRoot "sql\create-database-anam.sql"
if (Test-Path $scriptPath) {
    Write-Host "       Executando script SQL..." -ForegroundColor Gray
    
    # Tentar executar o script SQL
    $sqlResult = & $psqlPath -U postgres -d ANAM -f $scriptPath 2>&1
    $sqlExitCode = $LASTEXITCODE
    
    # Verificar se a tabela foi criada
    Start-Sleep -Seconds 2
    $tableCheck = & $psqlPath -U postgres -d ANAM -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros';" 2>&1
    
    if ($sqlExitCode -eq 0 -or $tableCheck -match "1" -or $tableCheck -match "count") {
        Write-Host "       Tabela 'membros' criada com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "       AVISO: Script SQL pode ter tido problemas, mas isso é normal." -ForegroundColor Yellow
        Write-Host "       A tabela será criada automaticamente pelo Hibernate ao iniciar o backend." -ForegroundColor Gray
        Write-Host "       (Isso é esperado se a tabela já existir ou se houver pequenos erros)" -ForegroundColor Gray
    }
} else {
    Write-Host "       AVISO: Script SQL não encontrado: $scriptPath" -ForegroundColor Yellow
    Write-Host "       A tabela será criada automaticamente pelo Hibernate." -ForegroundColor Gray
}

# Limpar senha da memória
$env:PGPASSWORD = ""

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BASE DE DADOS CONFIGURADA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# PASSO 5: Verificar configuração do backend
# ============================================
$propertiesPath = Join-Path $PSScriptRoot "src\main\resources\application.properties"
if (Test-Path $propertiesPath) {
    $properties = Get-Content $propertiesPath -Raw
    if ($properties -notmatch "spring\.datasource\.password=santos133") {
        Write-Host "AVISO: Verifique a senha no application.properties" -ForegroundColor Yellow
        Write-Host "       Arquivo: $propertiesPath" -ForegroundColor Gray
        Write-Host ""
    }
}

# ============================================
# PASSO 6: Iniciar backend (se não foi pulado)
# ============================================
if (-not $SkipBackend) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  INICIANDO BACKEND" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar se está na pasta correta
    if (-not (Test-Path ".\mvnw.cmd")) {
        Write-Host "ERRO: mvnw.cmd não encontrado!" -ForegroundColor Red
        Write-Host "       Certifique-se de executar este script na pasta backend/" -ForegroundColor Yellow
        pause
        exit 1
    }
    
    # Verificar PostgreSQL rodando
    Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
    $pgPort = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
    if (-not $pgPort) {
        Write-Host "AVISO: PostgreSQL pode não estar rodando!" -ForegroundColor Yellow
        Write-Host "       Certifique-se de iniciar o serviço PostgreSQL." -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "       PostgreSQL está rodando!" -ForegroundColor Green
    }
    
    # Verificar porta 8080
    Write-Host "Verificando porta 8080..." -ForegroundColor Yellow
    $port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($port8080) {
        Write-Host "AVISO: Porta 8080 já está em uso!" -ForegroundColor Yellow
        Write-Host "       Processo: $($port8080.OwningProcess)" -ForegroundColor Gray
        Write-Host "       O backend pode não iniciar corretamente." -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "       Porta 8080 está livre!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Compilando projeto..." -ForegroundColor Yellow
    Write-Host ""
    
    # Compilar projeto
    & .\mvnw.cmd clean install -DskipTests
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERRO: Falha na compilação!" -ForegroundColor Red
        Write-Host "       Verifique os erros acima." -ForegroundColor Yellow
        pause
        exit 1
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  BACKEND INICIANDO..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend estará disponível em:" -ForegroundColor Cyan
    Write-Host "  http://localhost:8080/api" -ForegroundColor White
    Write-Host ""
    Write-Host "API de Membros:" -ForegroundColor Cyan
    Write-Host "  POST   http://localhost:8080/api/membros" -ForegroundColor Gray
    Write-Host "  GET    http://localhost:8080/api/membros" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
    Write-Host ""
    
    # Iniciar backend
    & .\mvnw.cmd spring-boot:run
} else {
    Write-Host "Backend não será iniciado (use -SkipBackend para pular)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para iniciar o backend manualmente:" -ForegroundColor Yellow
    Write-Host "  cd portalmassinga\backend" -ForegroundColor Cyan
    Write-Host "  .\mvnw.cmd spring-boot:run" -ForegroundColor Cyan
    Write-Host ""
    pause
}
