# Script para configurar Java 17 automaticamente
$java17Path = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"

Write-Host "Configurando Java 17..." -ForegroundColor Yellow

# Configurar JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", $java17Path, "User")
$env:JAVA_HOME = $java17Path

# Configurar PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$javaBin = "$java17Path\bin"

if ($currentPath -notlike "*$javaBin*") {
    $newPath = "$javaBin;$currentPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "✅ PATH atualizado!" -ForegroundColor Green
}

# Atualizar PATH da sessão atual
$env:Path = "$javaBin;$env:Path"

Write-Host "✅ Java 17 configurado!" -ForegroundColor Green
Write-Host "   JAVA_HOME: $java17Path" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verificando..." -ForegroundColor Yellow
& "$javaBin\java.exe" -version
