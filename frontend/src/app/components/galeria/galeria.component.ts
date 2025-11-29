import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss',
})
export class GaleriaComponent implements OnInit, OnDestroy {
  @ViewChild('galeriaSection', { static: true }) galeriaSection!: ElementRef;

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
        { src: '/assets/slider/slide3.jpg', alt: 'Encontro - Reunião de Membros' },
        { src: '/assets/slider/slide1.jpg', alt: 'Encontro - Discussão de Projetos' },
        { src: '/assets/slider/slide2.jpg', alt: 'Encontro - Membros Participativos' }
      ],
      categoria: 'Reunião',
      participantes: 25
    },
  ];

  // Estado do modal
  modalAberto = false;
  eventoSelecionado: any = null;
  fotoAtual = 0;

  // Filtros
  categoriaAtiva = 'Todos';
  categorias: string[] = [];
  galeriaFiltrada: any[] = [];

  // Slider automático
  private slideInterval: any;
  private readonly SLIDE_DURATION = 4000; // 4 segundos

  ngOnInit() {
    this.initScrollAnimations();
    this.extrairCategorias();
    this.galeriaFiltrada = [...this.galeria];
  }

  ngOnDestroy() {
    this.pararSlideAutomatico();
  }

  extrairCategorias(): void {
    const categoriasSet = new Set(this.galeria.map(e => e.categoria));
    this.categorias = Array.from(categoriasSet).sort();
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaAtiva = categoria;
    if (categoria === 'Todos') {
      this.galeriaFiltrada = [...this.galeria];
    } else {
      this.galeriaFiltrada = this.galeria.filter(e => e.categoria === categoria);
    }
  }

  getCategoriaIcon(categoria: string): string {
    const icons: { [key: string]: string } = {
      'Feira': '🛍️',
      'Workshop': '📚',
      'Reunião': '👥',
      'Meio Ambiente': '🌱',
      'Cultural': '🎭'
    };
    return icons[categoria] || '📸';
  }

  getCategoriCount(categoria: string): number {
    return this.galeria.filter(e => e.categoria === categoria).length;
  }

  private initScrollAnimations() {
    // Configurar posição inicial da seção com fade in
    gsap.set(this.galeriaSection.nativeElement, { 
      opacity: 0, 
      y: 60,
      scale: 0.98
    });
    
    // Criar um observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Timeline para fade in profissional
          const tl = gsap.timeline();
          
          // Animar a entrada da seção
          tl.to(this.galeriaSection.nativeElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
          });
          
          // Animar os cards em cascata
          const cards = this.galeriaSection.nativeElement.querySelectorAll('.evento-card');
          if (cards.length > 0) {
            gsap.set(cards, { opacity: 0, y: 40 });
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.3
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
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