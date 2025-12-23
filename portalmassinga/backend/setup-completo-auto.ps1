# Script PowerShell para configurar tudo automaticamente
# Cria banco, tabelas e usuário admin

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Completo Automático" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# Criar arquivo .env se não existir
if (-not (Test-Path ".env")) {
    Write-Host "Criando arquivo .env..." -ForegroundColor Yellow
    @"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=anam_portal
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3000
NODE_ENV=development

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:4200
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
}

# Tentar resetar senha se necessário
Write-Host ""
Write-Host "Tentando configurar senha do PostgreSQL..." -ForegroundColor Yellow

if ($isAdmin) {
    Write-Host "Executando script de reset de senha..." -ForegroundColor Yellow
    & ".\reset-postgres-password.ps1"
} else {
    Write-Host "⚠️  Execute como Administrador para resetar senha automaticamente" -ForegroundColor Yellow
    Write-Host "   Ou configure manualmente a senha no .env" -ForegroundColor Yellow
}

# Aguardar um pouco
Start-Sleep -Seconds 2

# Executar setup do banco
Write-Host ""
Write-Host "Inicializando banco de dados..." -ForegroundColor Yellow
npm run db:init

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Banco inicializado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erro ao inicializar banco. Continuando..." -ForegroundColor Yellow
}

# Executar migrações
Write-Host ""
Write-Host "Criando tabelas..." -ForegroundColor Yellow
npm run db:migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tabelas criadas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erro ao criar tabelas. Continuando..." -ForegroundColor Yellow
}

# Criar usuário admin
Write-Host ""
Write-Host "Criando usuário admin..." -ForegroundColor Yellow
npm run db:create-admin-auto

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Usuário admin criado!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erro ao criar admin. Tente executar manualmente:" -ForegroundColor Yellow
    Write-Host "   npm run db:create-admin-auto" -ForegroundColor White
    Write-Host "   Ou execute o SQL em create-admin.sql" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Completo!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciais do Admin:" -ForegroundColor Cyan
Write-Host "  Email: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Inicie o backend: npm run dev" -ForegroundColor White
Write-Host "  2. Inicie o frontend: cd ../frontend && npm start" -ForegroundColor White
Write-Host "  3. Acesse: http://localhost:4200/login" -ForegroundColor White
Write-Host ""

