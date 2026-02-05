# ➕ Como Adicionar Nova Seção Parametrizável

Este guia mostra passo a passo como adicionar uma nova seção editável no dashboard e exibi-la na página inicial.

---

## 📋 Exemplo Prático: Adicionar Seção "Nossa História"

Vamos criar uma seção completa chamada "Nossa História" que pode ser editada no dashboard.

---

## 🗄️ Passo 1: Criar Entrada na Base de Dados

### Opção A: Via SQL (Recomendado para Setup Inicial)

```sql
-- Conectar à base de dados
\c anam2025

-- Inserir nova seção
INSERT INTO home_content (section_key, title, subtitle, content, order_index, is_active)
VALUES (
    'nossa_historia',
    'Nossa História',
    'Conheça a trajetória da ANAM desde sua fundação',
    '<p>A Associação de Naturais e Amigos de Massinga foi fundada em...</p>',
    5,
    true
)
ON CONFLICT (section_key) DO NOTHING;  -- Não sobrescrever se já existir
```

### Opção B: Via API (Recomendado para Produção)

```bash
POST http://localhost:8081/api/home-content
Content-Type: application/json

{
  "sectionKey": "nossa_historia",
  "title": "Nossa História",
  "subtitle": "Conheça a trajetória da ANAM desde sua fundação",
  "content": "<p>A Associação de Naturais e Amigos de Massinga foi fundada em...</p>",
  "orderIndex": 5,
  "isActive": true
}
```

---

## 💻 Passo 2: Adicionar no Backend (TypeScript - Dashboard)

### 2.1. Adicionar Interface e Propriedade

**Arquivo:** `frontend/src/app/dashboard/pages/home/home.component.ts`

```typescript
// Adicionar interface (se necessário)
interface NossaHistoriaData {
  titulo: string;
  subtitulo: string;
  conteudo: string;
  imagem?: string;
}

// Adicionar propriedade na classe
export class HomeComponent implements OnInit {
  // ... outras propriedades existentes ...
  
  nossaHistoria: NossaHistoriaData = {
    titulo: '',
    subtitulo: '',
    conteudo: '',
    imagem: ''
  };
}
```

### 2.2. Adicionar Método de Carregamento

```typescript
// Adicionar no método loadData() existente
loadData(): void {
  // ... código existente ...
  
  // Carregar Nossa História
  const historiaContent = contents.find(c => c.sectionKey === 'nossa_historia');
  if (historiaContent) {
    this.nossaHistoria.titulo = historiaContent.title || '';
    this.nossaHistoria.subtitulo = historiaContent.subtitle || '';
    this.nossaHistoria.conteudo = historiaContent.content || '';
    this.nossaHistoria.imagem = historiaContent.imageUrl || '';
  }
}
```

### 2.3. Adicionar Método de Salvamento

```typescript
saveNossaHistoria(): void {
  const historiaData = {
    sectionKey: 'nossa_historia',
    title: this.nossaHistoria.titulo,
    subtitle: this.nossaHistoria.subtitulo,
    content: this.nossaHistoria.conteudo,
    imageUrl: this.nossaHistoria.imagem || '',
    orderIndex: 5,
    isActive: true
  };
  
  this.saveOrUpdateContent('nossa_historia', historiaData)
    .then(() => {
      alert('✅ Nossa História salva com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao salvar Nossa História:', error);
      alert('❌ Erro ao salvar: ' + (error.message || 'Erro desconhecido'));
    });
}
```

---

## 🎨 Passo 3: Adicionar Interface no Dashboard (HTML)

**Arquivo:** `frontend/src/app/dashboard/pages/home/home.component.html`

Adicione após as outras seções (ex: após a seção "Nossos Valores"):

```html
<!-- Seção Nossa História -->
<mat-card class="section-card">
  <mat-card-header>
    <mat-card-title>
      <mat-icon>history</mat-icon>
      Seção Nossa História
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <div class="visual-editor-section">
      <label class="editor-label">Título</label>
      <div class="editor-toolbar">
        <span class="toolbar-label">📝 Selecione o texto e clique em uma cor:</span>
        <div class="toolbar-buttons">
          <button mat-mini-fab color="warn" (click)="applyColorToSelection(-1, 'historia-title', 'highlight-letter-red')" title="Vermelho">
            <span class="color-dot" style="background: #EF4444;"></span>
          </button>
          <!-- Adicione mais cores conforme necessário -->
        </div>
      </div>
      <div 
        class="visual-editor" 
        contenteditable="true"
        [attr.data-field]="'historia-title'"
        [innerHTML]="getPlainTextAsHtml(nossaHistoria.titulo)"
        (input)="onEditorInput($any($event), -1, 'historia')"
        (blur)="saveNossaHistoria()">
      </div>
    </div>

    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Subtítulo</mat-label>
      <textarea matInput rows="2" [(ngModel)]="nossaHistoria.subtitulo" (blur)="saveNossaHistoria()"></textarea>
    </mat-form-field>

    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Conteúdo</mat-label>
      <textarea matInput rows="8" [(ngModel)]="nossaHistoria.conteudo" (blur)="saveNossaHistoria()"></textarea>
    </mat-form-field>

    <div class="image-upload-section">
      <label class="upload-label">Imagem da Seção</label>
      <div class="image-preview-container">
        <img [src]="nossaHistoria.imagem || '/assets/placeholder.jpg'" alt="Preview" class="image-preview">
        <input type="file" id="historiaImageInput" (change)="onHistoriaImageSelected($event)" accept="image/*" style="display: none;">
        <button mat-raised-button color="primary" class="upload-btn" (click)="document.getElementById('historiaImageInput')?.click()">
          <mat-icon>cloud_upload</mat-icon>
          Alterar Imagem
        </button>
      </div>
    </div>

    <button mat-raised-button color="primary" (click)="saveNossaHistoria()" style="margin-top: 16px;">
      <mat-icon>save</mat-icon>
      Salvar Nossa História
    </button>
  </mat-card-content>
</mat-card>
```

### 3.1. Adicionar Método de Upload de Imagem

**Arquivo:** `frontend/src/app/dashboard/pages/home/home.component.ts`

```typescript
onHistoriaImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ Imagem muito grande. Máximo: 5MB');
      return;
    }
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Por favor, selecione uma imagem válida');
      return;
    }
    
    // Converter para base64 com compressão
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

        this.nossaHistoria.imagem = compressedBase64;
        this.saveNossaHistoria();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
```

---

## 🌐 Passo 4: Adicionar na Página Inicial (Frontend)

### 4.1. Criar Componente da Seção (Opcional - se quiser componente separado)

**Arquivo:** `frontend/src/app/pages/home/sections/history/history.component.ts`

Se já existe um componente de história, você pode reutilizá-lo ou criar um novo.

### 4.2. Adicionar na Página Inicial

**Arquivo:** `frontend/src/app/pages/home/home.component.ts`

```typescript
// Adicionar propriedade
nossaHistoria = {
  titulo: '',
  subtitulo: '',
  conteudo: '',
  imagem: ''
};

// Adicionar no método loadContentFromDatabase()
loadContentFromDatabase(): void {
  this.apiClient.getHomeContent(true).subscribe({
    next: (contents: any[]) => {
      // ... código existente ...
      
      // Carregar Nossa História
      const historiaContent = contents.find(c => c.sectionKey === 'nossa_historia');
      if (historiaContent) {
        this.nossaHistoria.titulo = historiaContent.title || '';
        this.nossaHistoria.subtitulo = historiaContent.subtitle || '';
        this.nossaHistoria.conteudo = historiaContent.content || '';
        this.nossaHistoria.imagem = historiaContent.imageUrl || '';
      }
    }
  });
}
```

### 4.3. Adicionar HTML na Página Inicial

**Arquivo:** `frontend/src/app/pages/home/home.component.html`

Adicione onde deseja exibir a seção (ex: após a seção de história):

```html
<!-- Seção Nossa História -->
<section class="historia-section" *ngIf="nossaHistoria.titulo">
  <div class="container">
    <h2 [innerHTML]="nossaHistoria.titulo"></h2>
    <p class="subtitle" [innerHTML]="nossaHistoria.subtitulo"></p>
    <div class="content" [innerHTML]="nossaHistoria.conteudo"></div>
    <img *ngIf="nossaHistoria.imagem" [src]="nossaHistoria.imagem" alt="Nossa História" class="historia-image">
  </div>
</section>
```

### 4.4. Adicionar Estilos CSS

**Arquivo:** `frontend/src/app/pages/home/home.component.scss` ou arquivo de estilos específico

```scss
.historia-section {
  padding: 80px 0;
  background: #f9fafb;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #1f2937;
  }
  
  .subtitle {
    font-size: 1.25rem;
    color: #6b7280;
    margin-bottom: 30px;
  }
  
  .content {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #374151;
    margin-bottom: 40px;
  }
  
  .historia-image {
    width: 100%;
    max-width: 800px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
```

---

## ✅ Passo 5: Testar

1. **Iniciar Backend:**
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

2. **Iniciar Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Testar no Dashboard:**
   - Acesse: `http://localhost:4201/dashboard`
   - Navegue até "Gestão de Conteúdo" → "Página Inicial"
   - Encontre a seção "Nossa História"
   - Edite o conteúdo
   - Clique em "Salvar Nossa História"
   - Verifique mensagem de sucesso

4. **Testar na Página Inicial:**
   - Acesse: `http://localhost:4201`
   - Verifique se a seção "Nossa História" aparece
   - Verifique se o conteúdo editado está visível

---

## 📝 Checklist de Implementação

- [ ] Entrada criada na base de dados (`home_content`)
- [ ] Interface adicionada no dashboard (HTML)
- [ ] Métodos de carregamento implementados (TypeScript)
- [ ] Métodos de salvamento implementados (TypeScript)
- [ ] Upload de imagem implementado (se necessário)
- [ ] Seção adicionada na página inicial (HTML)
- [ ] Estilos CSS adicionados
- [ ] Testado criação de conteúdo
- [ ] Testado edição de conteúdo
- [ ] Testado exibição na página inicial

---

## 🎯 Padrão de Section Keys

Use o seguinte padrão para `section_key`:

- **Hero Slides:** `hero_slide_1`, `hero_slide_2`, etc.
- **Seções Gerais:** `nome_da_secao` (snake_case, minúsculas)
- **Itens de Lista:** `tipo_item_1`, `tipo_item_2`, etc.
  - Exemplos: `stats_item_1`, `event_1`, `news_item_1`

**Exemplos de Section Keys:**
- `sobre_anam`
- `missao`
- `visao`
- `valores`
- `nossa_historia`
- `equipa`
- `contactos`

---

## 💡 Dicas

1. **Sempre use `saveOrUpdateContent()`** - Este método já trata criação e atualização automaticamente
2. **Use `orderIndex`** para controlar a ordem de exibição
3. **Use `metadata` (JSON)** para dados complexos ou arrays
4. **Valide dados** antes de salvar
5. **Comprima imagens** antes de converter para base64
6. **Use `section_key` único** - nunca duplique

---

## 🔄 Atualizar Seção Existente

Se precisar atualizar uma seção existente:

1. **Alterar estrutura da tabela** (se necessário):
   ```sql
   ALTER TABLE home_content 
   ADD COLUMN IF NOT EXISTS nova_coluna TEXT;
   ```

2. **Atualizar entidade Java:**
   ```java
   @Column(name = "nova_coluna", columnDefinition = "TEXT")
   private String novaColuna;
   ```

3. **Atualizar frontend** conforme necessário

---

**Boa sorte! 🚀**
