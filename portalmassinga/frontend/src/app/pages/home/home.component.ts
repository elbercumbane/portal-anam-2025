import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';
import { PageTransitionService } from '../../services/page-transition.service';
import { GsapAnimationsService } from '../../services/gsap-animations.service';
import { ApiClientService } from '../../services/api-client.service';

// Import section components
import { HistorySectionComponent } from './sections/history/history.component';
import { EventsSectionComponent } from './sections/events/events.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { PartnersSectionComponent } from './sections/partners/partners.component';
import { SantaPopupComponent } from './sections/santa-popup/santa-popup.component';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';

// Importar arquivos de animação e dados separados
import { SLIDER_CONFIG } from './home.data';
import { HomeSliderAnimations, SliderRefs } from './home-slider.animations';
import { inicializarAnimacoesHistoria, inicializarAnimacoesQuemSomos } from './home-sections.animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule, 
    CommonModule, 
    HistorySectionComponent,
    EventsSectionComponent, 
    GalleryComponent, 
    PartnersSectionComponent,
    SantaPopupComponent,
    ScrollToTopComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroContent', { static: true }) heroContent!: ElementRef;
  @ViewChild('heroTitle', { static: true }) heroTitle!: ElementRef;
  @ViewChild('titlePartLeft', { static: true }) titlePartLeft!: ElementRef;
  @ViewChild('titlePartRight', { static: true }) titlePartRight!: ElementRef;
  @ViewChild('heroSubtitle', { static: true }) heroSubtitle!: ElementRef;
  @ViewChild('heroSubtitleBox', { static: true }) heroSubtitleBox!: ElementRef;
  @ViewChild('heroButton') heroButton?: ElementRef;
  @ViewChild('slider', { static: true }) slider!: ElementRef;
  @ViewChild('historiaSection', { static: true }) historiaSection!: ElementRef;
  @ViewChild('quemSomosSection', { static: true }) quemSomosSection!: ElementRef;

  public currentSlide = 0;
  public totalSlides = SLIDER_CONFIG.totalSlides;
  private slideTimeout: any;
  public snowflakes: Array<{left: number, delay: number, duration: number}> = [];
  public enableSnow = true; // Valor padrão, será carregado da API
  public enableSanta = true; // Valor padrão, será carregado da API

  private sliderAnimations = new HomeSliderAnimations();

  constructor(
    private animationService: AnimationService,
    private pageTransitionService: PageTransitionService,
    private activatedRoute: ActivatedRoute,
    private gsapAnimations: GsapAnimationsService,
    private apiClient: ApiClientService
  ) {}

  ngOnInit() {
    this.loadChristmasConfig();
    this.initSliderAnimations();
    inicializarAnimacoesHistoria(this.historiaSection);
    inicializarAnimacoesQuemSomos(this.quemSomosSection);
    
    setTimeout(() => {
      this.gsapAnimations.initAllAnimations();
    }, 100);
  }

  private loadChristmasConfig(): void {
    // Tentar carregar configurações de Natal da API
    this.apiClient.getHomeContentBySectionKey('christmas_config').subscribe({
      next: (content: any) => {
        if (content && content.metadata) {
          try {
            const christmasData = JSON.parse(content.metadata);
            this.enableSnow = christmasData.enableSnow !== false; // Default true se não especificado
            this.enableSanta = christmasData.enableSanta !== false; // Default true se não especificado
            
            // Inicializar neve apenas se estiver habilitada
            if (this.enableSnow) {
              this.initSnowflakes();
            }
          } catch (e) {
            console.error('Erro ao parsear configurações de Natal:', e);
            // Usar valores padrão se houver erro no parse
            this.initSnowflakes();
          }
        } else {
          // Se não houver configuração, usar valores padrão (neve e santa habilitados)
          this.initSnowflakes();
        }
      },
      error: (error) => {
        // Se houver erro ao carregar (endpoint não encontrado, etc), usar valores padrão
        // Isso permite que a página funcione mesmo se a API não estiver disponível
        console.warn('Não foi possível carregar configurações de Natal da API, usando padrões:', error);
        this.initSnowflakes();
      }
    });
  }

  private initSnowflakes() {
    if (!this.enableSnow) {
      return; // Não inicializar se estiver desabilitado
    }
    
    for (let i = 0; i < SLIDER_CONFIG.quantidadeFlocos; i++) {
      this.snowflakes.push({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10
      });
    }
  }

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          this.scrollToSection(fragment);
        }, 100);
      }
    });
  }

  private getSliderRefs(): SliderRefs {
    return {
      heroContent: this.heroContent,
      heroTitle: this.heroTitle,
      titlePartLeft: this.titlePartLeft,
      titlePartRight: this.titlePartRight,
      heroSubtitle: this.heroSubtitle,
      heroSubtitleBox: this.heroSubtitleBox,
      heroButton: this.heroButton,
      slider: this.slider
    };
  }

  private initSliderAnimations() {
    const refs = this.getSliderRefs();
    this.sliderAnimations.configurarAnimacoesIniciais(refs);
    this.sliderAnimations.configurarAnimacoesImagens(refs);
    this.startSlideCycle();
  }

  private startSlideCycle() {
    this.scheduleNextSlide();
  }

  private scheduleNextSlide() {
    const duracaoAtual = SLIDER_CONFIG.duracoesPorSlideMs[this.currentSlide] ?? 12000;

    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }

    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
      this.scheduleNextSlide();
    }, duracaoAtual);
  }

  public nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.animateSlideTransition();
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
    this.scheduleNextSlide();
  }

  public prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.animateSlideTransition();
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
    this.scheduleNextSlide();
  }

  public goToSlide(index: number): void {
    if (index >= 0 && index < this.totalSlides && index !== this.currentSlide) {
      this.currentSlide = index;
      this.animateSlideTransition();
      if (this.slideTimeout) clearTimeout(this.slideTimeout);
      this.scheduleNextSlide();
    }
  }

  private animateSlideTransition() {
    this.sliderAnimations.animarTransicaoSlide(this.getSliderRefs(), this.currentSlide, this.totalSlides);
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
    this.sliderAnimations.destruir();
    this.gsapAnimations.killAllAnimations();
  }
}
