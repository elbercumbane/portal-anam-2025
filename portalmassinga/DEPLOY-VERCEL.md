# Deploy no Vercel - Guia Completo

Este guia explica como fazer deploy do frontend e backend no Vercel para disponibilizar a aplicação 24/7.

## 📋 Pré-requisitos

1. Conta no Vercel (gratuita): https://vercel.com/signup
2. Conta em um serviço de banco de dados PostgreSQL na nuvem:
   - **Recomendado**: [Supabase](https://supabase.com) (gratuito)
   - Alternativas: [Railway](https://railway.app), [Render](https://render.com), [Neon](https://neon.tech)

## 🗄️ Passo 1: Configurar Banco de Dados na Nuvem

### Opção A: Supabase (Recomendado - Gratuito)

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Anote as credenciais de conexão:
   - Host: `db.xxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (a senha que você definiu)

### Opção B: Railway

1. Acesse https://railway.app e crie uma conta
2. Crie um novo projeto PostgreSQL
3. Anote as credenciais de conexão

## 🚀 Passo 2: Deploy do Backend

1. **Instalar Vercel CLI** (se ainda não tiver):
   ```bash
   npm install -g vercel
   ```

2. **Navegar para a pasta do backend**:
   ```bash
   cd backend
   ```

3. **Fazer login no Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy do backend**:
   ```bash
   vercel
   ```
   
   Siga as instruções:
   - Link para o projeto existente? **N** (primeira vez)
   - Qual é o nome do projeto? `portal-anam-backend`
   - Em qual diretório está o código? `./`
   - Quer sobrescrever as configurações? **Y**

5. **Configurar variáveis de ambiente no Vercel**:
   
   Acesse o dashboard do Vercel: https://vercel.com/dashboard
   - Vá em seu projeto → Settings → Environment Variables
   
   Adicione as seguintes variáveis (para Production, Preview e Development):
   ```
   DB_HOST=seu-host-do-banco
   DB_PORT=5432
   DB_NAME=postgres (ou o nome do seu banco)
   DB_USER=postgres (ou seu usuário)
   DB_PASSWORD=sua-senha-do-banco
   JWT_SECRET=uma-chave-secreta-aleatoria-muito-longa (gere uma chave forte)
   NODE_ENV=production
   CORS_ORIGIN=https://seu-frontend.vercel.app
   FRONTEND_URL=https://seu-frontend.vercel.app
   ALLOWED_ORIGINS=https://seu-frontend.vercel.app
   ```
   
   **Importante**: Após adicionar as variáveis, faça um novo deploy para que elas sejam aplicadas.

6. **Criar tabelas no banco de dados**:
   
   Após o deploy, você precisará executar o schema SQL no banco de dados:
   - Acesse o arquivo `backend/src/database/schema.sql`
   - Execute no seu banco de dados PostgreSQL na nuvem (via Supabase SQL Editor, Railway Console, etc.)

7. **Criar usuário admin**:
   
   Execute o script de criação de admin:
   ```bash
   cd backend
   npm run db:create-admin-auto
   ```
   
   Ou configure manualmente via SQL.

## 🎨 Passo 3: Deploy do Frontend

1. **Navegar para a pasta do frontend**:
   ```bash
   cd frontend
   ```

2. **Deploy do frontend**:
   ```bash
   vercel
   ```
   
   Siga as instruções:
   - Link para o projeto existente? **N** (primeira vez)
   - Qual é o nome do projeto? `portal-anam-frontend`
   - Em qual diretório está o código? `./`
   - Quer sobrescrever as configurações? **Y**

3. **Configurar variáveis de ambiente no Vercel**:
   
   No projeto do frontend, adicione (para Production, Preview e Development):
   ```
   API_URL=https://seu-backend.vercel.app/api
   ```
   
   **Exemplo**: Se seu backend está em `https://portal-anam-backend.vercel.app`, então:
   ```
   API_URL=https://portal-anam-backend.vercel.app/api
   ```

4. **Atualizar configuração da API no frontend**:
   
   Verifique o arquivo `frontend/src/app/services/api.service.ts` e certifique-se de que está usando a variável de ambiente `API_URL`.

## 🔗 Passo 4: Conectar Frontend e Backend

1. **Obter URL do backend**:
   - Após o deploy do backend, você receberá uma URL como: `https://portal-anam-backend.vercel.app`

2. **Atualizar CORS no backend**:
   - No Vercel dashboard do backend, adicione a URL do frontend nas variáveis de ambiente:
     ```
     FRONTEND_URL=https://portal-anam-frontend.vercel.app
     ALLOWED_ORIGINS=https://portal-anam-frontend.vercel.app
     ```

3. **Atualizar API_URL no frontend**:
   - No Vercel dashboard do frontend, atualize:
     ```
     API_URL=https://portal-anam-backend.vercel.app/api
     ```

4. **Fazer novo deploy**:
   ```bash
   # No backend
   cd backend
   vercel --prod
   
   # No frontend
   cd frontend
   vercel --prod
   ```

## ✅ Verificação

1. Acesse a URL do frontend: `https://portal-anam-frontend.vercel.app`
2. Teste o login
3. Teste o cadastro de membros
4. Verifique se as requisições ao backend estão funcionando

## 🔄 Atualizações Futuras

Para atualizar a aplicação após mudanças:

```bash
# Backend
cd backend
vercel --prod

# Frontend
cd frontend
vercel --prod
```

## 📝 Notas Importantes

- O Vercel oferece plano gratuito generoso para projetos pessoais
- O banco de dados PostgreSQL precisa estar sempre acessível (24/7)
- Supabase oferece 500MB grátis de banco de dados
- As variáveis de ambiente são configuradas no dashboard do Vercel
- Cada deploy gera uma nova URL de preview, mas a produção mantém a mesma URL

## 🆘 Troubleshooting

### Backend não conecta ao banco de dados
- Verifique as variáveis de ambiente no Vercel
- Certifique-se de que o banco de dados permite conexões externas
- Verifique o firewall/security groups do banco de dados

### CORS errors
- Adicione a URL do frontend em `FRONTEND_URL` e `ALLOWED_ORIGINS`
- Faça novo deploy do backend

### Frontend não encontra a API
- Verifique se `API_URL` está configurada corretamente
- Verifique se o backend está deployado e funcionando
- Teste a URL do backend diretamente: `https://seu-backend.vercel.app/api/health`

