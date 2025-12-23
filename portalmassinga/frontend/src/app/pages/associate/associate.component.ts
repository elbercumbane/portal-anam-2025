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
  isLoading = false;
  errorMessage = '';
  
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
    
    // Preparar dados do formulário no formato esperado pelo backend
    const formData = {
      // Mapear campos do formulário para o formato do backend
      nome: this.memberForm.value.nome,
      nome_pai: this.memberForm.value.nomePai,
      nome_mae: this.memberForm.value.nomeMae,
      data_nascimento: this.memberForm.value.dataNascimento,
      estado_civil: this.memberForm.value.estadoCivil,
      profissao: this.memberForm.value.profissao,
      celular: this.memberForm.value.celular,
      email: this.memberForm.value.email,
      telefone: this.memberForm.value.telefone || null,
      rua: this.memberForm.value.rua,
      bairro: this.memberForm.value.bairro,
      cidade: this.memberForm.value.cidade,
      // Cônjuge (opcional)
      nome_conjuge: this.memberForm.value.nomeConjuge || null,
      data_nascimento_conjuge: this.memberForm.value.dataNascimentoConjuge || null,
      filiacao_pai_conjuge: this.memberForm.value.filiacaoPaiConjuge || null,
      filiacao_mae_conjuge: this.memberForm.value.filiacaoMaeConjuge || null,
      // Trabalho (opcional)
      local_trabalho: this.memberForm.value.localTrabalho || null,
      cargo: this.memberForm.value.cargo || null,
      endereco_trabalho: this.memberForm.value.enderecoTrabalho || null,
      telefone_trabalho: this.memberForm.value.telefoneTrabalho || null,
      // Outros
      foto: this.photoPreview || null,
      outras_informacoes: this.memberForm.value.outrasInformacoes || null,
      aceita_termos: true // Já validado pelo canSubmit()
    };

    console.log('📤 Enviando candidatura do formulário "Torne-se Membro":', formData);

    this.apiClient.createApplication(formData).subscribe({
      next: (response) => {
        console.log('✅ Resposta do servidor:', response);
        if (response.success) {
          this.showSuccessModal = true;
          // Limpar formulário após sucesso
          setTimeout(() => {
            this.memberForm.reset();
            this.photoPreview = null;
            this.showSuccessModal = false;
            // Opcional: redirecionar para home
            // this.router.navigate(['/']);
          }, 3000);
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

  // Método para obter candidaturas salvas (útil para demonstração)
  getStoredApplications(): any[] {
    const stored = localStorage.getItem('anam_applications');
    return stored ? JSON.parse(stored) : [];
  }

  // Método para limpar todas as candidaturas (útil para testes)
  clearStoredApplications(): void {
    localStorage.removeItem('anam_applications');
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.memberForm.reset();
    this.photoPreview = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
