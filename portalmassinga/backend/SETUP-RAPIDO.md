# 🚀 Setup Rápido - Criar Admin Automaticamente

## ⚡ Método Mais Rápido (Recomendado)

### Passo 1: Resetar Senha do PostgreSQL (se necessário)

**Opção A - PowerShell como Administrador:**
```powershell
cd portalmassinga\backend
.\reset-postgres-password.ps1
```

**Opção B - Manualmente:**
1. Abra pgAdmin
2. Conecte-se ao PostgreSQL (use a senha que você definiu na instalação)
3. Execute este SQL:
```sql
ALTER USER postgres PASSWORD 'postgres';
```

### Passo 2: Executar Setup Completo

```powershell
cd portalmassinga\backend
npm run setup-completo
```

Este comando vai:
- ✅ Criar arquivo .env se não existir
- ✅ Tentar conectar ao PostgreSQL
- ✅ Criar banco de dados se não existir
- ✅ Verificar/criar tabelas
- ✅ Criar usuário admin automaticamente

### Passo 3: Verificar

O script vai mostrar:
```
✅ ✅ ✅ SUCESSO! ✅ ✅ ✅
📝 Usuário admin criado/atualizado!

📋 Credenciais:
   Email: admin
   Password: admin123
   Role: admin (todas as permissões)
```

## 🔧 Se o Setup Automático Falhar

### Método Alternativo: SQL Direto

1. Abra pgAdmin ou outro cliente PostgreSQL
2. Conecte-se ao banco `anam_portal`
3. Execute o arquivo: `create-admin.sql`

Ou copie e cole:

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

## ✅ Testar Login

Após criar o admin:

1. **Inicie o backend:**
   ```powershell
   npm run dev
   ```

2. **Inicie o frontend:**
   ```powershell
   cd ../frontend
   npm start
   ```

3. **Acesse:** http://localhost:4200/login
   - Email: `admin`
   - Password: `admin123`

## 🎯 Resumo dos Comandos

```powershell
# 1. Resetar senha (se necessário, como Admin)
.\reset-postgres-password.ps1

# 2. Setup completo automático
npm run setup-completo

# 3. Iniciar backend
npm run dev

# 4. Em outro terminal, iniciar frontend
cd ../frontend
npm start
```

## 📝 Notas

- Se você já sabe a senha do PostgreSQL, apenas configure no arquivo `.env`:
  ```
  DB_PASSWORD=sua_senha_aqui
  ```
- O script tenta várias senhas comuns automaticamente
- Se nada funcionar, use o método SQL direto (mais confiável)

