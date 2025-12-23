import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners',
  standalone: false,
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

