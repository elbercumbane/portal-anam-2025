# Restaura o frontend Vercel para a versao estavel documentada em ROLLBACK-PRODUCAO.md
$ErrorActionPreference = "Stop"

$deployUrl = "anam-gzhe6in8r-commit976-5277s-projects.vercel.app"
$siteUrl = "https://anam-gilt.vercel.app"

Write-Host "=== Restaurar Vercel (producao) ===" -ForegroundColor Cyan
Write-Host "Deploy: $deployUrl" -ForegroundColor Gray
Write-Host "Site:   $siteUrl" -ForegroundColor Gray
Write-Host ""

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "ERRO: Vercel CLI nao encontrado. Instale: npm install -g vercel" -ForegroundColor Red
    exit 1
}

vercel redeploy $deployUrl --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "OK — Producao restaurada para a versao estavel." -ForegroundColor Green
    Write-Host "Teste: $siteUrl/membros/lista" -ForegroundColor Yellow
} else {
    Write-Host "ERRO no redeploy. Tente pelo painel Vercel." -ForegroundColor Red
    exit 1
}
