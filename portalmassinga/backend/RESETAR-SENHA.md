# 🔐 Como Redefinir a Senha do PostgreSQL

## Se você nunca usou o PostgreSQL

A senha foi definida durante a instalação. Se você não lembra, siga estes passos:

## Método Automático (Recomendado)

1. **Abra o PowerShell como Administrador:**
   - Clique com botão direito no PowerShell
   - Selecione "Executar como administrador"

2. **Navegue até a pasta do backend:**
   ```powershell
   cd "C:\Users\ecumbane\Desktop\portalmassinga 3\portalmassinga\backend"
   ```

3. **Execute o script:**
   ```powershell
   .\reset-postgres-password.ps1
   ```

O script vai:
- Fazer backup do arquivo de configuração
- Modificar temporariamente para permitir conexão sem senha
- Redefinir a senha para `postgres`
- Restaurar o arquivo original

## Método Manual

Se preferir fazer manualmente:

1. **Parar o serviço PostgreSQL:**
   ```powershell
   Stop-Service postgresql-x64-18
   ```

2. **Editar o arquivo pg_hba.conf:**
   - Localização: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
   - Abra como Administrador (botão direito → "Editar")
   - Encontre a linha:
     ```
     host    all             all             127.0.0.1/32            md5
     ```
   - Altere `md5` para `trust`:
     ```
     host    all             all             127.0.0.1/32            trust
     ```
   - Salve o arquivo

3. **Iniciar o serviço:**
   ```powershell
   Start-Service postgresql-x64-18
   ```

4. **Conectar e redefinir senha:**
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "ALTER USER postgres PASSWORD 'postgres';"
   ```

5. **Reverter o pg_hba.conf:**
   - Volte ao arquivo e mude `trust` de volta para `md5`
   - Salve e reinicie o serviço

6. **Atualizar .env:**
   ```powershell
   (Get-Content .env) -replace 'DB_PASSWORD=.*', "DB_PASSWORD=postgres" | Set-Content .env
   ```

7. **Inicializar banco:**
   ```powershell
   npm run db:init
   npm run db:seed
   ```

## Verificar se Funcionou

Execute:
```powershell
npm run db:init
```

Se funcionar, você verá:
```
✅ Database 'anam_portal' criado com sucesso!
✅ Schema executado com sucesso!
```

## Senha Padrão Após Reset

Após redefinir, a senha será: **`postgres`**

Esta senha já estará configurada no arquivo `.env`.











