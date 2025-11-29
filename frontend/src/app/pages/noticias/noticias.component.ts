import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PageTransitionService } from '../../services/page-transition.service';

interface Noticia {
  titulo: string;
  data: string;
  categoria: string;
  resumo: string;
  conteudo?: string;
}

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss',
})
export class NoticiasComponent implements OnInit {
  @ViewChild('noticiasContent', { static: true }) noticiasContent!: ElementRef;

  noticias: Noticia[] = [
    {
      titulo: 'Nova Parceria com Organização Internacional',
      data: '10 de Janeiro, 2024',
      categoria: 'Parcerias',
      resumo: 'A nossa associação estabeleceu uma parceria importante com uma organização internacional para apoiar projetos de desenvolvimento comunitário.',
      conteudo: 'Esta parceria trará recursos adicionais para apoiar os nossos projetos de educação, saúde e desenvolvimento económico na comunidade de Massinga.'
    },
    {
      titulo: 'Campanha de Limpeza Comunitária',
      data: '8 de Janeiro, 2024',
      categoria: 'Meio Ambiente',
      resumo: 'Mais de 200 pessoas participaram na campanha de limpeza que organizámos no centro da vila. Um sucesso total!',
      conteudo: 'A campanha resultou na recolha de mais de 2 toneladas de lixo e sensibilizou a comunidade para a importância de manter o ambiente limpo.'
    },
    {
      titulo: 'Workshop de Capacitação para Jovens',
      data: '5 de Janeiro, 2024',
      categoria: 'Educação',
      resumo: 'Iniciámos um programa de capacitação para jovens da comunidade, focado em competências digitais e empreendedorismo.',
      conteudo: 'O programa tem duração de 3 meses e inclui formação em informática básica, gestão de negócios e marketing digital.'
    },
    {
      titulo: 'Relatório Anual 2023',
      data: '2 de Janeiro, 2024',
      categoria: 'Relatórios',
      resumo: 'Publicámos o nosso relatório anual com os resultados alcançados em 2023 e os planos para 2024.',
      conteudo: 'O relatório mostra um crescimento de 40% no número de membros e a implementação de 15 novos projetos comunitários.'
    }
  ];

  constructor(private pageTransitionService: PageTransitionService) {}

  ngOnInit() {
    this.pageTransitionService.pageEnter(this.noticiasContent.nativeElement);
  }

  lerMais(noticia: Noticia): void {
    alert(`Lendo notícia: "${noticia.titulo}"\n\n${noticia.conteudo || noticia.resumo}`);
  }
}


