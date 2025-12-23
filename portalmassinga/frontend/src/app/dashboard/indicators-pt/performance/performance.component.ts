import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicators-performance',
  standalone: false,
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class IndicatorsPerformanceComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

