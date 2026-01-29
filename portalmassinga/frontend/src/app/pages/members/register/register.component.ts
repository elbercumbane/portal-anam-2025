import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiClientService } from '../../../services/api-client.service';
import { ToastService } from '../../../services/toast.service';

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
    private router: Router,
    private toastService: ToastService
  ) {}
  
  onSubmit() {
    // Validar campos obrigatórios
    if (!this.formData.nome || !this.formData.nome_pai || !this.formData.nome_mae ||
        !this.formData.data_nascimento || !this.formData.estado_civil || !this.formData.profissao ||
        !this.formData.celular || !this.formData.email || !this.formData.rua ||
        !this.formData.bairro || !this.formData.cidade || !this.formData.aceita_termos) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios e aceite os termos.';
      this.toastService.error('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Mapear campos do frontend (português) para backend (inglês)
    const applicationData = this.mapToBackendFormat(this.formData);

    console.log('📤 Enviando candidatura:', applicationData);

    this.apiClient.createApplication(applicationData).subscribe({
      next: (response) => {
        console.log('✅ Resposta do servidor:', response);
        this.isLoading = false;
        
        // O backend retorna a entidade diretamente, não um objeto com 'success'
        this.toastService.success('Candidatura enviada com sucesso! Entraremos em contacto em breve.');
        this.successMessage = 'Candidatura enviada com sucesso! Entraremos em contacto em breve.';
        
        // Limpar formulário
        this.resetForm();
        
        // Redirecionar após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/membros']);
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Erro ao criar candidatura:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          status: error.status,
          error: error.error,
          url: error.url
        });
        
        this.isLoading = false;
        
        let errorMsg = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
        if (error.status === 0) {
          errorMsg = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.errors && Array.isArray(error.error.errors)) {
          errorMsg = error.error.errors.map((e: any) => e.msg || e.message || e.defaultMessage).join(', ');
        } else if (error.message) {
          errorMsg = error.message;
        } else if (typeof error.error === 'string') {
          errorMsg = error.error;
        }
        
        this.errorMessage = errorMsg;
        this.toastService.error(errorMsg);
      }
    });
  }

  private mapToBackendFormat(formData: any): any {
    // Mapear campos do frontend (português) para backend (inglês/camelCase)
    return {
      photo: formData.foto || null,
      fullName: formData.nome,
      fatherName: formData.nome_pai,
      motherName: formData.nome_mae,
      birthDate: formData.data_nascimento || null,
      maritalStatus: formData.estado_civil,
      profession: formData.profissao,
      mobilePhone: formData.celular,
      email: formData.email,
      phone: formData.telefone || null,
      street: formData.rua,
      neighborhood: formData.bairro,
      city: formData.cidade,
      spouseName: formData.nome_conjuge || null,
      spouseBirthDate: formData.data_nascimento_conjuge || null,
      spouseFatherName: formData.filiacao_pai_conjuge || null,
      spouseMotherName: formData.filiacao_mae_conjuge || null,
      workplace: formData.local_trabalho || null,
      position: formData.cargo || null,
      workAddress: formData.endereco_trabalho || null,
      workPhone: formData.telefone_trabalho || null,
      additionalInformation: formData.outras_informacoes || null,
      acceptsTerms: formData.aceita_termos || false,
      dependents: [] // Por enquanto vazio, pode ser implementado depois
    };
  }

  private resetForm() {
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
  }
}
