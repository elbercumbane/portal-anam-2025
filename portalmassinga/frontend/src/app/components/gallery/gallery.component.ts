import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, OnDestroy {
  @ViewChild('galeriaSection', { static: true }) galeriaSection!: ElementRef;

  private apiClient = inject(ApiClientService);

  // Dados para galeria de eventos
  galeria: any[] = [
    {
      id: 1,
      titulo: 'Feira de Produtos Locais',
      data: '30 de Janeiro, 2024',
      local: 'Praça Central de Massinga',
      descricao: 'Uma feira vibrante onde produtores locais apresentam e vendem os seus produtos frescos. A comunidade reúne-se para apoiar a economia local e celebrar a riqueza dos produtos da nossa terra.',
      fotos: [
        { src: '/assets/slider/slide1.jpg', alt: 'Feira de Produtos - Vista Geral da Praça' },
        { src: '/assets/slider/slide2.jpg', alt: 'Feira de Produtos - Produtores Locais' },
        { src: '/assets/slider/slide3.jpg', alt: 'Feira de Produtos - Produtos Frescos' },
        { src: '/assets/slider/slide1.jpg', alt: 'Feira de Produtos - Comunidade Participante' },
        { src: '/assets/slider/slide2.jpg', alt: 'Feira de Produtos - Vendas e Negócios' }
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
        { src: '/assets/galeria/festival1.jpg', alt: 'Festival - Apresentação Cultural' },
        { src: '/assets/galeria/festival2.jpg', alt: 'Festival - Dança Tradicional' },
        { src: '/assets/galeria/festival3.jpg', alt: 'Festival - Música ao Vivo' },
        { src: '/assets/galeria/festival4.jpg', alt: 'Festival - Gastronomia' }
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

  // Filtros
  categoriaAtiva = 'Todos';
  categorias: string[] = [];

  // Slider automático do modal
  private slideInterval: any;
  private readonly SLIDE_DURATION = 8000; // 8 segundos

  ngOnInit() {
    // Carregar galeria da base de dados
    this.loadGalleryFromDatabase();
    this.initScrollAnimations();
    this.extrairCategorias();
  }

  /**
   * Carrega galeria da base de dados
   */
  loadGalleryFromDatabase(): void {
    this.apiClient.getHomeContent(true).subscribe({
      next: (contents: any[]) => {
        // Filtrar apenas eventos da galeria
        const galleryItems = contents
          .filter(c => c.sectionKey && c.sectionKey.startsWith('gallery_event_'))
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        if (galleryItems.length > 0) {
          this.galeria = galleryItems.map((item, index) => {
            let metadata: any = {};
            if (item.metadata) {
              try {
                metadata = JSON.parse(item.metadata);
              } catch (e) {
                console.warn('Erro ao parsear metadata de galeria:', e);
              }
            }
            
            return {
              id: index + 1,
              titulo: item.title || '',
              data: metadata['data'] || '',
              local: metadata['local'] || '',
              descricao: item.subtitle || '',
              fotos: metadata['fotos'] || [{ src: item.imageUrl || '/assets/slider/slide1.jpg', alt: item.title || '' }],
              categoria: metadata['categoria'] || 'Geral',
              participantes: metadata['participantes'] || 0
            };
          });
          
          // Atualizar categorias após carregar dados
          this.extrairCategorias();
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar galeria da base de dados:', error);
        // Manter dados padrão em caso de erro
        this.extrairCategorias();
      }
    });
  }

  ngOnDestroy() {
    this.pararSlideAutomatico();
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
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
    // Iniciar slide automático
    this.iniciarSlideAutomatico();
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.eventoSelecionado = null;
    this.fotoAtual = 0;
    // Restaurar scroll do body
    document.body.style.overflow = 'auto';
    // Parar slide automático
    this.pararSlideAutomatico();
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
