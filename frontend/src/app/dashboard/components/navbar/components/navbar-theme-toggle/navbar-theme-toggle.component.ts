import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar-theme-toggle',
  
  template: `
    <button 
      mat-icon-button 
      class="action-btn theme-toggle-btn" 
      matTooltip="Alternar Tema"
      (click)="onThemeToggle()">
      <mat-icon class="theme-icon">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      color: #0891B2;
      transition: all 0.3s ease;
      position: relative;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      
      &:hover {
        color: #05B6D4;
        background: rgba(5, 182, 212, 0.12);
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 12px rgba(5, 182, 212, 0.2);
      }
      
      &:active {
        transform: translateY(0) scale(0.98);
      }
      
      .theme-icon {
        color: #0891B2;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          animation: rotate 0.5s ease-in-out;
          color: #05B6D4;
        }
      }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(180deg); }
    }
    
    // Responsive
    @media (max-width: 768px) {
      .theme-toggle-btn {
        .theme-icon {
          font-size: 1.2rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .theme-toggle-btn {
        .theme-icon {
          font-size: 1.1rem;
        }
      }
    }
  `]
})
export class NavbarThemeToggleComponent {
  @Output() themeToggle = new EventEmitter<boolean>();
  
  isDarkMode = false;

  onThemeToggle(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeToggle.emit(this.isDarkMode);
  }
}
