# Configuração do Vercel

Esta pasta contém todas as configurações relacionadas ao deploy no Vercel para produção.

## 📁 Estrutura

- `setup-completo-auto.ps1` - ⚡ **Script principal** - Setup completo automático
- `deploy-auto.ps1` - 🔄 Deploy rápido automático
- `configurar-variaveis.ps1` - ⚙️ Configurar variáveis de ambiente
- `deploy-backend.ps1` - Script para deploy do backend
- `deploy-frontend.ps1` - Script para deploy do frontend
- `deploy-all.ps1` - Script para fazer deploy de ambos
- `env.example.txt` - Exemplo de variáveis de ambiente necessárias
- `INICIO-RAPIDO.md` - 🚀 Guia de início rápido
- `CONFIGURACAO.md` - Documentação detalhada
- `ARQUIVOS-CONFIG.md` - Referência dos arquivos

## 🚀 Uso Rápido

### ⚡ Setup Completo Automático (Primeira Vez)

```powershell
cd vercel-config
.\setup-completo-auto.ps1
```

Este script faz **TUDO automaticamente**:
- Instala Vercel CLI se necessário
- Faz login
- Instala dependências
- Faz deploy do backend e frontend

### 🔄 Deploy Rápido (Após Setup)

```powershell
cd vercel-config
.\deploy-auto.ps1
```

### ⚙️ Configurar Variáveis

```powershell
cd vercel-config
.\configurar-variaveis.ps1
```

### Scripts Individuais

```powershell
# Deploy do Backend
.\deploy-backend.ps1

# Deploy do Frontend
.\deploy-frontend.ps1

# Deploy de Ambos (interativo)
.\deploy-all.ps1
```

## 📋 Pré-requisitos

1. **Instalar Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

2. **Fazer login no Vercel**:
   ```powershell
   vercel login
   ```

3. **Configurar variáveis de ambiente**:
   - Acesse o dashboard do Vercel: https://vercel.com/dashboard
   - Configure as variáveis listadas em `env.example.txt`

## ⚙️ Configuração

### Backend

O arquivo `backend-vercel.json` está localizado em `../backend/vercel.json` e configura:
- Serverless functions usando `@vercel/node`
- Rotas da API
- Variáveis de ambiente

### Frontend

O arquivo `frontend-vercel.json` está localizado em `../frontend/vercel.json` e configura:
- Build do Angular
- Rewrites para SPA
- Headers de segurança

## 🔄 Atualizações

Após fazer mudanças no código:

```powershell
# Backend
cd ..\backend
vercel --prod

# Frontend
cd ..\frontend
vercel --prod
```

## 📝 Notas

- As configurações do ngrok permanecem intactas em `../ngrok-config/`
- O Vercel é para produção, o ngrok é para desenvolvimento local
- Consulte `../DEPLOY-VERCEL.md` para instruções detalhadas

## ⚠️ Importante

- Configure todas as variáveis de ambiente no dashboard do Vercel
- O banco de dados PostgreSQL deve estar acessível publicamente
- Após adicionar variáveis de ambiente, faça um novo deploy

