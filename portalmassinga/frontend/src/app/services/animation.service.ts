import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }

  // Animação de entrada do texto
  animarEntradaTexto(element: HTMLElement, direcao: 'left' | 'right' | 'top' | 'bottom' = 'bottom', atraso: number = 0) {
    const tl = gsap.timeline({ delay: atraso });
    
    // Posição inicial baseada na direção
    const initialPosition = this.obterPosicaoInicial(direcao);
    
    gsap.set(element, initialPosition);
    
    tl.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    });
    
    return tl;
  }

  // Animação de saída do texto
  animarSaidaTexto(element: HTMLElement, direcao: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const tl = gsap.timeline();
    
    const posicaoFinal = this.obterPosicaoFinal(direcao);
    
    tl.to(element, {
      ...posicaoFinal,
      opacity: 0,
      duration: 0.8,
      ease: "power3.in"
    });
    
    return tl;
  }

  // Animação de aparecer gradualmente
  aparecer(element: HTMLElement, duracao: number = 1) {
    return gsap.to(element, {
      opacity: 1,
      duration: duracao,
      ease: "power2.out"
    });
  }

  desaparecer(element: HTMLElement, duracao: number = 0.8) {
    return gsap.to(element, {
      opacity: 0,
      duration: duracao,
      ease: "power2.in"
    });
  }

  // Animação de escala
  escalar(element: HTMLElement, escala: number = 1.1, duracao: number = 1) {
    gsap.set(element, { scale: 0.8, opacity: 0 });
    return gsap.to(element, {
      scale: escala,
      opacity: 1,
      duration: duracao,
      ease: "back.out(1.7)"
    });
  }

  // Animação de rotação
  rotacionar(element: HTMLElement, rotacao: number = 360, duracao: number = 1) {
    gsap.set(element, { rotation: 0, opacity: 0 });
    return gsap.to(element, {
      rotation: rotacao,
      opacity: 1,
      duration: duracao,
      ease: "power2.out"
    });
  }

  // Animação de deslizar com efeito elástico
  deslizarElastico(element: HTMLElement, direcao: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const posicaoInicial = this.obterPosicaoInicial(direcao);
    gsap.set(element, posicaoInicial);
    
    return gsap.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)"
    });
  }

  // Animação de saltar
  saltar(element: HTMLElement, duracao: number = 1) {
    gsap.set(element, { scale: 0, opacity: 0 });
    return gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration: duracao,
      ease: "bounce.out"
    });
  }

  // Animação de pulsar
  pulsar(element: HTMLElement, escala: number = 1.05, duracao: number = 0.5) {
    return gsap.to(element, {
      scale: escala,
      duration: duracao,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  }

  // Animação de tremer
  tremer(element: HTMLElement, intensidade: number = 10, duracao: number = 0.5) {
    return gsap.to(element, {
      x: `+=${intensidade}`,
      duration: duracao / 10,
      yoyo: true,
      repeat: 9,
      ease: "power2.inOut"
    });
  }

  // Animação de ondulação
  ondular(element: HTMLElement, intensidade: number = 5, duracao: number = 1) {
    return gsap.to(element, {
      y: `+=${intensidade}`,
      duration: duracao / 4,
      yoyo: true,
      repeat: 3,
      ease: "sine.inOut"
    });
  }

  // Métodos auxiliares
  private obterPosicaoInicial(direcao: string) {
    switch (direcao) {
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

  private obterPosicaoFinal(direcao: string) {
    switch (direcao) {
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
}
