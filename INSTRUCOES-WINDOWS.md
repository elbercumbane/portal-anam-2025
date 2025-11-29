# 🪟 Instruções Rápidas para Windows

## ⚡ Instalação Rápida (3 passos)

### 1️⃣ Verificar Sistema
```cmd
check-system-windows.bat
```

### 2️⃣ Instalar Dependências
```cmd
install-windows.bat
```

### 3️⃣ Iniciar Aplicação
```cmd
start-windows.bat
```

## 🚀 Alternativa com PowerShell

```powershell
.\setup-windows.ps1
```

## 📋 Pré-requisitos

- ✅ **Node.js** 18+ ([Download](https://nodejs.org/))
- ✅ **Windows** 10/11
- ✅ **Terminal** (CMD ou PowerShell)

## 🌐 Acesso

Após iniciar:
- **Desenvolvimento**: http://localhost:4200
- **Produção**: http://localhost:8080

## 🔧 Comandos Úteis

```cmd
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm start

# Build para produção
npm run build:prod

# Executar testes
npm test

# Limpar cache
npm cache clean --force
```

## ❗ Problemas Comuns

### "node não é reconhecido"
- Reinstale Node.js do site oficial
- Reinicie o terminal

### Erro de permissão
- Execute como Administrador
- Ou use: `npm install --force`

### Antivírus bloqueando
- Desative temporariamente
- Adicione pasta às exceções

## 📞 Suporte

Se algo não funcionar:
1. Execute `check-system-windows.bat`
2. Verifique se Node.js está instalado
3. Tente executar como Administrador

---
**✅ Testado e funcionando no Windows 10/11!**
