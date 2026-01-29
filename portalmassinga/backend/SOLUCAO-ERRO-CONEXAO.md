# Solução para Erro de Conexão (ERR_CONNECTION_REFUSED)

## 🔍 Diagnóstico

O erro `ERR_CONNECTION_REFUSED` indica que o **backend não está rodando** na porta 8080.

## ✅ Solução Passo a Passo

### 1. Verificar se o PostgreSQL está rodando

O PostgreSQL precisa estar rodando antes de iniciar o backend.

**Verificar:**
```powershell
# No PowerShell, execute:
Get-NetTCPConnection -LocalPort 5432
```

Se não houver resultado, inicie o PostgreSQL:
- Abra o **pgAdmin 4** ou inicie o serviço PostgreSQL

### 2. Verificar se a base de dados existe

Certifique-se de que a base de dados `anam2025` foi criada:

```sql
-- No pgAdmin 4 ou psql, execute:
SELECT datname FROM pg_database WHERE datname = 'anam2025';
```

Se não existir, crie:
```sql
CREATE DATABASE anam2025;
```

### 3. Iniciar o Backend

**Opção A: Usando o script PowerShell (Recomendado)**

```powershell
# Na pasta backend/
.\iniciar-backend.ps1
```

**Opção B: Manualmente**

```powershell
# Na pasta backend/
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

### 4. Verificar se o Backend iniciou corretamente

Você deve ver mensagens como:
```
Started PortalAnamApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

### 5. Testar a conexão

Abra um navegador e acesse:
- `http://localhost:8080/api` - Deve retornar 404 (normal, significa que o servidor está rodando)
- `http://localhost:8080/api/member-applications` - Deve retornar uma lista vazia []

## 🐛 Problemas Comuns

### Erro: "Porta 8080 já está em uso"

**Solução:**
```powershell
# Encontrar o processo usando a porta 8080
Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess

# Encerrar o processo (substitua PID pelo número do processo)
Stop-Process -Id PID -Force
```

### Erro: "Connection refused" ao conectar ao PostgreSQL

**Verificar:**
1. PostgreSQL está rodando?
2. Credenciais corretas no `application.properties`?
3. Base de dados `anam2025` existe?

### Erro: "Table does not exist"

**Solução:**
Execute o script SQL novamente:
```sql
-- No pgAdmin 4, conecte-se à base anam2025 e execute:
-- O arquivo: backend/sql/create-database-anam2025.sql
```

## 📝 Checklist

Antes de iniciar o backend, verifique:

- [ ] PostgreSQL está rodando (porta 5432)
- [ ] Base de dados `anam2025` existe
- [ ] Credenciais corretas no `application.properties`
- [ ] Porta 8080 está livre
- [ ] Java 17+ instalado
- [ ] Maven instalado ou usando mvnw.cmd

## 🚀 Comandos Rápidos

```powershell
# Verificar status
.\verificar-backend.ps1

# Iniciar backend
.\iniciar-backend.ps1

# Parar backend
# Pressione Ctrl+C no terminal onde o backend está rodando
```

