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
  selector: 'app-service-view-help-modal',
  templateUrl: './service-view-help-modal.component.html',
  styleUrls: ['./service-view-help-modal.component.scss']
})
export class ServiceViewHelpModalComponent {
  isVisible = false;
  sections: HelpSection[] = [
    {
      id: 'filters',
      title: 'Filtros Disponíveis',
      icon: 'filter_list',
      summary: 'Cruze informações entre todos os formulários',
      description: 'A visão consolidada reúne respostas do FAE, Agente Econômico, Utilizador e outros formulários. Use os filtros para combinar dados de fontes diferentes.',
      items: [
        {
          title: 'Tipo de Formulário',
          content: 'Selecione uma origem (FAE, Agente Econômico, Utilizador, etc.) para focar em um formulário específico ou mantenha "Todos" para uma visão global.'
        },
        {
          title: 'Grau de Satisfação',
          content: 'Aplique níveis padronizados de satisfação e compare a experiência entre formulários distintos.'
        },
        {
          title: 'Problema Resolvido',
          content: 'Diferencie atendimentos concluídos (Sim) de pendentes (Não) para priorizar follow-up.'
        },
        {
          title: 'Tipo de Problema',
          content: 'Analise temas recorrentes (Demora, Falta de Informação, Documentação, Localização, Funcionários) independentemente da origem.'
        },
        {
          title: 'Serviço',
          content: 'Quando disponível, filtre por serviço prestado (Presencial, Online, Consultoria, etc.). Formulários que não possuem o campo mostram “-”.'
        },
        {
          title: 'Aspectos Positivos e Negativos',
          content: 'Identifique padrões do que agradou ou não agradou para orientar planos de melhoria.'
        },
        {
          title: 'Província',
          content: 'Compare a performance por região e detecte discrepâncias geográficas.'
        },
        {
          title: 'Intervalo de Datas',
          content: 'Foque num período específico ao indicar datas de início e fim.'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Regras de Utilização',
      icon: 'rule',
      summary: 'Garanta resultados consistentes ao combinar dados',
      description: 'A visão consolidada aplica as mesmas validações de cada formulário, permitindo análises seguras.',
      items: [
        {
          title: 'Filtros Combinados',
          content: 'Todos os critérios utilizam lógica AND. Evite combinar filtros excessivos para não retornar um conjunto vazio.'
        },
        {
          title: 'Validação de Datas',
          content: 'A Data Início deve ser anterior ou igual à Data Fim. Casos inválidos limpam os campos automaticamente.'
        },
        {
          title: 'Atualização dos Dados',
          content: 'Os dados são carregados automaticamente através dos serviços do dashboard. Clique em “Filtrar” sempre que ajustar os critérios.'
        },
        {
          title: 'Paginação',
          content: 'A tabela reinicia na primeira página após filtrar e ajusta a paginação conforme o total encontrado.'
        }
      ],
      tips: [
        'Combine “Tipo de Formulário” com “Grau de Satisfação” para identificar onde cada serviço está a performar melhor.',
        'Se precisar comparar períodos diferentes, exporte cada recorte individualmente antes de alterar os filtros.'
      ]
    },
    {
      id: 'export',
      title: 'Exportação e Indicadores',
      icon: 'file_download',
      summary: 'Use os dados consolidados nos seus relatórios',
      description: 'Os indicadores e exportações refletem o estado atual da tabela, sempre alinhados com os filtros ativos.',
      items: [
        {
          title: 'Exportar Resultados',
          content: 'Gere ficheiros Excel, Word ou PDF com a tabela ajustada ao filtro atual. Ideal para partilha com outras equipas.'
        },
        {
          title: 'Indicadores Dinâmicos',
          content: 'Os cards estatísticos são atualizados conforme os dados são carregados e filtrados, permitindo um resumo rápido da situação.'
        }
      ],
      tips: [
        'Antes de exportar, confirme o total de atendimentos exibidos para validar o recorte correto.',
        'Utilize o Excel para cruzar os dados exportados com outras fontes internas e aprofundar análises.'
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
    if (target.classList.contains('service-view-help-modal-overlay')) {
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
