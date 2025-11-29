import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  formData = {
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    nuit: '',
    mensagem: ''
  };
  
  onSubmit() {
    console.log('Dados do formulário:', this.formData);
    // Aqui você implementaria a lógica de envio para o backend
    alert('Candidatura enviada com sucesso! Entraremos em contacto em breve.');
  }
}
