import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-treasury-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class TreasuryReportsComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

