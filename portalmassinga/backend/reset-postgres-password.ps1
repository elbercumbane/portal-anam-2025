# Script para redefinir senha do PostgreSQL automaticamente
Write-Host "=== Redefinindo Senha do PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Este script requer privilégios de administrador!" -ForegroundColor Yellow
    Write-Host "   Execute o PowerShell como Administrador e tente novamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Ou execute manualmente:" -ForegroundColor Cyan
    Write-Host "   1. Stop-Service postgresql-x64-18" -ForegroundColor White
    Write-Host "   2. Edite: C:\Program Files\PostgreSQL\18\data\pg_hba.conf" -ForegroundColor White
    Write-Host "   3. Altere 'md5' para 'trust' na linha do host" -ForegroundColor White
    Write-Host "   4. Start-Service postgresql-x64-18" -ForegroundColor White
    Write-Host "   5. Execute: npm run db:init" -ForegroundColor White
    exit 1
}

$pgHbaPath = "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"
$pgService = "postgresql-x64-18"
$backupPath = "$pgHbaPath.backup"

# Fazer backup do arquivo original
Write-Host "[1/5] Fazendo backup do pg_hba.conf..." -ForegroundColor Yellow
if (Test-Path $pgHbaPath) {
    Copy-Item $pgHbaPath $backupPath -Force
    Write-Host "✅ Backup criado" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo pg_hba.conf não encontrado!" -ForegroundColor Red
    exit 1
}

# Parar serviço PostgreSQL
Write-Host "[2/5] Parando serviço PostgreSQL..." -ForegroundColor Yellow
try {
    Stop-Service $pgService -Force -ErrorAction Stop
    Start-Sleep -Seconds 2
    Write-Host "✅ Serviço parado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erro ao parar serviço: $_" -ForegroundColor Yellow
    Write-Host "   Tentando continuar..." -ForegroundColor Yellow
}

# Modificar pg_hba.conf para permitir conexão sem senha (trust)
Write-Host "[3/5] Modificando pg_hba.conf..." -ForegroundColor Yellow
try {
    $content = Get-Content $pgHbaPath -Raw
    $originalContent = $content
    
    # Substituir md5 por trust para localhost
    $content = $content -replace 'host\s+all\s+all\s+127\.0\.0\.1/32\s+md5', 'host    all             all             127.0.0.1/32            trust'
    $content = $content -replace 'host\s+all\s+all\s+::1/128\s+md5', 'host    all             all             ::1/128                 trust'
    
    if ($content -eq $originalContent) {
        Write-Host "⚠️  Não foi possível encontrar linhas para modificar" -ForegroundColor Yellow
        Write-Host "   Tentando adicionar linha trust manualmente..." -ForegroundColor Yellow
        
        # Adicionar linha trust no início
        $newLine = "host    all             all             127.0.0.1/32            trust`n"
        $content = $newLine + $content
    }
    
    Set-Content -Path $pgHbaPath -Value $content -NoNewline
    Write-Host "✅ Arquivo modificado" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao modificar arquivo: $_" -ForegroundColor Red
    # Restaurar backup
    Copy-Item $backupPath $pgHbaPath -Force
    exit 1
}

# Iniciar serviço PostgreSQL
Write-Host "[4/5] Iniciando serviço PostgreSQL..." -ForegroundColor Yellow
try {
    Start-Service $pgService
    Start-Sleep -Seconds 3
    Write-Host "✅ Serviço iniciado" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao iniciar serviço: $_" -ForegroundColor Red
    # Restaurar backup
    Copy-Item $backupPath $pgHbaPath -Force
    exit 1
}

# Redefinir senha do PostgreSQL
Write-Host "[5/5] Redefinindo senha do PostgreSQL..." -ForegroundColor Yellow
$newPassword = "postgres"  # Senha padrão simples

try {
    $env:PGPASSWORD = ""
    $result = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d postgres -c "ALTER USER postgres PASSWORD '$newPassword';" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Senha redefinida para: $newPassword" -ForegroundColor Green
        
        # Atualizar .env
        if (Test-Path ".env") {
            $envContent = Get-Content ".env" -Raw
            $envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$newPassword"
            Set-Content -Path ".env" -Value $envContent -NoNewline
            Write-Host "✅ Arquivo .env atualizado" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  Erro ao redefinir senha: $result" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Erro: $_" -ForegroundColor Yellow
}

# Restaurar pg_hba.conf original
Write-Host ""
Write-Host "Restaurando pg_hba.conf original..." -ForegroundColor Yellow
try {
    Copy-Item $backupPath $pgHbaPath -Force
    Remove-Item $backupPath -Force
    Write-Host "✅ Arquivo restaurado" -ForegroundColor Green
    
    # Reiniciar serviço
    Restart-Service $pgService -Force
    Write-Host "✅ Serviço reiniciado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erro ao restaurar: $_" -ForegroundColor Yellow
    Write-Host "   Backup salvo em: $backupPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Concluído! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Senha do PostgreSQL: $newPassword" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Yellow
Write-Host "  npm run db:init" -ForegroundColor White
Write-Host "  npm run db:seed" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White











