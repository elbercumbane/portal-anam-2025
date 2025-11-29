import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-simple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-simple.component.html',
  styleUrl: './footer-simple.component.scss'
})
export class FooterSimpleComponent {
  currentYear = new Date().getFullYear();
}
