# 📄 Arquivos de Configuração do Vercel

Este documento lista onde estão localizados os arquivos de configuração do Vercel no projeto.

## 📍 Localização dos Arquivos

### Backend

**Arquivo:** `../backend/vercel.json`

Este arquivo já está configurado e contém:
- Configuração de serverless functions
- Rotas da API
- Runtime do Node.js

**Arquivo principal da API:** `../backend/api/index.ts`

Este é o ponto de entrada da aplicação serverless no Vercel.

### Frontend

**Arquivo:** `../frontend/vercel.json`

Este arquivo já está configurado e contém:
- Comando de build
- Diretório de saída
- Rewrites para SPA
- Headers de segurança

## ✅ Status das Configurações

- ✅ `backend/vercel.json` - Configurado
- ✅ `frontend/vercel.json` - Configurado
- ✅ `backend/api/index.ts` - Pronto para Vercel
- ✅ Scripts de deploy - Criados em `vercel-config/`

## 🔄 Manutenção

Se precisar modificar as configurações:

1. **Backend:** Edite `../backend/vercel.json`
2. **Frontend:** Edite `../frontend/vercel.json`
3. **API Serverless:** Edite `../backend/api/index.ts`

## 📝 Nota

Os arquivos `vercel.json` estão nas pastas do projeto (backend e frontend) porque o Vercel procura por eles na raiz de cada projeto durante o deploy.

A pasta `vercel-config/` contém:
- Scripts de deploy
- Documentação
- Exemplos de variáveis de ambiente
- Guias de configuração

