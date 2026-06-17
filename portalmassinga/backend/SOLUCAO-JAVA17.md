# 🔧 Solução: Java 17 Necessário

## ❌ Problema

O backend não está iniciando porque o sistema tem **Java 8**, mas o projeto requer **Java 17 ou superior**.

## ✅ Solução: Instalar Java 17

### Opção 1: Eclipse Adoptium (Recomendado)

1. Acesse: https://adoptium.net/temurin/releases/?version=17
2. Baixe **JDK 17** para **Windows x64**
3. Execute o instalador
4. Durante a instalação, anote o caminho (ex: `C:\Program Files\Eclipse Adoptium\jdk-17.0.10+9-hotspot`)
5. Após instalar, configure o JAVA_HOME:
   - Abra "Variáveis de Ambiente" no Windows
   - Adicione/edite `JAVA_HOME` apontando para a pasta do JDK 17
   - Adicione `%JAVA_HOME%\bin` ao `PATH`

### Opção 2: Amazon Corretto

1. Acesse: https://aws.amazon.com/corretto/
2. Baixe **Amazon Corretto 17** para Windows
3. Instale e configure o JAVA_HOME

### Opção 3: Microsoft Build do OpenJDK

1. Acesse: https://www.microsoft.com/openjdk
2. Baixe **Microsoft Build of OpenJDK 17**
3. Instale e configure o JAVA_HOME

## 🚀 Após Instalar

Execute novamente:

```batch
cd portalmassinga\backend
.\iniciar-backend-com-java17.ps1
```

Ou:

```batch
.\SETUP-COMPLETO-AUTOMATICO.bat
```

## ✅ Verificar Instalação

Após instalar, verifique:

```powershell
java -version
```

Deve mostrar algo como:
```
openjdk version "17.0.x"
```

## 📝 Nota

Se você tiver múltiplas versões do Java instaladas, certifique-se de que o `PATH` está configurado para usar o Java 17 primeiro.
