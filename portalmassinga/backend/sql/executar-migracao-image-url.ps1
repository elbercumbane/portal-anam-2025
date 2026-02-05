# Script PowerShell para executar a migração da coluna image_url
# Este script chama o endpoint do backend para migrar automaticamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Migração: image_url VARCHAR -> TEXT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# URL do endpoint de migração
$migrationUrl = "http://localhost:8081/api/home-content/migrate-image-url"

Write-Host "Chamando endpoint de migração..." -ForegroundColor Yellow
Write-Host "URL: $migrationUrl" -ForegroundColor Gray
Write-Host ""

try {
    # Fazer requisição POST
    $response = Invoke-RestMethod -Uri $migrationUrl -Method Post -ContentType "application/json"
    
    Write-Host "✅ Migração executada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Resultado:" -ForegroundColor Cyan
    Write-Host "  Success: $($response.success)" -ForegroundColor White
    Write-Host "  Message: $($response.message)" -ForegroundColor White
    
    if ($response.previousType) {
        Write-Host "  Tipo anterior: $($response.previousType)" -ForegroundColor Gray
        Write-Host "  Novo tipo: $($response.newType)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Migração concluída!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro ao executar migração:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta do servidor: $responseBody" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Certifique-se de que:" -ForegroundColor Yellow
    Write-Host "  1. O backend está rodando em http://localhost:8081" -ForegroundColor White
    Write-Host "  2. A base de dados está acessível" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
