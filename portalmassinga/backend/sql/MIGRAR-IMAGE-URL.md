# Migração: Alterar image_url de VARCHAR(500) para TEXT

## Problema
A coluna `image_url` na tabela `home_content` está limitada a 500 caracteres, mas imagens em base64 podem ser muito maiores, causando erro 400 ao salvar.

## Solução
Execute o script SQL para alterar a coluna de `VARCHAR(500)` para `TEXT`.

## Como Executar

### Opção 1: Via pgAdmin4
1. Abra o pgAdmin4
2. Conecte-se ao servidor PostgreSQL
3. Selecione a base de dados `anam`
4. Clique com o botão direito em "Query Tool"
5. Abra o arquivo `alter-image-url-to-text.sql`
6. Execute o script (F5)

### Opção 2: Via psql (linha de comando)
```bash
# Conectar ao PostgreSQL
psql -U postgres -d anam

# Executar o script
\i alter-image-url-to-text.sql

# Ou copiar e colar o conteúdo do script diretamente
```

### Opção 3: Via PowerShell (Windows)
```powershell
# Navegar até a pasta do script
cd "portal-anam-2025\portalmassinga\backend\sql"

# Executar o script (ajuste o caminho do psql se necessário)
psql -U postgres -d anam -f alter-image-url-to-text.sql
```

## Verificar se funcionou
Após executar o script, verifique se a alteração foi aplicada:

```sql
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'home_content' 
AND column_name = 'image_url';
```

O resultado deve mostrar `data_type = 'text'` e `character_maximum_length = null`.

## Após a migração
1. Reinicie o backend Spring Boot
2. Tente fazer upload de imagem novamente no dashboard
3. O erro 400 não deve mais ocorrer
