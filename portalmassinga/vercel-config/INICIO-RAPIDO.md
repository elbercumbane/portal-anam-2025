# 🚀 Início Rápido - Deploy Automático no Vercel

## ⚡ Setup Completo Automático (Primeira Vez)

Execute este script para fazer tudo automaticamente:

```powershell
cd vercel-config
.\setup-completo-auto.ps1
```

**O que este script faz:**
1. ✅ Verifica e instala Vercel CLI se necessário
2. ✅ Faz login no Vercel
3. ✅ Instala dependências do backend e frontend
4. ✅ Faz deploy do backend
5. ✅ Faz build e deploy do frontend
6. ✅ Mostra próximos passos

## 🔄 Deploy Rápido (Após Setup)

Para fazer deploy rápido após a primeira configuração:

```powershell
cd vercel-config
.\deploy-auto.ps1
```

Este script:
- Faz deploy do backend
- Faz build e deploy do frontend
- Tudo automaticamente

## ⚙️ Configurar Variáveis de Ambiente

Após o primeiro deploy, configure as variáveis:

```powershell
cd vercel-config
.\configurar-variaveis.ps1
```

Ou configure manualmente no dashboard:
https://vercel.com/dashboard

## 📋 Checklist Rápido

- [ ] Execute `setup-completo-auto.ps1` (primeira vez)
- [ ] Configure variáveis de ambiente
- [ ] Faça novo deploy: `deploy-auto.ps1 --prod`
- [ ] Teste a aplicação

## 🔗 Link de demonstração (só frontend)

Para obter um link público **apenas do frontend** (demonstração da página):

1. **Uma vez:** fazer login na Vercel (abre o browser):
   ```powershell
   cd frontend
   npx vercel login
   ```
2. **Deploy:** na pasta `vercel-config` execute:
   ```powershell
   .\deploy-demo-frontend.ps1
   ```
   Ou use o ficheiro `DEPLOY-DEMO-FRONTEND.bat` (duplo clique).

---

## 🎯 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `deploy-demo-frontend.ps1` | Deploy **só frontend** (link de demonstração) |
| `setup-completo-auto.ps1` | Setup completo automático (primeira vez) |
| `deploy-auto.ps1` | Deploy rápido automático |
| `configurar-variaveis.ps1` | Configurar variáveis de ambiente |
| `deploy-backend.ps1` | Deploy apenas do backend |
| `deploy-frontend.ps1` | Deploy apenas do frontend |
| `deploy-all.ps1` | Deploy de ambos (interativo) |

## 📚 Documentação Completa

- `README.md` - Visão geral
- `CONFIGURACAO.md` - Configuração detalhada
- `ARQUIVOS-CONFIG.md` - Localização dos arquivos
- `env.example.txt` - Exemplo de variáveis

## ⚠️ Importante

1. **Primeira vez**: Use `setup-completo-auto.ps1`
2. **Variáveis**: Configure no dashboard após primeiro deploy
3. **Produção**: Use `deploy-auto.ps1` e escolha opção 2 (Production)

## 🆘 Problemas?

1. Verifique se Vercel CLI está instalado: `vercel --version`
2. Verifique login: `vercel whoami`
3. Consulte `CONFIGURACAO.md` para troubleshooting


