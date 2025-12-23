# 🔧 Configuração Manual do Banco de Dados

Se a configuração automática não funcionar, siga estes passos:

## Opção 1: Usando pgAdmin

1. Abra o pgAdmin
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `anam_portal`
5. Clique em "Save"
6. Selecione o database `anam_portal`
7. Vá em "Tools" → "Query Tool"
8. Abra o arquivo `src/database/schema.sql`
9. Execute o script (F5)

## Opção 2: Usando psql (linha de comando)

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar database
CREATE DATABASE anam_portal;

# Conectar ao database criado
\c anam_portal

# Executar schema (copie e cole o conteúdo de src/database/schema.sql)
```

Ou execute diretamente:
```bash
psql -U postgres -f src/database/schema.sql
```

## Opção 3: Verificar Credenciais

1. Abra o arquivo `.env` no diretório backend
2. Verifique se as credenciais estão corretas:
   ```
   DB_USER=postgres  (ou seu usuário PostgreSQL)
   DB_PASSWORD=sua_senha_aqui
   ```
3. Execute novamente: `npm run db:init`

## Após Criar o Banco

Execute o seed para criar usuários padrão:
```bash
npm run db:seed
```

## Verificar se Funcionou

Execute:
```bash
npm run dev
```

E acesse: http://localhost:3000/health

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected"
}
```

