import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-santa-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './santa-popup.component.html',
  styleUrl: './santa-popup.component.scss'
})
export class SantaPopupComponent implements OnInit {
  @Input() message: string = 'Feliz Natal e Próspero 2025 🎄';
  isVisible = true; // Sempre visível
  showMessage = true; // Mensagem sempre visível

  ngOnInit() {
    // Aparecer imediatamente
    this.isVisible = true;
    // Mostrar mensagem após pequeno delay para animação
    setTimeout(() => {
      this.showMessage = true;
    }, 500);
  }
}

