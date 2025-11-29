import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PARCEIROS, PartnerLogo } from './parceiros.data';

@Component({
  selector: 'home-parceiros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parceiros.component.html',
  styleUrls: ['./parceiros.component.scss']
})
export class ParceirosComponent {
  parceiros = signal<PartnerLogo[]>(PARCEIROS);
}
