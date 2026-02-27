import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-clock',
  template: `
    <div class="datetime-block">
      <div class="time-line">{{ currentTime }}</div>
      <div class="date-line">{{ currentDate }}</div>
    </div>
  `,
  styles: [`
    .datetime-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      margin-right: 0.75rem;
      text-align: right;
    }

    .time-line {
      font-size: 1.25rem;
      font-weight: 700;
      color: #059669;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.02em;
      line-height: 1.25;
    }

    .date-line {
      font-size: 0.8rem;
      font-weight: 500;
      color: #334155;
      line-height: 1.3;
      margin-top: 0.1rem;
    }

    @media (max-width: 768px) {
      .datetime-block {
        margin-right: 0.5rem;
      }
      .time-line {
        font-size: 1.1rem;
      }
      .date-line {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .datetime-block {
        margin-right: 0.35rem;
      }
      .time-line {
        font-size: 1rem;
      }
      .date-line {
        font-size: 0.7rem;
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
