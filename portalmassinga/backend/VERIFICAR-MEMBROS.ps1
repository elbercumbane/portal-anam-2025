# Script para verificar membros cadastrados
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICAR MEMBROS CADASTRADOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    $membros = Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method GET -TimeoutSec 5
    
    Write-Host "Total de membros cadastrados: $($membros.Count)" -ForegroundColor Yellow
    Write-Host ""
    
    # Verificar também diretamente no PostgreSQL do Docker
    Write-Host "Verificando também na base de dados Docker..." -ForegroundColor Gray
    try {
        $dockerCount = docker exec anam-postgres psql -U postgres -d anam -t -c "SELECT COUNT(*) FROM membros;" 2>&1
        $dockerCount = $dockerCount.Trim()
        if ($dockerCount -match "^\d+$") {
            Write-Host "  Base Docker: $dockerCount membro(s)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "  (Não foi possível verificar Docker diretamente)" -ForegroundColor Gray
    }
    Write-Host ""
    
    if ($membros.Count -eq 0) {
        Write-Host "⚠️ Nenhum membro encontrado via API." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Verificando diretamente no PostgreSQL Docker..." -ForegroundColor Cyan
        try {
            $dockerMembros = docker exec anam-postgres psql -U postgres -d anam -c "SELECT nome_completo, email, status FROM membros LIMIT 5;" 2>&1
            if ($dockerMembros -match "nome_completo") {
                Write-Host "✅ Dados encontrados no PostgreSQL Docker!" -ForegroundColor Green
                Write-Host $dockerMembros -ForegroundColor White
            } else {
                Write-Host "⚠️ Nenhum membro encontrado na base Docker também." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️ Não foi possível verificar Docker diretamente." -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "Possíveis motivos:" -ForegroundColor Gray
        Write-Host "  - Ainda não foi feita nenhuma submissão" -ForegroundColor Gray
        Write-Host "  - Houve erro na submissão" -ForegroundColor Gray
        Write-Host "  - Backend não está rodando" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Para verificar logs do backend:" -ForegroundColor Cyan
        Write-Host "  docker-compose logs -f backend" -ForegroundColor White
    } else {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host ""
        
        $membros | ForEach-Object -Begin { $index = 1 } -Process {
            Write-Host "[$index] MEMBRO CADASTRADO" -ForegroundColor Green
            Write-Host ""
            Write-Host "  ID:              $($_.id)" -ForegroundColor White
            Write-Host "  Nome Completo:   $($_.nomeCompleto)" -ForegroundColor White
            Write-Host "  Email:           $($_.email)" -ForegroundColor White
            Write-Host "  Celular:         $($_.celular)" -ForegroundColor White
            Write-Host "  Cidade:          $($_.cidade)" -ForegroundColor White
            Write-Host "  Profissão:       $($_.profissao)" -ForegroundColor White
            Write-Host "  Status:          $($_.status)" -ForegroundColor $(if ($_.status -eq "Aprovado") { "Green" } elseif ($_.status -eq "Rejeitado") { "Red" } else { "Yellow" })
            Write-Host "  Data Cadastro:   $($_.dataCadastro)" -ForegroundColor Gray
            Write-Host ""
            
            if ($_.nomeConjuge) {
                Write-Host "  Cônjuge:         $($_.nomeConjuge)" -ForegroundColor Gray
            }
            if ($_.localTrabalho) {
                Write-Host "  Local Trabalho:  $($_.localTrabalho)" -ForegroundColor Gray
            }
            
            Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
            Write-Host ""
            $index++
        }
        
        Write-Host "✅ Dados salvos com sucesso na tabela!" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Erro ao buscar dados: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique se:" -ForegroundColor Yellow
    Write-Host "  1. O backend está rodando (docker-compose ps)" -ForegroundColor Gray
    Write-Host "  2. A URL está correta: http://localhost:8081/api/membros" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "Para verificar no pgAdmin:" -ForegroundColor Cyan
Write-Host "  1. Abra o pgAdmin" -ForegroundColor White
Write-Host "  2. Conecte-se ao servidor PostgreSQL (localhost:5432)" -ForegroundColor White
Write-Host "  3. Expanda: Servers > PostgreSQL > Databases > anam > Schemas > public > Tables" -ForegroundColor White
Write-Host "  4. Clique com botão direito em 'membros' > View/Edit Data > All Rows" -ForegroundColor White
Write-Host ""
