// Animações do slider da página inicial
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { SLIDE_TEXTOS, SLIDER_CONFIG } from './home.data';

export interface SliderRefs {
  heroContent: ElementRef;
  heroTitle: ElementRef;
  titlePartLeft: ElementRef;
  titlePartRight: ElementRef;
  heroSubtitle: ElementRef;
  heroSubtitleBox: ElementRef;
  heroButton?: ElementRef;
  slider: ElementRef;
}

export class HomeSliderAnimations {
  private currentTimeline: gsap.core.Timeline | null = null;

  // Configurar animações iniciais do texto
  configurarAnimacoesIniciais(refs: SliderRefs): void {
    const textoInicial = SLIDE_TEXTOS[0].titulo;
    refs.heroSubtitle.nativeElement.innerHTML = SLIDE_TEXTOS[0].subtitulo;

    // Dividir o título em duas partes (apenas para o primeiro slide)
    // Dividir preservando HTML
    const palavrasComHTML = textoInicial.split(/(?=<span)|(?<=<\/span>)\s+/);
    const palavrasLimpos = textoInicial.replace(/<[^>]*>/g, '').split(' ');
    const meioIndice = Math.floor(palavrasLimpos.length / 2);
    
    // Encontrar onde dividir no texto HTML original
    let contadorPalavras = 0;
    let indiceDivisao = 0;
    for (let i = 0; i < textoInicial.length; i++) {
      if (textoInicial[i] === ' ' && !textoInicial.substring(Math.max(0, i-10), i).includes('<span')) {
        contadorPalavras++;
        if (contadorPalavras === meioIndice) {
          indiceDivisao = i;
          break;
        }
      }
    }
    
    const parteEsquerdaHTML = textoInicial.substring(0, indiceDivisao).trim();
    const parteDireitaHTML = textoInicial.substring(indiceDivisao).trim();
    
    refs.titlePartLeft.nativeElement.innerHTML = parteEsquerdaHTML;
    refs.titlePartRight.nativeElement.innerHTML = parteDireitaHTML;

    // Animação inicial do conteúdo - apenas textos, sem animar o heroContent
    gsap.set(refs.titlePartLeft.nativeElement, { x: -200, opacity: 0 });
    gsap.set(refs.titlePartRight.nativeElement, { x: 200, opacity: 0 });
    gsap.set(refs.heroSubtitleBox.nativeElement, { y: 30, opacity: 0, scale: 0.95 });
    if (refs.heroButton) {
      gsap.set(refs.heroButton.nativeElement, { y: 30, opacity: 0 });
    }

    // Timeline principal - removida animação de opacidade do heroContent
    const tl = gsap.timeline();
    
    tl.to(refs.titlePartLeft.nativeElement, { 
        x: 0, opacity: 1, duration: 1.2, ease: "power3.out" 
      }, "-=0.3")
      .to(refs.titlePartRight.nativeElement, { 
        x: 0, opacity: 1, duration: 1.2, ease: "power3.out" 
      }, "-=1.0")
      .to(refs.heroSubtitleBox.nativeElement, { 
        y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" 
      }, "-=0.5");
    
    if (refs.heroButton) {
      tl.to(refs.heroButton.nativeElement, { 
        y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" 
      }, "-=0.5");
    }
  }

  // Configurar animações das imagens
  configurarAnimacoesImagens(refs: SliderRefs): void {
    const slides = refs.slider.nativeElement.querySelectorAll('.slide');
    
    slides.forEach((slide: HTMLElement, index: number) => {
      const escalaInicial = index === 2 ? 1 : 1.1;
      gsap.set(slide, { 
        opacity: index === 0 ? 1 : 0,
        scale: escalaInicial
      });
    });
  }

  // Animar transição de slide
  animarTransicaoSlide(refs: SliderRefs, slideAtual: number, totalSlides: number): void {
    if (this.currentTimeline) {
      this.currentTimeline.kill();
    }
    
    const textoAtual = SLIDE_TEXTOS[slideAtual];
    const slides = refs.slider.nativeElement.querySelectorAll('.slide');
    const temTextoMissaoVisao = slideAtual !== 0;
    
    // Encontrar o slide anterior visível
    let indiceAnteriorVisivel = -1;
    slides.forEach((slide: HTMLElement, index: number) => {
      const opacidade = gsap.getProperty(slide, "opacity") as number;
      if (opacidade > 0.5) {
        indiceAnteriorVisivel = index;
      }
    });
    
    if (indiceAnteriorVisivel === -1) {
      indiceAnteriorVisivel = (slideAtual - 1 + totalSlides) % totalSlides;
    }
    
    const imagemAnterior = slides[indiceAnteriorVisivel];
    const novaImagem = slides[slideAtual];
    
    const escalaInicio = slideAtual === 2 ? 1 : 1;
    const escalaFim = slideAtual === 2 ? 1.05 : 1.15;
    
    this.currentTimeline = gsap.timeline();
    const masterTl = this.currentTimeline;
    
    this.animarSaidaTexto(masterTl, refs, indiceAnteriorVisivel);
    this.animarTransicaoImagem(masterTl, imagemAnterior, novaImagem, escalaInicio);
    this.atualizarTexto(masterTl, refs, textoAtual, slideAtual);
    this.animarEntradaTexto(masterTl, refs, slideAtual, temTextoMissaoVisao);
    this.aplicarEfeitoKenBurns(masterTl, novaImagem, escalaFim);
  }

  private animarSaidaTexto(tl: gsap.core.Timeline, refs: SliderRefs, indiceAnterior: number): void {
    const eraPrimeiroSlide = indiceAnterior === 0;
    const saindoDaVisao = indiceAnterior === 2;
    
    if (saindoDaVisao) {
      tl.set([refs.heroTitle.nativeElement, refs.heroSubtitleBox.nativeElement], { opacity: 0 });
    } else if (eraPrimeiroSlide) {
      tl.to(refs.titlePartLeft.nativeElement, { opacity: 0, x: -100, duration: 0.4, ease: "power2.in" });
      tl.to(refs.titlePartRight.nativeElement, { opacity: 0, x: 100, duration: 0.4, ease: "power2.in" }, "-=0.4");
      tl.to(refs.heroSubtitleBox.nativeElement, { opacity: 0, y: -20, scale: 0.95, duration: 0.4, ease: "power2.in" }, "-=0.4");
    } else {
      tl.to([refs.heroTitle.nativeElement, refs.heroSubtitleBox.nativeElement], { 
        opacity: 0, y: -20, scale: 0.95, duration: 0.4, ease: "power2.in" 
      });
    }
  }

  private animarTransicaoImagem(tl: gsap.core.Timeline, imagemAnterior: Element, novaImagem: Element, escalaInicio: number): void {
    tl.to(imagemAnterior, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.2");
    tl.fromTo(novaImagem, 
      { opacity: 0, scale: escalaInicio },
      { opacity: 1, scale: escalaInicio, duration: 0.8, ease: "power2.out" }, "-=0.2");
  }

  private atualizarTexto(tl: gsap.core.Timeline, refs: SliderRefs, textoAtual: any, slideAtual: number): void {
    tl.call(() => {
      const textoTitulo = textoAtual.titulo;
      if (slideAtual === 0) {
        // Dividir preservando HTML
        const palavrasLimpos = textoTitulo.replace(/<[^>]*>/g, '').split(' ');
        const meioIndice = Math.floor(palavrasLimpos.length / 2);
        
        // Encontrar onde dividir no texto HTML original
        let contadorPalavras = 0;
        let indiceDivisao = 0;
        for (let i = 0; i < textoTitulo.length; i++) {
          if (textoTitulo[i] === ' ' && !textoTitulo.substring(Math.max(0, i-10), i).includes('<span')) {
            contadorPalavras++;
            if (contadorPalavras === meioIndice) {
              indiceDivisao = i;
              break;
            }
          }
        }
        
        const parteEsquerdaHTML = textoTitulo.substring(0, indiceDivisao).trim();
        const parteDireitaHTML = textoTitulo.substring(indiceDivisao).trim();
        
        refs.titlePartLeft.nativeElement.innerHTML = parteEsquerdaHTML;
        refs.titlePartRight.nativeElement.innerHTML = parteDireitaHTML;
        refs.heroTitle.nativeElement.textContent = '';
        gsap.set(refs.titlePartLeft.nativeElement, { opacity: 0, x: -200, display: 'block', visibility: 'visible' });
        gsap.set(refs.titlePartRight.nativeElement, { opacity: 0, x: 200, display: 'block', visibility: 'visible' });
      } else {
        refs.heroTitle.nativeElement.innerHTML = textoTitulo;
        refs.titlePartLeft.nativeElement.textContent = '';
        refs.titlePartRight.nativeElement.textContent = '';
        gsap.set(refs.heroTitle.nativeElement, { opacity: 0, y: 30, scale: 0.95, display: 'block', visibility: 'visible' });
      }
      refs.heroSubtitle.nativeElement.innerHTML = textoAtual.subtitulo;
      gsap.set(refs.heroSubtitleBox.nativeElement, { 
        opacity: 0, y: slideAtual === 0 ? 30 : 40, scale: slideAtual === 0 ? 1 : 0.95, display: 'block', visibility: 'visible' 
      });
    }, [], "-=0.3");
  }

  private animarEntradaTexto(tl: gsap.core.Timeline, refs: SliderRefs, slideAtual: number, temTextoMissaoVisao: boolean): void {
    // Removida animação de opacidade do heroContent para evitar flash branco
    
    if (slideAtual === 0) {
      gsap.set([refs.titlePartLeft.nativeElement, refs.titlePartRight.nativeElement], { display: 'block', visibility: 'visible' });
      tl.fromTo(refs.titlePartLeft.nativeElement, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
      tl.fromTo(refs.titlePartRight.nativeElement, { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, "-=0.8");
    } else {
      gsap.set(refs.heroTitle.nativeElement, { display: 'block', visibility: 'visible' });
      tl.fromTo(refs.heroTitle.nativeElement, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");
    }
    
    if (temTextoMissaoVisao) {
      tl.fromTo(refs.heroSubtitleBox.nativeElement, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.1)" }, "-=0.3");
    } else {
      tl.fromTo(refs.heroSubtitleBox.nativeElement, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
    }
  }

  private aplicarEfeitoKenBurns(tl: gsap.core.Timeline, imagem: Element, escalaFim: number): void {
    tl.to(imagem, { scale: escalaFim, duration: 11, ease: "linear" }, "-=0.5");
  }

  // Limpar timeline atual
  destruir(): void {
    if (this.currentTimeline) {
      this.currentTimeline.kill();
    }
  }
}

