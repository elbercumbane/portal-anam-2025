import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  @Input() reports: any[] = [];

  baixarPdf(url: string, titulo: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = titulo + '.pdf';
    a.click();
  }
}
