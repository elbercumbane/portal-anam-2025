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
        font-size: 1.6rem;
        font-weight: 800;
        color: #2c3e50;
        line-height: 1;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .subtitle {
        font-size: 0.8rem;
        color: #666;
        margin-top: 0.25rem;
        font-weight: 500;
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
  @Input() title: string = 'SAQS';
  @Input() subtitle: string = 'Sistema de Avaliação da Qualidade dos Serviços do CEDSIF, IP';
}
