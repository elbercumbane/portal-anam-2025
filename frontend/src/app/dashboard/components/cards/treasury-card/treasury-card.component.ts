import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface TreasuryStats {
  saldo: number;
  receitas: number;
  despesas: number;
  transacoes: number;
}

@Component({
  selector: 'app-treasury-card',
  standalone: false,
  templateUrl: './treasury-card.component.html',
  styleUrls: ['./treasury-card.component.scss']
})
export class TreasuryCardComponent {
  @Input() stats: TreasuryStats = {
    saldo: 0,
    receitas: 0,
    despesas: 0,
    transacoes: 0
  };

  @Input() formatCurrency: (value: number) => string = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }

  getBalanceChange(): number {
    return (this.stats?.receitas || 0) - (this.stats?.despesas || 0);
  }
}

