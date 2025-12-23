import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiClientService } from '../../../services/api-client.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formData = {
    // Dados pessoais obrigatórios
    nome: '',
    nome_pai: '',
    nome_mae: '',
    data_nascimento: '',
    estado_civil: '',
    profissao: '',
    // Contatos obrigatórios
    celular: '',
    email: '',
    telefone: '',
    rua: '',
    bairro: '',
    cidade: '',
    // Cônjuge (opcional)
    nome_conjuge: '',
    data_nascimento_conjuge: '',
    filiacao_pai_conjuge: '',
    filiacao_mae_conjuge: '',
    // Trabalho (opcional)
    local_trabalho: '',
    cargo: '',
    endereco_trabalho: '',
    telefone_trabalho: '',
    // Outros
    foto: '',
    outras_informacoes: '',
    aceita_termos: false
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiClient: ApiClientService,
    private router: Router
  ) {}
  
  onSubmit() {
    // Validar campos obrigatórios
    if (!this.formData.nome || !this.formData.nome_pai || !this.formData.nome_mae ||
        !this.formData.data_nascimento || !this.formData.estado_civil || !this.formData.profissao ||
        !this.formData.celular || !this.formData.email || !this.formData.rua ||
        !this.formData.bairro || !this.formData.cidade || !this.formData.aceita_termos) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios e aceite os termos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Preparar dados para envio
    const applicationData = {
      ...this.formData,
      // Garantir que aceita_termos seja boolean true
      aceita_termos: true,
      // Campos opcionais como null se vazios
      telefone: this.formData.telefone || null,
      nome_conjuge: this.formData.nome_conjuge || null,
      data_nascimento_conjuge: this.formData.data_nascimento_conjuge || null,
      filiacao_pai_conjuge: this.formData.filiacao_pai_conjuge || null,
      filiacao_mae_conjuge: this.formData.filiacao_mae_conjuge || null,
      local_trabalho: this.formData.local_trabalho || null,
      cargo: this.formData.cargo || null,
      endereco_trabalho: this.formData.endereco_trabalho || null,
      telefone_trabalho: this.formData.telefone_trabalho || null,
      outras_informacoes: this.formData.outras_informacoes || null,
      foto: this.formData.foto || null
    };

    console.log('📤 Enviando candidatura:', applicationData);

    this.apiClient.createApplication(applicationData).subscribe({
      next: (response) => {
        console.log('✅ Resposta do servidor:', response);
        if (response.success) {
          this.successMessage = 'Candidatura enviada com sucesso! Entraremos em contacto em breve.';
          // Limpar formulário
          this.formData = {
            nome: '',
            nome_pai: '',
            nome_mae: '',
            data_nascimento: '',
            estado_civil: '',
            profissao: '',
            celular: '',
            email: '',
            telefone: '',
            rua: '',
            bairro: '',
            cidade: '',
            nome_conjuge: '',
            data_nascimento_conjuge: '',
            filiacao_pai_conjuge: '',
            filiacao_mae_conjuge: '',
            local_trabalho: '',
            cargo: '',
            endereco_trabalho: '',
            telefone_trabalho: '',
            foto: '',
            outras_informacoes: '',
            aceita_termos: false
          };
          // Redirecionar após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/membros']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Erro ao enviar candidatura';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao criar candidatura:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          status: error.status,
          error: error.error,
          url: error.url
        });
        
        let errorMsg = 'Erro ao conectar com o servidor. Tente novamente.';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.errors && Array.isArray(error.error.errors)) {
          errorMsg = error.error.errors.map((e: any) => e.msg || e.message).join(', ');
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        this.errorMessage = errorMsg;
        this.isLoading = false;
      }
    });
  }
}
