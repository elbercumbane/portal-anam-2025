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
      color: #0891B2;
      margin-right: 1rem;
      transition: all 0.3s ease;
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
      
      .menu-icon {
        color: #0891B2;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          animation: rotate 0.3s ease-in-out;
          color: #05B6D4;
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
