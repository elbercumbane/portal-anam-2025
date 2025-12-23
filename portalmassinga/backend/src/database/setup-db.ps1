# Script PowerShell para configurar banco de dados
Write-Host "=== Configuração do Banco de Dados PostgreSQL ===" -ForegroundColor Cyan
Write-Host ""

# Ler arquivo .env se existir
$envFile = ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "DB_PASSWORD=(.+)") {
        $currentPassword = $matches[1].Trim()
        Write-Host "Senha atual no .env: $currentPassword" -ForegroundColor Yellow
    }
}

Write-Host "Por favor, informe a senha do PostgreSQL:" -ForegroundColor Yellow
Write-Host "(Pressione Enter para usar 'postgres' como padrão)" -ForegroundColor Gray
$password = Read-Host "Senha"

if ([string]::IsNullOrWhiteSpace($password)) {
    $password = "postgres"
}

# Atualizar arquivo .env
$envContent = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=anam_portal
DB_USER=postgres
DB_PASSWORD=$password

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:4200
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host ""
Write-Host "Arquivo .env atualizado!" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando configuração do banco de dados..." -ForegroundColor Cyan
Write-Host ""

# Executar inicialização
npm run db:init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Populando banco com dados iniciais..." -ForegroundColor Cyan
    npm run db:seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Banco de dados configurado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para iniciar o servidor, execute: npm run dev" -ForegroundColor Cyan
    }
}

