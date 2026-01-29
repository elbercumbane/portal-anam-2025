import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  memberForm!: FormGroup;
  photoPreview: string | null = null;
  memberData: any = null;
  isEditing = false;
  showSuccessMessage = false;
  
  // Seções expansíveis
  showConjugeSection = false;
  showDependentesSection = false;
  showTrabalhoSection = false;
  showOutrasSection = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificação de autenticação removida - acesso permitido
    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['/login']);
    //   return;
    // }

    // Carregar dados do membro
    this.loadMemberDataFromStorage();
    
    if (!this.memberData) {
      // Tentar busca mais ampla
      this.loadMemberDataWithFallback();
      if (!this.memberData) {
        console.error('Dados não encontrados. Email do usuário:', this.authService.getCurrentUser()?.email);
        console.error('Aplicações no localStorage:', localStorage.getItem('anam_applications'));
        alert('Dados do membro não encontrados. Por favor, verifique se o email usado no login corresponde ao email do cadastro.');
        this.router.navigate(['/membros']);
        return;
      }
    }

    this.initForm();
    this.loadMemberData();
  }

  private loadMemberDataFromStorage(): void {
    // Primeiro tentar buscar do currentMemberData
    this.memberData = this.authService.getCurrentMemberData();
    
    // Se não encontrar, buscar diretamente do localStorage pelo email
    if (!this.memberData) {
      const user = this.authService.getCurrentUser();
      if (user?.email) {
        const stored = localStorage.getItem('anam_applications');
        if (stored) {
          try {
            const applications = JSON.parse(stored);
            // Busca case-insensitive
            const emailLower = user.email.toLowerCase().trim();
            this.memberData = applications.find((app: any) => {
              if (!app.email) return false;
              return app.email.toLowerCase().trim() === emailLower;
            }) || null;
            
            // Se encontrar, salvar no currentMemberData para próximas vezes
            if (this.memberData) {
              localStorage.setItem('currentMemberData', JSON.stringify(this.memberData));
              console.log('Dados do membro encontrados e salvos:', this.memberData);
            } else {
              console.warn('Email não encontrado nas aplicações. Email procurado:', emailLower);
              console.warn('Emails disponíveis:', applications.map((app: any) => app.email));
            }
          } catch (error) {
            console.error('Erro ao parsear aplicações:', error);
          }
        }
      }
    } else {
      console.log('Dados do membro carregados do currentMemberData');
    }
  }

  private loadMemberDataWithFallback(): void {
    // Busca alternativa: tentar pelo nome também
    const user = this.authService.getCurrentUser();
    if (user?.nome) {
      const stored = localStorage.getItem('anam_applications');
      if (stored) {
        try {
          const applications = JSON.parse(stored);
          const nomeLower = user.nome.toLowerCase().trim();
          // Buscar pelo nome (último recurso)
          this.memberData = applications.find((app: any) => {
            if (!app.nome) return false;
            return app.nome.toLowerCase().trim() === nomeLower;
          }) || null;
          
          if (this.memberData) {
            localStorage.setItem('currentMemberData', JSON.stringify(this.memberData));
            console.log('Dados encontrados pelo nome:', this.memberData);
          }
        } catch (error) {
          console.error('Erro ao buscar por nome:', error);
        }
      }
    }
  }

  private initForm(): void {
    this.memberForm = this.fb.group({
      // Dados Pessoais
      foto: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      nomePai: ['', Validators.required],
      nomeMae: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      profissao: ['', Validators.required],

      // Contatos
      celular: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],

      // Cônjuge
      nomeConjuge: [''],
      dataNascimentoConjuge: [''],
      filiacaoPaiConjuge: [''],
      filiacaoMaeConjuge: [''],

      // Dependentes
      dependentes: this.fb.array([]),

      // Trabalho
      localTrabalho: [''],
      cargo: [''],
      enderecoTrabalho: [''],
      telefoneTrabalho: [''],

      // Outras Informações
      outrasInformacoes: ['']
    });
  }

  private loadMemberData(): void {
    if (this.memberData) {
      // Foto
      if (this.memberData.foto) {
        this.photoPreview = this.memberData.foto;
      }

      // Preencher formulário
      this.memberForm.patchValue({
        nome: this.memberData.nome || '',
        nomePai: this.memberData.nomePai || '',
        nomeMae: this.memberData.nomeMae || '',
        dataNascimento: this.memberData.dataNascimento || '',
        estadoCivil: this.memberData.estadoCivil || '',
        profissao: this.memberData.profissao || '',
        celular: this.memberData.celular || '',
        email: this.memberData.email || '',
        telefone: this.memberData.telefone || '',
        rua: this.memberData.rua || '',
        bairro: this.memberData.bairro || '',
        cidade: this.memberData.cidade || '',
        nomeConjuge: this.memberData.nomeConjuge || '',
        dataNascimentoConjuge: this.memberData.dataNascimentoConjuge || '',
        filiacaoPaiConjuge: this.memberData.filiacaoPaiConjuge || '',
        filiacaoMaeConjuge: this.memberData.filiacaoMaeConjuge || '',
        localTrabalho: this.memberData.localTrabalho || '',
        cargo: this.memberData.cargo || '',
        enderecoTrabalho: this.memberData.enderecoTrabalho || '',
        telefoneTrabalho: this.memberData.telefoneTrabalho || '',
        outrasInformacoes: this.memberData.outrasInformacoes || ''
      });

      // Carregar dependentes
      if (this.memberData.dependentes && this.memberData.dependentes.length > 0) {
        this.memberData.dependentes.forEach((dep: any) => {
          this.addDependente(dep);
        });
        this.showDependentesSection = true;
      }

      // Mostrar seções que têm dados
      if (this.memberData.nomeConjuge || this.memberData.dataNascimentoConjuge) {
        this.showConjugeSection = true;
      }
      if (this.memberData.localTrabalho || this.memberData.cargo) {
        this.showTrabalhoSection = true;
      }
      if (this.memberData.outrasInformacoes) {
        this.showOutrasSection = true;
      }
    }
  }

  get dependentes(): FormArray {
    return this.memberForm.get('dependentes') as FormArray;
  }

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

  addDependente(dependente?: any): void {
    const dependenteGroup = this.fb.group({
      nome: [dependente?.nome || ''],
      parentesco: [dependente?.parentesco || ''],
      profissao: [dependente?.profissao || ''],
      idade: [dependente?.idade || '']
    });
    this.dependentes.push(dependenteGroup);
  }

  removeDependente(index: number): void {
    this.dependentes.removeAt(index);
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('photo-input') as HTMLInputElement;
    fileInput?.click();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Se saiu do modo de edição, recarregar dados originais
      this.loadMemberData();
    }
  }

  onSubmit(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }

    // Preparar dados atualizados
    const updatedData = {
      ...this.memberData,
      ...this.memberForm.value,
      foto: this.photoPreview || this.memberData.foto,
      dataAtualizacao: new Date().toISOString()
    };

    // Atualizar no localStorage
    this.authService.updateMemberData(updatedData);

    this.showSuccessMessage = true;
    this.isEditing = false;

    // Ocultar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadMemberData();
  }

  getEstadoCivilLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'solteiro': 'Solteiro(a)',
      'casado': 'Casado(a)',
      'uniao_marital': 'União Marital',
      'viuvo': 'Viúvo(a)',
      'divorciado': 'Divorciado(a)'
    };
    return labels[value] || value;
  }

  getParentescoLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'filho': 'Filho(a)',
      'enteado': 'Enteado(a)',
      'outro': 'Outro'
    };
    return labels[value] || value;
  }
}

