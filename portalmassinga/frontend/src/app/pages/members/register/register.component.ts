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

    // Mapear campos do frontend para o formato da tabela membros
    const membroData = this.mapToMembroFormat(this.formData);

    console.log('📤 Enviando cadastro de membro:', membroData);

    this.apiClient.criarMembro(membroData).subscribe({
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

  private mapToMembroFormat(formData: any): any {
    // Mapear campos do frontend para o formato da tabela membros (português/camelCase)
    return {
      foto: formData.foto || null,
      nomeCompleto: formData.nome,
      nomePai: formData.nome_pai,
      nomeMae: formData.nome_mae,
      dataNascimento: formData.data_nascimento || null,
      estadoCivil: formData.estado_civil,
      profissao: formData.profissao,
      celular: formData.celular,
      email: formData.email,
      telefone: formData.telefone || null,
      rua: formData.rua,
      bairro: formData.bairro,
      cidade: formData.cidade,
      nomeConjuge: formData.nome_conjuge || null,
      dataNascimentoConjuge: formData.data_nascimento_conjuge || null,
      filiacaoPaiConjuge: formData.filiacao_pai_conjuge || null,
      filiacaoMaeConjuge: formData.filiacao_mae_conjuge || null,
      localTrabalho: formData.local_trabalho || null,
      cargo: formData.cargo || null,
      enderecoTrabalho: formData.endereco_trabalho || null,
      telefoneTrabalho: formData.telefone_trabalho || null,
      outrasInformacoes: formData.outras_informacoes || null,
      aceitaTermos: formData.aceita_termos || false
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
