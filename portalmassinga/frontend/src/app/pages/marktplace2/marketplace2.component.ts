import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Product, Category } from './models/marketplace2.models';
import { MARKETPLACE_CATEGORIES, MARKETPLACE_PRODUCTS } from './data/marketplace2.data';

@Component({
  selector: 'app-marketplace2',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './marketplace2.component.html',
  styleUrl: './marketplace2.component.scss'
})
export class Marketplace2Component implements OnInit, OnDestroy {
  // Estado da sidebar (recolhida ao entrar)
  sidebarOpen = false;
  
  // Filtros e busca
  searchQuery = '';
  selectedCategory = 'todos';
  sortBy: 'recent' | 'price-low' | 'price-high' | 'name' = 'recent';
  
  // Dados
  categories: Category[] = MARKETPLACE_CATEGORIES;
  products: Product[] = MARKETPLACE_PRODUCTS;
  filteredProducts: Product[] = [];
  
  // Estatísticas
  totalProducts = 0;
  activeFilters = 0;
  currentYear = new Date().getFullYear();

  // Hero slides (imagens de agricultura e produtos locais)
  heroSlides: { title: string; subtitle: string; image: string }[] = [
    {
      title: 'Produtos Locais de Massinga',
      subtitle: 'Comércio sustentável da província de Inhambane',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200'
    },
    {
      title: 'Inhambane — Terra de Oportunidades',
      subtitle: 'Agricultura, artesanato e alimentação 100% local',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200'
    },
    {
      title: 'Comércio Local Sustentável',
      subtitle: 'Conectamos produtores locais com a comunidade',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200'
    }
  ];
  currentSlide = 0;
  private slideInterval: any;

  showAnunciarPopup = false;
  anunciarStep: 1 | 2 | 3 | 4 | 5 = 1;
  anunciarSubmitting = false;

  anunciarForm = {
    title: '',
    description: '',
    category: '',
    price: null as number | null,
    location: '',
    seller: '',
    contact: '',
    image: ''
  };

  anunciarSteps = [
    { num: 1, label: 'Produto' },
    { num: 2, label: 'Preço e contacto' },
    { num: 3, label: 'Imagem' },
    { num: 4, label: 'Revisão' }
  ];

  readonly defaultImages: Record<string, string> = {
    artesanato: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
    agricultura: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    servicos: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    alimentacao: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    outros: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.doc.body.classList.add('marketplace-page');
    this.filterProducts();
    this.updateStats();
    this.startHeroSlides();
  }

  ngOnDestroy(): void {
    this.doc.body.classList.remove('marketplace-page');
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startHeroSlides(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 10000);
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startHeroSlides();
    }
  }

  openAnunciarPopup(): void {
    this.resetAnunciarForm();
    this.anunciarStep = 1;
    this.showAnunciarPopup = true;
    this.cdr.detectChanges();
  }

  closeAnunciarPopup(): void {
    if (this.anunciarSubmitting) return;
    this.showAnunciarPopup = false;
    this.anunciarStep = 1;
    this.resetAnunciarForm();
  }

  resetAnunciarForm(): void {
    this.anunciarForm = {
      title: '',
      description: '',
      category: '',
      price: null,
      location: '',
      seller: '',
      contact: '',
      image: ''
    };
  }

  getAnunciarCategories(): Category[] {
    return this.categories.filter(c => c.id !== 'todos');
  }

  canProceedAnunciar(): boolean {
    switch (this.anunciarStep) {
      case 1:
        return !!(this.anunciarForm.title.trim() && this.anunciarForm.description.trim() && this.anunciarForm.category);
      case 2:
        return !!(this.anunciarForm.price && this.anunciarForm.price > 0
          && this.anunciarForm.location.trim() && this.anunciarForm.seller.trim());
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  }

  nextAnunciarStep(): void {
    if (!this.canProceedAnunciar()) return;
    if (this.anunciarStep === 4) {
      this.submitAnunciar();
      return;
    }
    if (this.anunciarStep < 5) {
      this.anunciarStep = (this.anunciarStep + 1) as 1 | 2 | 3 | 4 | 5;
    }
  }

  prevAnunciarStep(): void {
    if (this.anunciarStep > 1 && this.anunciarStep < 5) {
      this.anunciarStep = (this.anunciarStep - 1) as 1 | 2 | 3 | 4 | 5;
    }
  }

  submitAnunciar(): void {
    this.anunciarSubmitting = true;
    setTimeout(() => {
      const nextId = this.products.length > 0
        ? Math.max(...this.products.map(p => p.id)) + 1
        : 1;
      const category = this.anunciarForm.category;
      const newProduct: Product = {
        id: nextId,
        title: this.anunciarForm.title.trim(),
        description: this.anunciarForm.description.trim(),
        price: this.anunciarForm.price!,
        image: this.anunciarForm.image.trim() || this.defaultImages[category] || this.defaultImages['outros'],
        category,
        seller: this.anunciarForm.seller.trim(),
        location: this.anunciarForm.location.trim(),
        datePosted: new Date().toISOString().split('T')[0],
        featured: false
      };
      this.products = [newProduct, ...this.products];
      this.filterProducts();
      this.updateStats();
      this.anunciarSubmitting = false;
      this.anunciarStep = 5;
      this.cdr.detectChanges();
    }, 1200);
  }

  scrollToProducts(): void {
    const el = document.querySelector('.marketplace-main');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  finishAnunciarAndView(): void {
    this.closeAnunciarPopup();
    this.selectedCategory = 'todos';
    this.searchQuery = '';
    this.filterProducts();
    this.updateStats();
    setTimeout(() => this.scrollToProducts(), 300);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProducts();
    this.updateStats();
  }

  onSearchChange(): void {
    this.filterProducts();
    this.updateStats();
  }

  onSortChange(sort: 'recent' | 'price-low' | 'price-high' | 'name'): void {
    this.sortBy = sort;
    this.filterProducts();
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

    // Ordenar
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
  }

  sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    
    switch (this.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'recent':
      default:
        return sorted.sort((a, b) => 
          new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );
    }
  }

  updateStats(): void {
    this.totalProducts = this.filteredProducts.length;
    this.activeFilters = (this.selectedCategory !== 'todos' ? 1 : 0) + 
                        (this.searchQuery.trim() ? 1 : 0);
  }

  clearFilters(): void {
    this.selectedCategory = 'todos';
    this.searchQuery = '';
    this.sortBy = 'recent';
    this.filterProducts();
    this.updateStats();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `Há ${diffDays} dias`;
    
    return new Intl.DateTimeFormat('pt-MZ', {
      day: 'numeric',
      month: 'short'
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

  getCategoryColor(categoryId: string): string {
    const colors: { [key: string]: string } = {
      'artesanato': '#8B5CF6',
      'agricultura': '#10B981',
      'servicos': '#3B82F6',
      'alimentacao': '#F59E0B',
      'vestuario': '#EC4899',
      'outros': '#6B7280'
    };
    return colors[categoryId] || '#6B7280';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCBmaWxsPSIjRjBGNEZGIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzYzNjZGMUUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4Ij5JbWFnZW0gbsOjbyBkaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=';
  }

  contactSeller(product: Product): void {
    // Implementar lógica de contato
    console.log('Contactar vendedor:', product.seller);
  }

  viewProduct(product: Product): void {
    // Implementar visualização detalhada
    console.log('Ver produto:', product.title);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  getProductCountText(): string {
    const count = this.totalProducts;
    const produtoText = count !== 1 ? 'produtos' : 'produto';
    const encontradoText = count !== 1 ? 'encontrados' : 'encontrado';
    return `${count} ${produtoText} ${encontradoText}`;
  }

  getCategoryProductCount(categoryId: string): number {
    if (categoryId === 'todos') return this.products.length;
    return this.products.filter(p => p.category === categoryId).length;
  }

  getFeaturedProducts(): Product[] {
    if (this.selectedCategory !== 'todos' || this.searchQuery.trim()) {
      return [];
    }
    return this.filteredProducts.filter(p => p.featured).slice(0, 4);
  }

  getRegularProducts(): Product[] {
    const featuredIds = new Set(this.getFeaturedProducts().map(p => p.id));
    return this.filteredProducts.filter(p => !featuredIds.has(p.id));
  }

  getMainGridProducts(): Product[] {
    return this.showFeaturedSection() ? this.getRegularProducts() : this.filteredProducts;
  }

  showFeaturedSection(): boolean {
    return this.getFeaturedProducts().length > 0;
  }
}

