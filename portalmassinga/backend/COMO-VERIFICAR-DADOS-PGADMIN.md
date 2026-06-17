# 🔍 Como Verificar Dados no pgAdmin

## ⚠️ IMPORTANTE: Duas Bases de Dados Diferentes!

O backend Docker está usando o **PostgreSQL do Docker**, não o PostgreSQL local.

### Opção 1: Verificar via Script (Mais Fácil)

```batch
cd portalmassinga\backend
VERIFICAR-MEMBROS.bat
```

Este script verifica automaticamente a base de dados correta.

### Opção 2: Verificar via API

Acesse no navegador:
```
http://localhost:8081/api/membros
```

### Opção 3: Verificar via pgAdmin (PostgreSQL Docker)

**IMPORTANTE:** O backend Docker usa o PostgreSQL dentro do Docker, então você precisa conectar ao PostgreSQL do Docker, não ao local.

#### Passo a Passo:

1. **Abra o pgAdmin**

2. **Adicione um novo servidor:**
   - Clique com botão direito em "Servers" > "Create" > "Server"

3. **Na aba "General":**
   - Name: `PostgreSQL Docker` (ou qualquer nome)

4. **Na aba "Connection":**
   - Host name/address: `localhost`
   - Port: `5432` (o Docker mapeia a porta)
   - Maintenance database: `anam`
   - Username: `postgres`
   - Password: `elber123`
   - ✅ Marque "Save password"

5. **Clique em "Save"**

6. **Navegue até os dados:**
   - Expanda: `Servers` > `PostgreSQL Docker` > `Databases` > `anam` > `Schemas` > `public` > `Tables`
   - Clique com botão direito em `membros` > `View/Edit Data` > `All Rows`

### Opção 4: Verificar via Terminal Docker

```bash
# Ver total de membros
docker exec anam-postgres psql -U postgres -d anam -c "SELECT COUNT(*) FROM membros;"

# Ver todos os membros
docker exec anam-postgres psql -U postgres -d anam -c "SELECT nome_completo, email, status, data_cadastro FROM membros ORDER BY data_cadastro DESC;"

# Ver dados completos de um membro
docker exec anam-postgres psql -U postgres -d anam -c "SELECT * FROM membros WHERE email = 'jorge@gmail.com';"
```

## 📊 Status Atual

✅ **Dados estão sendo salvos corretamente!**
- Backend Docker está funcionando
- PostgreSQL Docker está funcionando
- Dados estão na tabela `membros` do Docker

## 🔄 Se Quiser Usar PostgreSQL Local

Se preferir usar o PostgreSQL local ao invés do Docker:

1. **Pare o backend Docker:**
   ```bash
   cd portalmassinga\backend
   docker-compose down
   ```

2. **Configure o backend para usar PostgreSQL local:**
   - Edite `src/main/resources/application.properties`
   - Certifique-se que está usando: `jdbc:postgresql://localhost:5432/anam`

3. **Inicie o backend sem Docker:**
   ```batch
   iniciar-backend-window.bat
   ```

## ✅ Resumo

- ✅ Formulário está funcionando
- ✅ Dados estão sendo salvos
- ✅ Pop-ups estão aparecendo
- ✅ Base de dados: PostgreSQL Docker (porta 5432)
- ✅ Backend: Docker (porta 8081)

Para verificar dados, use sempre o script `VERIFICAR-MEMBROS.bat` que verifica automaticamente a base correta!
