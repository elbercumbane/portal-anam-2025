import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar-settings',
  
  template: `
    <button 
      mat-icon-button 
      class="action-btn settings-btn" 
      matTooltip="Configurações"
      (click)="onSettingsClick()">
      <mat-icon class="settings-icon">settings</mat-icon>
    </button>
  `,
  styles: [`
    .settings-btn {
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
      
      .settings-icon {
        color: #666;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          animation: spin 0.8s linear infinite;
        }
      }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    // Responsive
    @media (max-width: 768px) {
      .settings-btn {
        .settings-icon {
          font-size: 1.2rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .settings-btn {
        .settings-icon {
          font-size: 1.1rem;
        }
      }
    }
  `]
})
export class NavbarSettingsComponent {
  @Output() settingsClick = new EventEmitter<void>();

  onSettingsClick(): void {
    this.settingsClick.emit();
  }
}
