import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-clock',
  template: `
    <div class="datetime-block">
      <div class="clock-icon-wrap">
        <mat-icon>schedule</mat-icon>
      </div>
      <div class="datetime-text">
        <div class="time-line">{{ currentTime }}</div>
        <div class="date-line">{{ currentDate }}</div>
      </div>
    </div>
  `,
  styles: [`
    .datetime-block {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.4rem 0.875rem;
      background: rgba(5, 150, 105, 0.06);
      border: 1px solid rgba(5, 150, 105, 0.15);
      border-radius: 12px;
    }

    .clock-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #059669;
      display: grid;
      place-items: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 17px;
        width: 17px;
        height: 17px;
        color: white;
      }
    }

    .datetime-text {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .time-line {
      font-size: 1.1rem;
      font-weight: 700;
      color: #059669;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.02em;
      line-height: 1.2;
    }

    .date-line {
      font-size: 0.7rem;
      font-weight: 500;
      color: #475569;
      line-height: 1.3;
      max-width: 140px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .datetime-block {
        padding: 0.35rem 0.625rem;
        gap: 0.5rem;
      }

      .clock-icon-wrap {
        width: 28px;
        height: 28px;

        mat-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
        }
      }

      .time-line {
        font-size: 1rem;
      }

      .date-line {
        font-size: 0.65rem;
        max-width: 120px;
      }
    }

    @media (max-width: 600px) {
      .date-line {
        display: none;
      }
    }
  `]
})
export class NavbarClockComponent implements OnInit, OnDestroy {
  currentTime = '';
  currentDate = '';
  private intervalId: ReturnType<typeof setInterval> | null = null;

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
    const dateStr = now.toLocaleDateString('pt-MZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    this.currentDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }
}
