# 💻 EXEMPLOS PRÁTICOS DE CÓDIGO - Portal ANAM Layout

Este arquivo contém exemplos práticos de código HTML/SCSS para implementar os componentes do design system.

---

## 🎨 EXEMPLO 1: Hero Section Completo

### HTML
```html
<section class="hero-section" aria-labelledby="hero-title">
  <!-- Background Slider -->
  <div class="hero-background">
    <div class="hero-slider">
      <div class="hero-slide active" 
           style="background-image: url('imagem1.jpg')"></div>
      <div class="hero-slide" 
           style="background-image: url('imagem2.jpg')"></div>
    </div>
    <div class="hero-overlay overlay-yellow-soft"></div>
  </div>
  
  <!-- Conteúdo -->
  <div class="hero-container">
    <div class="hero-badge">Bem-vindo</div>
    <h1 id="hero-title" class="hero-title">
      Título Principal com <span class="highlight">Destaque</span>
    </h1>
    <p class="hero-subtitle">
      Subtítulo descritivo que explica o propósito da seção
    </p>
    <div class="hero-actions">
      <a href="/acao" class="hero-cta-button" style="background-color: #4CAF50">
        Call to Action
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    </div>
  </div>
  
  <!-- Controles -->
  <div class="hero-controls">
    <button class="hero-dot active" aria-label="Slide 1"></button>
    <button class="hero-dot" aria-label="Slide 2"></button>
  </div>
</section>
```

### SCSS
```scss
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &.active {
    opacity: 1;
    z-index: 1;
  }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  
  &.overlay-yellow-soft {
    background: linear-gradient(
      to right,
      rgba(255, 215, 0, 0.4) 0%,
      rgba(255, 215, 0, 0.3) 30%,
      rgba(255, 215, 0, 0.15) 60%,
      rgba(255, 215, 0, 0) 100%
    );
  }
}

.hero-container {
  position: relative;
  z-index: 3;
  max-width: 1200px;
  width: 100%;
  padding: 0 5%;
  color: white;
  animation: fadeInUp 0.8s ease-out;
}

.hero-badge {
  display: inline-block;
  padding: 10px 24px;
  background: rgba(34, 139, 34, 0.9);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 30px;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 24px 0;
  color: white;
  max-width: 800px;
  
  .highlight {
    color: #FFD700;
  }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  line-height: 1.8;
  margin: 0 0 40px 0;
  color: rgba(255, 255, 255, 0.95);
  max-width: 800px;
}

.hero-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
    text-decoration: none;
    color: white;
    filter: brightness(1.1);
    
    svg {
      transform: translateX(5px);
    }
  }
}

.hero-controls {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 4;
}

.hero-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: scale(1.2);
  }
  
  &.active {
    background: #4CAF50;
    border-color: #4CAF50;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
  }
}

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

---

## 🎴 EXEMPLO 2: Card de Evento

### HTML
```html
<article class="evento-card">
  <!-- Imagem com overlay -->
  <div class="evento-imagem">
    <img src="evento.jpg" alt="Nome do Evento" loading="lazy">
    <div class="image-overlay"></div>
    <div class="image-badge">
      <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <span>Evento</span>
    </div>
  </div>
  
  <!-- Conteúdo -->
  <div class="evento-content">
    <div class="content-header">
      <span class="evento-data">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        15 Jan 2025
      </span>
    </div>
    
    <h3 class="evento-titulo">Título do Evento</h3>
    <p class="evento-descricao">Descrição breve do evento que será realizado.</p>
    
    <div class="evento-meta">
      <div class="meta-item">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Local do Evento</span>
      </div>
      <div class="meta-item">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>14:00</span>
      </div>
    </div>
    
    <button class="btn-inscrever">
      <span class="btn-text">Inscrever-se</span>
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  </div>
  
  <!-- Shine Effect -->
  <div class="card-shine"></div>
</article>
```

### SCSS
```scss
.evento-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  }
}

.evento-imagem {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
  
  .image-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(76, 175, 80, 0.9);
    color: white;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    
    .badge-icon {
      width: 14px;
      height: 14px;
    }
  }
  
  &:hover img {
    transform: scale(1.1);
  }
}

.evento-content {
  padding: 24px;
}

.content-header {
  margin-bottom: 12px;
}

.evento-data {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #666;
  
  .icon {
    width: 16px;
    height: 16px;
  }
}

.evento-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.evento-descricao {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0 0 20px 0;
}

.evento-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #666;
  
  .meta-icon {
    width: 16px;
    height: 16px;
  }
}

.btn-inscrever {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .btn-icon {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.evento-card:hover .card-shine {
  left: 100%;
}
```

---

## 📊 EXEMPLO 3: Seção de Estatísticas

### HTML
```html
<section class="stats-section" id="estatisticas">
  <div class="container">
    <!-- Header -->
    <div class="stats-header">
      <span class="section-badge">Impacto</span>
      <h2 class="section-title">
        Números que <span class="highlight">Importam</span>
      </h2>
      <p class="section-subtitle">
        Conheça o impacto da nossa organização
      </p>
    </div>
    
    <!-- Stats Grid -->
    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-decoration"></div>
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number" style="color: #4CAF50">1,234</div>
          <div class="stat-label">Membros Ativos</div>
        </div>
        <div class="stat-accent" style="background-color: #4CAF50"></div>
      </article>
      
      <!-- Repetir para outros cards -->
    </div>
  </div>
</section>
```

### SCSS
```scss
.stats-section {
  padding: 4rem 0;
  background: #FFF8E7;
}

.stats-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  
  .highlight {
    color: #4CAF50;
  }
}

.section-subtitle {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  }
}

.stat-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #10B981);
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(16, 185, 129, 0.1));
  margin-bottom: 1.5rem;
  
  .stat-icon {
    width: 32px;
    height: 32px;
    color: #4CAF50;
  }
}

.stat-content {
  position: relative;
  z-index: 2;
}

.stat-number {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.5rem 0;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.stat-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
}
```

---

## 📝 EXEMPLO 4: Formulário com Cards

### HTML
```html
<form [formGroup]="form" class="membership-form">
  <!-- Card de Introdução -->
  <div class="intro-banner">
    <div class="intro-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
    <div class="intro-text">
      <h2>Bem-vindo!</h2>
      <p>Preencha seus dados. Campos com <span class="required-mark">*</span> são obrigatórios.</p>
    </div>
  </div>
  
  <!-- Card de Seção -->
  <div class="form-card main-card">
    <div class="card-header">
      <div class="header-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="header-text">
        <h3>Dados Pessoais</h3>
        <span class="header-badge required-badge">Obrigatório</span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="form-field">
        <label>Nome Completo <span class="required-mark">*</span></label>
        <input type="text" formControlName="nome" placeholder="Seu nome completo">
        <span class="field-error" *ngIf="hasError('nome')">
          Campo obrigatório
        </span>
      </div>
      
      <div class="form-row">
        <div class="form-field">
          <label>Email <span class="required-mark">*</span></label>
          <input type="email" formControlName="email" placeholder="seu@email.com">
        </div>
        <div class="form-field">
          <label>Telefone</label>
          <input type="tel" formControlName="telefone" placeholder="+258 84 XXX XXXX">
        </div>
      </div>
    </div>
  </div>
  
  <!-- Botão de Envio -->
  <div class="submit-section">
    <button type="submit" class="btn-submit" [disabled]="!form.valid">
      <span class="btn-text">Enviar</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  </div>
</form>
```

### SCSS
```scss
.membership-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.intro-banner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(16, 185, 129, 0.1));
  border-radius: 16px;
  margin-bottom: 2rem;
  
  .intro-icon {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    color: #4CAF50;
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
  
  .intro-text {
    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #1a1a1a;
    }
    
    p {
      font-size: 1rem;
      color: #666;
      margin: 0;
    }
  }
}

.required-mark {
  color: #EF4444;
  font-weight: 600;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  
  .header-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    color: #4CAF50;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .header-text {
    flex: 1;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
      color: #1a1a1a;
    }
  }
}

.header-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  &.required-badge {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }
  
  &.optional-badge {
    background: rgba(107, 114, 128, 0.1);
    color: #6B7280;
  }
}

.card-content {
  padding: 1.5rem;
}

.form-field {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }
  
  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #E5E7EB;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
  }
  
  .field-error {
    display: block;
    font-size: 0.875rem;
    color: #EF4444;
    margin-top: 0.25rem;
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.submit-section {
  text-align: center;
  margin-top: 2rem;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    background: #45a049;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

---

## 🎯 EXEMPLO 5: Navbar Responsivo

### HTML
```html
<mat-toolbar class="navbar" [class.scrolled]="scrolled">
  <div class="brand">
    <div class="brand-title">ANAM</div>
  </div>
  
  <nav class="desktop-nav">
    <a mat-button routerLink="/" class="nav-link">Início</a>
    
    <div class="dropdown">
      <a mat-button class="nav-link dropdown-toggle">
        <span>Páginas</span>
        <mat-icon class="dropdown-icon">keyboard_arrow_down</mat-icon>
      </a>
      <div class="dropdown-menu">
        <a mat-button routerLink="/servicos" class="dropdown-item">Serviços</a>
        <a mat-button routerLink="/historial" class="dropdown-item">Historial</a>
      </div>
    </div>
    
    <a mat-button routerLink="/login" class="nav-link">Login</a>
  </nav>
  
  <button mat-icon-button class="mobile-menu-trigger" (click)="toggleMobileMenu()">
    <svg class="icon" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.8"></circle>
      <circle cx="12" cy="12" r="1.8"></circle>
      <circle cx="12" cy="19" r="1.8"></circle>
    </svg>
  </button>
</mat-toolbar>

<div class="mobile-menu" [class.open]="showMobileMenu">
  <div class="mobile-menu-header">
    <div class="brand-title">ANAM</div>
    <button mat-icon-button (click)="closeMobileMenu()">✕</button>
  </div>
  <div class="mobile-menu-body">
    <a mat-button routerLink="/" (click)="closeMobileMenu()" class="mobile-nav-link">Início</a>
    <a mat-button routerLink="/servicos" (click)="closeMobileMenu()" class="mobile-nav-link">Serviços</a>
    <a mat-button routerLink="/login" (click)="closeMobileMenu()" class="mobile-nav-link">Login</a>
  </div>
</div>
```

### SCSS
```scss
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  background: transparent;
  transition: all 0.3s ease;
  padding: 12px 24px;
  
  &.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(115, 116, 117, 0.2);
  }
}

.brand {
  .brand-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 1px;
  }
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 959px) {
    display: none;
  }
}

.nav-link {
  position: relative;
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #4CAF50;
  }
  
  &.active {
    color: #4CAF50;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #4CAF50;
    }
  }
}

.dropdown {
  position: relative;
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 12px 20px;
      color: #1a1a1a;
      text-decoration: none;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(76, 175, 80, 0.1);
        color: #4CAF50;
      }
    }
  }
  
  &:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.mobile-menu-trigger {
  display: none;
  
  @media (max-width: 959px) {
    display: block;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 1300;
  
  &.open {
    right: 0;
  }
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.mobile-menu-body {
  padding: 1rem;
}

.mobile-nav-link {
  display: block;
  width: 100%;
  padding: 12px 16px;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
  }
}
```

---

Estes exemplos cobrem os principais componentes do design system. Use-os como base para implementar seus próprios componentes seguindo os mesmos padrões visuais e de código.
