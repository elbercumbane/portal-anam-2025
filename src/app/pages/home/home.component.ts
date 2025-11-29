import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';
import { PageTransitionService } from '../../services/page-transition.service';
import { GsapAnimationsService } from '../../services/gsap-animations.service';
import { gsap } from 'gsap';

// Importar os novos componentes das seções
import { HistorialComponent } from './sections/historial/historial.component';
import { EventosComponent } from './sections/eventos/eventos.component';
import { GaleriaComponent } from '../../components/galeria/galeria.component';
import { ParceirosComponent } from './sections/parceiros/parceiros.component';
import { FooterSimpleComponent } from './sections/footer-simple/footer-simple.component';
import { MessagePopupComponent } from './sections/message-popup/message-popup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule, 
    CommonModule, 
    HistorialComponent,
    EventosComponent, 
    GaleriaComponent, 
    ParceirosComponent,
    FooterSimpleComponent,
    MessagePopupComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroContent', { static: true }) heroContent!: ElementRef;
  @ViewChild('heroTitle', { static: true }) heroTitle!: ElementRef;
  @ViewChild('heroSubtitle', { static: true }) heroSubtitle!: ElementRef;
  @ViewChild('heroButton') heroButton?: ElementRef;
  @ViewChild('slider', { static: true }) slider!: ElementRef;
  @ViewChild('historiaSection', { static: true }) historiaSection!: ElementRef;
  @ViewChild('quemSomosSection', { static: true }) quemSomosSection!: ElementRef;

  public currentSlide = 0;
  public totalSlides = 2;
  private slideTimeout: any;

  // Textos para cada slide
  private slideTexts = [
    {
      title: "Bem-vindo à Associação de Naturais e Amigos de Massinga",
      subtitle: "Unidos por uma visão de desenvolvimento e união"
    },
    {
      title: "Nossa Missão",
      subtitle: "Desenvolvimento comunitário e fortalecimento dos laços"
    }
  ];


  constructor(
    private animationService: AnimationService,
    private pageTransitionService: PageTransitionService,
    private activatedRoute: ActivatedRoute,
    private gsapAnimations: GsapAnimationsService
  ) {}

  ngOnInit() {
    this.initSliderAnimations();
    this.initHistoriaAnimations();
    this.initQuemSomosAnimations();
    
    // Inicializar animações GSAP
    setTimeout(() => {
      this.gsapAnimations.initAllAnimations();
    }, 100);
  }

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        // Usar um pequeno atraso para garantir que a view esteja totalmente renderizada antes de rolar
        setTimeout(() => {
          this.scrollToSection(fragment);
        }, 100);
      }
    });
  }

  private initSliderAnimations() {
    // Configurar animações iniciais
    this.setupInitialAnimations();
    
    // Configurar animações das imagens
    this.setupImageAnimations();
    
    // Iniciar ciclo de slides
    this.startSlideCycle();
  }

  private setupInitialAnimations() {
    // Definir texto inicial
    this.heroTitle.nativeElement.textContent = this.slideTexts[0].title;
    this.heroSubtitle.nativeElement.textContent = this.slideTexts[0].subtitle;

    // Animação inicial do conteúdo
    gsap.set(this.heroContent.nativeElement, { opacity: 0 });
    gsap.set(this.heroTitle.nativeElement, { y: 50, opacity: 0 });
    gsap.set(this.heroSubtitle.nativeElement, { x: -50, opacity: 0 });
    if (this.heroButton) {
      gsap.set(this.heroButton.nativeElement, { y: 30, opacity: 0 });
    }

    // Timeline principal
    const tl = gsap.timeline();
    
    tl.to(this.heroContent.nativeElement, { opacity: 1, duration: 0.5 })
      .to(this.heroTitle.nativeElement, { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power3.out" 
      }, "-=0.3")
      .to(this.heroSubtitle.nativeElement, { 
        x: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power3.out" 
      }, "-=0.7")
    
    if (this.heroButton) {
      tl.to(this.heroButton.nativeElement, { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)" 
      }, "-=0.5");
    }
  }

  private setupImageAnimations() {
    const slides = this.slider.nativeElement.querySelectorAll('.slide');
    
    // Configurar posição inicial das imagens
    slides.forEach((slide: HTMLElement, index: number) => {
      gsap.set(slide, { 
        opacity: index === 0 ? 1 : 0,
        scale: 1.1
      });
    });
  }

  private startSlideCycle() {
    this.scheduleNextSlide();
  }

  private scheduleNextSlide() {
    const durationsMs = [12000, 12000]; // 12 segundos para cada slide
    const currentDuration = durationsMs[this.currentSlide] ?? 12000;

    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }

    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
      this.scheduleNextSlide();
    }, currentDuration);
  }

  private nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.animateSlideTransition();
  }

  public goToSlide(index: number): void {
    if (index >= 0 && index < this.totalSlides && index !== this.currentSlide) {
      this.currentSlide = index;
      this.animateSlideTransition();
      // Reiniciar o ciclo automático após navegação manual
      if (this.slideTimeout) {
        clearTimeout(this.slideTimeout);
      }
      this.scheduleNextSlide();
    }
  }

  private animateSlideTransition() {
    const currentText = this.slideTexts[this.currentSlide];
    const slides = this.slider.nativeElement.querySelectorAll('.slide');
    
    // Timeline principal para transição profissional
    const masterTl = gsap.timeline();
    
    // Animação de saída da imagem atual - Fade out suave
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    const currentImage = slides[prevIndex];
    masterTl.to(currentImage, { 
      opacity: 0, 
      duration: 1.2, 
      ease: "power2.inOut" 
    });
    
    // Animação de entrada da nova imagem - Fade in profissional com zoom inicial
    const newImage = slides[this.currentSlide];
    masterTl.fromTo(newImage, 
      { opacity: 0, scale: 1 },
      { 
        opacity: 1, 
        scale: 1,
        duration: 1.5, 
        ease: "power2.inOut" 
      }, "-=0.8");
    
    // Efeito Ken Burns - Zoom lento contínuo na imagem enquanto está visível
    masterTl.to(newImage, {
      scale: 1.15,
      duration: 12, // Duração do zoom (mesmo tempo que o slide fica visível)
      ease: "linear"
    }, "-=1");
    
    // Animação de saída do texto - Fade out simples e elegante
    masterTl.to([this.heroTitle.nativeElement, this.heroSubtitle.nativeElement], { 
      opacity: 0, 
      y: -20,
      duration: 0.5, 
      ease: "power2.in" 
    }, "-=12.2");

    // Alterar o texto durante a transição
    masterTl.call(() => {
      this.heroTitle.nativeElement.textContent = currentText.title;
      this.heroSubtitle.nativeElement.textContent = currentText.subtitle;
    }, [], "-=11.5");

    // Animação de entrada do texto - Fade in profissional
    masterTl.fromTo(this.heroTitle.nativeElement, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1, 
        ease: "power2.out" 
      }, "-=11.3"
    )
    .fromTo(this.heroSubtitle.nativeElement, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0,
        duration: 1, 
        ease: "power2.out" 
      }, "-=11");
  }

  private getInitialPosition(direction: string) {
    switch (direction) {
      case 'left':
        return { x: -100, y: 0, opacity: 0 };
      case 'right':
        return { x: 100, y: 0, opacity: 0 };
      case 'top':
        return { x: 0, y: -100, opacity: 0 };
      case 'bottom':
      default:
        return { x: 0, y: 100, opacity: 0 };
    }
  }

  private getExitPosition(direction: string) {
    switch (direction) {
      case 'left':
        return { x: -100, y: 0 };
      case 'right':
        return { x: 100, y: 0 };
      case 'top':
        return { x: 0, y: -100 };
      case 'bottom':
      default:
        return { x: 0, y: 100 };
    }
  }

  private initHistoriaAnimations() {
    // Configurar posição inicial da seção de história
    gsap.set(this.historiaSection.nativeElement, { opacity: 0, y: 50 });
    
    // Criar um observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar a entrada da seção
          gsap.to(this.historiaSection.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
          });
          
          // Animar os parágrafos com stagger
          const paragraphs = this.historiaSection.nativeElement.querySelectorAll('.historia-text');
          gsap.fromTo(paragraphs, 
            { opacity: 0, x: -30 },
            { 
              opacity: 1, 
              x: 0, 
              duration: 0.8, 
              stagger: 0.2, 
              ease: "power2.out" 
            }
          );
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.historiaSection.nativeElement);
  }

  private initQuemSomosAnimations() {
    // Configurar posição inicial da seção quem somos
    gsap.set(this.quemSomosSection.nativeElement, { opacity: 0, y: 50 });
    
    // Criar um observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar a entrada da seção
          gsap.to(this.quemSomosSection.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
          });
          
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.quemSomosSection.nativeElement);
  }

  // Método para scroll suave para seções
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  ngOnDestroy() {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }
    
    // Limpar animações GSAP
    this.gsapAnimations.killAllAnimations();
  }
}


