# 🔐 Como Descobrir/Configurar a Senha do PostgreSQL

## Problema
O script automático não conseguiu conectar ao PostgreSQL porque a senha não está correta.

## Soluções

### Opção 1: Descobrir a Senha Atual

**Via pgAdmin:**
1. Abra o pgAdmin
2. Tente conectar ao servidor PostgreSQL
3. Se conseguir conectar, a senha está correta
4. Anote a senha que você usou

**Via linha de comando:**
```powershell
# Tentar conectar interativamente
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost
# Digite a senha quando solicitado
```

### Opção 2: Redefinir a Senha do PostgreSQL

**Via pgAdmin:**
1. Abra o pgAdmin
2. Conecte-se ao servidor (se possível)
3. Clique com botão direito em "Login/Group Roles" → "postgres" → "Properties"
4. Vá na aba "Definition"
5. Digite a nova senha
6. Salve

**Via linha de comando (Windows):**
```powershell
# Parar serviço PostgreSQL
Stop-Service postgresql-x64-18

# Editar pg_hba.conf temporariamente para permitir conexão sem senha
# Localização: C:\Program Files\PostgreSQL\18\data\pg_hba.conf
# Altere a linha:
# host    all             all             127.0.0.1/32            md5
# Para:
# host    all             all             127.0.0.1/32            trust

# Iniciar serviço
Start-Service postgresql-x64-18

# Conectar sem senha e alterar senha
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "ALTER USER postgres PASSWORD 'sua_nova_senha';"

# Reverter pg_hba.conf para md5
# E reiniciar serviço
```

### Opção 3: Usar Senha Padrão do Windows

Se você instalou o PostgreSQL recentemente, a senha pode ser:
- A senha que você definiu durante a instalação
- "postgres" (padrão em algumas instalações)
- Vazia (se configurado para trust)

## Após Descobrir/Configurar a Senha

1. Edite o arquivo `.env`:
   ```
   DB_PASSWORD=sua_senha_aqui
   ```

2. Execute:
   ```powershell
   npm run db:init
   npm run db:seed
   npm run dev
   ```

## Script Rápido

Execute este comando após descobrir a senha:
```powershell
$senha = Read-Host "Digite a senha do PostgreSQL"
(Get-Content .env) -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$senha" | Set-Content .env
npm run db:init
npm run db:seed
npm run dev
```

