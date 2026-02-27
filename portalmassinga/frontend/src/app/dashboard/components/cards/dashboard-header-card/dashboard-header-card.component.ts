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
}

