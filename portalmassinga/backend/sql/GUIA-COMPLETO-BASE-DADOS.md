# 📚 Guia Completo - Base de Dados Portal ANAM

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Estrutura da Base de Dados](#estrutura-da-base-de-dados)
5. [Scripts SQL Disponíveis](#scripts-sql-disponíveis)
6. [Passo a Passo - Setup Inicial](#passo-a-passo---setup-inicial)
7. [Como Adicionar Novas Seções Parametrizáveis](#como-adicionar-novas-seções-parametrizáveis)
8. [Migrações e Atualizações](#migrações-e-atualizações)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O Portal ANAM utiliza **PostgreSQL** como base de dados e **Spring Boot** como backend. A base de dados armazena:
- Conteúdo parametrizável da página inicial (Hero, Stats, Events, News, Gallery, Partners)
- Dados de membros, apoiantes e simpatizantes
- Configurações do sistema

---

## 📦 Pré-requisitos

### Software Necessário:
1. **PostgreSQL 12+** instalado e rodando
2. **pgAdmin4** (recomendado) ou **psql** (linha de comando)
3. **Java JDK 17+**
4. **Maven** (incluído no projeto via `mvnw`)

### Credenciais Padrão:
- **Usuário:** `postgres`
- **Senha:** `elber123` (configurar no `application.properties` se diferente)
- **Porta:** `5432`
- **Base de Dados:** `anam` ou `anam2025`

---

## 🚀 Instalação e Configuração

### Passo 1: Instalar PostgreSQL

Se ainda não tiver PostgreSQL instalado, siga o guia:
📄 Ver arquivo: `INSTALAR-POSTGRESQL.md`

### Passo 2: Criar Base de Dados

**Opção A: Via pgAdmin4 (Recomendado)**
1. Abra o **pgAdmin4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em **"Databases"** → **"Create"** → **"Database..."**
4. Nome: `anam` ou `anam2025`
5. Clique em **"Save"**

**Opção B: Via Script SQL**
```sql
-- Execute no psql ou pgAdmin4
CREATE DATABASE anam
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

**Opção C: Via Script Automático**
```bash
# Windows PowerShell
cd "portal-anam-2025\portalmassinga\backend\sql"
psql -U postgres -f create-database-anam2025.sql
```

---

## 🗄️ Estrutura da Base de Dados

### Tabelas Principais

#### 1. `home_content` - Conteúdo Parametrizável da Página Inicial

**Propósito:** Armazena todo o conteúdo editável da homepage (Hero slides, Stats, Events, News, Gallery, Partners)

**Estrutura:**
```sql
CREATE TABLE home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) NOT NULL UNIQUE,  -- Chave única da seção
    title TEXT,                                 -- Título
    subtitle TEXT,                              -- Subtítulo/Descrição
    content TEXT,                                -- Conteúdo HTML/texto longo
    image_url TEXT,                              -- URL/imagem base64
    order_index INTEGER,                         -- Ordem de exibição
    is_active BOOLEAN DEFAULT TRUE,              -- Se está ativo
    metadata TEXT,                               -- Dados extras em JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Section Keys Principais:**
- `hero_slide_1`, `hero_slide_2`, `hero_slide_3`, `hero_slide_4` - Slides do Hero
- `sobre_anam` - Seção Sobre ANAM
- `missao` - Missão da ANAM
- `visao` - Visão da ANAM
- `valores` - Valores da ANAM
- `stats_item_1`, `stats_item_2`, etc. - Estatísticas
- `event_1`, `event_2`, etc. - Eventos
- `news_item_1`, `news_item_2`, etc. - Notícias
- `gallery_event_1`, `gallery_event_2`, etc. - Galeria
- `partners_section` - Seção de Parceiros
- `christmas_config` - Configurações de Natal

#### 2. `membros` - Membros da ANAM

**Propósito:** Armazena dados dos membros cadastrados

**Estrutura:** Ver entidade `Membro.java`

#### 3. `apoiantes` - Apoiantes da ANAM

**Propósito:** Armazena dados dos apoiantes

**Estrutura:** Ver entidade `Apoiante.java`

#### 4. `simpatizantes` - Simpatizantes da ANAM

**Propósito:** Armazena dados dos simpatizantes

**Estrutura:** Ver entidade `Simpatizante.java`

#### 5. `member_applications` - Candidaturas de Membros

**Propósito:** Armazena candidaturas pendentes de aprovação

**Estrutura:** Ver entidade `MemberApplication.java`

---

## 📜 Scripts SQL Disponíveis

### Scripts de Criação

#### 1. `create-database-anam2025.sql`
Cria a base de dados `anam2025` com encoding UTF-8.

**Como executar:**
```bash
psql -U postgres -f create-database-anam2025.sql
```

#### 2. `create-table-home-content.sql`
Cria a tabela `home_content` com todos os índices e comentários.

**Como executar:**
```bash
# Conectar à base de dados primeiro
psql -U postgres -d anam2025 -f create-table-home-content.sql
```

**Ou via pgAdmin4:**
1. Conecte-se à base de dados `anam2025`
2. Clique com botão direito → **"Query Tool"**
3. Abra o arquivo `create-table-home-content.sql`
4. Execute (F5)

#### 3. `create-tables-apoiantes-simpatizantes.sql`
Cria as tabelas `apoiantes` e `simpatizantes`.

**Como executar:**
```bash
psql -U postgres -d anam2025 -f create-tables-apoiantes-simpatizantes.sql
```

#### 4. `setup-completo-anam.sql`
Script completo que cria todas as tabelas necessárias.

**Como executar:**
```bash
psql -U postgres -d anam2025 -f setup-completo-anam.sql
```

### Scripts de Migração

#### 1. `alter-image-url-to-text.sql`
Altera a coluna `image_url` de `VARCHAR(500)` para `TEXT` para suportar imagens base64 maiores.

**Como executar:**
```bash
psql -U postgres -d anam2025 -f alter-image-url-to-text.sql
```

**Ou via API (Automático):**
```bash
# Via PowerShell
.\executar-migracao-image-url.ps1

# Via Batch
executar-migracao-image-url.bat

# Via Postman/Insomnia
POST http://localhost:8081/api/home-content/migrate-image-url
```

#### 2. `fix-utf8-encoding.sql`
Corrige problemas de encoding UTF-8 na base de dados.

**Como executar:**
```bash
psql -U postgres -d anam2025 -f fix-utf8-encoding.sql
```

### Scripts de Inicialização

#### 1. `initialize-home-content.sql`
Inicializa conteúdo padrão na tabela `home_content`.

**Como executar:**
```bash
psql -U postgres -d anam2025 -f initialize-home-content.sql
```

#### 2. `insert-hero-slide-4.sql`
Adiciona o 4º slide do Hero (caso não exista).

**Como executar:**
```bash
psql -U postgres -d anam2025 -f insert-hero-slide-4.sql
```

---

## 📝 Passo a Passo - Setup Inicial

### Cenário: Primeira Instalação Completa

#### Passo 1: Verificar PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
# Windows PowerShell
Get-Service -Name postgresql*

# Ou verificar porta
netstat -an | findstr 5432
```

#### Passo 2: Criar Base de Dados
```bash
# Opção A: Via Script
psql -U postgres -f create-database-anam2025.sql

# Opção B: Manualmente
psql -U postgres
CREATE DATABASE anam2025;
\q
```

#### Passo 3: Criar Todas as Tabelas
```bash
# Conectar à base de dados
psql -U postgres -d anam2025

# Executar script completo
\i create-table-home-content.sql
\i create-tables-apoiantes-simpatizantes.sql

# Ou executar tudo de uma vez
\i setup-completo-anam.sql
```

#### Passo 4: Configurar Backend

Editar `application.properties`:
```properties
# Base de dados
spring.datasource.url=jdbc:postgresql://localhost:5432/anam2025
spring.datasource.username=postgres
spring.datasource.password=elber123

# Porta do backend
server.port=8081
server.servlet.context-path=/api
```

#### Passo 5: Inicializar Conteúdo Padrão (Opcional)
```bash
psql -U postgres -d anam2025 -f initialize-home-content.sql
```

#### Passo 6: Iniciar Backend
```bash
cd "portal-anam-2025\portalmassinga\backend"
.\mvnw.cmd spring-boot:run
```

#### Passo 7: Verificar Funcionamento
1. Acesse: `http://localhost:8081/api/home-content`
2. Deve retornar lista de conteúdos (pode estar vazia inicialmente)

---

## ➕ Como Adicionar Novas Seções Parametrizáveis

### Exemplo: Adicionar Seção "Sobre Nós"

#### Passo 1: Criar Entrada na Base de Dados

**Via SQL:**
```sql
INSERT INTO home_content (section_key, title, subtitle, content, order_index, is_active)
VALUES (
    'sobre_nos',
    'Sobre Nós',
    'Conheça mais sobre a nossa organização',
    'Conteúdo HTML aqui...',
    10,
    true
);
```

**Via API (Recomendado):**
```bash
POST http://localhost:8081/api/home-content
Content-Type: application/json

{
  "sectionKey": "sobre_nos",
  "title": "Sobre Nós",
  "subtitle": "Conheça mais sobre a nossa organização",
  "content": "Conteúdo HTML aqui...",
  "orderIndex": 10,
  "isActive": true
}
```

#### Passo 2: Adicionar no Frontend (Dashboard)

**Arquivo:** `frontend/src/app/dashboard/pages/home/home.component.ts`

```typescript
// Adicionar propriedade
sobreNos = {
  titulo: '',
  descricao: '',
  imagem: ''
};

// Adicionar método de carregamento
loadSobreNos(): void {
  // Buscar da API
  this.apiClient.getHomeContentBySectionKey('sobre_nos').subscribe({
    next: (content: any) => {
      if (content) {
        this.sobreNos.titulo = content.title || '';
        this.sobreNos.descricao = content.subtitle || '';
        this.sobreNos.imagem = content.imageUrl || '';
      }
    }
  });
}

// Adicionar método de salvamento
saveSobreNos(): void {
  const data = {
    sectionKey: 'sobre_nos',
    title: this.sobreNos.titulo,
    subtitle: this.sobreNos.descricao,
    imageUrl: this.sobreNos.imagem,
    orderIndex: 10,
    isActive: true
  };
  
  this.saveOrUpdateContent('sobre_nos', data);
}
```

#### Passo 3: Adicionar Interface no Dashboard

**Arquivo:** `frontend/src/app/dashboard/pages/home/home.component.html`

```html
<mat-card class="section-card">
  <mat-card-header>
    <mat-card-title>
      <mat-icon>info</mat-icon>
      Seção Sobre Nós
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Título</mat-label>
      <input matInput [(ngModel)]="sobreNos.titulo" (blur)="saveSobreNos()">
    </mat-form-field>
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Descrição</mat-label>
      <textarea matInput rows="5" [(ngModel)]="sobreNos.descricao" (blur)="saveSobreNos()"></textarea>
    </mat-form-field>
    <button mat-raised-button color="primary" (click)="saveSobreNos()">
      <mat-icon>save</mat-icon>
      Salvar Sobre Nós
    </button>
  </mat-card-content>
</mat-card>
```

#### Passo 4: Adicionar na Página Inicial

**Arquivo:** `frontend/src/app/pages/home/home.component.ts`

```typescript
sobreNos = {
  titulo: '',
  descricao: '',
  imagem: ''
};

loadSobreNosFromDatabase(): void {
  this.apiClient.getHomeContentBySectionKey('sobre_nos').subscribe({
    next: (content: any) => {
      if (content) {
        this.sobreNos.titulo = content.title || '';
        this.sobreNos.descricao = content.subtitle || '';
        this.sobreNos.imagem = content.imageUrl || '';
      }
    }
  });
}
```

---

## 🔄 Migrações e Atualizações

### Migração: Alterar Tipo de Coluna

**Exemplo:** Alterar `image_url` de `VARCHAR(500)` para `TEXT`

#### Método 1: Via SQL Direto
```sql
ALTER TABLE home_content 
ALTER COLUMN image_url TYPE TEXT;
```

#### Método 2: Via Script
```bash
psql -U postgres -d anam2025 -f alter-image-url-to-text.sql
```

#### Método 3: Via API (Automático)
```bash
POST http://localhost:8081/api/home-content/migrate-image-url
```

### Migração: Adicionar Nova Coluna

**Exemplo:** Adicionar coluna `video_url`

```sql
ALTER TABLE home_content 
ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN home_content.video_url IS 'URL do vídeo associado à seção';
```

**Atualizar Entidade Java:**
```java
// Em HomeContent.java
@Column(name = "video_url", columnDefinition = "TEXT")
private String videoUrl;
```

### Migração: Adicionar Novo Índice

```sql
CREATE INDEX IF NOT EXISTS idx_home_content_video_url 
ON home_content(video_url) 
WHERE video_url IS NOT NULL;
```

---

## 🔍 Troubleshooting

### Problema: Erro ao conectar à base de dados

**Solução:**
1. Verificar se PostgreSQL está rodando
2. Verificar credenciais no `application.properties`
3. Verificar se a base de dados existe:
   ```sql
   SELECT datname FROM pg_database WHERE datname = 'anam2025';
   ```

### Problema: Erro "column image_url is too long"

**Solução:**
```bash
# Executar migração
psql -U postgres -d anam2025 -f alter-image-url-to-text.sql

# Ou via API
POST http://localhost:8081/api/home-content/migrate-image-url
```

### Problema: Caracteres especiais aparecem incorretos

**Solução:**
```bash
# Executar script de correção de encoding
psql -U postgres -d anam2025 -f fix-utf8-encoding.sql
```

### Problema: Tabela não existe

**Solução:**
```bash
# Criar tabela
psql -U postgres -d anam2025 -f create-table-home-content.sql
```

### Problema: Erro ao salvar conteúdo (404 ou 400)

**Solução:**
1. Verificar se `section_key` está correto
2. Verificar se a coluna `image_url` é `TEXT` (não `VARCHAR`)
3. Verificar logs do backend para mais detalhes

---

## 📊 Consultas Úteis

### Ver Todos os Conteúdos
```sql
SELECT section_key, title, is_active, created_at 
FROM home_content 
ORDER BY order_index, section_key;
```

### Ver Slides do Hero
```sql
SELECT * FROM home_content 
WHERE section_key LIKE 'hero_slide_%' 
ORDER BY order_index;
```

### Ver Conteúdo de uma Seção Específica
```sql
SELECT * FROM home_content 
WHERE section_key = 'hero_slide_1';
```

### Verificar Tamanho das Imagens
```sql
SELECT 
    section_key,
    title,
    LENGTH(image_url) as image_size_bytes,
    CASE 
        WHEN LENGTH(image_url) > 1000000 THEN 'Muito Grande (>1MB)'
        WHEN LENGTH(image_url) > 500000 THEN 'Grande (>500KB)'
        ELSE 'OK'
    END as tamanho_status
FROM home_content 
WHERE image_url IS NOT NULL
ORDER BY LENGTH(image_url) DESC;
```

### Limpar Conteúdo de Teste
```sql
-- CUIDADO: Isso apaga todos os dados!
DELETE FROM home_content 
WHERE section_key LIKE 'test_%';
```

### Backup da Tabela
```bash
# Criar backup
pg_dump -U postgres -d anam2025 -t home_content > backup_home_content.sql

# Restaurar backup
psql -U postgres -d anam2025 < backup_home_content.sql
```

---

## 📚 Referências

### Arquivos Importantes:
- **Entidades Java:** `backend/src/main/java/com/anam/entity/`
- **Controllers:** `backend/src/main/java/com/anam/controller/`
- **Scripts SQL:** `backend/sql/`
- **Configuração:** `backend/src/main/resources/application.properties`

### Documentação Adicional:
- `INSTALAR-POSTGRESQL.md` - Guia de instalação do PostgreSQL
- `EXECUTAR-MIGRACAO-RAPIDA.md` - Guia rápido de migrações
- `INSTRUCOES-PARAMETRIZACAO.md` - Instruções de parametrização

---

## ✅ Checklist de Setup

- [ ] PostgreSQL instalado e rodando
- [ ] Base de dados `anam2025` criada
- [ ] Tabela `home_content` criada
- [ ] Tabelas `membros`, `apoiantes`, `simpatizantes` criadas (se necessário)
- [ ] Backend configurado no `application.properties`
- [ ] Backend iniciado com sucesso
- [ ] API respondendo em `http://localhost:8081/api`
- [ ] Frontend conectando ao backend
- [ ] Dashboard acessível e funcionando

---

**Última Atualização:** 2025-01-XX
**Versão:** 1.0
