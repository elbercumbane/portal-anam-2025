# Script interativo para configurar banco
Write-Host "=== Configuração do Banco de Dados ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Por favor, informe a senha do PostgreSQL:" -ForegroundColor Yellow
$password = Read-Host "Senha" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Atualizar .env
$envContent = Get-Content .env -Raw
$envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$plainPassword"
$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "Inicializando banco..." -ForegroundColor Yellow
npm run db:init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Populando banco..." -ForegroundColor Yellow
    npm run db:seed
    Write-Host ""
    Write-Host " Configuração concluída!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host " Erro ao inicializar banco. Verifique a senha." -ForegroundColor Red
}
