import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-associar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './associar.component.html',
  styleUrl: './associar.component.scss'
})
export class AssociarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  memberForm!: FormGroup;
  photoPreview: string | null = null;
  showSuccessModal = false;
  
  // Seções expansíveis
  showConjugeSection = false;
  showDependentesSection = false;
  showTrabalhoSection = false;
  showOutrasSection = false;

  constructor(private fb: FormBuilder) {}

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
    if (this.canSubmit()) {
      console.log('Form submitted:', this.memberForm.value);
      this.showSuccessModal = true;
    } else {
      // Marcar campos obrigatórios como touched para mostrar erros
      Object.keys(this.memberForm.controls).forEach(key => {
        const control = this.memberForm.get(key);
        control?.markAsTouched();
      });
      alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
    }
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.memberForm.reset();
    this.photoPreview = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
