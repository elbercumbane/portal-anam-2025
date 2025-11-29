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
  selector: 'app-economic-agent-help-modal',
  templateUrl: './economic-agent-help-modal.component.html',
  styleUrls: ['./economic-agent-help-modal.component.scss']
})
export class EconomicAgentHelpModalComponent {
  isVisible = false;
  sections: HelpSection[] = [
    {
      id: 'filters',
      title: 'Filtros Disponíveis',
      icon: 'filter_list',
      summary: 'Combine critérios para localizar avaliações específicas',
      description: 'Aplique um ou mais filtros para analisar grupos de agentes económicos que compartilham características em comum.',
      items: [
        {
          title: 'Grau de Satisfação',
          content: 'Escolha um nível de satisfação para agrupar experiências semelhantes e comparar percepções.'
        },
        {
          title: 'Tipo de Problema',
          content: 'Identifique padrões recorrentes limitando os resultados a temas como Demora, Falta de Informação, Documentação, Localização ou Funcionários.'
        },
        {
          title: 'Problema Resolvido',
          content: 'Destaque casos resolvidos (Sim) ou pendentes (Não) e priorize ações de follow-up.'
        },
        {
          title: 'Aspectos Positivos e Negativos',
          content: 'Filtre pelos fatores que agradaram ou não agradaram para entender motivos de satisfação ou melhoria.'
        },
        {
          title: 'Província',
          content: 'Analise a qualidade do atendimento por região e identifique unidades que necessitam de suporte adicional.'
        },
        {
          title: 'Intervalo de Datas',
          content: 'Selecione um período para avaliar evoluções ao longo do tempo ou medir impactos recentes.'
        }
      ]
    },
    {
      id: 'rules',
      title: 'Regras de Utilização',
      icon: 'rule',
      summary: 'Saiba como o sistema responde às suas escolhas',
      description: 'Entenda como os filtros são combinados e como a interface reage a interações inválidas.',
      items: [
        {
          title: 'Combinação de Filtros',
          content: 'Todos os filtros activos são avaliados simultaneamente. Apenas itens que atendem a todos os critérios são listados.'
        },
        {
          title: 'Validação de Datas',
          content: 'Datas inválidas são automaticamente corrigidas: se a Data Início for posterior à Data Fim, ambos os campos são limpos.'
        },
        {
          title: 'Aplicar e Limpar',
          content: 'Utilize “Filtrar” para actualizar a grelha ou “Limpar” para regressar à visão completa rapidamente.'
        },
        {
          title: 'Paginação',
          content: 'A paginação ajusta-se ao total filtrado e retorna para a primeira página para evitar resultados vazios.'
        }
      ],
      tips: [
        'Observe o contador de “Total de Avaliações” no cabeçalho para confirmar o impacto dos filtros.',
        'Se não encontrar resultados, experimente remover filtros em cascata até localizar o grupo desejado.'
      ]
    },
    {
      id: 'export',
      title: 'Exportação',
      icon: 'file_download',
      summary: 'Leve os dados filtrados para relatórios externos',
      description: 'Os ficheiros gerados refletem exactamente o que está visível na tabela após aplicar os filtros.',
      items: [
        {
          title: 'Excel (.xlsx)',
          content: 'Ideal para análises numéricas, criação de tabelas dinâmicas e partilha com equipas de dados.'
        },
        {
          title: 'Word (.docx)',
          content: 'Perfeito para relatórios narrativos e registos formais de acompanhamento.'
        },
        {
          title: 'PDF (.pdf)',
          content: 'Garante um snapshot fiel para arquivamento, impressão ou envio rápido.'
        }
      ],
      tips: [
        'Verifique os filtros activos antes de exportar: o ficheiro conterá apenas o subconjunto actual.',
        'Pode gerar vários formatos em sequência; o menu fecha automaticamente após cada exportação.'
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
    if (target.classList.contains('economic-help-modal-overlay')) {
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
