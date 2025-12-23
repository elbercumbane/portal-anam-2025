import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class MembersHomeComponent {
  @Output() navigationClick = new EventEmitter<any>();

  constructor() {}
}

