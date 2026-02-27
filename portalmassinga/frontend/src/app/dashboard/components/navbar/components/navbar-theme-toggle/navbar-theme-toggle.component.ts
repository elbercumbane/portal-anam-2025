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
      color: #475569;
      transition: all 0.3s ease;
      position: relative;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
    }
    .theme-toggle-btn:hover {
      color: #334155;
      background: rgba(100, 116, 139, 0.1);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 12px rgba(71, 85, 105, 0.15);
    }
    .theme-toggle-btn:active {
      transform: translateY(0) scale(0.98);
    }
    .theme-toggle-btn .theme-icon {
      color: #475569;
      font-size: 1.65rem;
      width: 1.65rem;
      height: 1.65rem;
      transition: all 0.3s ease;
    }
    .theme-toggle-btn:hover .theme-icon {
      animation: theme-rotate 0.5s ease-in-out;
      color: #334155;
    }
    @keyframes theme-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(180deg); }
    }
    @media (max-width: 768px) {
      .theme-toggle-btn .theme-icon {
        font-size: 1.4rem;
        width: 1.4rem;
        height: 1.4rem;
      }
    }
    @media (max-width: 480px) {
      .theme-toggle-btn .theme-icon {
        font-size: 1.35rem;
        width: 1.35rem;
        height: 1.35rem;
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
