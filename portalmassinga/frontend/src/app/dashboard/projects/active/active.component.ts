import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active',
  standalone: false,
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

