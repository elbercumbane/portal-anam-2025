import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servico-card',
  standalone: false,
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() titulo: string = '';
  @Input() bullets: string[] = [];
  @Input() cta: string = 'Saber Mais';
}
