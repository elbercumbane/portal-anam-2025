import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface AssociationStats {
  totalMembros: number;
  novosEsteMes: number;
  crescimento: number;
  membrosAtivos: number;
}

@Component({
  selector: 'app-members-card',
  standalone: false,
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.scss']
})
export class MembersCardComponent {
  @Input() stats: AssociationStats = {
    totalMembros: 0,
    novosEsteMes: 0,
    crescimento: 0,
    membrosAtivos: 0
  };

  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}

