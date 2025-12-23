import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  
  filtroAtivo: string = 'Todos';
  
  documentos: Documento[] = [
    // ========== ESTATUTOS (3) ==========
    {
      id: 1,
      tipo: 'Estatutos',
      titulo: 'Estatuto da Associação',
      descricao: 'Documento oficial que define a estrutura, objectivos e funcionamento da ANAM. Versão vigente aprovada em Assembleia Geral.',
      tamanho: '1.2 MB',
      icon: '📘',
      cor: '#10B981',
      url: 'assets/docs/estatuto.pdf'
    },
    {
      id: 2,
      tipo: 'Estatutos',
      titulo: 'Estatuto do Membro',
      descricao: 'Direitos, deveres e responsabilidades dos membros associados. Critérios de adesão e participação.',
      tamanho: '680 KB',
      icon: '👤',
      cor: '#34D399',
      url: 'assets/docs/estatuto-membro.pdf'
    },
    {
      id: 3,
      tipo: 'Estatutos',
      titulo: 'Estatuto do Conselho Fiscal',
      descricao: 'Competências, composição e procedimentos do órgão de fiscalização da associação.',
      tamanho: '520 KB',
      icon: '🔍',
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
      icon: '📗',
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
  
  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
  }

  ngOnDestroy() {
    // Remover classe quando sair da página
    document.body.classList.remove('navbar-solid');
  }
}
