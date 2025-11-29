import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface DashboardStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

@Component({
  selector: 'app-stats-cards',
  
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.scss']
})
export class StatsCardsComponent {
  @Input() stats: DashboardStats = {
    totalFormularios: 0,
    formulariosAtivos: 0,
    formulariosInativos: 0,
    totalRespostas: 0,
    taxaResposta: 0,
    ultimaAtualizacao: new Date()
  };
}
