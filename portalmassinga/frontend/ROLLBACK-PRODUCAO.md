# Rollback de Produção — ANAM

Documento de referência para **voltar à versão estável** do frontend no Vercel.
Os dados (membros, cotas, etc.) vêm do **backend Railway + Supabase** — não mudam ao atualizar o frontend.

---

## Versão estável atual (17 Jun 2026)

| Componente | Valor |
|------------|--------|
| **Site público** | https://anam-gilt.vercel.app |
| **Deploy ID** | `dpl_9FtqGPcBLsk8gQZEWLEbK7G3Zxev` |
| **URL do deploy** | https://anam-gzhe6in8r-commit976-5277s-projects.vercel.app |
| **API (dados)** | https://anam-production.up.railway.app/api |
| **Backend Railway** | serviço `anam` — deployment `cc1098ec-aad7-4fa6-b41c-d8e580fd3363` |

### Deploy anterior (backup extra)

| URL | Notas |
|-----|--------|
| https://anam-pl1ed8ru7-commit976-5277s-projects.vercel.app | Deploy de 16 Jun (antes das melhorias mobile) |

---

## O que NÃO muda ao fazer `git pull`

| Ação | Afeta Vercel? | Afeta backend/dados? |
|------|---------------|----------------------|
| `git pull origin guilherme_anam` | **Não** (só altera ficheiros no PC) | **Não** |
| Editar código local | **Não** | **Não** |
| `vercel deploy --prod` | **Sim** — nova versão no ar | **Não** |
| `railway up` | **Não** | **Sim** — novo backend |
| Alterar variáveis Railway/Supabase | **Não** | **Sim** — pode afetar dados |

O frontend no Vercel foi publicado **manualmente** (CLI), **não** está ligado ao GitLab para deploy automático.

---

## Voltar à versão estável do Vercel (1 comando)

Na pasta `frontend`, com Vercel CLI instalado e login feito:

```powershell
cd "C:\Users\Elber Elizio\Desktop\portal ANAM\portal-anam-2025\portalmassinga\frontend"
vercel redeploy anam-gzhe6in8r-commit976-5277s-projects.vercel.app --prod --yes
```

Ou pelo painel: [Vercel → projeto anam → Deployments](https://vercel.com/commit976-5277s-projects/anam) → deploy `anam-gzhe6in8r` → **⋯** → **Promote to Production**.

---

## Antes de puxar o commit do Guilherme

1. **Guardar o trabalho local** (lista de membros, responsivo, etc. ainda não está todo no Git):

```powershell
git stash push -u -m "backup-antes-guilherme-$(Get-Date -Format yyyyMMdd)"
```

2. **Puxar a branch** (só no PC):

```powershell
git fetch origin guilherme_anam
git checkout guilherme_anam
git pull origin guilherme_anam
```

3. **Testar localmente** antes de publicar:

```powershell
cd frontend
$env:API_URL = "https://anam-production.up.railway.app/api"
npm start
```

4. **Só publicar no Vercel** quando estiver satisfeito:

```powershell
npm run build:prod
# depois deploy prebuilt (ver deploy-railway / histórico do chat)
```

5. Se der problemas no site → usar **Voltar à versão estável** (secção acima). O site volta em ~30 segundos; os **31 membros na API mantêm-se**.

---

## Backend intacto

Para **não** alterar o backend em produção:

- **Não** executar `railway up` na pasta `backend`
- **Não** alterar variáveis `SPRING_DATASOURCE_*` no Railway
- **Não** executar scripts SQL destrutivos no Supabase sem backup

Testar API a qualquer momento:

- Health: https://anam-production.up.railway.app/api/actuator/health
- Membros: https://anam-production.up.railway.app/api/membros

---

## Commit novo do Guilherme (referência)

- Branch: `guilherme_anam`
- Commit: `31bce852` — *Melhorias em cotas, dashboard, páginas públicas e scripts SQL*
- Inclui alterações em backend (cotas, SQL) — **só entram em produção se fizer deploy no Railway**
