# Instruções de Parametrização de Conteúdo

## Visão Geral

O sistema de parametrização permite que todo o conteúdo da página inicial seja gerenciado através do Dashboard, com todas as alterações sendo salvas e substituídas na base de dados.

## Estrutura da Base de Dados

A tabela `home_content` armazena todo o conteúdo organizado por seções usando a coluna `section_key`:

- `hero_slide_1`, `hero_slide_2`, `hero_slide_3`, `hero_slide_4` - Slides do carrossel
- `sobre_anam` - Seção Sobre a ANAM
- `missao` - Card Missão
- `visao` - Card Visão
- `valores` - Seção Nossos Valores
- `christmas_config` - Configurações de Natal

## Como Funciona

### 1. Inicialização do Conteúdo Padrão

**Opção A: Via Dashboard (Recomendado)**
1. Acesse o Dashboard → Gestão de Conteúdo → Página Inicial
2. Clique no botão "Inicializar Conteúdo Padrão"
3. O sistema salvará todo o conteúdo atual na base de dados

**Opção B: Via SQL**
```bash
# Conectar ao PostgreSQL
docker exec -it anam-postgres psql -U postgres -d anam

# Executar o script
\i /path/to/initialize-home-content.sql
```

**Opção C: Via API**
```bash
POST http://localhost:8081/api/home-content/initialize
```

### 2. Edição de Conteúdo

1. Acesse o Dashboard → Gestão de Conteúdo → Página Inicial
2. Edite qualquer campo (título, subtítulo, descrição, imagem)
3. Ao sair do campo (blur) ou clicar em "Salvar Todas as Alterações"
4. O conteúdo é **automaticamente substituído** na base de dados

### 3. Lógica de Substituição

- **Se o conteúdo já existe**: Atualiza (substitui) o conteúdo existente
- **Se o conteúdo não existe**: Cria um novo registro
- **Todas as alterações substituem** o conteúdo anterior na base de dados

## Endpoints da API

### GET /api/home-content
Lista todo o conteúdo (ou apenas ativo se `activeOnly=true`)

### GET /api/home-content/section/{sectionKey}
Busca conteúdo por chave de seção

### POST /api/home-content
Cria novo conteúdo

### PUT /api/home-content/{id}
Atualiza conteúdo existente (substitui)

### POST /api/home-content/initialize
Inicializa conteúdo padrão (cria ou atualiza)

## Estrutura de Dados

### Slide do Hero
```json
{
  "sectionKey": "hero_slide_1",
  "title": "Título do slide",
  "subtitle": "Subtítulo/descrição",
  "imageUrl": "URL da imagem",
  "orderIndex": 0,
  "isActive": true,
  "metadata": "{\"buttonText\": \"...\", \"buttonLink\": \"...\", \"buttonColor\": \"...\"}"
}
```

### Seção Sobre ANAM
```json
{
  "sectionKey": "sobre_anam",
  "title": "Sobre a ANAM",
  "content": "Texto de introdução",
  "orderIndex": 10,
  "isActive": true
}
```

### Valores
```json
{
  "sectionKey": "valores",
  "title": "Nossos Valores",
  "metadata": "{\"valores\": [{\"titulo\": \"...\", \"descricao\": \"...\"}]}",
  "orderIndex": 13,
  "isActive": true
}
```

## Fluxo de Trabalho

1. **Primeira vez**: Execute a inicialização para salvar todo o conteúdo atual
2. **Edições**: Faça alterações no Dashboard e elas serão salvas automaticamente
3. **Substituição**: Qualquer alteração substitui o conteúdo anterior na BD
4. **Visualização**: O frontend carrega o conteúdo da BD ao iniciar

## Verificação

Para verificar se o conteúdo está salvo:

```sql
SELECT section_key, title, order_index, is_active, updated_at 
FROM home_content 
ORDER BY order_index ASC;
```

## Notas Importantes

- ✅ Todas as alterações são **persistentes** na base de dados
- ✅ O conteúdo é **organizado por seção** usando `section_key`
- ✅ As alterações **substituem** o conteúdo anterior
- ✅ Imagens podem ser salvas como base64 ou URLs
- ✅ Metadados são armazenados como JSON na coluna `metadata`
