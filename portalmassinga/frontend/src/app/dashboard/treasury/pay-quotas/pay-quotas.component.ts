import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pay-quotas',
  standalone: false,
  templateUrl: './pay-quotas.component.html',
  styleUrls: ['./pay-quotas.component.scss']
})
export class PayQuotasComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

