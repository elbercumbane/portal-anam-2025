import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Partner {
  nome: string;
  tipo: string;
  ativo: boolean;
}

@Component({
  selector: 'app-partners-card',
  standalone: false,
  templateUrl: './partners-card.component.html',
  styleUrls: ['./partners-card.component.scss']
})
export class PartnersCardComponent {
  @Input() partners: Partner[] = [];

  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }

  getActivePartners(): number {
    return this.partners?.filter(p => p.ativo).length || 0;
  }

  getInactivePartners(): number {
    return (this.partners?.length || 0) - this.getActivePartners();
  }
}

