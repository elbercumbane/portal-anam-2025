import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';

// Import section components
import { HistorySectionComponent } from './sections/history/history.component';
import { EventsSectionComponent } from './sections/events/events.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { PartnersSectionComponent } from './sections/partners/partners.component';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';
import { StatsSectionComponent } from './sections/stats/stats.component';
import { NewsSectionComponent } from './sections/news/news.component';

// Importar dados
import { SLIDE_TEXTOS } from './home.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule, 
    CommonModule,
    RouterModule,
    HistorySectionComponent,
    EventsSectionComponent, 
    GalleryComponent, 
    PartnersSectionComponent,
    ScrollToTopComponent,
    StatsSectionComponent,
    NewsSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public currentSlide = 0;
  private slideTimeout: any;
  public isTransitioning = false;
  
  slides = [
    { 
      imagem: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80' // Bem-vindo - Comunidade unida com pessoas negras
    },
    { 
      imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80' // Missão - Propósito e direção com pessoas negras
    },
    { 
      imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80' // Visão - Futuro e crescimento com pessoas negras
    },
    { 
      imagem: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80' // Valores - Trabalho em equipe com pessoas negras
    }
  ];

  // Configuração dos botões por slide
  slideButtons = [
    { 
      text: 'Torne-se Membro', 
      link: '/associar', 
      color: '#FFD700' // Amarelo
    },
    { 
      text: 'Torne-se Simpatizante', 
      link: '/associar', 
      color: '#EF4444' // Vermelho
    },
    { 
      text: 'Torne-se Apoiante', 
      link: '/associar', 
      color: '#60A5FA' // Azul
    },
    { 
      text: 'Torne-se Parceiro', 
      link: '/parceiros', 
      color: '#4CAF50' // Verde
    }
  ];

  getCurrentButton() {
    return this.slideButtons[this.currentSlide] || this.slideButtons[0];
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiClient: ApiClientService
  ) {}

  ngOnInit() {
    this.startSlideCycle();
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          this.scrollToSection(fragment);
        }, 100);
      }
    });
  }

  getCurrentTitle(): string {
    return SLIDE_TEXTOS[this.currentSlide]?.titulo || '';
  }

  getCurrentSubtitle(): string {
    return SLIDE_TEXTOS[this.currentSlide]?.subtitulo || '';
  }

  private startSlideCycle() {
    this.scheduleNextSlide();
  }

  private scheduleNextSlide() {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }

    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
      this.scheduleNextSlide();
    }, 8000); // 8 segundos por slide
  }

  public nextSlide() {
    this.isTransitioning = true;
    setTimeout(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      setTimeout(() => {
        this.isTransitioning = false;
      }, 200);
    }, 400);
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
    this.scheduleNextSlide();
  }

  public goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length && index !== this.currentSlide) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.currentSlide = index;
        setTimeout(() => {
          this.isTransitioning = false;
        }, 200);
      }, 400);
      if (this.slideTimeout) clearTimeout(this.slideTimeout);
      this.scheduleNextSlide();
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy() {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }
  }
}
