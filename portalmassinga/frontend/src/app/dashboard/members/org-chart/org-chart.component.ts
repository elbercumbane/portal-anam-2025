import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-org-chart',
  standalone: false,
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class MembersOrgChartComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

