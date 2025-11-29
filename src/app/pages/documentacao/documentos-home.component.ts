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
  templateUrl: './documentos-home.component.html',
  styleUrl: './documentos-home.component.scss'
})
export class DocumentosHomeComponent implements OnInit, OnDestroy {
  
  filtroAtivo: string = 'Todos';
  
  documentos: Documento[] = [
    {
      id: 1,
      tipo: 'Estatutos',
      titulo: 'Estatuto da Associação',
      descricao: 'Versão vigente aprovada em Assembleia Geral.',
      tamanho: '1.2 MB',
      icon: '📘',
      cor: '#2563EB',
      url: 'assets/docs/estatuto.pdf'
    },
    {
      id: 2,
      tipo: 'Regulamentos',
      titulo: 'Regulamentos Internos',
      descricao: 'Normas, procedimentos e disposições complementares.',
      tamanho: '800 KB',
      icon: '📗',
      cor: '#059669',
      url: 'assets/docs/regulamento.pdf'
    },
    {
      id: 3,
      tipo: 'Relatórios',
      titulo: 'Relatório Anual 2023',
      descricao: 'Atividades, resultados e contas do exercício.',
      tamanho: '3.6 MB',
      icon: '📙',
      cor: '#EA580C',
      url: 'assets/docs/relatorio-2023.pdf'
    },
    {
      id: 4,
      tipo: 'Planos',
      titulo: 'Plano Estratégico 2024-2026',
      descricao: 'Visão e objetivos para o desenvolvimento institucional.',
      tamanho: '2.1 MB',
      icon: '📕',
      cor: '#DC2626',
      url: 'assets/docs/plano-estrategico.pdf'
    },
    {
      id: 5,
      tipo: 'Políticas',
      titulo: 'Política de Privacidade',
      descricao: 'Tratamento de dados pessoais de acordo com a legislação.',
      tamanho: '420 KB',
      icon: '🔒',
      cor: '#7C3AED',
      url: 'assets/docs/politica-privacidade.pdf'
    }
  ];

  get documentosFiltrados(): Documento[] {
    if (this.filtroAtivo === 'Todos') {
      return this.documentos;
    }
    return this.documentos.filter(doc => doc.tipo === this.filtroAtivo);
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
