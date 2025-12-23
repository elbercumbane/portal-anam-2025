# Script PowerShell para criar usuário admin no PostgreSQL
# Requer: PostgreSQL instalado e variáveis de ambiente configuradas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Criar Usuário Admin" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Carregar variáveis de ambiente do .env se existir
if (Test-Path ".env") {
    Write-Host "Carregando variáveis de ambiente do .env..." -ForegroundColor Yellow
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Obter configurações do banco
$DB_HOST = $env:DB_HOST
if (-not $DB_HOST) { $DB_HOST = "localhost" }

$DB_PORT = $env:DB_PORT
if (-not $DB_PORT) { $DB_PORT = "5432" }

$DB_NAME = $env:DB_NAME
if (-not $DB_NAME) { $DB_NAME = "anam_portal" }

$DB_USER = $env:DB_USER
if (-not $DB_USER) { $DB_USER = "postgres" }

$DB_PASSWORD = $env:DB_PASSWORD
if (-not $DB_PASSWORD) { 
    $DB_PASSWORD = Read-Host "Digite a senha do PostgreSQL para o usuário $DB_USER"
}

Write-Host "Configurações do banco:" -ForegroundColor Yellow
Write-Host "  Host: $DB_HOST" -ForegroundColor White
Write-Host "  Port: $DB_PORT" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  User: $DB_USER" -ForegroundColor White
Write-Host ""

# SQL para criar admin
$SQL = @"
INSERT INTO users (email, password_hash, full_name, role, active)
VALUES (
  'admin',
  '\$2a\$10\$TnCDA5VUrMSMam8M2ybXt.MPWi.ksSw8fL8ghaqU8IZieYVsVEjhG',
  'Admin',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;
"@

# Tentar executar via psql
$psqlPath = "psql"
$psqlFound = $false

# Verificar se psql está no PATH
try {
    $null = Get-Command psql -ErrorAction Stop
    $psqlFound = $true
} catch {
    # Tentar caminhos comuns
    $commonPaths = @(
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\14\bin\psql.exe",
        "C:\Program Files\PostgreSQL\13\bin\psql.exe",
        "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $psqlPath = $path
            $psqlFound = $true
            break
        }
    }
}

if ($psqlFound) {
    Write-Host "Executando SQL via psql..." -ForegroundColor Yellow
    
    # Criar arquivo SQL temporário
    $tempFile = [System.IO.Path]::GetTempFileName()
    $SQL | Out-File -FilePath $tempFile -Encoding UTF8
    
    # Configurar variável de ambiente para senha
    $env:PGPASSWORD = $DB_PASSWORD
    
    # Executar psql
    $psqlCommand = "`"$psqlPath`" -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f `"$tempFile`""
    
    try {
        Invoke-Expression $psqlCommand
        Write-Host ""
        Write-Host "✅ Usuário admin criado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Credenciais:" -ForegroundColor Yellow
        Write-Host "  Email: admin" -ForegroundColor White
        Write-Host "  Password: admin123" -ForegroundColor White
        Write-Host "  Role: admin" -ForegroundColor White
    } catch {
        Write-Host "❌ Erro ao executar SQL: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Execute manualmente o arquivo create-admin.sql no seu cliente PostgreSQL" -ForegroundColor Yellow
    } finally {
        # Limpar
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "⚠️  psql não encontrado no sistema." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Cyan
    Write-Host "1. Execute manualmente o arquivo create-admin.sql no pgAdmin ou outro cliente PostgreSQL" -ForegroundColor White
    Write-Host "2. Instale o PostgreSQL e adicione ao PATH" -ForegroundColor White
    Write-Host ""
    Write-Host "SQL para executar:" -ForegroundColor Yellow
    Write-Host $SQL -ForegroundColor Gray
}

Write-Host ""

