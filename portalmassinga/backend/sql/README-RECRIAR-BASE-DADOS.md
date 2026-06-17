# 🔄 Recriar Base de Dados ANAM - Setup Automático

Este guia explica como recriar completamente a base de dados ANAM e executar todos os scripts necessários automaticamente.

## ⚠️ ATENÇÃO

**Este processo apaga TODOS os dados existentes na base de dados ANAM!**

Certifique-se de fazer backup antes de executar se tiver dados importantes.

---

## 🚀 Método 1: Script Automático (Recomendado)

### Passo 1: Verificar Configurações

Antes de executar, verifique se as credenciais do PostgreSQL estão corretas no arquivo `RECRIAR-BASE-DADOS-AUTOMATICO.bat`:

```batch
set PGUSER=postgres
set PGPASSWORD=admin123
```

**⚠️ IMPORTANTE:** Se sua senha do PostgreSQL for diferente, edite o arquivo `.bat` e altere a variável `PGPASSWORD`.

### Passo 2: Executar o Script

1. Abra o **PowerShell** ou **Prompt de Comando** como Administrador
2. Navegue até a pasta SQL:
   ```bash
   cd "C:\Users\Elber Elizio\Desktop\portal ANAM\portal-anam-2025\portalmassinga\backend\sql"
   ```
3. Execute o script:
   ```bash
   RECRIAR-BASE-DADOS-AUTOMATICO.bat
   ```

### O que o script faz:

1. ✅ Remove a base de dados ANAM existente (se houver)
2. ✅ Cria uma nova base de dados ANAM com encoding UTF-8
3. ✅ Cria todas as tabelas necessárias:
   - `home_content` - Conteúdo da página inicial
   - `membros` - Membros cadastrados
   - `apoiantes` - Apoiantes
   - `simpatizantes` - Simpatizantes
   - `member_applications` - Candidaturas de membros
   - `application_dependents` - Dependentes das candidaturas
4. ✅ Popula dados iniciais (slides do hero, missão, visão, valores, etc.)
5. ✅ Verifica se tudo foi criado corretamente

---

## 🔧 Método 2: Execução Manual

Se preferir executar manualmente ou se o script automático não funcionar:

### Passo 1: Remover e Criar Base de Dados

```bash
psql -U postgres -f 01-CRIAR-BASE-DADOS.sql
```

Você será solicitado a inserir a senha do PostgreSQL.

### Passo 2: Criar Tabelas e Popular Dados

```bash
psql -U postgres -d anam -f 02-SETUP-TABELAS-E-DADOS.sql
```

---

## 📋 Método 3: Via pgAdmin4

### Passo 1: Remover Base de Dados

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em **Databases** > **anam** > **Delete/Drop**
4. Confirme a exclusão

### Passo 2: Criar Base de Dados

1. Clique com botão direito em **Databases** > **Create** > **Database**
2. Nome: `anam`
3. Owner: `postgres`
4. Encoding: `UTF8`
5. Clique em **Save**

### Passo 3: Executar Scripts

1. Clique com botão direito em **anam** > **Query Tool**
2. Abra o arquivo `02-SETUP-TABELAS-E-DADOS.sql`
3. Execute o script (F5 ou botão Execute)

---

## ✅ Verificação

Após executar os scripts, verifique se tudo foi criado corretamente:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('home_content', 'membros', 'apoiantes', 'simpatizantes', 'member_applications', 'application_dependents')
ORDER BY table_name;

-- Verificar conteúdo inicial
SELECT section_key, title, order_index 
FROM home_content 
ORDER BY order_index;
```

**Deve mostrar:**
- 6 tabelas criadas
- 8+ registros na tabela `home_content`

---

## 🔍 Solução de Problemas

### Erro: "password authentication failed"

**Solução:** Verifique se a senha do PostgreSQL está correta no script `.bat` ou insira manualmente quando solicitado.

### Erro: "could not connect to server"

**Solução:** 
- Verifique se o PostgreSQL está rodando
- Verifique se a porta está correta (padrão: 5432)
- Verifique se o host está correto (padrão: localhost)

### Erro: "database is being accessed by other users"

**Solução:** 
- Feche todas as conexões com a base de dados (pgAdmin4, aplicações, etc.)
- Execute o script novamente

### Erro: "psql: command not found"

**Solução:** 
- Adicione o PostgreSQL ao PATH do sistema
- Ou use o caminho completo: `C:\Program Files\PostgreSQL\15\bin\psql.exe`

---

## 📝 Arquivos Criados

- `01-CRIAR-BASE-DADOS.sql` - Remove e cria a base de dados
- `02-SETUP-TABELAS-E-DADOS.sql` - Cria tabelas e popula dados iniciais
- `RECRIAR-BASE-DADOS-AUTOMATICO.bat` - Script automático para Windows
- `RECRIAR-BASE-DADOS-COMPLETA.sql` - Script completo (alternativa)

---

## 🎯 Próximos Passos

Após recriar a base de dados:

1. ✅ Verifique o arquivo `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/anam
   spring.datasource.username=postgres
   spring.datasource.password=admin123
   ```

2. ✅ Inicie o backend Spring Boot

3. ✅ Teste a aplicação

---

## 📞 Suporte

Se encontrar problemas, verifique:
- Logs do PostgreSQL
- Logs do Spring Boot
- Arquivo de configuração `application.properties`
