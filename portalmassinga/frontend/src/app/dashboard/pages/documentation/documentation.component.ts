import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentation',
  standalone: false,
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

