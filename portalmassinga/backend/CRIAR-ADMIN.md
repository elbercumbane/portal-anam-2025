# Como Criar o Usuário Admin

Este guia mostra como criar o usuário administrador no banco de dados.

## Credenciais do Admin

- **Email:** `admin`
- **Password:** `admin123`
- **Role:** `admin` (todas as permissões)

## Opção 1: Executar SQL diretamente (Recomendado)

1. Abra o PostgreSQL (pgAdmin, DBeaver, ou psql)
2. Conecte-se ao banco de dados `anam_portal`
3. Execute o arquivo `create-admin.sql` ou copie e cole o seguinte SQL:

```sql
INSERT INTO users (email, password_hash, full_name, role, active)
VALUES (
  'admin',
  '$2a$10$TnCDA5VUrMSMam8M2ybXt.MPWi.ksSw8fL8ghaqU8IZieYVsVEjhG',
  'Admin',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;
```

4. Verificar se foi criado:

```sql
SELECT id, email, full_name, role, active, created_at 
FROM users 
WHERE email = 'admin';
```

## Opção 2: Usar script Node.js

Se você tiver o arquivo `.env` configurado corretamente:

```bash
cd backend
npm run db:create-admin
```

## Opção 3: Gerar novo hash

Se precisar gerar um novo hash:

```bash
cd backend
node src/database/create-admin-direct.js
```

Isso irá gerar um novo hash e mostrar o SQL para executar.

## Testar Login

Após criar o usuário, você pode testar fazendo login no frontend:

1. Acesse: http://localhost:4200/login
2. Email: `admin`
3. Password: `admin123`

Ou teste via API:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"admin123"}'
```

## Notas

- O hash da senha é gerado com bcrypt (10 rounds)
- O usuário terá role `admin` que permite aprovar/rejeitar candidaturas
- Se o usuário já existir, será atualizado com os novos dados

