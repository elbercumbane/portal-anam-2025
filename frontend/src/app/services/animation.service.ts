import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }

  // Animação de entrada do texto
  animateTextIn(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom', delay: number = 0) {
    const tl = gsap.timeline({ delay });
    
    // Posição inicial baseada na direção
    const initialPosition = this.getInitialPosition(direction);
    
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
  animateTextOut(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const tl = gsap.timeline();
    
    const finalPosition = this.getFinalPosition(direction);
    
    tl.to(element, {
      ...finalPosition,
      opacity: 0,
      duration: 0.8,
      ease: "power3.in"
    });
    
    return tl;
  }

  // Animação de fade in/out
  fadeIn(element: HTMLElement, duration: number = 1) {
    return gsap.to(element, {
      opacity: 1,
      duration,
      ease: "power2.out"
    });
  }

  fadeOut(element: HTMLElement, duration: number = 0.8) {
    return gsap.to(element, {
      opacity: 0,
      duration,
      ease: "power2.in"
    });
  }

  // Animação de escala
  scaleIn(element: HTMLElement, scale: number = 1.1, duration: number = 1) {
    gsap.set(element, { scale: 0.8, opacity: 0 });
    return gsap.to(element, {
      scale,
      opacity: 1,
      duration,
      ease: "back.out(1.7)"
    });
  }

  // Animação de rotação
  rotateIn(element: HTMLElement, rotation: number = 360, duration: number = 1) {
    gsap.set(element, { rotation: 0, opacity: 0 });
    return gsap.to(element, {
      rotation,
      opacity: 1,
      duration,
      ease: "power2.out"
    });
  }

  // Animação de slide com efeito elástico
  slideInElastic(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const initialPosition = this.getInitialPosition(direction);
    gsap.set(element, initialPosition);
    
    return gsap.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)"
    });
  }

  // Animação de bounce
  bounceIn(element: HTMLElement, duration: number = 1) {
    gsap.set(element, { scale: 0, opacity: 0 });
    return gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration,
      ease: "bounce.out"
    });
  }

  // Animação de pulse
  pulse(element: HTMLElement, scale: number = 1.05, duration: number = 0.5) {
    return gsap.to(element, {
      scale,
      duration,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  }

  // Animação de shake
  shake(element: HTMLElement, intensity: number = 10, duration: number = 0.5) {
    return gsap.to(element, {
      x: `+=${intensity}`,
      duration: duration / 10,
      yoyo: true,
      repeat: 9,
      ease: "power2.inOut"
    });
  }

  // Animação de wave (ondulação)
  wave(element: HTMLElement, intensity: number = 5, duration: number = 1) {
    return gsap.to(element, {
      y: `+=${intensity}`,
      duration: duration / 4,
      yoyo: true,
      repeat: 3,
      ease: "sine.inOut"
    });
  }

  // Métodos auxiliares
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

  private getFinalPosition(direction: string) {
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
}
