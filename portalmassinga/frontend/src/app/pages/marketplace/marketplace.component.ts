import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller: string;
  location: string;
  datePosted: string;
  featured?: boolean;
}

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.scss'
})
export class MarketplaceComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('slider', { static: true }) slider!: ElementRef;
  @ViewChild('heroContent', { static: true }) heroContent!: ElementRef;
  @ViewChild('heroTitle', { static: true }) heroTitle!: ElementRef;
  @ViewChild('heroSubtitleBox', { static: true }) heroSubtitleBox!: ElementRef;

  searchQuery = '';
  selectedCategory = 'todos';
  currentSlide = 0;
  location = 'Massinga, Inhambane';
  private slideTimeout: any;
  
  slides = [
    {
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920',
      titleLine1: 'Marketplace',
      titleLine2: 'da Associação',
      subtitle: 'Conectando membros e comunidades através do comércio local sustentável'
    },
    {
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920',
      titleLine1: 'Comércio',
      titleLine2: 'Sustentável',
      subtitle: 'Fortalecendo a economia comunitária e apoiando produtores locais'
    },
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
      titleLine1: 'Produtos',
      titleLine2: 'Locais',
      subtitle: 'Descubra artesanato, produtos agrícolas e serviços da nossa região'
    }
  ];

  particles: Array<{left: number, delay: number, duration: number}> = [];
  
  stats = [
    { valor: '150+', label: 'Produtos', icon: 'inventory_2', cor: 'var(--gradient-primary)' },
    { valor: '45+', label: 'Vendedores', icon: 'people', cor: 'var(--gradient-secondary)' },
    { valor: '6', label: 'Categorias', icon: 'category', cor: 'var(--gradient-primary)' },
    { valor: '98%', label: 'Satisfação', icon: 'favorite', cor: 'var(--gradient-accent)' }
  ];
  
  categories = [
    { id: 'todos', label: 'Todos', icon: 'apps' },
    { id: 'artesanato', label: 'Artesanato', icon: 'brush' },
    { id: 'agricultura', label: 'Agricultura', icon: 'agriculture' },
    { id: 'servicos', label: 'Serviços', icon: 'build' },
    { id: 'alimentacao', label: 'Alimentação', icon: 'restaurant' },
    { id: 'vestuario', label: 'Vestuário', icon: 'checkroom' },
    { id: 'outros', label: 'Outros', icon: 'category' }
  ];

  products: Product[] = [
    {
      id: 1,
      title: 'Cestas Artesanais de Palha',
      description: 'Cestas tradicionais feitas à mão com palha local. Perfeitas para decoração e uso doméstico.',
      price: 250,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
      category: 'artesanato',
      seller: 'Maria João',
      location: 'Massinga',
      datePosted: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      title: 'Produtos Agrícolas Orgânicos',
      description: 'Variedade de legumes e frutas frescas cultivadas localmente sem pesticidas.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      category: 'agricultura',
      seller: 'Cooperativa Agrícola',
      location: 'Inhambane',
      datePosted: '2024-01-14',
      featured: true
    },
    {
      id: 3,
      title: 'Serviços de Costura',
      description: 'Costura profissional para roupas tradicionais e modernas. Ajustes e reparos.',
      price: 100,
      image: 'https://images.unsplash.com/photo-1515356619894-b8913e1ab8e1?w=400',
      category: 'servicos',
      seller: 'Ana Silva',
      location: 'Maputo',
      datePosted: '2024-01-13'
    },
    {
      id: 4,
      title: 'Mel Natural da Região',
      description: 'Mel puro extraído de forma sustentável. Embalagem de 500g.',
      price: 300,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
      category: 'alimentacao',
      seller: 'Apicultores Locais',
      location: 'Vilanculos',
      datePosted: '2024-01-12',
      featured: true
    },
    {
      id: 5,
      title: 'Roupas Tradicionais',
      description: 'Capulanas e roupas tradicionais moçambicanas. Vários tamanhos disponíveis.',
      price: 400,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      category: 'vestuario',
      seller: 'Moda Tradicional',
      location: 'Beira',
      datePosted: '2024-01-11'
    },
    {
      id: 6,
      title: 'Oleaginosas e Sementes',
      description: 'Amendoim, gergelim e outras sementes locais. Pacotes de 1kg.',
      price: 120,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4e242c50?w=400',
      category: 'agricultura',
      seller: 'Produtores Locais',
      location: 'Chimoio',
      datePosted: '2024-01-10'
    },
    {
      id: 7,
      title: 'Cerâmica Artesanal',
      description: 'Vasos e utensílios de cerâmica feitos à mão. Cada peça é única.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      category: 'artesanato',
      seller: 'Artesãos Unidos',
      location: 'Nampula',
      datePosted: '2024-01-09'
    },
    {
      id: 8,
      title: 'Serviços de Jardinagem',
      description: 'Cuidados de jardim e paisagismo. Plantação e manutenção.',
      price: 200,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      category: 'servicos',
      seller: 'Verde Vida',
      location: 'Pemba',
      datePosted: '2024-01-08'
    }
  ];

  filteredProducts: Product[] = [];

  ngOnInit(): void {
    this.filteredProducts = this.products;
    this.initParticles();
    this.startSlideCycle();
  }

  ngAfterViewInit(): void {
    this.animateHero();
  }

  ngOnDestroy(): void {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }
  }

  initParticles(): void {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10
      });
    }
  }

  startSlideCycle(): void {
    this.scheduleNextSlide();
  }

  scheduleNextSlide(): void {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }
    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
      this.scheduleNextSlide();
    }, 6000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.animateSlideTransition();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.animateSlideTransition();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length && index !== this.currentSlide) {
      this.currentSlide = index;
      this.animateSlideTransition();
      if (this.slideTimeout) clearTimeout(this.slideTimeout);
      this.scheduleNextSlide();
    }
  }

  animateSlideTransition(): void {
    const slideElement = this.slider.nativeElement.querySelector('.slide');
    if (slideElement) {
      slideElement.style.opacity = '0';
      setTimeout(() => {
        slideElement.style.opacity = '1';
      }, 300);
    }
    this.animateHero();
  }

  animateHero(): void {
    if (this.heroTitle && this.heroSubtitleBox) {
      this.heroTitle.nativeElement.style.animation = 'none';
      this.heroSubtitleBox.nativeElement.style.animation = 'none';
      setTimeout(() => {
        this.heroTitle.nativeElement.style.animation = 'fadeInUp 0.8s ease-out';
        this.heroSubtitleBox.nativeElement.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
      }, 10);
    }
  }

  scrollToProducts(): void {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToCTA(): void {
    const element = document.getElementById('cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  filterProducts(): void {
    let filtered = [...this.products];

    // Filtrar por categoria
    if (this.selectedCategory !== 'todos') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filtrar por busca
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.seller.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.icon || 'category';
  }

  getCategoryLabel(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.label || 'Outros';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCBmaWxsPSIjRjBGNEZGIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzYzNjZGMUUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4Ij5JbWFnZW0gbsOjbyBkaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=';
  }

  resetFilters(): void {
    this.selectedCategory = 'todos';
    this.searchQuery = '';
    this.filterProducts();
  }
}

