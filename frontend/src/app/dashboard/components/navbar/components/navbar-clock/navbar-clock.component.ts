import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-clock',
  
  template: `
    <div class="clock-container">
      <mat-icon class="clock-icon">schedule</mat-icon>
      <span class="time-display">{{ currentTime }}</span>
    </div>
  `,
  styles: [`
    .clock-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-right: 0.5rem;
      
      .clock-icon {
        color: #05B6D4;
        font-size: 1.2rem;
        transition: all 0.3s ease;
      }
      
      .time-display {
        color: #05B6D4;
        font-weight: 600;
        font-size: 0.9rem;
        font-family: 'Courier New', monospace;
        letter-spacing: 0.5px;
      }
    }
    
    @media (max-width: 768px) {
      .clock-container {
        margin-right: 0.25rem;
        gap: 0.4rem;
        
        .clock-icon {
          font-size: 1.1rem;
        }
        
        .time-display {
          font-size: 0.85rem;
        }
      }
    }
    
    @media (max-width: 480px) {
      .clock-container {
        margin-right: 0.15rem;
        gap: 0.3rem;
        
        .clock-icon {
          font-size: 1rem;
        }
        
        .time-display {
          font-size: 0.8rem;
        }
      }
    }
  `]
})
export class NavbarClockComponent implements OnInit, OnDestroy {
  currentTime = '';
  private intervalId: any;

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('pt-MZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
}
