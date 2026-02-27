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
      color: #059669;
      margin-right: 0.5rem;
      transition: all 0.3s ease;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
    }
    .menu-btn:hover {
      color: #047857;
      background: rgba(5, 150, 105, 0.12);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
    }
    .menu-btn:active {
      transform: translateY(0) scale(0.98);
    }
    .menu-btn .menu-icon {
      color: #059669;
      font-size: 1.65rem;
      width: 1.65rem;
      height: 1.65rem;
      transition: all 0.3s ease;
    }
    .menu-btn:hover .menu-icon {
      color: #047857;
    }
    @media (max-width: 768px) {
      .menu-btn { margin-right: 0.4rem; }
      .menu-btn .menu-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
    @media (max-width: 480px) {
      .menu-btn .menu-icon {
        font-size: 1.4rem;
        width: 1.4rem;
        height: 1.4rem;
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
