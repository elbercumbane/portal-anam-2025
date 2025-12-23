# Componente Papai Noel Popup

## Descrição
Componente standalone que exibe um Papai Noel animado que aparece por 5 segundos, mostra uma mensagem "Olá! 🎄" e desaparece.

## Estrutura de Arquivos
```
santa-popup/
├── santa-popup.component.ts      # Lógica do componente
├── santa-popup.component.html     # Template HTML
├── santa-popup.component.scss     # Estilos e animações
└── README.md                      # Esta documentação
```

## Funcionalidades

### Comportamento
- Aparece automaticamente após 1 segundo do carregamento da página
- Mostra mensagem "Olá! 🎄" após 0.5 segundos de aparecer
- Desaparece automaticamente após 5 segundos no total
- Animações suaves de entrada e saída

### Animações
- **santaWave**: Movimento de acenar (rotação suave)
- **santaBounce**: Movimento de pulo no corpo
- **santaBlink**: Piscar dos olhos

## Como Modificar

### Alterar Tempo de Exibição
Edite `santa-popup.component.ts`:
```typescript
// Linha 25: Alterar tempo total (5000 = 5 segundos)
this.timeoutId = setTimeout(() => {
  this.hideSanta();
}, 5000); // Altere este valor (em milissegundos)
```

### Alterar Mensagem
Edite `santa-popup.component.html`:
```html
<!-- Linha 30: Alterar mensagem -->
<p>Olá! 🎄</p> <!-- Altere aqui -->
```

### Alterar Posição
Edite `santa-popup.component.scss`:
```scss
// Linhas 3-4: Alterar posição
bottom: 120px;  // Distância do fundo
right: 30px;    // Distância da direita
```

### Alterar Aparência do Papai Noel
Edite o SVG em `santa-popup.component.html` (linhas 5-30):
- Cores: `fill="#C41E3A"` (vermelho), `fill="#FFE5B4"` (pele), etc.
- Tamanho: ajuste `viewBox` e classes `.santa-character`

### Desabilitar Temporariamente
No arquivo `home.component.html`, comente ou remova:
```html
<!-- <app-santa-popup></app-santa-popup> -->
```

### Remover Completamente
1. Remova o import em `home.component.ts`:
   ```typescript
   // Remover: import { SantaPopupComponent } from './sections/santa-popup/santa-popup.component';
   ```
2. Remova dos imports:
   ```typescript
   // Remover: SantaPopupComponent
   ```
3. Remova do template `home.component.html`:
   ```html
   <!-- Remover: <app-santa-popup></app-santa-popup> -->
   ```
4. Delete a pasta `santa-popup/`

## Personalização Avançada

### Adicionar Som
No `santa-popup.component.ts`, adicione:
```typescript
ngOnInit() {
  // Tocar som ao aparecer
  const audio = new Audio('assets/sounds/ho-ho-ho.mp3');
  audio.play();
  // ... resto do código
}
```

### Adicionar Interação com Clique
No `santa-popup.component.html`:
```html
<div class="santa-popup" (click)="hideSanta()" ...>
```

### Múltiplas Mensagens
Modifique o componente para mostrar mensagens diferentes em sequência.

## Notas
- Componente totalmente isolado e independente
- Não afeta outros componentes ao ser removido
- Fácil de personalizar sem comprometer o código principal
- Responsivo para mobile

