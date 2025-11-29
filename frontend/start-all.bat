@echo off
echo ========================================
echo   Portal da Associacao - All Apps
echo   Executando todas as aplicacoes
echo ========================================
echo.

echo Iniciando aplicacoes duais...
start "Dual-Apps" cmd /k "start-dual-apps.bat"

echo.
echo Aguardando 5 segundos...
timeout /t 5 /nobreak >nul

echo Iniciando aplicacoes com ngrok...
start "Dual-Apps-Ngrok" cmd /k "start-dual-apps-with-ngrok.bat"

echo.
echo Todas as aplicacoes foram iniciadas!
echo.
echo Voce tera:
echo - 2 aplicacoes na porta 4200 e 4201 (primeira janela)
echo - 2 aplicacoes na porta 4200 e 4201 + ngrok (segunda janela)
echo.
echo Total: 4 aplicacoes rodando simultaneamente
echo.

pause
