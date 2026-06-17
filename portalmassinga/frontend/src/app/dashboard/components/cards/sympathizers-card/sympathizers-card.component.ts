import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface SympathizersStats {
  total: number;
  ativos: number;
  novosEsteMes: number;
  comunicacoes: number;
}

@Component({
  selector: 'app-sympathizers-card',
  standalone: false,
  templateUrl: './sympathizers-card.component.html',
  styleUrls: ['./sympathizers-card.component.scss']
})
export class SympathizersCardComponent {
  @Input() stats: SympathizersStats = {
    total: 0,
    ativos: 0,
    novosEsteMes: 0,
    comunicacoes: 0
  };

  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
