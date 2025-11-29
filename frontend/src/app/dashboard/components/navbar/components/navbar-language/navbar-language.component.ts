import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar-language',
  
  template: `
    <button 
      mat-icon-button 
      class="action-btn language-btn" 
      matTooltip="Idioma"
      [matMenuTriggerFor]="languageMenu">
      <mat-icon class="language-icon">language</mat-icon>
    </button>
    
    <mat-menu #languageMenu="matMenu" class="language-menu">
      <button mat-menu-item (click)="onLanguageSelect('pt')" [class.active]="currentLanguage === 'pt'">
        <mat-icon>flag</mat-icon>
        <span>Português</span>
      </button>
      <button mat-menu-item (click)="onLanguageSelect('en')" [class.active]="currentLanguage === 'en'">
        <mat-icon>flag</mat-icon>
        <span>English</span>
      </button>
      <button mat-menu-item (click)="onLanguageSelect('es')" [class.active]="currentLanguage === 'es'">
        <mat-icon>flag</mat-icon>
        <span>Español</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .language-btn {
      color: #666;
      transition: all 0.3s ease;
      position: relative;
      border-radius: 50%;
      
      &:hover {
        color: #666;
        background: rgba(102, 102, 102, 0.1);
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(102, 102, 102, 0.2);
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      .language-icon {
        color: #666;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          animation: bounce 0.6s ease-in-out;
        }
      }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    
    .language-menu {
      .mat-mdc-menu-item {
        &.active {
          background-color: rgba(102, 102, 102, 0.1);
          color: #666;
          font-weight: 600;
        }
        
        &:hover {
          background-color: rgba(102, 102, 102, 0.05);
        }
      }
    }
    
    // Responsive
    @media (max-width: 768px) {
      .language-btn {
        .language-icon {
          font-size: 1.2rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .language-btn {
        .language-icon {
          font-size: 1.1rem;
        }
      }
    }
  `]
})
export class NavbarLanguageComponent {
  @Input() currentLanguage: string = 'pt';
  @Output() languageChange = new EventEmitter<string>();

  onLanguageSelect(language: string): void {
    this.currentLanguage = language;
    this.languageChange.emit(language);
  }
}
