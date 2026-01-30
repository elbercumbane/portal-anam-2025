import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
  imagem?: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit, OnDestroy {
  @ViewChild('noticiasContent', { static: true }) noticiasContent!: ElementRef;

  noticiaSelecionada: Noticia | null = null;
  categoriaFiltro: string = '';
  currentSlide: number = 0;

  noticias: Noticia[] = [
    {
      titulo: 'Nova Parceria com Organização Internacional',
      data: '15 de Janeiro, 2025',
      categoria: 'Parcerias',
      resumo: 'A nossa associação estabeleceu uma parceria importante com uma organização internacional para apoiar projetos de desenvolvimento comunitário.',
      conteudo: 'Esta parceria trará recursos adicionais para apoiar os nossos projetos de educação, saúde e desenvolvimento económico na comunidade de Massinga. A colaboração incluirá programas de capacitação, apoio técnico e financiamento para iniciativas locais que visam melhorar a qualidade de vida dos residentes. A organização parceira tem uma vasta experiência em projetos de desenvolvimento sustentável e trará metodologias comprovadas para maximizar o impacto das nossas ações.',
      imagem: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Campanha de Limpeza Comunitária',
      data: '12 de Janeiro, 2025',
      categoria: 'Meio Ambiente',
      resumo: 'Mais de 200 pessoas participaram na campanha de limpeza que organizámos no centro da vila. Um sucesso total!',
      conteudo: 'A campanha resultou na recolha de mais de 2 toneladas de lixo e sensibilizou a comunidade para a importância de manter o ambiente limpo. O evento contou com a participação de voluntários de todas as idades e foi apoiado pela administração local. Além da limpeza, foram realizadas palestras sobre reciclagem e gestão de resíduos, e foram distribuídos materiais educativos para as famílias.',
      imagem: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Workshop de Capacitação para Jovens',
      data: '10 de Janeiro, 2025',
      categoria: 'Educação',
      resumo: 'Iniciámos um programa de capacitação para jovens da comunidade, focado em competências digitais e empreendedorismo.',
      conteudo: 'O programa tem duração de 3 meses e inclui formação em informática básica, gestão de negócios e marketing digital. Os participantes receberão certificados e terão acesso a mentoria contínua para desenvolver os seus projetos empresariais. O objetivo é capacitar 50 jovens este ano, proporcionando-lhes as ferramentas necessárias para criar os seus próprios negócios ou encontrar melhores oportunidades de emprego.',
      imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Relatório Anual 2024',
      data: '8 de Janeiro, 2025',
      categoria: 'Relatórios',
      resumo: 'Publicámos o nosso relatório anual com os resultados alcançados em 2024 e os planos para 2025.',
      conteudo: 'O relatório mostra um crescimento de 40% no número de membros e a implementação de 15 novos projetos comunitários. Para 2025, planeamos expandir os nossos programas de educação e criar novas oportunidades de emprego na região. Destacamos também o aumento significativo no número de beneficiários dos nossos programas sociais e a melhoria nos indicadores de desenvolvimento da comunidade.',
      imagem: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Inauguração do Novo Centro Comunitário',
      data: '5 de Janeiro, 2025',
      categoria: 'Infraestrutura',
      resumo: 'Foi inaugurado o novo centro comunitário que servirá como espaço para reuniões, eventos e atividades educativas.',
      conteudo: 'O centro comunitário, construído com o apoio de parceiros locais e internacionais, possui salas de reunião, espaço para eventos, biblioteca e área de informática. Este espaço permitirá expandir significativamente as atividades da associação e proporcionar um local adequado para a realização de workshops, palestras e eventos culturais. A inauguração contou com a presença de autoridades locais e membros da comunidade.',
      imagem: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Programa de Apoio à Saúde Materno-Infantil',
      data: '3 de Janeiro, 2025',
      categoria: 'Saúde',
      resumo: 'Lançámos um novo programa focado na saúde materno-infantil, oferecendo consultas e acompanhamento gratuito.',
      conteudo: 'O programa visa melhorar os indicadores de saúde materno-infantil na região, oferecendo consultas pré-natais, acompanhamento pós-parto e educação sobre cuidados com recém-nascidos. Em parceria com profissionais de saúde locais, o programa já atendeu mais de 100 mulheres e crianças nos primeiros meses de funcionamento. O objetivo é reduzir a mortalidade materno-infantil e melhorar a qualidade de vida das famílias.',
      imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Festival Cultural de Massinga',
      data: '28 de Dezembro, 2024',
      categoria: 'Cultura',
      resumo: 'Realizámos o primeiro festival cultural da comunidade, celebrando a diversidade e tradições locais.',
      conteudo: 'O festival contou com apresentações de música tradicional, dança, artesanato e gastronomia local. Mais de 500 pessoas participaram no evento, que teve como objetivo promover a cultura local e fortalecer os laços comunitários. O festival foi um sucesso e já está planejado para se tornar um evento anual, contribuindo para o turismo cultural da região.',
      imagem: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop'
    },
    {
      titulo: 'Projeto de Agricultura Sustentável',
      data: '20 de Dezembro, 2024',
      categoria: 'Desenvolvimento',
      resumo: 'Iniciámos um projeto de agricultura sustentável que ensina técnicas modernas de cultivo a agricultores locais.',
      conteudo: 'O projeto visa melhorar a produtividade agrícola através de técnicas sustentáveis e adaptadas ao clima local. Os agricultores participantes recebem formação em compostagem, irrigação eficiente e gestão de culturas. O projeto já beneficiou 30 famílias e resultou em um aumento médio de 25% na produção agrícola. O objetivo é expandir para mais 50 famílias este ano.',
      imagem: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop'
    }
  ];

  constructor(private pageTransitionService: PageTransitionService) {}

  ngOnInit() {
    this.pageTransitionService.pageEnter(this.noticiasContent.nativeElement);
    // Auto-play do carrossel
    this.startCarouselAutoPlay();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  private carouselInterval: any;

  startCarouselAutoPlay() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Muda de slide a cada 5 segundos
  }

  getFeaturedSlides(): Noticia[] {
    return this.noticias.slice(0, 4);
  }

  nextSlide(): void {
    const slides = this.getFeaturedSlides();
    this.currentSlide = (this.currentSlide + 1) % slides.length;
  }

  previousSlide(): void {
    const slides = this.getFeaturedSlides();
    this.currentSlide = (this.currentSlide - 1 + slides.length) % slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    // Reiniciar auto-play
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    this.startCarouselAutoPlay();
  }

  selecionarNoticia(noticia: Noticia): void {
    this.noticiaSelecionada = noticia;
  }

  fecharDetalhes(): void {
    this.noticiaSelecionada = null;
  }

  getCurrentDate(): string {
    const hoje = new Date();
    const opcoes: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return hoje.toLocaleDateString('pt-PT', opcoes);
  }

  getRelatedNews(): Noticia[] {
    if (!this.noticiaSelecionada) {
      return this.noticias.slice(1, 4);
    }
    return this.noticias
      .filter(n => n !== this.noticiaSelecionada)
      .slice(0, 3);
  }

  getCategoriesCount(): number {
    const categories = new Set(this.noticias.map(n => n.categoria));
    return categories.size;
  }

  getFeaturedNews(): Noticia | null {
    return this.noticias.length > 0 ? this.noticias[0] : null;
  }

  getSideNews(): Noticia[] {
    return this.noticias.slice(1, 4);
  }

  getCategorias(): string[] {
    const categories = new Set(this.noticias.map(n => n.categoria));
    return Array.from(categories);
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaFiltro = categoria;
  }

  getFilteredNews(): Noticia[] {
    if (this.categoriaFiltro === '') {
      return this.noticias;
    }
    return this.noticias.filter(n => n.categoria === this.categoriaFiltro);
  }
}