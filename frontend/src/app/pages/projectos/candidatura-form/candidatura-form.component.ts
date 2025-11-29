import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface ProjetoDisponivel {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  valorDisponivel: string;
  prazoCandidatura: string;
  requisitos: string[];
  beneficios: string[];
  dataInicio: string;
  duracao: string;
  organizacao: string;
}

interface CandidaturaForm {
  // Dados da Organização
  nomeOrganizacao: string;
  tipoOrganizacao: string;
  nif: string;
  endereco: string;
  cidade: string;
  provincia: string;
  telefone: string;
  email: string;
  website: string;
  
  // Dados do Representante
  nomeRepresentante: string;
  cargo: string;
  telefoneRepresentante: string;
  emailRepresentante: string;
  
  // Dados do Projeto
  tituloProjeto: string;
  descricaoProjeto: string;
  objetivos: string;
  metodologia: string;
  cronograma: string;
  orcamento: string;
  contrapartida: string;
  
  // Anexos
  estatutos: File | null;
  nifDocument: File | null;
  projetoPowerPoint: File | null;
  outrosDocumentos: File[] | null;
  
  // Termos
  aceitaTermos: boolean;
  autorizaDados: boolean;
}

@Component({
  selector: 'app-candidatura-form',
  standalone: false,
  templateUrl: './candidatura-form.component.html',
  styleUrl: './candidatura-form.component.scss'
})
export class CandidaturaFormComponent implements OnInit {
  projeto: ProjetoDisponivel | null = null;
  formData: CandidaturaForm = {
    nomeOrganizacao: '',
    tipoOrganizacao: '',
    nif: '',
    endereco: '',
    cidade: '',
    provincia: '',
    telefone: '',
    email: '',
    website: '',
    nomeRepresentante: '',
    cargo: '',
    telefoneRepresentante: '',
    emailRepresentante: '',
    tituloProjeto: '',
    descricaoProjeto: '',
    objetivos: '',
    metodologia: '',
    cronograma: '',
    orcamento: '',
    contrapartida: '',
    estatutos: null,
    nifDocument: null,
    projetoPowerPoint: null,
    outrosDocumentos: null,
    aceitaTermos: false,
    autorizaDados: false
  };

  tiposOrganizacao = [
    'ONG',
    'Associação',
    'Cooperativa',
    'Fundação',
    'Empresa Social',
    'Outro'
  ];

  provincias = [
    'Maputo',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa'
  ];

  currentStep = 1;
  totalSteps = 4;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const projetoId = this.route.snapshot.paramMap.get('id');
    this.carregarProjeto(projetoId);
  }

  carregarProjeto(id: string | null) {
    // Simular carregamento do projeto
    const projetos: ProjetoDisponivel[] = [
      {
        id: '1',
        titulo: 'Programa de Desenvolvimento Rural Sustentável',
        descricao: 'Iniciativa para promover o desenvolvimento sustentável em comunidades rurais através de projetos de agricultura, energia renovável e capacitação comunitária.',
        area: 'Desenvolvimento Rural',
        valorDisponivel: '5.0M MZN',
        prazoCandidatura: '31 de Março, 2024',
        requisitos: ['ONG registrada', 'Experiência em desenvolvimento rural', 'Equipe técnica qualificada'],
        beneficios: ['Financiamento completo', 'Acompanhamento técnico', 'Rede de parceiros'],
        dataInicio: 'Abril 2024',
        duracao: '24 meses',
        organizacao: 'ANAM - Associação Nacional de Apoio ao Meio Ambiente'
      }
    ];
    
    this.projeto = projetos.find(p => p.id === id) || null;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      (this.formData as any)[field] = file;
    }
  }

  onMultipleFilesSelected(event: any, field: string) {
    const files = Array.from(event.target.files);
    (this.formData as any)[field] = files;
  }

  submitForm() {
    if (this.formData.aceitaTermos && this.formData.autorizaDados) {
      console.log('Formulário submetido:', this.formData);
      // Aqui você implementaria a lógica de submissão
      alert('Candidatura submetida com sucesso!');
      this.router.navigate(['/projectos/candidaturas']);
    } else {
      alert('Por favor, aceite os termos e condições.');
    }
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Dados da Organização';
      case 2: return 'Dados do Representante';
      case 3: return 'Detalhes do Projeto';
      case 4: return 'Anexos e Confirmação';
      default: return '';
    }
  }
}
