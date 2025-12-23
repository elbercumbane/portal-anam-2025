import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicators-metrics',
  standalone: false,
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class IndicatorsMetricsComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

