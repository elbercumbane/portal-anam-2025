import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar-calendar',
  
  template: `
    <button 
      mat-icon-button 
      class="calendar-btn" 
      matTooltip="Calendário"
      (click)="onCalendarClick()">
      <mat-icon class="calendar-icon">calendar_today</mat-icon>
    </button>
  `,
  styles: [`
    .calendar-btn {
      color: #666;
      transition: all 0.3s ease;
      border-radius: 50%;
      
      &:hover {
        color: #28a745;
        background: rgba(40, 167, 69, 0.1);
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      .calendar-icon {
        color: #666;
        font-size: 1.4rem;
        transition: all 0.3s ease;
        
        &:hover {
          color: #28a745;
        }
      }
    }
    
    // Responsive
    @media (max-width: 768px) {
      .calendar-btn {
        .calendar-icon {
          font-size: 1.2rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .calendar-btn {
        .calendar-icon {
          font-size: 1.1rem;
        }
      }
    }
  `]
})
export class NavbarCalendarComponent {
  @Output() calendarClick = new EventEmitter<void>();

  onCalendarClick(): void {
    this.calendarClick.emit();
  }
}
