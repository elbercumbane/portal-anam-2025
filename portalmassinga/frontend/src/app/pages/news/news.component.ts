import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageTransitionService } from '../../services/page-transition.service';
import { NOTICIAS, Noticia, NOTICIA_IMAGE_FALLBACK } from './news.data';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit, OnDestroy {
  @ViewChild('noticiasContent', { static: true }) noticiasContent!: ElementRef;

  noticias: Noticia[] = NOTICIAS;
  noticiaSelecionada: Noticia | null = null;
  categoriaFiltro = '';
  imageFallback = NOTICIA_IMAGE_FALLBACK;

  constructor(private pageTransitionService: PageTransitionService) {}

  ngOnInit() {
    this.pageTransitionService.pageEnter(this.noticiasContent.nativeElement);
  }

  ngOnDestroy() {}

  get featuredNoticia(): Noticia | null {
    return this.noticias[0] ?? null;
  }

  get secondaryHighlights(): Noticia[] {
    return this.noticias.slice(1, 4);
  }

  getCategorias(): string[] {
    return [...new Set(this.noticias.map(n => n.categoria))];
  }

  getCountByCategory(categoria: string): number {
    return this.noticias.filter(n => n.categoria === categoria).length;
  }

  getRecentNews(): Noticia[] {
    return this.noticias.slice(0, 5);
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaFiltro = categoria;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getGridNews(): Noticia[] {
    const filtered = this.categoriaFiltro
      ? this.noticias.filter(n => n.categoria === this.categoriaFiltro)
      : this.noticias.slice(4);
    return filtered;
  }

  selecionarNoticia(noticia: Noticia): void {
    this.noticiaSelecionada = noticia;
    document.body.style.overflow = 'hidden';
  }

  fecharDetalhes(): void {
    this.noticiaSelecionada = null;
    document.body.style.overflow = '';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.dataset['fallback']) {
      img.dataset['fallback'] = 'true';
      img.src = this.imageFallback;
    }
  }
}
