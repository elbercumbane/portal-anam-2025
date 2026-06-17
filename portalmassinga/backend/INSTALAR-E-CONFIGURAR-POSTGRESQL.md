# Guia Completo: Instalar PostgreSQL e Configurar Base de Dados ANAM

## 📋 Passo 1: Instalar PostgreSQL

### Windows:

1. **Baixar PostgreSQL:**
   - Acesse: https://www.postgresql.org/download/windows/
   - Clique em "Download the installer"
   - Baixe a versão mais recente (recomendado: PostgreSQL 15 ou 16)

2. **Instalar PostgreSQL:**
   - Execute o instalador baixado
   - Escolha os componentes padrão
   - Escolha o diretório de instalação (padrão: `C:\Program Files\PostgreSQL\16`)
   - **IMPORTANTE**: Defina uma senha para o usuário `postgres` e **ANOTE ESSA SENHA**
   - Escolha a porta padrão: `5432`
   - Escolha o locale: `Portuguese, Brazil` ou `Default locale`
   - Complete a instalação

3. **Verificar Instalação:**
   - Abra o "Services" (Serviços) do Windows
   - Procure por "postgresql-x64-16" (ou similar conforme sua versão)
   - Verifique se está "Running" (Em execução)
   - Se não estiver, clique com botão direito > "Start"

## 📋 Passo 2: Instalar pgAdmin4 (Interface Gráfica)

O pgAdmin4 geralmente vem junto com o instalador do PostgreSQL. Se não vier:

1. Baixe em: https://www.pgadmin.org/download/
2. Instale normalmente
3. Abra o pgAdmin4
4. Conecte-se ao servidor PostgreSQL usando:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: (a senha que você definiu durante a instalação)

## 📋 Passo 3: Criar a Base de Dados ANAM

### Opção A: Via pgAdmin4 (Recomendado)

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em **"Databases"**
4. Selecione **"Create"** > **"Database..."**
5. No campo **"Database"**, digite: `ANAM` (em MAIÚSCULAS)
6. No campo **"Owner"**, selecione: `postgres`
7. Clique em **"Save"**

### Opção B: Via Script Batch (Windows)

Execute o arquivo:
```batch
create-database-anam.bat
```

Este script tentará criar a base de dados automaticamente.

### Opção C: Via Linha de Comando (psql)

Abra o PowerShell e execute:

```powershell
# Encontrar o caminho do psql
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object -First 1 -ExpandProperty FullName

# Criar a base de dados
& $psqlPath -U postgres -c "CREATE DATABASE ANAM;"
```

Quando solicitado, digite a senha do usuário `postgres`.

## 📋 Passo 4: Criar a Tabela de Membros

### Via pgAdmin4:

1. No pgAdmin4, clique com botão direito na base de dados **"ANAM"**
2. Selecione **"Query Tool"**
3. Abra o arquivo `sql/create-database-anam.sql`
4. Copie todo o conteúdo do arquivo
5. Cole no Query Tool
6. Clique no botão **"Execute"** (ou pressione F5)
7. Verifique se a tabela `membros` foi criada:
   - Expanda: Databases > ANAM > Schemas > public > Tables
   - Você deve ver a tabela `membros`

### Via Linha de Comando:

```powershell
# Encontrar o caminho do psql
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object -First 1 -ExpandProperty FullName

# Executar o script SQL
& $psqlPath -U postgres -d ANAM -f "portalmassinga\backend\sql\create-database-anam.sql"
```

## 📋 Passo 5: Verificar se Funcionou

Execute no pgAdmin4 (Query Tool):

```sql
-- Verificar se a tabela existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'membros';

-- Verificar a estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'membros'
ORDER BY ordinal_position;

-- Verificar se há membros cadastrados
SELECT COUNT(*) FROM membros;
```

Você deve ver:
- A tabela `membros` listada
- Todas as colunas da tabela
- Contagem de membros (deve ser 0 inicialmente)

## 📋 Passo 6: Configurar o Backend

Edite o arquivo `src/main/resources/application.properties` e ajuste:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ANAM
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA_AQUI
```

**Substitua `SUA_SENHA_AQUI` pela senha que você definiu durante a instalação do PostgreSQL.**

## 📋 Passo 7: Testar o Cadastro

1. Inicie o backend:
   ```bash
   cd portalmassinga/backend
   .\mvnw.cmd spring-boot:run
   ```

2. Inicie o frontend:
   ```bash
   cd portalmassinga/frontend
   npm start
   ```

3. Acesse o formulário de cadastro de membros
4. Preencha o formulário e envie
5. Verifique no pgAdmin4 se o membro foi salvo:
   ```sql
   SELECT * FROM membros;
   ```

## 🐛 Problemas Comuns

### PostgreSQL não está rodando
- Abra o "Services" (Serviços) do Windows
- Procure pelo serviço PostgreSQL
- Clique com botão direito > "Start"

### Erro de conexão
- Verifique se o PostgreSQL está rodando
- Verifique se a porta 5432 está livre
- Verifique as credenciais no `application.properties`
- Verifique se a base de dados `ANAM` foi criada

### Erro ao criar base de dados
- Certifique-se de estar conectado como usuário `postgres` ou outro superusuário
- Verifique se a base de dados já existe (pode dar erro se já existir)

### Erro de tabela não encontrada
- Execute o script SQL novamente (`sql/create-database-anam.sql`)
- Verifique se está conectado à base de dados correta (`ANAM`)

### Erro de autenticação
- Verifique a senha do PostgreSQL no `application.properties`
- Tente resetar a senha do usuário `postgres` se necessário

## ✅ Checklist Final

- [ ] PostgreSQL instalado e rodando
- [ ] pgAdmin4 instalado e funcionando
- [ ] Base de dados `ANAM` criada
- [ ] Tabela `membros` criada
- [ ] Backend configurado com credenciais corretas
- [ ] Backend iniciado sem erros
- [ ] Frontend iniciado sem erros
- [ ] Teste de cadastro funcionando
