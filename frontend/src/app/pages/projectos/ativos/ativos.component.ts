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
  selector: 'app-ativos',
  standalone: false,
  templateUrl: './ativos.component.html',
  styleUrl: './ativos.component.scss'
})
export class AtivosComponent {
  projetos: Projeto[] = [
    {
      id: '1',
      titulo: 'Desenvolvimento de Infraestruturas Rurais',
      descricao: 'Construção de estradas e pontes para melhorar o acesso às comunidades rurais.',
      status: 'Em Execução',
      dataInicio: 'Janeiro 2024',
      dataFim: 'Dezembro 2024',
      orcamento: '2.5M MZN',
      parceiros: ['Governo Provincial', 'Banco Mundial'],
      progresso: 64,
      kpis: { beneficiarios: 1200, parcerias: 5, eventos: 12 },
      linkPlano: '#',
      linkDetalhes: '#'
    },
    {
      id: '2',
      titulo: 'Capacitação em Agricultura Sustentável',
      descricao: 'Formação de agricultores em técnicas modernas e sustentáveis de cultivo.',
      status: 'Em Execução',
      dataInicio: 'Março 2024',
      dataFim: 'Novembro 2024',
      orcamento: '800K MZN',
      parceiros: ['FAO', 'Ministério da Agricultura'],
      progresso: 48,
      kpis: { beneficiarios: 600, parcerias: 3, eventos: 18 },
      linkPlano: '#',
      linkDetalhes: '#'
    },
    {
      id: '3',
      titulo: 'Programa de Empreendedorismo Juvenil',
      descricao: 'Apoio ao desenvolvimento de negócios liderados por jovens da região.',
      status: 'Em Execução',
      dataInicio: 'Fevereiro 2024',
      dataFim: 'Janeiro 2025',
      orcamento: '1.2M MZN',
      parceiros: ['UNIDO', 'Banco de Desenvolvimento'],
      progresso: 35,
      kpis: { beneficiarios: 220, parcerias: 4, eventos: 9 },
      linkPlano: '#',
      linkDetalhes: '#'
    }
  ];
}
