// Animações das seções da página inicial
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';

// Animações para a seção de história
export function inicializarAnimacoesHistoria(secaoRef: ElementRef): void {
  gsap.set(secaoRef.nativeElement, { opacity: 0, y: 50 });
  
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        gsap.to(secaoRef.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        });
        
        const paragrafos = secaoRef.nativeElement.querySelectorAll('.historia-text');
        gsap.fromTo(paragrafos, 
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        );
        
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.3 });
  
  observador.observe(secaoRef.nativeElement);
}

// Animações para a seção "Quem Somos"
export function inicializarAnimacoesQuemSomos(secaoRef: ElementRef): void {
  gsap.set(secaoRef.nativeElement, { opacity: 0, y: 50 });
  
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        gsap.to(secaoRef.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        });
        
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.3 });
  
  observador.observe(secaoRef.nativeElement);
}

// Utilitários para posições de animação
export function obterPosicaoInicial(direcao: string): { x: number; y: number; opacity: number } {
  switch (direcao) {
    case 'left': return { x: -100, y: 0, opacity: 0 };
    case 'right': return { x: 100, y: 0, opacity: 0 };
    case 'top': return { x: 0, y: -100, opacity: 0 };
    case 'bottom':
    default: return { x: 0, y: 100, opacity: 0 };
  }
}

export function obterPosicaoSaida(direcao: string): { x: number; y: number } {
  switch (direcao) {
    case 'left': return { x: -100, y: 0 };
    case 'right': return { x: 100, y: 0 };
    case 'top': return { x: 0, y: -100 };
    case 'bottom':
    default: return { x: 0, y: 100 };
  }
}

