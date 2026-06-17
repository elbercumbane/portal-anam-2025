# 🎨 PROMPT: Layout e Design System do Portal ANAM

Este documento descreve completamente o layout, design system e padrões visuais do Portal ANAM para que possam ser replicados em outros sistemas.

---

## 📋 ÍNDICE

1. [Estrutura Geral do Layout](#estrutura-geral-do-layout)
2. [Sistema de Cores](#sistema-de-cores)
3. [Tipografia](#tipografia)
4. [Componentes Principais](#componentes-principais)
5. [Padrões de Seções](#padrões-de-seções)
6. [Formulários](#formulários)
7. [Navegação](#navegação)
8. [Responsividade](#responsividade)
9. [Animações e Transições](#animações-e-transições)
10. [Espaçamentos e Grid](#espaçamentos-e-grid)

---

## 🏗️ ESTRUTURA GERAL DO LAYOUT

### Shell Principal
```
<div class="app-container">
  <app-navbar></app-navbar>
  <main class="app-content">
    <router-outlet></router-outlet>
  </main>
  <app-footer></app-footer>
  <app-scroll-to-top></app-scroll-to-top>
  <app-toast></app-toast>
</div>
```

### Estrutura de Página Típica
- **Hero Section** (full viewport height ou menor)
- **Seções de Conteúdo** (com container max-width: 1200px)
- **Footer** (fixo no final)

---

## 🎨 SISTEMA DE CORES

### Paleta Principal

#### Cores de Marca
```scss
// Cores Principais
$creme: #FFF8E7;           // Fundo suave, cards claros
$branco: #FFFFFF;           // Fundo principal, textos em dark
$verde: #4CAF50;            // Cor primária, CTAs, destaques
$preto: #1a1a1a;           // Textos principais
$cinzento: #808080;         // Textos secundários
$cinzento-claro: #E0E0E0;   // Bordas, divisores
$cinzento-escuro: #666666;  // Textos terciários
$cinzento-nav: #737475;     // Navegação

// Cores de Acento
$gold-primary: #D4AF37;     // Dourado primário
$gold-light: #FFD700;       // Dourado claro (highlights)
$green-dark: #1B4332;       // Verde escuro
$green-medium: #2D6A4F;     // Verde médio
$green-light: #40916C;      // Verde claro
```

#### Cores de Estado
```scss
$success: #22C55E;          // Sucesso
$warning: #F59E0B;          // Aviso
$error: #EF4444;            // Erro
$info: #3B82F6;             // Informação
```

#### Gradientes
```scss
// Gradientes Modernos
$gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
$gradient-secondary: linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #6366F1 100%);
$gradient-accent: linear-gradient(135deg, #F97316 0%, #EC4899 50%, #A855F7 100%);

// Gradientes Verde (para áreas específicas)
$gradient-green: linear-gradient(135deg, #10B981 0%, #059669 50%, #14B8A6 100%);
```

### Overlays de Hero
```scss
// Overlay Amarelo Suave (Bem-vindo)
background: linear-gradient(
  to right,
  rgba(255, 215, 0, 0.4) 0%,
  rgba(255, 215, 0, 0.3) 30%,
  rgba(255, 215, 0, 0.15) 60%,
  rgba(255, 215, 0, 0) 100%
);

// Overlay Vermelho Suave (Missão/Valores)
background: linear-gradient(
  to right,
  rgba(239, 68, 68, 0.4) 0%,
  rgba(239, 68, 68, 0.3) 30%,
  rgba(239, 68, 68, 0.15) 60%,
  rgba(239, 68, 68, 0) 100%
);
```

---

## 📝 TIPOGRAFIA

### Fontes
```scss
// Fontes Principais
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-display: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-serif: 'Playfair Display', 'Georgia', serif;  // Para títulos especiais
```

### Hierarquia Tipográfica

#### Títulos
```scss
// Hero Title
font-size: clamp(2.5rem, 6vw, 4.5rem);
font-weight: 700;
line-height: 1.2;
color: white;

// Section Title
font-size: clamp(2rem, 4vw, 3rem);
font-weight: 700;
line-height: 1.3;

// Subsection Title
font-size: clamp(1.5rem, 3vw, 2rem);
font-weight: 600;
line-height: 1.4;
```

#### Textos
```scss
// Hero Subtitle
font-size: clamp(1.1rem, 2.5vw, 1.5rem);
font-weight: 400;
line-height: 1.8;
color: rgba(255, 255, 255, 0.95);

// Body Text
font-size: 1rem;
font-weight: 400;
line-height: 1.6;
color: $preto;

// Small Text
font-size: 0.875rem;
font-weight: 400;
line-height: 1.5;
color: $cinzento;
```

### Highlights de Texto
```scss
// Classes para destacar palavras
.highlight {
  color: #FFD700;  // Amarelo
}

.highlight-text {
  color: $verde;
  font-weight: 600;
}

// Classes específicas por cor
.highlight-letter-yellow { color: #FFD700; }
.highlight-letter-green { color: #4CAF50; }
.highlight-letter-red { color: #EF4444; }
.highlight-letter-blue { color: #60A5FA; }
```

---

## 🧩 COMPONENTES PRINCIPAIS

### 1. Navbar (Barra de Navegação)

#### Estrutura
```html
<mat-toolbar class="navbar" [class.scrolled]="scrolled">
  <div class="brand">
    <div class="brand-title">ANAM</div>
  </div>
  
  <nav class="desktop-nav">
    <!-- Links e Dropdowns -->
  </nav>
  
  <button class="mobile-menu-trigger">☰</button>
  
  <div class="nav-actions">
    <a routerLink="/login">Login</a>
  </div>
</mat-toolbar>
```

#### Características
- **Background**: Transparente no topo, branco translúcido ao fazer scroll
- **Altura**: ~64px (desktop), ~56px (mobile)
- **Z-index**: 1200
- **Sombra ao scroll**: `0 4px 20px rgba(0, 0, 0, 0.1)`
- **Transição**: `all 0.3s ease`

#### Dropdowns
- Background branco sólido
- Borda suave: `rgba(0, 0, 0, 0.1)`
- Hover: `rgba(76, 175, 80, 0.1)` (verde claro)
- Animação: fade in/out suave

#### Mobile Menu
- Overlay fullscreen
- Slide-in da direita
- Background branco
- Links organizados em seções

### 2. Hero Section

#### Estrutura
```html
<section class="hero-section">
  <!-- Background Slider -->
  <div class="hero-background">
    <div class="hero-slider">
      <div class="hero-slide" *ngFor="let slide of slides" [class.active]="currentSlide === i"></div>
    </div>
    <div class="hero-overlay"></div>
  </div>
  
  <!-- Conteúdo -->
  <div class="hero-container">
    <div class="hero-badge">Bem-vindo</div>
    <h1 class="hero-title">Título Principal</h1>
    <p class="hero-subtitle">Subtítulo descritivo</p>
    <div class="hero-actions">
      <a class="hero-cta-button">Call to Action</a>
    </div>
  </div>
  
  <!-- Controles -->
  <div class="hero-controls">
    <button class="hero-dot" *ngFor="let slide of slides"></button>
  </div>
</section>
```

#### Características
- **Altura**: `100vh` (mínimo 600px)
- **Background**: Imagens em slider com overlay gradiente
- **Transições**: Fade suave entre slides (1.8s)
- **Badge**: Verde com texto branco, uppercase
- **CTA Button**: Cores dinâmicas, hover com elevação

### 3. Cards

#### Card Básico
```html
<article class="card">
  <div class="card-image">
    <img src="..." alt="...">
    <div class="image-overlay"></div>
  </div>
  <div class="card-content">
    <h3 class="card-title">Título</h3>
    <p class="card-description">Descrição</p>
    <button class="card-button">Ação</button>
  </div>
</article>
```

#### Características
- **Border-radius**: 16px
- **Sombra**: `0 14px 34px rgba(15, 23, 42, 0.08)`
- **Hover**: Elevação aumentada, transform scale(1.02)
- **Transição**: `all 0.3s ease`

#### Card de Estatística
```html
<article class="stat-card">
  <div class="stat-decoration"></div>
  <div class="stat-icon-wrapper">
    <svg class="stat-icon">...</svg>
  </div>
  <div class="stat-content">
    <div class="stat-number">1,234</div>
    <div class="stat-label">Label</div>
  </div>
  <div class="stat-accent"></div>
</article>
```

### 4. Seções

#### Estrutura Padrão de Seção
```html
<section class="section" id="section-id">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Badge</span>
      <h2 class="section-title">
        Título com <span class="highlight">Destaque</span>
      </h2>
      <p class="section-subtitle">Subtítulo descritivo</p>
    </div>
    
    <div class="section-content">
      <!-- Conteúdo -->
    </div>
  </div>
</section>
```

#### Badge de Seção
```scss
.section-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  color: $verde;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### 5. Footer

#### Estrutura
```html
<footer class="footer">
  <!-- Partículas decorativas -->
  <div class="footer-particles">...</div>
  
  <!-- Conteúdo Principal - 4 Colunas -->
  <div class="footer-main">
    <div class="footer-container">
      <!-- Coluna 1: Logo e Contato -->
      <div class="footer-brand">...</div>
      
      <!-- Coluna 2: Sobre -->
      <div class="footer-links">...</div>
      
      <!-- Coluna 3: Informação -->
      <div class="footer-links">...</div>
      
      <!-- Coluna 4: Newsletter -->
      <div class="footer-newsletter">...</div>
    </div>
  </div>
  
  <!-- Seção Intermediária - Badges -->
  <div class="footer-badges">...</div>
  
  <!-- Barra Inferior -->
  <div class="footer-bottom">
    <!-- Rating, Copyright, Redes Sociais -->
  </div>
</footer>
```

---

## 📄 PADRÕES DE SEÇÕES

### 1. Seção de Estatísticas
- Grid de 4 colunas (desktop), 2 (tablet), 1 (mobile)
- Cards com ícones coloridos
- Números grandes e destacados
- Gradientes de fundo

### 2. Seção de Eventos
- Grid de cards com imagens
- Badge de data no canto da imagem
- Overlay gradiente na imagem
- Botão de ação com ícone

### 3. Seção de História/Missão/Visão
- Layout em duas colunas
- Ícones SVG para cada item
- Cores temáticas por seção

### 4. Seção de Notícias
- Cards em grid
- Imagem destacada
- Data e categoria
- Modal para leitura completa

### 5. Seção de Parceiros
- Grid de logos
- Filtros por categoria
- Hover com informações adicionais

---

## 📝 FORMULÁRIOS

### Estrutura de Formulário
```html
<form [formGroup]="form" class="membership-form">
  <!-- Card de Introdução -->
  <div class="intro-banner">
    <div class="intro-icon">...</div>
    <div class="intro-text">
      <h2>Título do Formulário</h2>
      <p>Instruções. Campos com <span class="required-mark">*</span> são obrigatórios.</p>
    </div>
  </div>
  
  <!-- Cards de Seção -->
  <div class="form-card main-card">
    <div class="card-header">
      <div class="header-icon">...</div>
      <div class="header-text">
        <h3>Nome da Seção</h3>
        <span class="header-badge required-badge">Obrigatório</span>
      </div>
    </div>
    
    <div class="card-content">
      <!-- Campos do formulário -->
    </div>
  </div>
  
  <!-- Seções Expansíveis -->
  <div class="form-card expandable-card" [class.expanded]="isExpanded">
    <div class="card-header clickable" (click)="toggleSection()">
      <!-- Header com ícone de expansão -->
    </div>
    <div class="card-content expandable-content" [class.show]="isExpanded">
      <!-- Conteúdo expansível -->
    </div>
  </div>
  
  <!-- Botão de Envio -->
  <div class="submit-section">
    <button type="submit" class="btn-submit">Enviar</button>
  </div>
</form>
```

### Campos de Formulário
```html
<div class="form-field">
  <label>Label <span class="required-mark">*</span></label>
  <input type="text" formControlName="field" placeholder="Placeholder">
  <span class="field-error" *ngIf="hasError">Mensagem de erro</span>
</div>
```

#### Características
- **Input**: Border-radius 8px, padding 12px 16px
- **Focus**: Borda verde, sombra suave
- **Erro**: Borda vermelha, texto de erro abaixo
- **Required Mark**: Asterisco vermelho

### Botões

#### Botão Primário
```scss
.btn-submit {
  padding: 16px 32px;
  background: $verde;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

#### Botão Secundário
```scss
.btn-secondary {
  padding: 12px 24px;
  background: transparent;
  color: $verde;
  border: 2px solid $verde;
  border-radius: 8px;
  font-weight: 600;
  
  &:hover {
    background: $verde;
    color: white;
  }
}
```

---

## 🧭 NAVEGAÇÃO

### Menu Desktop
- Links horizontais
- Dropdowns ao hover
- Indicador de página ativa (linha verde abaixo)
- Transições suaves

### Menu Mobile
- Hamburger menu (3 pontos)
- Overlay fullscreen
- Links organizados em seções
- Fechar com X no topo

### Breadcrumbs
- Navegação hierárquica
- Separador: `/` ou `>`
- Link ativo destacado

---

## 📱 RESPONSIVIDADE

### Breakpoints
```scss
$mobile-max: 767px;
$tablet-max: 1023px;
$desktop-min: 1024px;
```

### Container
```scss
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: $mobile-max) {
    padding: 0 0.75rem;
  }
}
```

### Grid Responsivo
```scss
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: $tablet-max) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: $mobile-max) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

### Tipografia Responsiva
- Uso de `clamp()` para tamanhos fluidos
- Exemplo: `font-size: clamp(1rem, 2.5vw, 1.5rem);`

---

## ✨ ANIMAÇÕES E TRANSIÇÕES

### Transições Padrão
```scss
$transition-fast: 150ms ease-in-out;
$transition-normal: 300ms ease-in-out;
$transition-slow: 500ms ease-in-out;
```

### Animações Comuns

#### Fade In Up
```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Fade In Content
```scss
@keyframes fadeInContent {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Hover Effects
- **Cards**: `transform: translateY(-4px)` + sombra aumentada
- **Botões**: `transform: translateY(-2px)` + brilho
- **Links**: Underline animado

### Efeitos Especiais
- **Shine Effect**: Brilho que passa pelos cards
- **Particles**: Partículas decorativas no footer
- **Snow Effect**: Flocos de neve (condicional, para eventos especiais)

---

## 📏 ESPAÇAMENTOS E GRID

### Espaçamentos
```scss
$space-xs: 0.25rem;   // 4px
$space-sm: 0.5rem;    // 8px
$space-md: 1rem;       // 16px
$space-lg: 1.5rem;     // 24px
$space-xl: 2rem;       // 32px
$space-2xl: 3rem;      // 48px
$space-3xl: 4rem;      // 64px
```

### Padding de Seções
```scss
.section {
  padding: 3rem 0;
  
  @media (max-width: $mobile-max) {
    padding: 2rem 0;
  }
}
```

### Grid System
- **Container max-width**: 1200px
- **Gutters**: 1rem (mobile), 1.5rem (tablet), 2rem (desktop)
- **Colunas**: 12 colunas (flexível)

---

## 🎯 PADRÕES DE USO

### 1. Cores de Destaque por Contexto
- **Verde**: Ações principais, sucesso, natureza
- **Amarelo/Dourado**: Destaques, prêmios, importância
- **Vermelho**: Urgência, alertas, paixão
- **Azul**: Informação, confiança, tecnologia

### 2. Ícones
- **Biblioteca**: Material Icons (SVG inline)
- **Tamanho padrão**: 24px
- **Cor**: Herda do contexto ou cor primária

### 3. Imagens
- **Aspect Ratio**: 16:9 para hero, 4:3 para cards
- **Lazy Loading**: Sempre habilitado
- **Alt Text**: Sempre presente

### 4. Acessibilidade
- **ARIA Labels**: Em todos os elementos interativos
- **Contraste**: Mínimo 4.5:1 para textos
- **Focus States**: Sempre visíveis
- **Keyboard Navigation**: Totalmente suportado

---

## 🚀 COMO USAR ESTE PROMPT

### Para Criar um Novo Sistema Baseado Neste Layout:

1. **Copie a estrutura de cores** e adapte conforme necessário
2. **Implemente os componentes principais** (Navbar, Hero, Footer)
3. **Use os padrões de seções** como base para suas páginas
4. **Aplique as animações e transições** para consistência
5. **Mantenha a responsividade** usando os breakpoints definidos
6. **Siga os padrões de formulários** para inputs consistentes

### Exemplo de Uso com IA:

```
Crie um sistema web usando Angular com o seguinte design system:

[COLE TODO O CONTEÚDO DESTE DOCUMENTO]

Aplique este design system para criar:
- Uma página inicial com hero section
- Uma página de serviços com cards
- Um formulário de contato
- Um footer completo
```

---

## 📚 RECURSOS ADICIONAIS

### Bibliotecas Utilizadas
- **Angular Material**: Componentes base
- **SCSS**: Pré-processador CSS
- **Material Icons**: Ícones SVG

### Estrutura de Arquivos Recomendada
```
src/
  app/
    components/
      navbar/
      footer/
      scroll-to-top/
    pages/
      home/
        sections/
          stats/
          events/
          history/
    styles/
      _variables.scss
      _mixins.scss
      _animations.scss
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Ao replicar este design system, certifique-se de:

- [ ] Paleta de cores implementada
- [ ] Tipografia configurada
- [ ] Navbar responsivo funcionando
- [ ] Hero section com slider
- [ ] Cards com hover effects
- [ ] Formulários com validação visual
- [ ] Footer completo
- [ ] Animações suaves
- [ ] Responsividade em todos os breakpoints
- [ ] Acessibilidade (ARIA, contraste, keyboard)
- [ ] Performance otimizada (lazy loading, imagens otimizadas)

---

**Última atualização**: Janeiro 2025  
**Versão do Design System**: 1.0  
**Autor**: Portal ANAM Development Team
