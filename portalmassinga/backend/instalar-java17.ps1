# Script para verificar e instalar Java 17
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICANDO JAVA 17" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Java atual
$javaVersion = java -version 2>&1 | Select-String "version"
Write-Host "Java atual:" -ForegroundColor Yellow
Write-Host $javaVersion -ForegroundColor Gray
Write-Host ""

# Verificar se Java 17+ está instalado
$java17Paths = @(
    "C:\Program Files\Java\jdk-17*",
    "C:\Program Files\Eclipse Adoptium\jdk-17*",
    "C:\Program Files\Microsoft\jdk-17*",
    "C:\Program Files\Amazon Corretto\jdk17*"
)

$java17Found = $false
$java17Path = $null

foreach ($path in $java17Paths) {
    $dirs = Get-ChildItem $path -ErrorAction SilentlyContinue
    if ($dirs) {
        $java17Path = $dirs[0].FullName
        $java17Found = $true
        break
    }
}

if ($java17Found) {
    Write-Host "✅ Java 17 encontrado em: $java17Path" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configurando JAVA_HOME..." -ForegroundColor Yellow
    $env:JAVA_HOME = $java17Path
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $java17Path, "User")
    Write-Host "✅ JAVA_HOME configurado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testando Java 17..." -ForegroundColor Yellow
    & "$java17Path\bin\java.exe" -version
    exit 0
} else {
    Write-Host "❌ Java 17 não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  INSTALAÇÃO NECESSÁRIA" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O projeto requer Java 17 ou superior." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções para instalar:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Eclipse Adoptium (Recomendado):" -ForegroundColor White
    Write-Host "   https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Amazon Corretto:" -ForegroundColor White
    Write-Host "   https://aws.amazon.com/corretto/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Microsoft Build do OpenJDK:" -ForegroundColor White
    Write-Host "   https://www.microsoft.com/openjdk" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Após instalar, execute este script novamente." -ForegroundColor Yellow
    Write-Host ""
    
    $install = Read-Host "Deseja abrir o site de download? (S/N)"
    if ($install -eq "S" -or $install -eq "s") {
        Start-Process "https://adoptium.net/temurin/releases/?version=17"
    }
    
    exit 1
}
