# 📡 Referência de API Endpoints - Portal ANAM

## 🔗 Base URL

```
http://localhost:8081/api
```

---

## 📋 Endpoints Disponíveis

### 1. Listar Todo o Conteúdo

**GET** `/home-content`

**Descrição:** Retorna todos os conteúdos da tabela `home_content`

**Parâmetros Query (Opcionais):**
- `activeOnly` (boolean): Se `true`, retorna apenas conteúdos ativos

**Exemplo:**
```bash
GET http://localhost:8081/api/home-content?activeOnly=true
```

**Resposta:**
```json
[
  {
    "id": "uuid-here",
    "sectionKey": "hero_slide_1",
    "title": "Bem-vindo à ANAM",
    "subtitle": "Subtítulo...",
    "content": null,
    "imageUrl": "data:image/jpeg;base64...",
    "orderIndex": 0,
    "isActive": true,
    "metadata": null,
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-01T10:00:00"
  }
]
```

---

### 2. Buscar Conteúdo por Section Key

**GET** `/home-content/section/{sectionKey}`

**Descrição:** Retorna conteúdo específico por `section_key`

**Parâmetros:**
- `sectionKey` (path): Chave da seção (ex: `hero_slide_1`)

**Exemplo:**
```bash
GET http://localhost:8081/api/home-content/section/hero_slide_1
```

**Resposta:**
```json
{
  "id": "uuid-here",
  "sectionKey": "hero_slide_1",
  "title": "Bem-vindo à ANAM",
  "subtitle": "Subtítulo...",
  "imageUrl": "data:image/jpeg;base64...",
  "orderIndex": 0,
  "isActive": true
}
```

**Erro 404:** Se não encontrar, retorna 404

---

### 3. Criar Novo Conteúdo

**POST** `/home-content`

**Descrição:** Cria novo conteúdo na base de dados

**Body (JSON):**
```json
{
  "sectionKey": "nova_secao",
  "title": "Título da Seção",
  "subtitle": "Subtítulo",
  "content": "Conteúdo HTML ou texto",
  "imageUrl": "data:image/jpeg;base64...",
  "orderIndex": 10,
  "isActive": true,
  "metadata": "{\"key\":\"value\"}"
}
```

**Exemplo:**
```bash
POST http://localhost:8081/api/home-content
Content-Type: application/json

{
  "sectionKey": "nova_secao",
  "title": "Nova Seção",
  "subtitle": "Descrição",
  "orderIndex": 10,
  "isActive": true
}
```

**Resposta:**
```json
{
  "id": "uuid-gerado",
  "sectionKey": "nova_secao",
  "title": "Nova Seção",
  ...
}
```

**Erro 409:** Se `sectionKey` já existir

---

### 4. Atualizar Conteúdo Existente

**PUT** `/home-content/{id}`

**Descrição:** Atualiza conteúdo existente

**Parâmetros:**
- `id` (path): UUID do conteúdo

**Body (JSON):**
```json
{
  "sectionKey": "hero_slide_1",
  "title": "Título Atualizado",
  "subtitle": "Subtítulo Atualizado",
  "imageUrl": "nova-imagem-base64...",
  "orderIndex": 0,
  "isActive": true
}
```

**Exemplo:**
```bash
PUT http://localhost:8081/api/home-content/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "title": "Título Atualizado",
  "subtitle": "Novo Subtítulo"
}
```

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "sectionKey": "hero_slide_1",
  "title": "Título Atualizado",
  ...
}
```

**Erro 404:** Se ID não existir

---

### 5. Deletar Conteúdo

**DELETE** `/home-content/{id}`

**Descrição:** Remove conteúdo da base de dados

**Parâmetros:**
- `id` (path): UUID do conteúdo

**Exemplo:**
```bash
DELETE http://localhost:8081/api/home-content/123e4567-e89b-12d3-a456-426614174000
```

**Resposta:**
```json
{
  "message": "Conteúdo deletado com sucesso"
}
```

**Erro 404:** Se ID não existir

---

### 6. Migrar Coluna image_url (TEXT)

**POST** `/home-content/migrate-image-url`

**Descrição:** Altera coluna `image_url` de `VARCHAR(500)` para `TEXT`

**Body:** Vazio `{}`

**Exemplo:**
```bash
POST http://localhost:8081/api/home-content/migrate-image-url
Content-Type: application/json

{}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Coluna 'image_url' migrada para TEXT."
}
```

**Uso:** Execute quando receber erro 400 ao salvar imagens grandes

---

## 🔐 Autenticação

Atualmente, os endpoints não requerem autenticação. Se implementar autenticação no futuro, adicione:

```
Authorization: Bearer {token}
```

---

## 📝 Exemplos de Uso

### Criar Slide do Hero

```bash
POST http://localhost:8081/api/home-content
Content-Type: application/json

{
  "sectionKey": "hero_slide_1",
  "title": "Bem-vindo à <span class='highlight-letter-yellow'>Associação</span>",
  "subtitle": "Unindo pessoas, fortalecendo comunidades",
  "imageUrl": "data:image/jpeg;base64...",
  "orderIndex": 0,
  "isActive": true
}
```

### Atualizar Estatística

```bash
# Primeiro, buscar o ID
GET http://localhost:8081/api/home-content/section/stats_item_1

# Depois, atualizar usando o ID retornado
PUT http://localhost:8081/api/home-content/{id-retornado}
Content-Type: application/json

{
  "sectionKey": "stats_item_1",
  "title": "500+",
  "subtitle": "Membros Ativos",
  "orderIndex": 0,
  "isActive": true,
  "metadata": "{\"icon\":\"people\"}"
}
```

### Listar Apenas Conteúdos Ativos

```bash
GET http://localhost:8081/api/home-content?activeOnly=true
```

---

## ⚠️ Códigos de Erro Comuns

### 400 Bad Request
- **Causa:** Dados inválidos ou coluna muito pequena (ex: `image_url` VARCHAR)
- **Solução:** Verificar dados enviados ou executar migração

### 404 Not Found
- **Causa:** Recurso não encontrado (ID ou sectionKey não existe)
- **Solução:** Verificar se o ID/sectionKey está correto

### 409 Conflict
- **Causa:** `sectionKey` já existe ao tentar criar
- **Solução:** Usar PUT para atualizar ou escolher outro `sectionKey`

### 500 Internal Server Error
- **Causa:** Erro no servidor (geralmente problema de conexão com BD)
- **Solução:** Verificar logs do backend e conexão com PostgreSQL

---

## 🧪 Testar Endpoints

### Via PowerShell

```powershell
# Listar conteúdos
Invoke-RestMethod -Uri "http://localhost:8081/api/home-content" -Method GET

# Buscar por section key
Invoke-RestMethod -Uri "http://localhost:8081/api/home-content/section/hero_slide_1" -Method GET

# Criar conteúdo
$body = @{
    sectionKey = "teste_secao"
    title = "Título Teste"
    orderIndex = 99
    isActive = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/home-content" -Method POST -Body $body -ContentType "application/json"
```

### Via Postman/Insomnia

1. Importar coleção (se disponível)
2. Configurar variável `baseUrl` = `http://localhost:8081/api`
3. Testar endpoints individualmente

### Via cURL

```bash
# Listar
curl http://localhost:8081/api/home-content

# Criar
curl -X POST http://localhost:8081/api/home-content \
  -H "Content-Type: application/json" \
  -d '{"sectionKey":"teste","title":"Teste","orderIndex":99,"isActive":true}'
```

---

## 📚 Estrutura de Dados

### HomeContent Object

```typescript
interface HomeContent {
  id: string;                    // UUID
  sectionKey: string;            // Chave única (ex: "hero_slide_1")
  title?: string;                 // Título (pode conter HTML)
  subtitle?: string;              // Subtítulo (pode conter HTML)
  content?: string;               // Conteúdo HTML/texto longo
  imageUrl?: string;              // URL ou base64 (TEXT)
  orderIndex?: number;            // Ordem de exibição
  isActive?: boolean;             // Se está ativo
  metadata?: string;              // JSON string com dados extras
  createdAt?: string;             // ISO timestamp
  updatedAt?: string;             // ISO timestamp
}
```

### Metadata (JSON)

O campo `metadata` pode conter JSON com dados adicionais:

```json
{
  "buttonText": "Saiba Mais",
  "buttonLink": "/sobre",
  "buttonColor": "#FFD700",
  "valores": [
    {"titulo": "Valor 1", "descricao": "Descrição 1"},
    {"titulo": "Valor 2", "descricao": "Descrição 2"}
  ],
  "icon": "people",
  "customField": "valor personalizado"
}
```

---

## 🔄 Fluxo Típico de Uso

### 1. Carregar Conteúdo na Página Inicial

```typescript
// Frontend
this.apiClient.getHomeContent(true).subscribe({
  next: (contents: HomeContent[]) => {
    // Processar conteúdos
    const heroSlides = contents.filter(c => c.sectionKey.startsWith('hero_slide_'));
    // ...
  }
});
```

### 2. Salvar Conteúdo do Dashboard

```typescript
// Frontend - Criar ou Atualizar
const data = {
  sectionKey: 'hero_slide_1',
  title: 'Novo Título',
  subtitle: 'Novo Subtítulo',
  imageUrl: 'data:image/jpeg;base64...',
  orderIndex: 0,
  isActive: true
};

// Se já existe, buscar ID primeiro
this.apiClient.getHomeContentBySectionKey('hero_slide_1').subscribe({
  next: (existing: HomeContent) => {
    if (existing?.id) {
      // Atualizar
      this.apiClient.updateHomeContent(existing.id, data).subscribe(...);
    } else {
      // Criar
      this.apiClient.createHomeContent(data).subscribe(...);
    }
  }
});
```

---

**Última Atualização:** 2025-01-XX
