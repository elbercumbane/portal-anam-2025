import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  orcamento: string;
  parceiros: string[];
  progresso?: number; // 0-100
  kpis?: { beneficiarios: number; parcerias: number; eventos: number };
  linkPlano?: string;
  linkDetalhes?: string;
}

@Component({
  selector: 'app-realizados',
  standalone: false,
  templateUrl: './realizados.component.html',
  styleUrl: './realizados.component.scss'
})
export class RealizadosComponent {
  projetos: Projeto[] = [];
  totalInvestido: number = 0;

  constructor() {
    this.carregarProjetos();
    this.calcularTotalInvestido();
  }

  carregarProjetos() {
    this.projetos = [
    {
      id: '1',
      titulo: 'Construção de Escola Primária "Futuro Brilhante"',
      descricao: 'Construção de uma escola primária moderna com 6 salas de aula, biblioteca e laboratório de informática para 300 alunos.',
      status: 'Concluído',
      dataInicio: 'Janeiro 2023',
      dataFim: 'Dezembro 2023',
      orcamento: '2.5M MZN',
      parceiros: ['UNICEF', 'Ministério da Educação'],
      progresso: 100,
      kpis: { beneficiarios: 300, parcerias: 2, eventos: 8 },
      linkPlano: '#',
      linkDetalhes: '#'
    },
    {
      id: '2',
      titulo: 'Sistema de Água Potável "Água para Todos"',
      descricao: 'Instalação de sistema completo de distribuição de água potável para 5 comunidades rurais.',
      status: 'Concluído',
      dataInicio: 'Abril 2023',
      dataFim: 'Setembro 2023',
      orcamento: '1.8M MZN',
      parceiros: ['Cruz Vermelha', 'Governo Local'],
      progresso: 100,
      kpis: { beneficiarios: 2000, parcerias: 2, eventos: 5 },
      linkPlano: '#',
      linkDetalhes: '#'
    },
    {
      id: '3',
      titulo: 'Centro de Saúde Comunitário "Saúde em Primeiro"',
      descricao: 'Construção e equipamento de um centro de saúde para atendimento básico e campanhas de vacinação.',
      status: 'Concluído',
      dataInicio: 'Fevereiro 2023',
      dataFim: 'Dezembro 2023',
      orcamento: '3.2M MZN',
      parceiros: ['Médicos Sem Fronteiras', 'Ministério da Saúde'],
      progresso: 100,
      kpis: { beneficiarios: 5000, parcerias: 2, eventos: 15 },
      linkPlano: '#',
      linkDetalhes: '#'
    },
    {
      id: '4',
      titulo: 'Programa de Empoderamento Feminino "Mulheres Fortes"',
      descricao: 'Capacitação de mulheres em habilidades de empreendedorismo, liderança e direitos civis.',
      status: 'Concluído',
      dataInicio: 'Maio 2023',
      dataFim: 'Novembro 2023',
      orcamento: '1.5M MZN',
      parceiros: ['ONU Mulheres', 'Associação de Mulheres Empreendedoras'],
      progresso: 100,
      kpis: { beneficiarios: 150, parcerias: 2, eventos: 12 },
      linkPlano: '#',
      linkDetalhes: '#'
    }
  ];
  }

  calcularTotalInvestido() {
    this.totalInvestido = this.projetos.reduce((total, projeto) => {
      const valor = parseFloat(projeto.orcamento.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.'));
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);
  }

  formatarValor(valor: number): string {
    if (valor >= 1000000) {
      return `${(valor / 1000000).toFixed(1)}M MZN`;
    } else if (valor >= 1000) {
      return `${(valor / 1000).toFixed(0)}K MZN`;
    }
    return `${valor} MZN`;
  }
}