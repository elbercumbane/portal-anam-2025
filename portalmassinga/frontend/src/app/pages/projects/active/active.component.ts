import { Component } from '@angular/core';

interface PlanoProjeto {
  objetivo: string;
  fases: string[];
  entregas: string[];
}

interface ProjetoTheme {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
  kpi1: string;
  kpi2: string;
  kpi3: string;
}

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  orcamento: string;
  parceiros: string[];
  progresso?: number;
  kpis?: { beneficiarios: number; parcerias: number; eventos: number };
  plano: PlanoProjeto;
  detalhes: string;
  theme: ProjetoTheme;
}

@Component({
  selector: 'app-ativos',
  standalone: false,
  templateUrl: './active.component.html',
  styleUrl: './active.component.scss'
})
export class ActiveComponent {
  projetoSelecionado: Projeto | null = null;
  modalTipo: 'plano' | 'detalhes' | null = null;

  projetos: Projeto[] = [
    {
      id: '1',
      titulo: 'Desenvolvimento de Infraestruturas Rurais',
      descricao: 'Construção de estradas e pontes para melhorar o acesso às comunidades rurais.',
      categoria: 'Infraestruturas',
      status: 'Em Execução',
      dataInicio: 'Janeiro 2024',
      dataFim: 'Dezembro 2024',
      orcamento: '2.5M MZN',
      parceiros: ['Governo Provincial', 'Banco Mundial'],
      progresso: 64,
      kpis: { beneficiarios: 1200, parcerias: 5, eventos: 12 },
      plano: {
        objetivo: 'Melhorar a mobilidade e o acesso a serviços básicos nas comunidades rurais de Massinga.',
        fases: [
          'Levantamento topográfico e estudos de viabilidade',
          'Construção de 12 km de estradas vicinais',
          'Edificação de 3 pontes em zonas críticas',
          'Sinalização e entrega às comunidades'
        ],
        entregas: ['12 km de estrada reabilitada', '3 pontes concluídas', '1.200 beneficiários directos']
      },
      detalhes: 'Este projecto visa reduzir o tempo de deslocação entre aldeias e centros de serviço, facilitando o transporte de produtos agrícolas e o acesso à saúde e educação. A ANAM coordena a execução em parceria com o Governo Provincial e o Banco Mundial, com supervisão técnica contínua e envolvimento das comunidades beneficiárias.',
      theme: {
        primary: '#1565C0',
        secondary: '#42A5F5',
        accent: '#4CAF50',
        light: '#EDF4F0',
        dark: '#0D47A1',
        kpi1: '#1976D2',
        kpi2: '#43A047',
        kpi3: '#26A69A'
      }
    },
    {
      id: '2',
      titulo: 'Capacitação em Agricultura Sustentável',
      descricao: 'Formação de agricultores em técnicas modernas e sustentáveis de cultivo.',
      categoria: 'Agricultura',
      status: 'Em Execução',
      dataInicio: 'Março 2024',
      dataFim: 'Novembro 2024',
      orcamento: '800K MZN',
      parceiros: ['FAO', 'Ministério da Agricultura'],
      progresso: 48,
      kpis: { beneficiarios: 600, parcerias: 3, eventos: 18 },
      plano: {
        objetivo: 'Aumentar a produtividade agrícola com práticas sustentáveis adaptadas ao clima local.',
        fases: [
          'Diagnóstico das necessidades dos agricultores',
          'Formação em compostagem e irrigação eficiente',
          'Distribuição de sementes e materiais',
          'Acompanhamento pós-formação'
        ],
        entregas: ['600 agricultores formados', '18 workshops realizados', '3 cooperativas apoiadas']
      },
      detalhes: 'O programa combina formação teórica e prática em técnicas de agricultura sustentável, com foco em culturas resistentes à seca. Os participantes recebem acompanhamento técnico da FAO e do Ministério da Agricultura durante todo o ciclo do projecto.',
      theme: {
        primary: '#4CAF50',
        secondary: '#66BB6A',
        accent: '#388E3C',
        light: '#E8F5E9',
        dark: '#2E7D32',
        kpi1: '#43A047',
        kpi2: '#66BB6A',
        kpi3: '#388E3C'
      }
    },
    {
      id: '3',
      titulo: 'Programa de Empreendedorismo Juvenil',
      descricao: 'Apoio ao desenvolvimento de negócios liderados por jovens da região.',
      categoria: 'Empreendedorismo',
      status: 'Em Execução',
      dataInicio: 'Fevereiro 2024',
      dataFim: 'Janeiro 2025',
      orcamento: '1.2M MZN',
      parceiros: ['UNIDO', 'Banco de Desenvolvimento'],
      progresso: 35,
      kpis: { beneficiarios: 220, parcerias: 4, eventos: 9 },
      plano: {
        objetivo: 'Capacitar jovens empreendedores e apoiar a criação de negócios locais sustentáveis.',
        fases: [
          'Selecção de candidatos e diagnóstico de ideias',
          'Formação em gestão, marketing e finanças',
          'Mentoria individual com empresários locais',
          'Apoio ao acesso a microcrédito'
        ],
        entregas: ['220 jovens capacitados', '45 planos de negócio elaborados', '15 negócios incubados']
      },
      detalhes: 'Iniciativa voltada para jovens entre 18 e 35 anos com ideias de negócio na região de Massinga. O programa oferece formação, mentoria e ligação a parceiros financeiros, promovendo o emprego e o empreendedorismo local como motor de desenvolvimento.',
      theme: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#00897B',
        light: '#EDF5EE',
        dark: '#1B5E20',
        kpi1: '#43A047',
        kpi2: '#00897B',
        kpi3: '#4CAF50'
      }
    }
  ];

  abrirPlano(projeto: Projeto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.projetoSelecionado = projeto;
    this.modalTipo = 'plano';
    document.body.style.overflow = 'hidden';
  }

  abrirDetalhes(projeto: Projeto, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.projetoSelecionado = projeto;
    this.modalTipo = 'detalhes';
    document.body.style.overflow = 'hidden';
  }

  fecharModal(): void {
    this.projetoSelecionado = null;
    this.modalTipo = null;
    document.body.style.overflow = '';
  }
}
