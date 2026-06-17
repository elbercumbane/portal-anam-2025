# Deploy local do backend ANAM para o Railway
# Uso: .\deploy-railway.ps1
# Requer: railway CLI (npm i -g @railway/cli) e login previo (railway login)

$ErrorActionPreference = "Stop"
$BackendDir = $PSScriptRoot

Write-Host "=== Deploy Backend ANAM -> Railway ===" -ForegroundColor Cyan

# 1. Verificar CLI
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Railway CLI nao encontrado. Instale com: npm install -g @railway/cli" -ForegroundColor Red
    exit 1
}

# 2. Verificar login
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Faca login primeiro:" -ForegroundColor Yellow
    Write-Host "  railway login" -ForegroundColor White
    Write-Host "Depois execute este script novamente." -ForegroundColor Yellow
    exit 1
}
Write-Host "Logado como: $whoami" -ForegroundColor Green

Set-Location $BackendDir

# 3. Ligar ao projeto (se ainda nao estiver)
$status = railway status 2>&1
if ($LASTEXITCODE -ne 0 -or ($status -match "No linked project")) {
    Write-Host "`nLigue este servico ao seu projeto Railway..." -ForegroundColor Yellow
    railway link
}

Write-Host "`nProjeto ligado:" -ForegroundColor Green
railway status

# 4. Variaveis de ambiente (Supabase)
Write-Host "`n=== Configurar variaveis (Supabase) ===" -ForegroundColor Cyan
$dbPassword = $env:RAILWAY_DB_PASSWORD
if (-not $dbPassword) {
    $secure = Read-Host "Password do Supabase (postgres)" -AsSecureString
    $dbPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    )
}

$vars = @{
    # Pooler IPv4 (direct db.*.supabase.co e IPv6; Railway nao suporta IPv6 outbound)
    "SPRING_DATASOURCE_URL" = "jdbc:postgresql://aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require"
    "SPRING_DATASOURCE_USERNAME" = "postgres.hfrerqbbfccrfordetut"
    "SPRING_DATASOURCE_PASSWORD" = $dbPassword
    "SPRING_JPA_HIBERNATE_DDL_AUTO" = "update"
    "SERVER_SERVLET_CONTEXT_PATH" = "/api"
}

foreach ($key in $vars.Keys) {
    $val = $vars[$key]
    if ($key -eq "SPRING_DATASOURCE_PASSWORD") {
        railway variables set "${key}=$val" 2>&1 | Out-Null
        Write-Host "  OK $key = ********" -ForegroundColor DarkGray
    } else {
        railway variables set "${key}=$val" 2>&1 | Out-Null
        Write-Host "  OK $key" -ForegroundColor DarkGray
    }
}

# 5. Deploy
Write-Host "`n=== A enviar codigo local para o Railway (pode demorar varios minutos) ===" -ForegroundColor Cyan
railway up --detach

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deploy falhou. Veja os logs: railway logs" -ForegroundColor Red
    exit 1
}

Write-Host "`nDeploy iniciado com sucesso!" -ForegroundColor Green
Write-Host "`nProximos passos:" -ForegroundColor Cyan
Write-Host "  1. Ver logs:     railway logs"
Write-Host "  2. Abrir painel: railway open"
Write-Host "  3. Gerar dominio: railway domain  (se ainda nao tiver)"
Write-Host "  4. Testar API:   https://SEU-DOMINIO.up.railway.app/api/actuator/health"
Write-Host "  5. No Vercel:    API_URL = https://SEU-DOMINIO.up.railway.app/api"
