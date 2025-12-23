# 🚀 Guia Rápido de Deploy no Vercel

## ✅ O que foi configurado

1. **Configurações do ngrok** → Movidas para `ngrok-config/`
2. **Frontend Angular** → Pronto para deploy no Vercel
3. **Backend Node.js** → Configurado como serverless functions no Vercel
4. **Variáveis de ambiente** → Configuradas para usar no Vercel

## 📋 Passos para Deploy

### 1. Banco de Dados PostgreSQL na Nuvem

**Opção Recomendada: Supabase (Gratuito)**
1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Anote as credenciais de conexão
4. Execute o schema SQL (`backend/src/database/schema.sql`) no SQL Editor do Supabase

### 2. Deploy do Backend

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

**Configurar variáveis de ambiente no Vercel Dashboard:**
- `DB_HOST` - Host do seu banco PostgreSQL
- `DB_PORT` - 5432
- `DB_NAME` - Nome do banco (geralmente `postgres`)
- `DB_USER` - Usuário do banco
- `DB_PASSWORD` - Senha do banco
- `JWT_SECRET` - Chave secreta aleatória (gere uma chave forte)
- `NODE_ENV` - production
- `FRONTEND_URL` - URL do frontend (será configurada após deploy do frontend)
- `ALLOWED_ORIGINS` - URL do frontend

### 3. Deploy do Frontend

```bash
cd frontend
vercel
```

**Configurar variável de ambiente no Vercel Dashboard:**
- `API_URL` - URL do backend + `/api` (ex: `https://portal-anam-backend.vercel.app/api`)

### 4. Atualizar CORS do Backend

Após o deploy do frontend, atualize no backend:
- `FRONTEND_URL` - URL completa do frontend
- `ALLOWED_ORIGINS` - URL completa do frontend

Faça novo deploy do backend:
```bash
cd backend
vercel --prod
```

## 🔗 Links Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com

## 📝 Notas

- O Vercel oferece plano gratuito generoso
- Cada deploy gera uma URL de preview
- A URL de produção permanece a mesma
- Variáveis de ambiente precisam ser configuradas no dashboard do Vercel
- Após configurar variáveis, faça novo deploy

## 🆘 Problemas Comuns

**Backend não conecta ao banco:**
- Verifique se o banco permite conexões externas
- Verifique as variáveis de ambiente no Vercel
- Certifique-se de que o firewall do banco permite conexões do Vercel

**CORS errors:**
- Adicione a URL do frontend em `FRONTEND_URL` e `ALLOWED_ORIGINS`
- Faça novo deploy do backend

**Frontend não encontra API:**
- Verifique se `API_URL` está configurada corretamente
- Verifique se o backend está deployado e funcionando
- Teste: `https://seu-backend.vercel.app/api/health`

Para mais detalhes, consulte `DEPLOY-VERCEL.md`.

