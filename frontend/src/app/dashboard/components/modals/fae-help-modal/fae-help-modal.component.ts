import { Component, OnInit } from '@angular/core';

interface HelpSectionItem {
  title: string;
  content: string;
}

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  description: string;
  items: HelpSectionItem[];
  tips?: string[];
}

@Component({
  selector: 'app-fae-help-modal',
  templateUrl: './fae-help-modal.component.html',
  styleUrls: ['./fae-help-modal.component.scss']
})
export class FaeHelpModalComponent implements OnInit {
  isVisible = false;
  sections: HelpSection[] = [
    {
      id: 'filters',
      title: 'Filtros de Pesquisa',
      icon: 'filter_list',
      summary: 'Refine os resultados rapidamente',
      description: 'Use os filtros para localizar avaliações específicas com base em critérios reais dos formulários FAE.',
      items: [
        {
          title: 'Grau de Satisfação',
          content: 'Selecione entre Muito Satisfeito, Satisfeito, Neutro, Insatisfeito ou Muito Insatisfeito para focar em experiências semelhantes.'
        },
        {
          title: 'Tipo de Problema',
          content: 'Limite os resultados por temas relatados como Demora no Atendimento, Falta de Informação, Documentação, Localização ou Funcionários.'
        },
        {
          title: 'Problema Resolvido',
          content: 'Visualize apenas casos resolvidos (Sim) ou pendentes (Não) para priorizar acompanhamentos.'
        },
        {
          title: 'Aspectos Positivos e Negativos',
          content: 'Filtre pelos motivos que agradaram ou não agradaram (Atendimento, Rapidez, Processo, etc.) e entenda os principais pontos levantados.'
        },
        {
          title: 'Província',
          content: 'Compare a qualidade do serviço por região selecionando províncias específicas.'
        },
        {
          title: 'Intervalo de Datas',
          content: 'Informe Data Início e Data Fim para analisar períodos específicos. O calendário limita automaticamente datas inválidas.'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Regras de Filtragem',
      icon: 'rule',
      summary: 'Entenda como o sistema combina filtros',
      description: 'Algumas regras ajudam a evitar resultados inesperados ao combinar diferentes critérios.',
      items: [
        {
          title: 'Combinação de Filtros',
          content: 'Vários filtros ativos funcionam em conjunto (lógica AND). Apenas avaliações que satisfazem todos os critérios aparecem na tabela.'
        },
        {
          title: 'Validação de Datas',
          content: 'Se a Data Início for posterior à Data Fim os campos são limpos automaticamente e uma mensagem de aviso é exibida.'
        },
        {
          title: 'Aplicar & Limpar',
          content: 'Clique em “Filtrar” para atualizar a tabela ou em “Limpar” para restaurar todos os dados originais.'
        },
        {
          title: 'Paginação Inteligente',
          content: 'Ao filtrar, a tabela volta para a primeira página e mantém a paginação ajustada ao total de resultados encontrados.'
        }
      ],
      tips: [
        'Revise o contador “Total” no cabeçalho para confirmar rapidamente quantas avaliações correspondem ao filtro atual.',
        'Use o botão “Limpar” antes de aplicar um novo conjunto de filtros para evitar combinações indesejadas.'
      ]
    },
    {
      id: 'export',
      title: 'Exportação de Dados',
      icon: 'file_download',
      summary: 'Leve os dados filtrados para outros formatos',
      description: 'Os botões de exportação consideram exatamente os resultados visíveis após aplicar filtros.',
      items: [
        {
          title: 'Exportar para Excel',
          content: 'Ideal para análises detalhadas ou construção de dashboards externos.'
        },
        {
          title: 'Exportar para Word',
          content: 'Gere relatórios textuais rapidamente, prontos para revisão ou envio.'
        },
        {
          title: 'Exportar para PDF',
          content: 'Compartilhe um resumo consolidado mantendo o layout pronto para impressão ou arquivamento.'
        }
      ],
      tips: [
        'Confirme os filtros antes da exportação: os arquivos gerados refletem a visualização atual.',
        'Após exportar, o menu fecha automaticamente — basta reabri-lo para gerar outro formato.'
      ]
    }
  ];
  activeSectionId = this.sections[0].id;

  constructor() { }

  ngOnInit(): void {
  }

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

  onOverlayClick(event: Event): void {
    // Fechar ao clicar no overlay (fundo escuro)
    if ((event.target as HTMLElement).classList.contains('fae-help-modal-overlay')) {
      this.close();
    }
  }

  selectSection(sectionId: string): void {
    this.activeSectionId = sectionId;
  }

  isActive(sectionId: string): boolean {
    return this.activeSectionId === sectionId;
  }

  get activeSection(): HelpSection {
    return this.sections.find(section => section.id === this.activeSectionId) ?? this.sections[0];
  }
}

