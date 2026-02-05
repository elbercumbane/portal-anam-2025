@echo off
REM Script batch para executar a migração da coluna image_url
REM Este script chama o endpoint do backend para migrar automaticamente

echo ========================================
echo   Migracao: image_url VARCHAR -^> TEXT
echo ========================================
echo.

REM URL do endpoint de migração
set MIGRATION_URL=http://localhost:8081/api/home-content/migrate-image-url

echo Chamando endpoint de migracao...
echo URL: %MIGRATION_URL%
echo.

REM Usar PowerShell para fazer a requisição HTTP
powershell -Command "try { $response = Invoke-RestMethod -Uri '%MIGRATION_URL%' -Method Post -ContentType 'application/json'; Write-Host 'Migracao executada com sucesso!' -ForegroundColor Green; Write-Host 'Success:' $response.success; Write-Host 'Message:' $response.message } catch { Write-Host 'Erro ao executar migracao:' -ForegroundColor Red; Write-Host $_.Exception.Message -ForegroundColor Red }"

echo.
echo ========================================
echo   Migracao concluida!
echo ========================================
echo.
pause
