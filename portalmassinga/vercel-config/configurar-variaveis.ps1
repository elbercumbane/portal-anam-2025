# Script para Configurar Variáveis de Ambiente no Vercel
# Windows PowerShell - Interativo

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configurar Variáveis - Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI não encontrado!" -ForegroundColor Red
    Write-Host "Instale: npm install -g vercel" -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar login
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Não está logado no Vercel!" -ForegroundColor Red
    Write-Host "Execute: vercel login" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Logado como: $loginCheck" -ForegroundColor Green
Write-Host ""

# Escolher projeto
Write-Host "Qual projeto deseja configurar?" -ForegroundColor Yellow
Write-Host "  1. Backend" -ForegroundColor Cyan
Write-Host "  2. Frontend" -ForegroundColor Cyan
Write-Host "  3. Ambos" -ForegroundColor Cyan
Write-Host ""
$projeto = Read-Host "Escolha (1, 2 ou 3)"

$backendPath = Join-Path $PSScriptRoot "..\backend"
$frontendPath = Join-Path $PSScriptRoot "..\frontend"

# Configurar Backend
if ($projeto -eq "1" -or $projeto -eq "3") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Configurar Backend" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path $backendPath) {
        Set-Location $backendPath
        
        Write-Host "Variáveis do Backend:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Você pode adicionar variáveis de duas formas:" -ForegroundColor Cyan
        Write-Host "  1. Via CLI interativo (será solicitado)" -ForegroundColor White
        Write-Host "  2. Manualmente no dashboard: https://vercel.com/dashboard" -ForegroundColor White
        Write-Host ""
        
        $metodo = Read-Host "Usar CLI interativo? (S/N)"
        
        if ($metodo -eq "S" -or $metodo -eq "s") {
            Write-Host ""
            Write-Host "Adicione as variáveis uma por uma:" -ForegroundColor Yellow
            Write-Host "Pressione Enter sem valor para pular uma variável" -ForegroundColor Cyan
            Write-Host ""
            
            $vars = @(
                "DB_HOST",
                "DB_PORT",
                "DB_NAME",
                "DB_USER",
                "DB_PASSWORD",
                "JWT_SECRET",
                "NODE_ENV",
                "CORS_ORIGIN",
                "FRONTEND_URL",
                "ALLOWED_ORIGINS"
            )
            
            foreach ($var in $vars) {
                $valor = Read-Host "  $var"
                if ($valor) {
                    Write-Host "Adicionando $var..." -ForegroundColor Yellow
                    vercel env add $var production
                    # Aguardar entrada do usuário
                    Start-Sleep -Seconds 1
                }
            }
        } else {
            Write-Host ""
            Write-Host "Abra o dashboard do Vercel:" -ForegroundColor Yellow
            Write-Host "https://vercel.com/dashboard" -ForegroundColor White
            Write-Host ""
            Write-Host "Vá em: Projeto → Settings → Environment Variables" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Variáveis necessárias:" -ForegroundColor Yellow
            Write-Host "  - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD" -ForegroundColor White
            Write-Host "  - JWT_SECRET" -ForegroundColor White
            Write-Host "  - NODE_ENV=production" -ForegroundColor White
            Write-Host "  - CORS_ORIGIN, FRONTEND_URL, ALLOWED_ORIGINS" -ForegroundColor White
        }
    }
}

# Configurar Frontend
if ($projeto -eq "2" -or $projeto -eq "3") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Configurar Frontend" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path $frontendPath) {
        Set-Location $frontendPath
        
        Write-Host "Variável do Frontend:" -ForegroundColor Yellow
        Write-Host ""
        
        $metodo = Read-Host "Usar CLI interativo? (S/N)"
        
        if ($metodo -eq "S" -or $metodo -eq "s") {
            $apiUrl = Read-Host "  API_URL (ex: https://seu-backend.vercel.app/api)"
            if ($apiUrl) {
                Write-Host "Adicionando API_URL..." -ForegroundColor Yellow
                vercel env add API_URL production
            }
        } else {
            Write-Host ""
            Write-Host "Abra o dashboard do Vercel:" -ForegroundColor Yellow
            Write-Host "https://vercel.com/dashboard" -ForegroundColor White
            Write-Host ""
            Write-Host "Vá em: Projeto → Settings → Environment Variables" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Adicione:" -ForegroundColor Yellow
            Write-Host "  - API_URL=https://seu-backend.vercel.app/api" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Configuração Concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Após adicionar variáveis, faça um novo deploy:" -ForegroundColor Yellow
Write-Host "  cd backend && vercel --prod" -ForegroundColor White
Write-Host "  cd frontend && vercel --prod" -ForegroundColor White
Write-Host ""

pause


