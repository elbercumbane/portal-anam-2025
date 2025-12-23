import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applications',
  standalone: false,
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

