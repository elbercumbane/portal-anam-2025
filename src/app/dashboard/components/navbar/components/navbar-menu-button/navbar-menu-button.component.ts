import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar-menu-button',
  
  template: `
    <button 
      mat-icon-button 
      (click)="onToggleSidebar()" 
      class="menu-btn">
      <mat-icon class="menu-icon">menu</mat-icon>
    </button>
  `,
  styles: [`
    .menu-btn {
      color: #666;
      margin-right: 1rem;
      transition: all 0.3s ease;
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
      
      .menu-icon {
        color: #666;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          animation: rotate 0.3s ease-in-out;
        }
      }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(90deg); }
    }
    
    // Responsive
    @media (max-width: 768px) {
      .menu-btn {
        margin-right: 0.75rem;
        
        .menu-icon {
          font-size: 1.2rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .menu-btn {
        margin-right: 0.5rem;
        
        .menu-icon {
          font-size: 1.1rem;
        }
      }
    }
  `]
})
export class NavbarMenuButtonComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
