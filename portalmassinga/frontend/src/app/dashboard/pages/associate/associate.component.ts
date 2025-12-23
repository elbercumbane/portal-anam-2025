import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-associate',
  standalone: false,
  templateUrl: './associate.component.html',
  styleUrls: ['./associate.component.scss']
})
export class AssociateComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

