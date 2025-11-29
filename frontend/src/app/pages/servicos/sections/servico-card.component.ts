import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servico-card',
  standalone: false,
  templateUrl: './servico-card.component.html',
  styleUrl: './servico-card.component.scss'
})
export class ServicoCardComponent {
  @Input() titulo: string = '';
  @Input() bullets: string[] = [];
  @Input() cta: string = 'Saber Mais';
}
