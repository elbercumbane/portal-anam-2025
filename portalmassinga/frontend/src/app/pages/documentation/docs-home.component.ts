import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Documento {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string;
  tamanho: string;
  icon: string;
  cor: string;
  url?: string;
}

@Component({
  selector: 'app-documentos-home',
  standalone: false,
  templateUrl: './docs-home.component.html',
  styleUrl: './docs-home.component.scss'
})
export class DocsHomeComponent implements OnInit, OnDestroy {
  
  constructor(private sanitizer: DomSanitizer) {}
  
  filtroAtivo: string = 'Todos';
  
  documentos: Documento[] = [
    // ========== DOCUMENTOS REAIS ==========
    {
      id: 100,
      tipo: 'Relatórios',
      titulo: 'Lista de Candidatos a Membros da ANAM',
      descricao: 'Listagem oficial dos candidatos a membros da Associação Nacional de Armadores de Moçambique (ANAM).',
      tamanho: 'PDF',
      icon: 'description',
      cor: '#10B981',
      url: 'assets/docs/lista-candidatos-membros-anam.pdf'
    },
    {
      id: 101,
      tipo: 'Relatórios',
      titulo: 'Ergimino Mucale',
      descricao: 'Documento oficial referente ao membro Ergimino Mucale da ANAM.',
      tamanho: 'PDF',
      icon: 'person',
      cor: '#34D399',
      url: 'assets/docs/ergimino-mucale.pdf'
    },
    {
      id: 102,
      tipo: 'Relatórios',
      titulo: 'Mario Sevene',
      descricao: 'Documento oficial referente ao membro Mario Sevene da ANAM.',
      tamanho: 'PDF',
      icon: 'person',
      cor: '#059669',
      url: 'assets/docs/mario-sevene.pdf'
    },

    // ========== ESTATUTOS (3) ==========
    {
      id: 1,
      tipo: 'Estatutos',
      titulo: 'Estatuto da Associação',
      descricao: 'Documento oficial que define a estrutura, objectivos e funcionamento da ANAM. Versão vigente aprovada em Assembleia Geral.',
      tamanho: '1.2 MB',
      icon: 'gavel',
      cor: '#10B981',
      url: 'assets/docs/estatuto.pdf'
    },
    {
      id: 2,
      tipo: 'Estatutos',
      titulo: 'Estatuto do Membro',
      descricao: 'Direitos, deveres e responsabilidades dos membros associados. Critérios de adesão e participação.',
      tamanho: '680 KB',
      icon: 'person',
      cor: '#34D399',
      url: 'assets/docs/estatuto-membro.pdf'
    },
    {
      id: 3,
      tipo: 'Estatutos',
      titulo: 'Estatuto do Conselho Fiscal',
      descricao: 'Competências, composição e procedimentos do órgão de fiscalização da associação.',
      tamanho: '520 KB',
      icon: 'search',
      cor: '#059669',
      url: 'assets/docs/estatuto-conselho.pdf'
    },

    // ========== REGULAMENTOS (3) ==========
    {
      id: 4,
      tipo: 'Regulamentos',
      titulo: 'Regulamento Interno',
      descricao: 'Normas, procedimentos e disposições complementares que regem as actividades internas da associação.',
      tamanho: '800 KB',
      icon: 'rule',
      cor: '#059669',
      url: 'assets/docs/regulamento.pdf'
    },
    {
      id: 5,
      tipo: 'Regulamentos',
      titulo: 'Código de Conduta',
      descricao: 'Princípios éticos e normas de comportamento para membros, colaboradores e parceiros.',
      tamanho: '650 KB',
      icon: 'gavel',
      cor: '#10B981',
      url: 'assets/docs/codigo-conduta.pdf'
    },
    {
      id: 6,
      tipo: 'Regulamentos',
      titulo: 'Regulamento Eleitoral',
      descricao: 'Procedimentos e regras para eleição dos órgãos sociais e representantes da associação.',
      tamanho: '480 KB',
      icon: 'how_to_vote',
      cor: '#047857',
      url: 'assets/docs/regulamento-eleitoral.pdf'
    },

    // ========== RELATÓRIOS (3) ==========
    {
      id: 7,
      tipo: 'Relatórios',
      titulo: 'Relatório de Actividades',
      descricao: 'Síntese das actividades realizadas, resultados alcançados e prestação de contas do exercício.',
      tamanho: '3.6 MB',
      icon: 'description',
      cor: '#10B981',
      url: 'assets/docs/relatorio.pdf'
    },
    {
      id: 8,
      tipo: 'Relatórios',
      titulo: 'Relatório Financeiro',
      descricao: 'Demonstrações financeiras, balanço patrimonial e parecer do conselho fiscal.',
      tamanho: '2.8 MB',
      icon: 'account_balance',
      cor: '#34D399',
      url: 'assets/docs/relatorio-financeiro.pdf'
    },
    {
      id: 9,
      tipo: 'Relatórios',
      titulo: 'Relatório de Impacto Social',
      descricao: 'Avaliação do impacto das acções da ANAM na comunidade de Massinga e região.',
      tamanho: '4.2 MB',
      icon: 'public',
      cor: '#059669',
      url: 'assets/docs/relatorio-impacto.pdf'
    },

    // ========== PLANOS (3) ==========
    {
      id: 10,
      tipo: 'Planos',
      titulo: 'Plano Estratégico',
      descricao: 'Visão, missão e objectivos estratégicos para o desenvolvimento institucional e comunitário.',
      tamanho: '2.1 MB',
      icon: 'book',
      cor: '#10B981',
      url: 'assets/docs/plano-estrategico.pdf'
    },
    {
      id: 11,
      tipo: 'Planos',
      titulo: 'Plano de Acção Anual',
      descricao: 'Programação detalhada das actividades, projectos e metas para o ano corrente.',
      tamanho: '1.5 MB',
      icon: 'assignment',
      cor: '#34D399',
      url: 'assets/docs/plano-accao.pdf'
    },
    {
      id: 12,
      tipo: 'Planos',
      titulo: 'Plano de Comunicação',
      descricao: 'Estratégias de comunicação interna e externa, identidade visual e presença digital.',
      tamanho: '1.8 MB',
      icon: 'campaign',
      cor: '#059669',
      url: 'assets/docs/plano-comunicacao.pdf'
    },

    // ========== POLÍTICAS (3) ==========
    {
      id: 13,
      tipo: 'Políticas',
      titulo: 'Política de Privacidade',
      descricao: 'Directrizes sobre o tratamento e protecção de dados pessoais de acordo com a legislação vigente.',
      tamanho: '420 KB',
      icon: 'lock',
      cor: '#10B981',
      url: 'assets/docs/politica-privacidade.pdf'
    },
    {
      id: 14,
      tipo: 'Políticas',
      titulo: 'Política de Parcerias',
      descricao: 'Critérios e procedimentos para estabelecimento de parcerias institucionais e colaborações.',
      tamanho: '580 KB',
      icon: 'handshake',
      cor: '#34D399',
      url: 'assets/docs/politica-parcerias.pdf'
    },
    {
      id: 15,
      tipo: 'Políticas',
      titulo: 'Política Ambiental',
      descricao: 'Compromissos e práticas da ANAM para a sustentabilidade ambiental e desenvolvimento verde.',
      tamanho: '390 KB',
      icon: 'eco',
      cor: '#059669',
      url: 'assets/docs/politica-ambiental.pdf'
    }
  ];

  get documentosFiltrados(): Documento[] {
    if (this.filtroAtivo === 'Todos') {
      return this.documentos;
    }
    return this.documentos.filter(doc => doc.tipo === this.filtroAtivo);
  }

  getCount(tipo: string): number {
    return this.documentos.filter(doc => doc.tipo === tipo).length;
  }

  filtrar(tipo: string): void {
    this.filtroAtivo = tipo;
  }

  getIconSvg(iconName: string): SafeHtml {
    const iconMap: { [key: string]: string } = {
      'gavel': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0s-.83-.83 0-1.66L11.34 12"/><path d="M17.64 15L20 12.64"/><path d="M20.5 11.5l-1-1"/><path d="M15.5 6.5l-1-1"/><path d="M12 2l-2 2"/><path d="M6.5 7.5L5 6"/><path d="M8 2l2 2"/><path d="M3 3l18 18"/></svg>',
      'person': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      'rule': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      'description': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
      'account_balance': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="3" y1="10" x2="3" y2="14"/><line x1="21" y1="10" x2="21" y2="14"/></svg>',
      'public': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      'book': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      'assignment': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      'campaign': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      'lock': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      'handshake': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 12h2a2 2 0 1 0 0-4h-3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1"/><path d="M13 12h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3a2 2 0 1 0 0-4h-2"/><path d="M5 15h14"/><path d="M5 9h14"/></svg>',
      'eco': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8"/><path d="M12 8v8"/><circle cx="12" cy="12" r="1.5"/><path d="M7.5 7.5l9 9M16.5 7.5l-9 9"/></svg>',
      'how_to_vote': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/><path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3z"/><path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3z"/></svg>'
    };
    
    const svg = iconMap[iconName] || iconMap['description'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  
  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
  }

  ngOnDestroy() {
    document.body.classList.remove('navbar-solid');
    document.body.style.overflow = '';
  }
}
