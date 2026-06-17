# 🔌 Como Conectar ao PostgreSQL Docker no pgAdmin

## 📋 Passo a Passo Detalhado

### 1. Abrir o pgAdmin

Abra o pgAdmin4 no seu computador.

### 2. Adicionar Novo Servidor

1. No painel esquerdo, encontre **"Servers"**
2. Clique com **botão direito** em **"Servers"**
3. Selecione **"Create"** > **"Server..."**

### 3. Preencher Dados de Conexão

#### Aba "General"

- **Name:** `PostgreSQL Docker` (ou qualquer nome que preferir)
  - Este é apenas um nome para identificar a conexão no pgAdmin

#### Aba "Connection" (IMPORTANTE!)

Preencha exatamente assim:

- **Host name/address:** `localhost`
- **Port:** `5432`
- **Maintenance database:** `anam`
- **Username:** `postgres`
- **Password:** `elber123`
- ✅ **Marque a opção "Save password"** (para não ter que digitar sempre)

### 4. Salvar Conexão

Clique em **"Save"** no canto inferior direito.

### 5. Verificar Conexão

Se tudo estiver correto, você verá:
- ✅ O servidor aparece na lista com um ícone verde
- ✅ Pode expandir e ver: `Databases` > `anam`

### 6. Ver os Dados

1. Expanda: **Servers** > **PostgreSQL Docker** > **Databases** > **anam**
2. Expanda: **Schemas** > **public** > **Tables**
3. Você verá a tabela **`membros`**
4. Clique com **botão direito** em **`membros`**
5. Selecione **"View/Edit Data"** > **"All Rows"**
6. Você verá todos os membros cadastrados!

## 🔍 Verificar se Docker está Rodando

Antes de conectar, certifique-se de que o Docker está rodando:

```bash
cd portalmassinga\backend
docker-compose ps
```

Deve mostrar:
- `anam-postgres` - Status: Up (healthy)
- `anam-backend` - Status: Up (healthy)

## ⚠️ Problemas Comuns

### Erro: "Could not connect to server"

**Solução:**
1. Verifique se o Docker está rodando: `docker-compose ps`
2. Verifique se o PostgreSQL Docker está na porta 5432:
   ```bash
   docker-compose ps
   ```
   Deve mostrar: `0.0.0.0:5432->5432/tcp`

### Erro: "Password authentication failed"

**Solução:**
- Certifique-se de que a senha está correta: `elber123`
- Verifique se está usando o usuário: `postgres`

### Erro: "Database does not exist"

**Solução:**
- Certifique-se de que o Maintenance database está como: `anam`
- Não use `postgres` como database inicial

### Não consegue ver a tabela `membros`

**Solução:**
1. Expanda completamente: Databases > anam > Schemas > public > Tables
2. Se não aparecer, a tabela pode não ter sido criada ainda
3. Execute o script SQL: `sql/create-database-anam.sql`

## 📊 Dados de Conexão Resumidos

```
Tipo: PostgreSQL
Host: localhost
Porta: 5432
Database: anam
Usuário: postgres
Senha: elber123
```

## ✅ Teste Rápido

Após conectar, execute esta query para verificar:

```sql
SELECT COUNT(*) FROM membros;
```

Deve retornar o número de membros cadastrados.

## 🎯 Dica

Salve esta conexão como favorita no pgAdmin para acesso rápido no futuro!
