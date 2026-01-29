# Script para renomear as pastas do backend
# Execute este script DEPOIS de fechar o IDE e todos os processos Node.js

Write-Host "Renomeando pastas do backend..." -ForegroundColor Yellow

# Verificar se backend-spring existe
if (Test-Path "backend-spring") {
    # Tentar renomear backend para backend-old (se existir)
    if (Test-Path "backend") {
        Write-Host "Renomeando 'backend' para 'backend-old'..." -ForegroundColor Cyan
        try {
            Rename-Item -Path "backend" -NewName "backend-old" -ErrorAction Stop
            Write-Host "✓ Pasta 'backend' renomeada para 'backend-old'" -ForegroundColor Green
        } catch {
            Write-Host "✗ Erro ao renomear 'backend': $_" -ForegroundColor Red
            Write-Host "  Por favor, feche o IDE e todos os processos que possam estar usando a pasta 'backend'" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Renomear backend-spring para backend
    Write-Host "Renomeando 'backend-spring' para 'backend'..." -ForegroundColor Cyan
    try {
        Rename-Item -Path "backend-spring" -NewName "backend" -ErrorAction Stop
        Write-Host "✓ Pasta 'backend-spring' renomeada para 'backend'" -ForegroundColor Green
    } catch {
        Write-Host "✗ Erro ao renomear 'backend-spring': $_" -ForegroundColor Red
        exit 1
    }
    
    # Remover backend-old se existir
    if (Test-Path "backend-old") {
        Write-Host "Removendo pasta antiga 'backend-old'..." -ForegroundColor Cyan
        try {
            Remove-Item -Recurse -Force "backend-old" -ErrorAction Stop
            Write-Host "✓ Pasta 'backend-old' removida" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Não foi possível remover 'backend-old': $_" -ForegroundColor Yellow
            Write-Host "  Você pode removê-la manualmente depois" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✓ Concluído! Agora você tem apenas a pasta 'backend' (Spring Boot)" -ForegroundColor Green
} else {
    Write-Host "✗ Pasta 'backend-spring' não encontrada!" -ForegroundColor Red
}

