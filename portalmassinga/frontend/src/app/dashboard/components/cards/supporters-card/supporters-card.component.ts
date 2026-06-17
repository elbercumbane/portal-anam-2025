import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface SupportersStats {
  total: number;
  ativos: number;
  novosEsteMes: number;
  pendentes: number;
}

@Component({
  selector: 'app-supporters-card',
  standalone: false,
  templateUrl: './supporters-card.component.html',
  styleUrls: ['./supporters-card.component.scss']
})
export class SupportersCardComponent {
  @Input() stats: SupportersStats = {
    total: 0,
    ativos: 0,
    novosEsteMes: 0,
    pendentes: 0
  };

  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
