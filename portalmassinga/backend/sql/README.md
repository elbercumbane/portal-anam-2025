# 📚 Documentação Completa - Base de Dados Portal ANAM

Bem-vindo à documentação completa da base de dados do Portal ANAM. Esta pasta contém todos os scripts SQL, guias e documentação necessária para configurar, manter e expandir a base de dados.

---

## 📖 Índice de Documentação

### 🚀 Guias de Início Rápido

1. **[PASSO-A-PASSO-SETUP.md](./PASSO-A-PASSO-SETUP.md)** ⭐ **COMECE AQUI**
   - Guia passo a passo completo para configurar o ambiente do zero
   - Instruções detalhadas para novo desenvolvedor
   - Checklist de verificação

2. **[GUIA-COMPLETO-BASE-DADOS.md](./GUIA-COMPLETO-BASE-DADOS.md)**
   - Visão geral completa da estrutura da base de dados
   - Todas as tabelas e seus propósitos
   - Scripts SQL disponíveis e como usá-los
   - Troubleshooting completo

### 📜 Scripts SQL

3. **[SCRIPT-SETUP-COMPLETO.sql](./SCRIPT-SETUP-COMPLETO.sql)**
   - Script único que cria todas as tabelas necessárias
   - Execute este script após criar a base de dados
   - Inclui todas as tabelas: `home_content`, `membros`, `apoiantes`, `simpatizantes`, etc.

4. **[create-table-home-content.sql](./create-table-home-content.sql)**
   - Cria apenas a tabela `home_content` (conteúdo parametrizável)
   - Use quando precisar recriar apenas esta tabela

5. **[create-tables-apoiantes-simpatizantes.sql](./create-tables-apoiantes-simpatizantes.sql)**
   - Cria tabelas `apoiantes` e `simpatizantes`
   - Use quando precisar apenas dessas tabelas

6. **[alter-image-url-to-text.sql](./alter-image-url-to-text.sql)**
   - Migração: Altera coluna `image_url` de `VARCHAR(500)` para `TEXT`
   - Execute quando receber erro 400 ao salvar imagens grandes

7. **[initialize-home-content.sql](./initialize-home-content.sql)**
   - Inicializa conteúdo padrão na tabela `home_content`
   - Use para ter dados de exemplo no sistema

### 🔧 Guias de Desenvolvimento

8. **[COMO-ADICIONAR-NOVA-SECAO.md](./COMO-ADICIONAR-NOVA-SECAO.md)**
   - Guia completo para adicionar nova seção parametrizável
   - Exemplo prático passo a passo
   - Inclui código frontend e backend

9. **[API-ENDPOINTS-REFERENCE.md](./API-ENDPOINTS-REFERENCE.md)**
   - Referência completa de todos os endpoints da API
   - Exemplos de uso com cURL, PowerShell, Postman
   - Estrutura de dados e códigos de erro

### 📋 Outros Documentos

10. **[INSTALAR-POSTGRESQL.md](./INSTALAR-POSTGRESQL.md)**
    - Guia de instalação do PostgreSQL no Windows
    - Configuração inicial

11. **[EXECUTAR-MIGRACAO-RAPIDA.md](./EXECUTAR-MIGRACAO-RAPIDA.md)**
    - Guia rápido para executar migrações
    - Scripts automatizados

12. **[INSTRUCOES-PARAMETRIZACAO.md](./INSTRUCOES-PARAMETRIZACAO.md)**
    - Instruções sobre como parametrizar conteúdo
    - Como usar o dashboard

13. **[VERIFICACAO-HOME-CONTENT.md](./VERIFICACAO-HOME-CONTENT.md)**
    - Como verificar se a tabela `home_content` está funcionando
    - Consultas úteis

---

## 🎯 Fluxo Recomendado para Novo Desenvolvedor

### 1️⃣ Primeira Vez Configurando

```
1. Ler: PASSO-A-PASSO-SETUP.md
2. Executar: SCRIPT-SETUP-COMPLETO.sql
3. Configurar: application.properties
4. Testar: Iniciar backend e frontend
```

### 2️⃣ Entendendo a Estrutura

```
1. Ler: GUIA-COMPLETO-BASE-DADOS.md
2. Explorar: Scripts SQL disponíveis
3. Testar: API endpoints via API-ENDPOINTS-REFERENCE.md
```

### 3️⃣ Adicionando Novas Funcionalidades

```
1. Ler: COMO-ADICIONAR-NOVA-SECAO.md
2. Criar: Entrada na base de dados
3. Implementar: Frontend e backend
4. Testar: Dashboard e página inicial
```

---

## 🗄️ Estrutura da Base de Dados

### Tabelas Principais

| Tabela | Propósito | Documentação |
|--------|-----------|--------------|
| `home_content` | Conteúdo parametrizável da homepage | [create-table-home-content.sql](./create-table-home-content.sql) |
| `membros` | Membros cadastrados | Ver entidade `Membro.java` |
| `apoiantes` | Apoiantes da ANAM | [create-tables-apoiantes-simpatizantes.sql](./create-tables-apoiantes-simpatizantes.sql) |
| `simpatizantes` | Simpatizantes da ANAM | [create-tables-apoiantes-simpatizantes.sql](./create-tables-apoiantes-simpatizantes.sql) |
| `member_applications` | Candidaturas de membros | Ver entidade `MemberApplication.java` |

---

## 🚀 Comandos Rápidos

### Criar Base de Dados
```bash
psql -U postgres -f create-database-anam2025.sql
```

### Criar Todas as Tabelas
```bash
psql -U postgres -d anam2025 -f SCRIPT-SETUP-COMPLETO.sql
```

### Migrar Coluna image_url
```bash
psql -U postgres -d anam2025 -f alter-image-url-to-text.sql
```

### Inicializar Conteúdo Padrão
```bash
psql -U postgres -d anam2025 -f initialize-home-content.sql
```

---

## 🔍 Consultas Úteis

### Ver Todas as Tabelas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Ver Conteúdo da home_content
```sql
SELECT section_key, title, is_active 
FROM home_content 
ORDER BY order_index;
```

### Verificar Tamanho das Imagens
```sql
SELECT 
    section_key,
    LENGTH(image_url) as tamanho_bytes
FROM home_content 
WHERE image_url IS NOT NULL
ORDER BY LENGTH(image_url) DESC;
```

---

## ⚠️ Troubleshooting

### Problema: Erro ao conectar à base de dados
**Solução:** Verificar se PostgreSQL está rodando e credenciais em `application.properties`

### Problema: Erro 400 ao salvar imagens
**Solução:** Executar `alter-image-url-to-text.sql` ou via API: `POST /home-content/migrate-image-url`

### Problema: Tabela não existe
**Solução:** Executar `SCRIPT-SETUP-COMPLETO.sql`

### Problema: Caracteres especiais incorretos
**Solução:** Executar `fix-utf8-encoding.sql`

**Mais soluções:** Ver seção Troubleshooting em [GUIA-COMPLETO-BASE-DADOS.md](./GUIA-COMPLETO-BASE-DADOS.md)

---

## 📞 Suporte

Se encontrar problemas:

1. ✅ Verifique os logs do backend
2. ✅ Consulte a seção Troubleshooting nos guias
3. ✅ Verifique se todas as tabelas foram criadas
4. ✅ Teste a conexão com PostgreSQL

---

## 📝 Convenções

### Section Keys (home_content)

- **Hero Slides:** `hero_slide_1`, `hero_slide_2`, `hero_slide_3`, `hero_slide_4`
- **Seções Gerais:** `sobre_anam`, `missao`, `visao`, `valores`
- **Itens de Lista:** `stats_item_1`, `event_1`, `news_item_1`, `gallery_event_1`

**Padrão:** snake_case, minúsculas, descritivo

### Nomes de Arquivos SQL

- `create-*` - Scripts de criação
- `alter-*` - Scripts de migração/alteracao
- `insert-*` - Scripts de inserção de dados
- `fix-*` - Scripts de correção

---

## ✅ Checklist de Setup

- [ ] PostgreSQL instalado e rodando
- [ ] Base de dados `anam2025` criada
- [ ] Todas as tabelas criadas (`SCRIPT-SETUP-COMPLETO.sql`)
- [ ] Backend configurado (`application.properties`)
- [ ] Backend iniciado com sucesso
- [ ] Frontend conectando ao backend
- [ ] Dashboard acessível
- [ ] Teste de criação de conteúdo funcionando

---

## 📚 Referências Externas

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Angular Docs:** https://angular.io/docs

---

**Última Atualização:** 2025-01-XX  
**Versão:** 1.0

---

## 🎓 Para Iniciantes

Se você é novo no projeto, comece por aqui:

1. 📖 Leia: [PASSO-A-PASSO-SETUP.md](./PASSO-A-PASSO-SETUP.md)
2. 🗄️ Execute: [SCRIPT-SETUP-COMPLETO.sql](./SCRIPT-SETUP-COMPLETO.sql)
3. 🔍 Explore: [GUIA-COMPLETO-BASE-DADOS.md](./GUIA-COMPLETO-BASE-DADOS.md)
4. ➕ Adicione: [COMO-ADICIONAR-NOVA-SECAO.md](./COMO-ADICIONAR-NOVA-SECAO.md)

**Boa sorte! 🚀**
