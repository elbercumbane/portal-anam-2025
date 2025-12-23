import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistorySectionComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Adicionar a classe is-visible após 1 segundo para animação
    setTimeout(() => {
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 1000);
  }
}
