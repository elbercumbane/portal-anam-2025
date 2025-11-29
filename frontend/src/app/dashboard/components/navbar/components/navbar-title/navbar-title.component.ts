import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-title',
  
  template: `
    <div class="navbar-title">
      <h1>{{ title }}</h1>
      <span class="subtitle">{{ subtitle }}</span>
    </div>
  `,
  styles: [`
    .navbar-title {
      display: flex;
      flex-direction: column;
      
      h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 800;
        color: #05B6D4;
        line-height: 1.1;
        letter-spacing: -0.02em;
        text-shadow: 0 2px 4px rgba(5, 182, 212, 0.15);
      }
      
      .subtitle {
        font-size: 0.85rem;
        color: #0891B2;
        margin-top: 0.25rem;
        font-weight: 600;
        letter-spacing: 0.2px;
      }
    }
    
    @media (max-width: 1024px) {
      .navbar-title {
        h1 {
          font-size: 1.4rem;
        }
        
        .subtitle {
          font-size: 0.75rem;
        }
      }
    }
    
    @media (max-width: 768px) {
      .navbar-title {
        h1 {
          font-size: 1.2rem;
        }
        
        .subtitle {
          font-size: 0.7rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .navbar-title {
        h1 {
          font-size: 1rem;
        }
        
        .subtitle {
          display: none;
        }
      }
    }
    
    @media (max-width: 320px) {
      .navbar-title {
        h1 {
          font-size: 0.9rem;
        }
      }
    }
  `]
})
export class NavbarTitleComponent {
  @Input() title: string = 'ANAM';
  @Input() subtitle: string = 'Associação de Naturais e Amigos de Massinga';
}
