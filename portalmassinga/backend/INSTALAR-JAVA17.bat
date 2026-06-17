@echo off
chcp 65001 >nul
title Instalar Java 17 - Portal ANAM
color 0A

echo.
echo ========================================
echo   INSTALACAO JAVA 17 NECESSARIA
echo ========================================
echo.
echo O projeto requer Java 17 ou superior.
echo Java atual: Java 8 (nao compativel)
echo.
echo ========================================
echo   OPCOES DE INSTALACAO
echo ========================================
echo.
echo 1. Eclipse Adoptium (Recomendado)
echo    https://adoptium.net/temurin/releases/?version=17
echo.
echo 2. Amazon Corretto
echo    https://aws.amazon.com/corretto/
echo.
echo 3. Microsoft Build do OpenJDK
echo    https://www.microsoft.com/openjdk
echo.
echo ========================================
echo.

set /p ABRIR="Deseja abrir o site de download? (S/N): "
if /i "%ABRIR%"=="S" (
    start https://adoptium.net/temurin/releases/?version=17
)

echo.
echo ========================================
echo   INSTRUCOES
echo ========================================
echo.
echo 1. Baixe o Java 17 (JDK) para Windows x64
echo 2. Execute o instalador
echo 3. Durante a instalacao, anote o caminho
echo    (geralmente: C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot)
echo 4. Apos instalar, execute este script novamente
echo.
echo ========================================
echo.
pause
