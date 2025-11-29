import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar-help',
  
  template: `
    <button 
      mat-icon-button 
      class="action-btn help-btn" 
      matTooltip="Ajuda e Suporte"
      (click)="onHelpClick()">
      <mat-icon class="help-icon">help_outline</mat-icon>
    </button>
  `,
  styles: [`
    .help-btn {
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
      
      .help-icon {
        color: #666;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          animation: wiggle 0.5s ease-in-out;
        }
      }
    }
    
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    
    // Responsive
    @media (max-width: 768px) {
      .help-btn {
        .help-icon {
          font-size: 1.2rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .help-btn {
        .help-icon {
          font-size: 1.1rem;
        }
      }
    }
  `]
})
export class NavbarHelpComponent {
  @Output() helpClick = new EventEmitter<void>();

  onHelpClick(): void {
    this.helpClick.emit();
  }
}
