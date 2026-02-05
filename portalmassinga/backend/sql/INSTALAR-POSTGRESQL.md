# Instruções para Instalar e Configurar PostgreSQL

## 1. Instalar PostgreSQL

### Windows:

1. Baixe o instalador do PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante a instalação:
   - Escolha a versão mais recente (recomendado: PostgreSQL 15 ou 16)
   - Escolha o diretório de instalação (padrão: `C:\Program Files\PostgreSQL\16`)
   - **IMPORTANTE**: Anote a senha do usuário `postgres` que você definir
   - Escolha a porta padrão: `5432`
   - Escolha o locale: `Portuguese, Brazil` ou `Default locale`

4. Após a instalação, verifique se o serviço está rodando:
   - Abra o "Services" (Serviços) do Windows
   - Procure por "postgresql-x64-16" (ou similar)
   - Verifique se está "Running" (Em execução)

## 2. Instalar pgAdmin4 (Interface Gráfica)

O pgAdmin4 geralmente vem junto com o instalador do PostgreSQL. Se não vier:

1. Baixe em: https://www.pgadmin.org/download/
2. Instale normalmente
3. Abra o pgAdmin4
4. Conecte-se ao servidor PostgreSQL usando:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: (a senha que você definiu durante a instalação)

## 3. Criar a Base de Dados ANAM

### Opção A: Via pgAdmin4 (Recomendado)

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em **"Databases"**
4. Selecione **"Create"** > **"Database..."**
5. No campo **"Database"**, digite: `ANAM` (em maiúsculas)
6. No campo **"Owner"**, selecione: `postgres`
7. Clique em **"Save"**

### Opção B: Via Linha de Comando (psql)

Abra o PowerShell como Administrador e execute:

```powershell
# Encontrar o caminho do psql
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object -First 1 -ExpandProperty FullName

# Criar a base de dados
& $psqlPath -U postgres -c "CREATE DATABASE ANAM;"
```

Quando solicitado, digite a senha do usuário `postgres`.

## 4. Executar o Script SQL para Criar a Tabela

### Via pgAdmin4:

1. No pgAdmin4, clique com botão direito na base de dados **"ANAM"**
2. Selecione **"Query Tool"**
3. Abra o arquivo `sql/create-database-anam.sql`
4. Clique no botão **"Execute"** (ou pressione F5)
5. Verifique se a tabela `membros` foi criada:
   - Expanda: Databases > ANAM > Schemas > public > Tables
   - Você deve ver a tabela `membros`

### Via Linha de Comando:

```powershell
# Encontrar o caminho do psql
$psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" | Select-Object -First 1 -ExpandProperty FullName

# Executar o script SQL
& $psqlPath -U postgres -d ANAM -f "portalmassinga\backend\sql\create-database-anam.sql"
```

## 5. Verificar se Funcionou

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
```

Você deve ver a tabela `membros` com todas as colunas definidas.

## 6. Configurar o Backend

Edite o arquivo `src/main/resources/application.properties` e ajuste:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ANAM
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA_AQUI
```

Substitua `SUA_SENHA_AQUI` pela senha que você definiu durante a instalação do PostgreSQL.

## Problemas Comuns

### PostgreSQL não está rodando
- Abra o "Services" (Serviços) do Windows
- Procure pelo serviço PostgreSQL
- Clique com botão direito > "Start"

### Erro de conexão
- Verifique se o PostgreSQL está rodando
- Verifique se a porta 5432 está livre
- Verifique as credenciais no `application.properties`

### Erro ao criar base de dados
- Certifique-se de estar conectado como usuário `postgres` ou outro superusuário
- Verifique se a base de dados já existe
