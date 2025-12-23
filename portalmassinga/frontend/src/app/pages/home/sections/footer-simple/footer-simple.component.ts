import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer-simple',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './footer-simple.component.html',
  styleUrl: './footer-simple.component.scss'
})
export class FooterSimpleComponent {
  currentYear = new Date().getFullYear();
}
