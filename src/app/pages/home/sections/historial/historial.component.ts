import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Adicionar a classe is-visible após 1 segundo para animação
    setTimeout(() => {
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 1000);
  }
}
