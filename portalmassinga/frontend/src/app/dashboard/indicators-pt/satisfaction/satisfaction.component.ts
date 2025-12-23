import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-indicators-satisfaction',
  standalone: false,
  templateUrl: './satisfaction.component.html',
  styleUrls: ['./satisfaction.component.scss']
})
export class IndicatorsSatisfactionComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

