import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programs',
  standalone: false,
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

