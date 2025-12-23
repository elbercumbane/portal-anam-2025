import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-header-card',
  standalone: false,
  templateUrl: './dashboard-header-card.component.html',
  styleUrls: ['./dashboard-header-card.component.scss']
})
export class DashboardHeaderCardComponent {
  @Input() greeting: string = 'Boa tarde';
  @Input() userName: string = 'Usuário';
  @Input() currentDate: Date = new Date();

  getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return this.currentDate.toLocaleDateString('pt-MZ', options);
  }

  getFormattedTime(): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return this.currentDate.toLocaleTimeString('pt-MZ', options);
  }
}

