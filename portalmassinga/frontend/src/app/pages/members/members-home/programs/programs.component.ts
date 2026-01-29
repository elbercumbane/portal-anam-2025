import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProgramsComponent {
  @Input() programs: any[] = [];
}

