import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
// ApiService removido - sem backend
export interface HomeHeaderTexts {
  texto: string;
}

export interface HomeCard {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  imagem: string;
  ativo: boolean;
  ordem: number;
}

export interface Problema {
  id: string;
  nome: string;
  tipo: string;
  dataCriacao: Date;
  descricao?: string;
}

interface FormularioConfig {
  id: string;
  nome: string;
  problemas: Problema[];
}

@Component({
  selector: 'app-form-management',
  templateUrl: './form-management.component.html',
  styleUrls: ['./form-management.component.scss']
})
export class FormManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() navigationClick = new EventEmitter<any>();
  
  selectedTabIndex = 0;
  
  // Textos do cabeçalho da Home
  homeHeaderTexts: HomeHeaderTexts = {
    texto: 'Sistema de Avaliação da Qualidade dos Serviços do CEDSIF, IP\n\nBem-vindo ao questionário da pesquisa de satisfação. Sua opinião é muito importante para melhor servi-lo.\n\nAgradecemos que reserve alguns minutos para responder o questionário. Quem nos avalia?'
  };
  
  // Dados da Home
  homeCards: HomeCard[] = [
    {
      id: 'fae',
      tipo: 'fae',
      titulo: 'Funcionário e Agente de Estado',
      descricao: 'Cidadão provido para o quadro de pessoal do Estado ou contratado que desempenha actividades nos órgãos centrais ou locais do Estado.',
      imagem: 'assets/images/Delcia.jpeg',
      ativo: true,
      ordem: 1
    },
    {
      id: 'agente',
      tipo: 'agente',
      titulo: 'Agente Económico',
      descricao: 'Indivíduos ou empresas que têm ou pretendem estabelecer uma relação com o Estado no âmbito da Contratação de Empreitada de Obras Públicas, Fornecimento de Bens e Prestação de Serviços.',
      imagem: 'assets/images/Credor __.jpeg',
      ativo: true,
      ordem: 2
    },
    {
      id: 'utilizador',
      tipo: 'utilizador',
      titulo: 'Utilizador',
      descricao: 'Funcionário e Agente do Estado ou colaborador com vínculo laboral com um órgão ou instituição do Estado ou entidade descentralizada que opera o e-SISTAFE ou outros sistemas complementares.',
      imagem: 'assets/images/utilizador.jpeg',
      ativo: true,
      ordem: 3
    },
    {
      id: 'training',
      tipo: 'training',
      titulo: 'Formando',
      descricao: 'Funcionário e Agente Estado ou colaborador com vínculo laboral com um órgão ou instituição do Estado ou entidade descentralizada que recebeu treinamento específico para operar o e-SISTAFE ou outros sistemas complementares.',
      imagem: 'assets/images/formado.jpg',
      ativo: true,
      ordem: 4
    }
  ];

  // Configuração dos formulários
  formularios: { [key: string]: FormularioConfig } = {
    fae: {
      id: 'fae',
      nome: 'FAE',
      problemas: [
        { id: '1', nome: 'Problema com documentação', tipo: 'documentacao', dataCriacao: new Date('2025-09-20') },
        { id: '2', nome: 'Dificuldade no atendimento', tipo: 'atendimento', dataCriacao: new Date('2025-09-19') },
        { id: '3', nome: 'Demora na resolução', tipo: 'resolucao', dataCriacao: new Date('2025-09-18') },
        { id: '4', nome: 'Falta de informações', tipo: 'informacao', dataCriacao: new Date('2025-09-17') },
        { id: '5', nome: 'Problema técnico', tipo: 'tecnico', dataCriacao: new Date('2025-09-16') },
        { id: '6', nome: 'Outros', tipo: 'outros', dataCriacao: new Date('2025-09-15') }
      ]
    },
    'economic-agent': {
      id: 'economic-agent',
      nome: 'Agente Econômico',
      problemas: [
        { id: '1', nome: 'Problema com documentação', tipo: 'documentacao', dataCriacao: new Date('2025-09-20') },
        { id: '2', nome: 'Dificuldade no atendimento', tipo: 'atendimento', dataCriacao: new Date('2025-09-19') },
        { id: '3', nome: 'Demora na resolução', tipo: 'resolucao', dataCriacao: new Date('2025-09-18') },
        { id: '4', nome: 'Falta de informações', tipo: 'informacao', dataCriacao: new Date('2025-09-17') },
        { id: '5', nome: 'Problema técnico', tipo: 'tecnico', dataCriacao: new Date('2025-09-16') },
        { id: '6', nome: 'Outros', tipo: 'outros', dataCriacao: new Date('2025-09-15') }
      ]
    },
    training: {
      id: 'training',
      nome: 'Formação',
      problemas: []
    },
    'user-evaluation': {
      id: 'user-evaluation',
      nome: 'Avaliação de Utilizador',
      problemas: []
    }
  };

  // Modal states
  modalAberto = false;
  modalImagemAberto = false;
  modalProblemaAberto = false;
  isHeaderEditing = false;
  isSavingHeaderTexts = false;
  cardEditando: HomeCard | null = null;
  problemaEditando: Problema | null = null;
  formularioSelecionado = '';
  headerTextValue = this.homeHeaderTexts.texto;
  
  // Image upload
  imagemPreview: string | null = null;
  arquivoSelecionado: File | null = null;

  // Form for new problem
  problemaForm: FormGroup;

  // Loading states
  isLoading = false;
  saveError: string | null = null;

  constructor(
    private fb: FormBuilder,
    // ApiService removido
  ) {
    this.problemaForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      tipo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load data from localStorage or API
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadData(): Promise<void> {
    this.isLoading = true;
    this.saveError = null;

    try {
      // Sem backend - dados vazios ou do localStorage
      // Carregar do localStorage se existir
      const savedHeaderTexts = localStorage.getItem('homeHeaderTexts');
      if (savedHeaderTexts) {
        this.homeHeaderTexts = JSON.parse(savedHeaderTexts);
        this.headerTextValue = this.homeHeaderTexts.texto;
      }

      const savedCards = localStorage.getItem('homeCards');
      if (savedCards) {
        this.homeCards = JSON.parse(savedCards);
      }

      // Problemas vazios por padrão
      for (const formType of Object.keys(this.formularios)) {
        const savedProblems = localStorage.getItem(`formProblems_${formType}`);
        if (savedProblems) {
          this.formularios[formType].problemas = JSON.parse(savedProblems);
        }
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      this.saveError = 'Erro ao carregar dados.';
    } finally {
      this.isLoading = false;
    }
  }

  private async saveData(): Promise<void> {
    this.saveError = null;

    try {
      // Sem backend - salvar no localStorage
      localStorage.setItem('homeHeaderTexts', JSON.stringify(this.homeHeaderTexts));
      localStorage.setItem('homeCards', JSON.stringify(this.homeCards));
      
      // Salvar problemas de cada formulário
      for (const formType of Object.keys(this.formularios)) {
        localStorage.setItem(`formProblems_${formType}`, JSON.stringify(this.formularios[formType].problemas));
      }

      console.log('Dados salvos com sucesso no localStorage');
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      this.saveError = 'Erro ao salvar. Por favor, tente novamente.';
    }
  }

  // Home management
  iniciarEdicaoHeaderTexts(): void {
    this.headerTextValue = this.homeHeaderTexts.texto;
    this.isHeaderEditing = true;
  }

  cancelarEdicaoHeaderTexts(): void {
    this.isHeaderEditing = false;
    this.headerTextValue = this.homeHeaderTexts.texto;
  }

  async salvarHeaderTextsInline(): Promise<void> {
    if (!this.isHeaderEditing) {
      return;
    }

    this.isSavingHeaderTexts = true;
    this.saveError = null;

    try {
      this.homeHeaderTexts = { texto: this.headerTextValue };
      // Sem backend - salvar no localStorage
      localStorage.setItem('homeHeaderTexts', JSON.stringify(this.homeHeaderTexts));
      this.isHeaderEditing = false;
    } catch (error: any) {
      console.error('Erro ao salvar cabeçalho:', error);
      this.saveError = 'Erro ao salvar os textos do cabeçalho. Tente novamente.';
    } finally {
      this.isSavingHeaderTexts = false;
    }
  }

  editarCardHome(card: HomeCard): void {
    this.cardEditando = { ...card };
    this.modalAberto = true;
  }

  async salvarCardHome(): Promise<void> {
    if (this.cardEditando) {
      const index = this.homeCards.findIndex(c => c.id === this.cardEditando!.id);
      if (index !== -1) {
        this.homeCards[index] = { ...this.cardEditando! };
        await this.saveData();
      }
      this.fecharModal();
    }
  }

  alterarImagemHome(card: HomeCard): void {
    this.cardEditando = { ...card };
    this.modalImagemAberto = true;
    this.imagemPreview = null;
    this.arquivoSelecionado = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async salvarImagemHome(): Promise<void> {
    if (this.imagemPreview && this.cardEditando) {
      const index = this.homeCards.findIndex(c => c.id === this.cardEditando!.id);
      if (index !== -1) {
        this.homeCards[index].imagem = this.imagemPreview;
        await this.saveData();
      }
      this.fecharModalImagem();
    }
  }

  // Problem management
  abrirModalProblema(formularioId: string, problema?: Problema): void {
    this.formularioSelecionado = formularioId;
    if (problema) {
      this.problemaEditando = { ...problema };
      this.problemaForm.patchValue({
        nome: problema.nome,
        descricao: problema.descricao || '',
        tipo: problema.tipo
      });
    } else {
      this.problemaEditando = null;
      this.problemaForm.reset();
    }
    this.modalProblemaAberto = true;
  }

  async salvarProblema(): Promise<void> {
    if (this.problemaForm.valid && this.formularioSelecionado) {
      const formValue = this.problemaForm.value;
      const formulario = this.formularios[this.formularioSelecionado];
      
      try {
        if (this.problemaEditando) {
          // Editar problema existente
          const problemaAtualizado: Problema = {
            ...this.problemaEditando,
            nome: formValue.nome,
            descricao: formValue.descricao,
            tipo: formValue.tipo
          };
          
          // Sem backend - atualizar localmente
          const index = formulario.problemas.findIndex(p => p.id === this.problemaEditando!.id);
          if (index !== -1) {
            formulario.problemas[index] = problemaAtualizado;
          }
        } else {
          // Adicionar novo problema
          const novoProblema: Problema = {
            id: Date.now().toString(),
            nome: formValue.nome,
            descricao: formValue.descricao,
            tipo: formValue.tipo,
            dataCriacao: new Date()
          };
          
          // Sem backend - adicionar localmente
          formulario.problemas.push(novoProblema);
        }
        
        // Salvar backup no localStorage
        await this.saveData();
        this.fecharModalProblema();
      } catch (error: any) {
        console.error('Erro ao salvar problema:', error);
        this.saveError = 'Erro ao salvar problema. Tente novamente.';
      }
    }
  }

  async removerProblema(formularioId: string, problemaId: string): Promise<void> {
    const formulario = this.formularios[formularioId];
    if (formulario) {
      try {
        // Sem backend - remover localmente
        formulario.problemas = formulario.problemas.filter(p => p.id !== problemaId);
        await this.saveData();
      } catch (error: any) {
        console.error('Erro ao remover problema:', error);
        this.saveError = 'Erro ao remover problema. Tente novamente.';
      }
    }
  }

  // Modal management
  fecharModal(): void {
    this.modalAberto = false;
    this.cardEditando = null;
  }

  fecharModalImagem(): void {
    this.modalImagemAberto = false;
    this.cardEditando = null;
    this.imagemPreview = null;
    this.arquivoSelecionado = null;
  }

  fecharModalProblema(): void {
    this.modalProblemaAberto = false;
    this.problemaEditando = null;
    this.formularioSelecionado = '';
    this.problemaForm.reset();
  }

  // Navigation
  fechar(): void {
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  fecharMenus(): void {
    this.modalAberto = false;
    this.modalImagemAberto = false;
    this.modalProblemaAberto = false;
  }

  // Utility
  getProblemas(formularioId: string): Problema[] {
    return this.formularios[formularioId]?.problemas || [];
  }

  getFormularioNome(formularioId: string): string {
    return this.formularios[formularioId]?.nome || formularioId;
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageError(event: any): void {
    event.target.src = 'assets/icon/default.png';
  }
}
