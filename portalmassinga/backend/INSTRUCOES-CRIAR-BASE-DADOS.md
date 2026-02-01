# Instruções para Criar a Base de Dados anam2025

## Opção 1: Usando pgAdmin4 (Recomendado)

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em **"Databases"**
4. Selecione **"Create"** > **"Database..."**
5. No campo **"Database"**, digite: `anam2025`
6. Clique em **"Save"**

## Opção 2: Usando Script Batch (Windows)

Execute o arquivo:
```batch
create-database.bat
```

Este script tentará criar a base de dados automaticamente.

## Opção 3: Usando Linha de Comandos (psql)

Se o PostgreSQL estiver no PATH:
```bash
psql -U postgres -c "CREATE DATABASE anam2025;"
```

Se não estiver no PATH, use o caminho completo:
```bash
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE anam2025;"
```

(Substitua `16` pela versão do seu PostgreSQL: 15, 14, 13, ou 12)

## Criar as Tabelas

Após criar a base de dados, execute o script SQL:

1. No pgAdmin4, conecte-se à base de dados `anam2025`
2. Clique com botão direito na base de dados `anam2025`
3. Selecione **"Query Tool"**
4. Abra o arquivo `sql/create-database-anam2025.sql`
5. Execute o script (F5 ou botão Execute)

## Verificar se Funcionou

Após criar a base de dados e executar o script SQL, você deve ver as tabelas:
- `member_applications` (inclui: registration_device, registration_browser, registration_user_agent, created_at para data de registo)
- `application_dependents`

Se a tabela `member_applications` já existir sem as colunas de registo, execute também:
- `sql/add-registration-device-browser.sql`

No pgAdmin4, expanda:
- Databases > anam2025 > Schemas > public > Tables

## Configuração do Backend

O arquivo `application.properties` já está configurado para usar:
- Base de dados: `anam2025`
- Usuário: `postgres`
- Senha: `postgres`
- Porta: `5432`

Se suas credenciais forem diferentes, edite o arquivo:
`src/main/resources/application.properties`

