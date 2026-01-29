# Verificação da Tabela home_content

## Estrutura da Tabela

A tabela `home_content` possui as seguintes colunas:

```sql
- id (UUID) - PRIMARY KEY
- section_key (VARCHAR(100)) - UNIQUE, NOT NULL
- title (TEXT)
- subtitle (TEXT)
- content (TEXT)
- image_url (VARCHAR(500))
- order_index (INTEGER)
- is_active (BOOLEAN)
- metadata (TEXT) - Para dados JSON
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Dados Salvos no Dashboard

### 1. Slides do Hero (hero_slide_1, hero_slide_2, hero_slide_3)
- **sectionKey**: `hero_slide_${i+1}`
- **title**: Título do slide ✅
- **subtitle**: Subtítulo/descrição do slide ✅
- **imageUrl**: URL da imagem de fundo ✅
- **orderIndex**: Índice do slide (0, 1, 2) ✅
- **isActive**: true ✅

### 2. Seção Sobre ANAM (sobre_anam)
- **sectionKey**: `sobre_anam`
- **title**: Título da seção ✅
- **content**: Texto de introdução ✅
- **orderIndex**: 10 ✅
- **isActive**: true ✅

### 3. Missão (missao)
- **sectionKey**: `missao`
- **title**: Título do card (ex: "Missão") ✅
- **content**: Descrição da missão ✅
- **orderIndex**: 11 ✅
- **isActive**: true ✅

### 4. Visão (visao)
- **sectionKey**: `visao`
- **title**: Título do card (ex: "Visão") ✅
- **content**: Descrição da visão ✅
- **orderIndex**: 12 ✅
- **isActive**: true ✅

### 5. Nossos Valores (valores)
- **sectionKey**: `valores`
- **title**: Título da seção ✅
- **metadata**: JSON com array de valores ✅
  ```json
  {
    "valores": [
      {
        "titulo": "Desenvolvimento de Competências",
        "descricao": "..."
      },
      ...
    ]
  }
  ```
- **orderIndex**: 13 ✅
- **isActive**: true ✅

### 6. Configurações de Natal (christmas_config)
- **sectionKey**: `christmas_config`
- **metadata**: JSON com configurações ✅
  ```json
  {
    "enableSnow": true,
    "enableSanta": true,
    "christmasMessage": "Feliz Natal e Próspero 2025 🎄"
  }
  ```
- **orderIndex**: 0 ✅
- **isActive**: true ✅

## Verificação de localStorage

✅ **Nenhum uso de localStorage** no componente `home.component.ts` do dashboard.
✅ Todos os dados são salvos e carregados diretamente da base de dados via API.

## Conclusão

✅ **A tabela possui todas as colunas necessárias** para armazenar todos os dados editáveis.
✅ **Todos os dados são salvos na base de dados**, não há uso de localStorage.
✅ **O mapeamento está correto** entre o frontend e a entidade JPA.

