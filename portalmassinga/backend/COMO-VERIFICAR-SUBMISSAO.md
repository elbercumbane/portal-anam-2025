# 🔍 Como Verificar se os Dados Foram Salvos

## 📋 Formas de Verificar

### 1️⃣ Via Script Automático (Mais Fácil)

Execute:
```batch
VERIFICAR-MEMBROS.bat
```

Ou via PowerShell:
```powershell
.\VERIFICAR-MEMBROS.ps1
```

### 2️⃣ Via API (Navegador ou PowerShell)

**No navegador:**
- Acesse: `http://localhost:8081/api/membros`

**Via PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method GET
```

### 3️⃣ Via pgAdmin (Visual)

1. Abra o **pgAdmin**
2. Conecte-se ao servidor PostgreSQL:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `elber123`
3. Expanda: **Servers** > **PostgreSQL** > **Databases** > **anam** > **Schemas** > **public** > **Tables**
4. Clique com botão direito em **`membros`** > **View/Edit Data** > **All Rows**

### 4️⃣ Via SQL Direto

```sql
-- Conectar ao PostgreSQL
psql -h localhost -U postgres -d anam

-- Ver todos os membros
SELECT * FROM membros;

-- Contar membros
SELECT COUNT(*) FROM membros;

-- Ver membros recentes
SELECT nome_completo, email, status, data_cadastro 
FROM membros 
ORDER BY data_cadastro DESC;
```

### 5️⃣ Via Logs do Docker

```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver apenas erros
docker-compose logs backend | Select-String -Pattern "error|Error|Exception"

# Ver requisições POST
docker-compose logs backend | Select-String -Pattern "POST|membro|save"
```

## ⚠️ Se Não Encontrar Dados

### Possíveis Problemas:

1. **Frontend não está enviando para o backend correto**
   - Verifique a URL no frontend: deve ser `http://localhost:8081/api/membros`
   - Verifique se há erros no console do navegador (F12)

2. **Erro de CORS**
   - Verifique os logs do backend para erros de CORS
   - O backend já está configurado para aceitar requisições do frontend

3. **Erro de validação**
   - Verifique os logs do backend para erros de validação
   - Todos os campos obrigatórios devem estar preenchidos

4. **Backend não está recebendo requisições**
   - Verifique se o backend está rodando: `docker-compose ps`
   - Teste manualmente via Postman ou curl (veja abaixo)

## 🧪 Testar Manualmente

### Via PowerShell (Teste POST):

```powershell
$body = @{
    nomeCompleto = "João Silva"
    nomePai = "José Silva"
    nomeMae = "Maria Silva"
    dataNascimento = "1990-01-01"
    estadoCivil = "Solteiro"
    profissao = "Engenheiro"
    celular = "+244 923 456 789"
    email = "joao@example.com"
    rua = "Rua Principal"
    bairro = "Centro"
    cidade = "Luanda"
    aceitaTermos = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/membros" -Method POST -Body $body -ContentType "application/json"
```

### Via curl:

```bash
curl -X POST http://localhost:8081/api/membros \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "João Silva",
    "nomePai": "José Silva",
    "nomeMae": "Maria Silva",
    "dataNascimento": "1990-01-01",
    "estadoCivil": "Solteiro",
    "profissao": "Engenheiro",
    "celular": "+244 923 456 789",
    "email": "joao@example.com",
    "rua": "Rua Principal",
    "bairro": "Centro",
    "cidade": "Luanda",
    "aceitaTermos": true
  }'
```

## ✅ Checklist de Verificação

- [ ] Backend está rodando (`docker-compose ps`)
- [ ] API está respondendo (`http://localhost:8081/api`)
- [ ] Frontend está enviando para URL correta
- [ ] Não há erros no console do navegador (F12)
- [ ] Não há erros nos logs do backend
- [ ] Campos obrigatórios estão preenchidos
- [ ] Email não está duplicado (deve ser único)

## 📞 Se Ainda Não Funcionar

1. Verifique os logs completos:
   ```bash
   docker-compose logs backend > logs.txt
   ```

2. Verifique a configuração do frontend:
   - URL da API deve ser: `http://localhost:8081/api/membros`
   - Método deve ser: `POST`
   - Content-Type deve ser: `application/json`

3. Teste manualmente via Postman ou curl primeiro para garantir que o backend está funcionando
