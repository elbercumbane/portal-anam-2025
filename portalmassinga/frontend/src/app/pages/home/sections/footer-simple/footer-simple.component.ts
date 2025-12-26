import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer-simple',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './footer-simple.component.html',
  styleUrl: './footer-simple.component.scss'
})
export class FooterSimpleComponent {
  currentYear = new Date().getFullYear();
  
  mensagemEnviada: boolean = false;
  nome: string = '';
  email: string = '';
  mensagem: string = '';

  isFormValid(): boolean {
    return !!(this.nome.trim() && this.email.trim() && this.mensagem.trim());
  }

  enviarMensagem() {
    if (this.isFormValid()) {
      // Simular envio da mensagem
      console.log('Mensagem enviada:', {
        nome: this.nome,
        email: this.email,
        mensagem: this.mensagem
      });
      
      // Aqui você pode chamar sua API existente
      // Simular delay de envio
      setTimeout(() => {
        this.mensagemEnviada = true;
      }, 500);
    }
  }

  resetarFormulario() {
    this.mensagemEnviada = false;
    this.nome = '';
    this.email = '';
    this.mensagem = '';
  }
}
