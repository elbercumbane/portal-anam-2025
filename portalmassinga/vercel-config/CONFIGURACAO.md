# 📋 Configuração Detalhada do Vercel

Este documento explica em detalhes como configurar o projeto para deploy no Vercel.

## 🗂️ Estrutura de Arquivos

### Backend

O backend usa serverless functions do Vercel. O arquivo principal está em:
```
backend/api/index.ts
```

Este arquivo exporta uma função serverless que é executada pelo Vercel.

### Frontend

O frontend Angular é buildado e servido como arquivos estáticos pelo Vercel.

## 📝 Arquivos de Configuração

### `backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

**O que faz:**
- Define que o arquivo `api/index.ts` será usado como serverless function
- Todas as rotas `/api/*` são direcionadas para essa função
- Usa o runtime `@vercel/node` para executar Node.js

### `frontend/vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/associacao-portal",
  "framework": "angular",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**O que faz:**
- Define o comando de build: `npm run build`
- Define o diretório de saída: `dist/associacao-portal`
- Configura rewrites para SPA (Single Page Application)
- Todas as rotas são redirecionadas para `index.html`

## 🔐 Variáveis de Ambiente

### Backend

Configure no dashboard do Vercel (Settings → Environment Variables):

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host do PostgreSQL | `db.xxxxx.supabase.co` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `postgres` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `sua-senha` |
| `JWT_SECRET` | Chave secreta para JWT | `chave-aleatoria-longa` |
| `NODE_ENV` | Ambiente | `production` |
| `CORS_ORIGIN` | URL do frontend | `https://seu-app.vercel.app` |
| `FRONTEND_URL` | URL do frontend | `https://seu-app.vercel.app` |
| `ALLOWED_ORIGINS` | Origens permitidas | `https://seu-app.vercel.app` |

### Frontend

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `API_URL` | URL da API backend | `https://seu-backend.vercel.app/api` |

## 🚀 Processo de Deploy

### Primeira Vez

1. **Instalar Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Fazer login:**
   ```powershell
   vercel login
   ```

3. **Deploy do backend:**
   ```powershell
   cd backend
   vercel
   ```
   - Link para projeto existente? **N**
   - Nome do projeto? `portal-anam-backend`
   - Diretório? `./`

4. **Deploy do frontend:**
   ```powershell
   cd frontend
   vercel
   ```
   - Link para projeto existente? **N**
   - Nome do projeto? `portal-anam-frontend`
   - Diretório? `./`

5. **Configurar variáveis de ambiente** no dashboard do Vercel

6. **Fazer deploy de produção:**
   ```powershell
   # Backend
   cd backend
   vercel --prod
   
   # Frontend
   cd frontend
   vercel --prod
   ```

### Atualizações Futuras

```powershell
# Backend
cd backend
vercel --prod

# Frontend
cd frontend
vercel --prod
```

## 🔄 Fluxo de Trabalho

1. **Desenvolvimento Local:**
   - Use ngrok (configurações em `ngrok-config/`)
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:4200`

2. **Deploy Preview:**
   - Push para branch no Git
   - Vercel cria automaticamente preview
   - Ou use: `vercel` (sem `--prod`)

3. **Deploy Produção:**
   - Use: `vercel --prod`
   - Ou faça merge na branch principal

## 🗄️ Banco de Dados

O Vercel não fornece banco de dados. Você precisa usar:

- **Supabase** (recomendado - gratuito)
- **Railway**
- **Render**
- **Neon**

Configure as credenciais nas variáveis de ambiente do backend.

## 🔍 Troubleshooting

### Backend não conecta ao banco

1. Verifique as variáveis de ambiente
2. Certifique-se de que o banco permite conexões externas
3. Verifique o firewall do banco

### CORS errors

1. Adicione a URL do frontend em `CORS_ORIGIN` e `ALLOWED_ORIGINS`
2. Faça novo deploy do backend

### Frontend não encontra API

1. Verifique se `API_URL` está configurada
2. Verifique se o backend está deployado
3. Teste: `https://seu-backend.vercel.app/api/health`

## 📚 Referências

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions)

