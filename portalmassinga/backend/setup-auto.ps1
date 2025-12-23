# Script PowerShell para configuração automática completa
Write-Host "=== Configuração Automática do Backend ANAM ===" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Instalar dependências
Write-Host "[1/4] Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# Passo 2: Configurar .env
Write-Host "[2/4] Configurando arquivo .env..." -ForegroundColor Yellow
if (-not (Test-Path .env)) {
    Write-Host "Por favor, informe a senha do PostgreSQL:" -ForegroundColor Yellow
    $password = Read-Host "Senha"
    if ([string]::IsNullOrWhiteSpace($password)) {
        $password = "postgres"
    }
    
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
    Write-Host "✅ Arquivo .env criado" -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}
Write-Host ""

# Passo 3: Inicializar banco de dados
Write-Host "[3/4] Inicializando banco de dados..." -ForegroundColor Yellow
npm run db:init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Erro ao inicializar banco. Verifique as credenciais no arquivo .env" -ForegroundColor Yellow
    Write-Host "   Você pode criar o banco manualmente usando pgAdmin ou psql" -ForegroundColor Yellow
    Write-Host "   Veja SETUP-MANUAL.md para instruções" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Após criar o banco manualmente, execute:" -ForegroundColor Cyan
    Write-Host "   npm run db:seed" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    exit 1
}
Write-Host "✅ Banco de dados inicializado" -ForegroundColor Green
Write-Host ""

# Passo 4: Popular com dados iniciais
Write-Host "[4/4] Populando banco com dados iniciais..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Erro ao popular banco" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Banco populado com sucesso" -ForegroundColor Green
Write-Host ""

# Resumo
Write-Host "=== Configuração Concluída! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Usuários padrão criados:" -ForegroundColor Cyan
Write-Host "  - admin@anam.org / admin123 (admin)" -ForegroundColor White
Write-Host "  - guilherme@gmail.com / membro123 (membro)" -ForegroundColor White
Write-Host "  - maria@gmail.com / membro123 (membro)" -ForegroundColor White
Write-Host ""
Write-Host "Para iniciar o servidor:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Servidor estará disponível em: http://localhost:3000" -ForegroundColor Cyan

