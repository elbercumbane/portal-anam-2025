import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-associate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './associate.component.html',
  styleUrl: './associate.component.scss'
})
export class AssociateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  memberForm!: FormGroup;
  photoPreview: string | null = null;
  showSuccessModal = false;
  showErrorModal = false;
  isLoading = false;
  errorMessage = '';
  private modalTimeoutId: any = null;
  
  // Seções expansíveis
  showConjugeSection = false;
  showDependentesSection = false;
  showTrabalhoSection = false;
  showOutrasSection = false;

  constructor(
    private fb: FormBuilder,
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.memberForm = this.fb.group({
      // Dados Pessoais (Obrigatório)
      foto: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      nomePai: ['', Validators.required],
      nomeMae: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      profissao: ['', Validators.required],

      // Contatos (Obrigatório)
      celular: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],

      // Cônjuge (Opcional)
      nomeConjuge: [''],
      dataNascimentoConjuge: [''],
      filiacaoPaiConjuge: [''],
      filiacaoMaeConjuge: [''],

      // Dependentes (Opcional)
      dependentes: this.fb.array([]),

      // Trabalho (Opcional)
      localTrabalho: [''],
      cargo: [''],
      enderecoTrabalho: [''],
      telefoneTrabalho: [''],

      // Outras Informações (Opcional)
      outrasInformacoes: [''],

      // Confirmação
      aceitaTermos: [false, Validators.requiredTrue]
    });
  }

  // Getters
  get dependentes(): FormArray {
    return this.memberForm.get('dependentes') as FormArray;
  }

  // Toggle sections
  toggleSection(section: string): void {
    switch (section) {
      case 'conjuge':
        this.showConjugeSection = !this.showConjugeSection;
        break;
      case 'dependentes':
        this.showDependentesSection = !this.showDependentesSection;
        break;
      case 'trabalho':
        this.showTrabalhoSection = !this.showTrabalhoSection;
        break;
      case 'outras':
        this.showOutrasSection = !this.showOutrasSection;
        break;
    }
  }

  // Dependentes
  addDependente(): void {
    const dependenteGroup = this.fb.group({
      nome: [''],
      parentesco: [''],
      profissao: [''],
      idade: ['']
    });
    this.dependentes.push(dependenteGroup);
  }

  removeDependente(index: number): void {
    this.dependentes.removeAt(index);
  }

  // Photo handling
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        alert('A foto deve ter no máximo 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
        this.memberForm.patchValue({ foto: file });
      };
      reader.readAsDataURL(file);
    }
  }

  canSubmit(): boolean {
    const requiredFields = ['nome', 'nomePai', 'nomeMae', 'dataNascimento', 'estadoCivil', 'profissao', 'celular', 'email', 'rua', 'bairro', 'cidade'];
    
    for (const field of requiredFields) {
      const control = this.memberForm.get(field);
      if (!control?.value) {
        return false;
      }
    }
    
    return this.memberForm.get('aceitaTermos')?.value === true;
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      // Marcar campos obrigatórios como touched para mostrar erros
      Object.keys(this.memberForm.controls).forEach(key => {
        const control = this.memberForm.get(key);
        control?.markAsTouched();
      });
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios e aceite os termos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showSuccessModal = false;
    
    // Mapear campos do formulário para o formato esperado pelo backend (tabela membros)
    const membroData = this.mapToMembroFormat(this.memberForm.value);

    console.log('📤 Enviando candidatura do formulário "Torne-se Membro":', membroData);
    console.log('🌐 URL da API:', 'http://localhost:8081/api/membros');

    this.apiClient.criarMembro(membroData).subscribe({
      next: (response) => {
        console.log('✅ Resposta do servidor:', response);
        this.isLoading = false;
        
        // Mostrar modal de sucesso
        this.showSuccessModal = true;
        this.errorMessage = '';
        
        // Limpar formulário após 10 segundos (se o modal não foi fechado manualmente)
        this.modalTimeoutId = setTimeout(() => {
          if (this.showSuccessModal) {
            this.closeModal();
          }
        }, 10000);
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
        this.showSuccessModal = false;
        
        let errorMsg = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
        if (error.status === 0) {
          errorMsg = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8081';
        } else if (error.status === 409) {
          errorMsg = 'Este email já está cadastrado! Por favor, use outro email.';
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
        // Mostrar modal de erro
        this.showErrorModal = true;
      }
    });
  }

  private mapToMembroFormat(formValue: any): any {
    // Mapear campos do formulário para o formato da tabela membros (português/camelCase)
    return {
      foto: this.photoPreview || null,
      nomeCompleto: formValue.nome,
      nomePai: formValue.nomePai,
      nomeMae: formValue.nomeMae,
      dataNascimento: formValue.dataNascimento || null,
      estadoCivil: formValue.estadoCivil,
      profissao: formValue.profissao,
      celular: formValue.celular,
      email: formValue.email,
      telefone: formValue.telefone || null,
      rua: formValue.rua,
      bairro: formValue.bairro,
      cidade: formValue.cidade,
      nomeConjuge: formValue.nomeConjuge || null,
      dataNascimentoConjuge: formValue.dataNascimentoConjuge || null,
      filiacaoPaiConjuge: formValue.filiacaoPaiConjuge || null,
      filiacaoMaeConjuge: formValue.filiacaoMaeConjuge || null,
      localTrabalho: formValue.localTrabalho || null,
      cargo: formValue.cargo || null,
      enderecoTrabalho: formValue.enderecoTrabalho || null,
      telefoneTrabalho: formValue.telefoneTrabalho || null,
      outrasInformacoes: formValue.outrasInformacoes || null,
      aceitaTermos: formValue.aceitaTermos || false
    };
  }

  closeModal(): void {
    // Cancelar timeout se o modal for fechado manualmente
    if (this.modalTimeoutId) {
      clearTimeout(this.modalTimeoutId);
      this.modalTimeoutId = null;
    }
    
    this.showSuccessModal = false;
    this.showErrorModal = false;
    this.memberForm.reset();
    this.photoPreview = null;
    this.errorMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }
}
