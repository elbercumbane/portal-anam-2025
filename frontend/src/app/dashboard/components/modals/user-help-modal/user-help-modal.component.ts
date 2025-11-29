import { Component } from '@angular/core';

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
  selector: 'app-user-help-modal',
  templateUrl: './user-help-modal.component.html',
  styleUrls: ['./user-help-modal.component.scss']
})
export class UserHelpModalComponent {
  isVisible = false;
  sections: HelpSection[] = [
    {
      id: 'filters',
      title: 'Filtros Disponíveis',
      icon: 'filter_list',
      summary: 'Combine critérios para investigar perfis específicos',
      description: 'Os filtros permitem examinar as avaliações dos utilizadores por diferentes perspectivas. Todos podem ser combinados para refinar o resultado.',
      items: [
        {
          title: 'Grau de Satisfação',
          content: 'Identifique rapidamente níveis de satisfação (de Muito Satisfeito a Muito Insatisfeito) e perceba tendências.'
        },
        {
          title: 'Tipo de Problema',
          content: 'Analise temas recorrentes como Demora, Falta de Informação, Documentação, Localização ou Funcionários.'
        },
        {
          title: 'Problema Resolvido',
          content: 'Separe casos resolvidos (Sim) de pendentes (Não) para orientar ações prioritárias.'
        },
        {
          title: 'Serviço',
          content: 'Filtre por tipo de serviço solicitado (Atendimento Presencial, Online, Consultoria, Formação, Suporte Técnico, etc.).'
        },
        {
          title: 'Aspectos Positivos e Negativos',
          content: 'Veja rapidamente os motivos apontados como pontos fortes ou fracos (Atendimento, Rapidez, Processo, Falta de Informação...).'
        },
        {
          title: 'Província',
          content: 'Compare a experiência dos utilizadores por região e identifique diferenças geográficas.'
        },
        {
          title: 'Intervalo de Datas',
          content: 'Concentre-se em períodos específicos seleccionando datas de início e fim.'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Regras de Utilização',
      icon: 'rule',
      summary: 'Entenda como o sistema reage às suas escolhas',
      description: 'Algumas regras garantem que os resultados retornados permanecem coerentes e fáceis de interpretar.',
      items: [
        {
          title: 'Combinação de Filtros',
          content: 'Os filtros utilizam lógica AND. Apenas avaliações que satisfazem todos os critérios ativos são mostradas.'
        },
        {
          title: 'Validação de Datas',
          content: 'A Data Início deve ser anterior ou igual à Data Fim. Se a combinação for inválida, ambos os campos são limpos e uma mensagem é exibida.'
        },
        {
          title: 'Aplicar e Limpar',
          content: 'Use “Filtrar” para actualizar a tabela ou “Limpar” para voltar à vista completa sem filtros.'
        },
        {
          title: 'Paginação',
          content: 'A paginação reinicia na primeira página após aplicar filtros, garantindo que os novos resultados estejam sempre visíveis.'
        }
      ],
      tips: [
        'Se a tabela ficar vazia, remova filtros gradualmente até voltar a obter resultados.',
        'Verifique o contador no cabeçalho para confirmar quantas avaliações correspondem ao critério escolhido.'
      ]
    },
    {
      id: 'export',
      title: 'Exportação',
      icon: 'file_download',
      summary: 'Leve a visão filtrada para relatórios externos',
      description: 'Os ficheiros gerados reflectem exactamente o que está visível na tabela, incluindo filtros activos.',
      items: [
        {
          title: 'Excel (.xlsx)',
          content: 'Ideal para análises detalhadas, tabelas dinâmicas e partilha com equipas operacionais.'
        },
        {
          title: 'Word (.docx)',
          content: 'Útil para relatórios descritivos, registos de reuniões ou documentação formal.'
        },
        {
          title: 'PDF (.pdf)',
          content: 'Fornece um snapshot pronto para impressão, envio ou arquivo.'
        }
      ],
      tips: [
        'Confirme os filtros antes de exportar para garantir que o ficheiro contenha o recorte desejado.',
        'Pode gerar múltiplos formatos em sequência; reabra o menu de exportação sempre que precisar.'
      ]
    }
  ];
  activeSectionId = this.sections[0].id;

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

  onOverlayClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('user-help-modal-overlay')) {
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
