# 🔧 Executar Migração Rápida - image_url VARCHAR → TEXT

## ⚡ Solução Rápida (3 opções)

### Opção 1: Via Endpoint do Backend (MAIS FÁCIL) ✅

1. **Certifique-se de que o backend está rodando** em `http://localhost:8081`

2. **Execute o script PowerShell:**
   ```powershell
   cd "portal-anam-2025\portalmassinga\backend\sql"
   .\executar-migracao-image-url.ps1
   ```

   Ou execute o script batch:
   ```batch
   cd "portal-anam-2025\portalmassinga\backend\sql"
   executar-migracao-image-url.bat
   ```

3. **Ou faça uma requisição POST manualmente:**
   - Abra o Postman, Insomnia ou qualquer cliente HTTP
   - Método: `POST`
   - URL: `http://localhost:8081/api/home-content/migrate-image-url`
   - Headers: `Content-Type: application/json`
   - Body: `{}` (vazio)

### Opção 2: Via pgAdmin4

1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Selecione a base de dados **`anam`**
4. Clique com botão direito → **"Query Tool"**
5. Execute este SQL:
   ```sql
   ALTER TABLE home_content ALTER COLUMN image_url TYPE TEXT;
   ```
6. Clique em **Execute** (F5)

### Opção 3: Via PowerShell (linha de comando)

```powershell
# Conectar e executar SQL diretamente
$env:PGPASSWORD="elber123"
psql -U postgres -d anam -c "ALTER TABLE home_content ALTER COLUMN image_url TYPE TEXT;"
```

## ✅ Verificar se Funcionou

Após executar a migração, verifique:

```sql
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'home_content' 
AND column_name = 'image_url';
```

**Resultado esperado:**
- `data_type` = `text`
- `character_maximum_length` = `null`

## 🎯 Após a Migração

1. **Reinicie o backend** (se necessário)
2. **Teste fazer upload de imagem** no dashboard
3. **O erro 400 não deve mais ocorrer**

## 🔄 Migração Automática

O sistema agora tenta migrar automaticamente quando detecta erro 400 relacionado ao tamanho da coluna. Mas se isso não funcionar, execute manualmente usando uma das opções acima.
