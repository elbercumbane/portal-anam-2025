import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicators-general',
  standalone: false,
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class IndicatorsGeneralComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

