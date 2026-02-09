import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  @ViewChild('galeriaSection', { static: true }) galeriaSection!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  // Dados para galeria de eventos
  galeria: any[] = [
    {
      id: 1,
      titulo: 'Feira de Produtos Locais',
      data: '30 de Janeiro, 2024',
      local: 'Praça Central de Massinga',
      descricao: 'Uma feira vibrante onde produtores locais apresentam e vendem os seus produtos frescos. A comunidade reúne-se para apoiar a economia local e celebrar a riqueza dos produtos da nossa terra.',
      fotos: [
        { src: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80', alt: 'Feira de Frutas - Produtos Frescos' },
        { src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', alt: 'Feira de Frutas - Banca de Frutas e Vegetais' },
        { src: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80', alt: 'Feira de Frutas - Frutas Tropicais' },
        { src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&q=80', alt: 'Feira de Frutas - Produtos Locais' },
        { src: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80', alt: 'Feira de Frutas - Variedade de Frutas' },
        { src: 'https://images.unsplash.com/photo-1533900298318-6b8da3a8cf6b?w=800&q=80', alt: 'Feira de Frutas - Mercado Local' }
      ],
      categoria: 'Feira',
      participantes: 150
    },
    {
      id: 2,
      titulo: 'Workshop de Agricultura Sustentável',
      data: '15 de Janeiro, 2024',
      local: 'Centro Comunitário de Massinga',
      descricao: 'Sessão prática de capacitação onde agricultores aprendem técnicas modernas e sustentáveis para aumentar a produtividade das suas culturas, promovendo uma agricultura mais eficiente e amiga do ambiente.',
      fotos: [
        { src: '/assets/slider/slide2.jpg', alt: 'Workshop - Início da Sessão' },
        { src: '/assets/slider/slide3.jpg', alt: 'Workshop - Demonstração Prática' },
        { src: '/assets/slider/slide1.jpg', alt: 'Workshop - Participantes Atentos' },
        { src: '/assets/slider/slide2.jpg', alt: 'Workshop - Aplicação Prática' }
      ],
      categoria: 'Workshop',
      participantes: 45
    },
    {
      id: 3,
      titulo: 'Encontro Mensal da Associação',
      data: '20 de Janeiro, 2024',
      local: 'Sede da Associação',
      descricao: 'Reunião estratégica onde membros da associação discutem projetos em curso, planos futuros e desafios da comunidade, fortalecendo a união e o compromisso coletivo.',
      fotos: [
        { src: '/assets/galeria/encontro1.jpg', alt: 'Encontro - Reunião de Membros' },
        { src: '/assets/galeria/encontro2.jpg', alt: 'Encontro - Discussão de Projetos' },
        { src: '/assets/galeria/encontro3.jpg', alt: 'Encontro - Membros Participativos' }
      ],
      categoria: 'Reunião',
      participantes: 25
    },
    {
      id: 4,
      titulo: 'Festival Cultural',
      data: '10 de Fevereiro, 2024',
      local: 'Praça Central de Massinga',
      descricao: 'Celebração da cultura local com música, dança e gastronomia tradicional, unindo a comunidade em uma festa memorável.',
      fotos: [
        { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', alt: 'Festival da Cultura - Concerto ao Vivo' },
        { src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', alt: 'Festival da Cultura - Dança Tradicional' },
        { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', alt: 'Festival da Cultura - Música e Público' },
        { src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', alt: 'Festival da Cultura - Apresentação no Palco' },
        { src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80', alt: 'Festival da Cultura - Celebração' },
        { src: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80', alt: 'Festival da Cultura - Artistas em Palco' }
      ],
      categoria: 'Cultural',
      participantes: 300
    },
    {
      id: 5,
      titulo: 'Campanha de Limpeza',
      data: '5 de Março, 2024',
      local: 'Bairros de Massinga',
      descricao: 'Iniciativa comunitária para manter os bairros limpos e promover a consciência ambiental entre os residentes.',
      fotos: [
        { src: '/assets/galeria/limpeza1.jpg', alt: 'Limpeza - Voluntários' },
        { src: '/assets/galeria/limpeza2.jpg', alt: 'Limpeza - Ação Comunitária' },
        { src: '/assets/galeria/limpeza3.jpg', alt: 'Limpeza - Resultados' }
      ],
      categoria: 'Meio Ambiente',
      participantes: 80
    },
    {
      id: 6,
      titulo: 'Workshop de Empreendedorismo',
      data: '25 de Março, 2024',
      local: 'Centro Comunitário',
      descricao: 'Capacitação para jovens e adultos interessados em iniciar seus próprios negócios, com foco em sustentabilidade.',
      fotos: [
        { src: '/assets/galeria/workshop1.jpg', alt: 'Workshop - Sessão de Aprendizado' },
        { src: '/assets/galeria/workshop2.jpg', alt: 'Workshop - Participantes' },
        { src: '/assets/galeria/workshop3.jpg', alt: 'Workshop - Atividades Práticas' }
      ],
      categoria: 'Workshop',
      participantes: 60
    },
    {
      id: 7,
      titulo: 'Feira de Artesanato',
      data: '15 de Abril, 2024',
      local: 'Praça Central',
      descricao: 'Exposição e venda de produtos artesanais locais, valorizando o trabalho manual e a criatividade da comunidade.',
      fotos: [
        { src: '/assets/galeria/feira1.jpg', alt: 'Feira - Artesanato Local' },
        { src: '/assets/galeria/feira2.jpg', alt: 'Feira - Produtos Artesanais' },
        { src: '/assets/galeria/feira3.jpg', alt: 'Feira - Visitantes' }
      ],
      categoria: 'Feira',
      participantes: 200
    },
    {
      id: 8,
      titulo: 'Festival de Música',
      data: '1 de Maio, 2024',
      local: 'Anfiteatro Municipal',
      descricao: 'Celebração musical com artistas locais e regionais, promovendo a cultura e o entretenimento.',
      fotos: [
        { src: '/assets/galeria/festival5.jpg', alt: 'Festival - Artistas Locais' },
        { src: '/assets/galeria/festival6.jpg', alt: 'Festival - Público' },
        { src: '/assets/galeria/festival7.jpg', alt: 'Festival - Apresentação' }
      ],
      categoria: 'Cultural',
      participantes: 500
    },
    {
      id: 9,
      titulo: 'Dia de Limpeza Comunitária',
      data: '20 de Maio, 2024',
      local: 'Parques e Praças',
      descricao: 'Ação coletiva para preservar e melhorar os espaços públicos da comunidade.',
      fotos: [
        { src: '/assets/galeria/limpeza4.jpg', alt: 'Limpeza - Espaços Públicos' },
        { src: '/assets/galeria/limpeza5.jpg', alt: 'Limpeza - Comunidade Unida' },
        { src: '/assets/galeria/limpeza6.jpg', alt: 'Limpeza - Resultados Finais' }
      ],
      categoria: 'Meio Ambiente',
      participantes: 120
    },
  ];

  // Estado do modal
  modalAberto = false;
  eventoSelecionado: any = null;
  fotoAtual = 0;

  // Índice da foto atual em cada card da galeria (slide sequencial, um card de cada vez)
  cardPhotoIndices: number[] = [0, 0, 0, 0];
  imageLoaded: boolean[] = [true, true, true, true]; // para transição suave (fade)
  sectionVisible = false;
  private cardSlideInterval: any;
  private readonly CARD_SLIDE_STEP_MS = 5000; // intervalo entre cada avanço (um card de cada vez)
  private currentCardToAdvance = 0;
  private sectionObserver: IntersectionObserver | null = null;

  // Filtros
  categoriaAtiva = 'Todos';
  categorias: string[] = [];

  // Slider automático do modal
  private slideInterval: any;
  private readonly SLIDE_DURATION = 8000; // 8 segundos

  ngOnInit() {
    this.initScrollAnimations();
    this.initCardSlideWhenSectionVisible();
    this.extrairCategorias();
  }

  ngOnDestroy() {
    this.pararSlideAutomatico();
    this.stopCardSlideLoop();
    this.sectionObserver?.disconnect();
  }

  getCardPhotoIndex(cardIndex: number): number {
    return this.cardPhotoIndices[cardIndex] ?? 0;
  }

  onCardImageLoad(cardIndex: number): void {
    this.imageLoaded = this.imageLoaded.map((v, idx) => (idx === cardIndex ? true : v));
    this.cdr.markForCheck();
  }

  isCardImageLoaded(cardIndex: number): boolean {
    return this.imageLoaded[cardIndex] ?? true;
  }

  private initCardSlideWhenSectionVisible(): void {
    if (!this.galeriaSection?.nativeElement) return;
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.sectionVisible = entry.isIntersecting;
          if (this.sectionVisible && !this.modalAberto) {
            this.startCardSlideLoop();
          } else {
            this.stopCardSlideLoop();
          }
        });
      },
      { threshold: 0.2 }
    );
    this.sectionObserver.observe(this.galeriaSection.nativeElement);
  }

  private startCardSlideLoop(): void {
    this.stopCardSlideLoop();
    this.cardSlideInterval = setInterval(() => {
      const preview = this.getEventosPreview();
      const cardIndex = this.currentCardToAdvance % 4;
      const ev = preview[cardIndex];
      const len = ev?.fotos?.length ?? 1;
      if (len <= 0) {
        this.currentCardToAdvance++;
        return;
      }
      // Fade out antes de trocar a imagem
      this.imageLoaded = this.imageLoaded.map((v, idx) => (idx === cardIndex ? false : v));
      this.cdr.markForCheck();
      setTimeout(() => {
        const nextIdx = (this.cardPhotoIndices[cardIndex] + 1) % len;
        this.cardPhotoIndices = this.cardPhotoIndices.map((val, i) =>
          i === cardIndex ? nextIdx : val
        );
        this.currentCardToAdvance++;
        this.cdr.markForCheck();
      }, 350);
    }, this.CARD_SLIDE_STEP_MS);
  }

  private stopCardSlideLoop(): void {
    if (this.cardSlideInterval) {
      clearInterval(this.cardSlideInterval);
      this.cardSlideInterval = null;
    }
  }

  // Retorna apenas os primeiros 4 eventos para preview
  getEventosPreview(): any[] {
    return this.galeria.slice(0, 4);
  }

  extrairCategorias(): void {
    const categoriasSet = new Set(this.galeria.map(e => e.categoria));
    this.categorias = Array.from(categoriasSet).sort();
  }

  trackByEventoId(index: number, evento: any): any {
    return evento ? evento.id : index;
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaAtiva = categoria;
    // Implementar filtro se necessário
  }

  getCategoriaIcon(categoria: string): string {
    const icons: { [key: string]: string } = {
      'Feira': 'shopping_bag',
      'Workshop': 'menu_book',
      'Reunião': 'groups',
      'Meio Ambiente': 'eco',
      'Cultural': 'theater_comedy'
    };
    return icons[categoria] || '📸';
  }

  getCategoriCount(categoria: string): number {
    return this.galeria.filter(e => e.categoria === categoria).length;
  }

  private initScrollAnimations() {
    // Animações simplificadas - apenas fade in suave
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = this.galeriaSection.nativeElement.querySelectorAll('.evento-card');
          if (cards.length > 0) {
            gsap.to(cards, {
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power1.out"
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(this.galeriaSection.nativeElement);
  }

  abrirEvento(evento: any): void {
    this.eventoSelecionado = evento;
    this.fotoAtual = 0;
    this.modalAberto = true;
    this.stopCardSlideLoop();
    document.body.style.overflow = 'hidden';
    this.iniciarSlideAutomatico();
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.eventoSelecionado = null;
    this.fotoAtual = 0;
    document.body.style.overflow = 'auto';
    this.pararSlideAutomatico();
    if (this.sectionVisible) {
      this.startCardSlideLoop();
    }
  }

  proximaFoto(): void {
    if (this.eventoSelecionado && this.fotoAtual < this.eventoSelecionado.fotos.length - 1) {
      this.fotoAtual++;
    } else if (this.eventoSelecionado) {
      // Voltar para a primeira foto (loop)
      this.fotoAtual = 0;
    }
    // Reiniciar timer ao navegar manualmente
    this.reiniciarSlideAutomatico();
  }

  fotoAnterior(): void {
    if (this.fotoAtual > 0) {
      this.fotoAtual--;
    } else if (this.eventoSelecionado) {
      // Ir para a última foto (loop)
      this.fotoAtual = this.eventoSelecionado.fotos.length - 1;
    }
    // Reiniciar timer ao navegar manualmente
    this.reiniciarSlideAutomatico();
  }

  selecionarFoto(index: number): void {
    this.fotoAtual = index;
    // Reiniciar timer ao selecionar foto
    this.reiniciarSlideAutomatico();
  }

  // Slide automático
  private iniciarSlideAutomatico(): void {
    this.pararSlideAutomatico();
    this.slideInterval = setInterval(() => {
      this.proximaFoto();
    }, this.SLIDE_DURATION);
  }

  private pararSlideAutomatico(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  private reiniciarSlideAutomatico(): void {
    this.pararSlideAutomatico();
    this.iniciarSlideAutomatico();
  }

  // Navegação por teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.modalAberto) return;
    
    switch(event.key) {
      case 'ArrowLeft':
        this.fotoAnterior();
        break;
      case 'ArrowRight':
        this.proximaFoto();
        break;
      case 'Escape':
        this.fecharModal();
        break;
    }
  }
}
