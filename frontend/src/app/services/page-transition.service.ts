import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class PageTransitionService {
  private currentRoute = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  // Animação de entrada da página
  pageEnter(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const tl = gsap.timeline();
    
    // Posição inicial baseada na direção
    const initialPosition = this.getInitialPosition(direction);
    
    gsap.set(element, { ...initialPosition, opacity: 0 });
    
    tl.to(element, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    });
    
    return tl;
  }

  // Animação de saída da página
  pageExit(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const tl = gsap.timeline();
    
    const exitPosition = this.getExitPosition(direction);
    
    tl.to(element, {
      ...exitPosition,
      opacity: 0,
      duration: 0.8,
      ease: "power2.in"
    });
    
    return tl;
  }

  // Animação de fade in
  fadeIn(element: HTMLElement, duration: number = 1) {
    gsap.set(element, { opacity: 0 });
    return gsap.to(element, {
      opacity: 1,
      duration,
      ease: "power2.out"
    });
  }

  // Animação de fade out
  fadeOut(element: HTMLElement, duration: number = 0.8) {
    return gsap.to(element, {
      opacity: 0,
      duration,
      ease: "power2.in"
    });
  }

  // Animação de slide com zoom
  slideWithZoom(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom') {
    const tl = gsap.timeline();
    const initialPosition = this.getInitialPosition(direction);
    
    gsap.set(element, { ...initialPosition, opacity: 0, scale: 0.8 });
    
    tl.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out"
    });
    
    return tl;
  }

  // Animação de rotação com entrada
  rotateIn(element: HTMLElement, rotation: number = 360) {
    const tl = gsap.timeline();
    
    gsap.set(element, { rotation: 0, opacity: 0, scale: 0.5 });
    
    tl.to(element, {
      rotation,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "back.out(1.7)"
    });
    
    return tl;
  }

  // Animação de bounce
  bounceIn(element: HTMLElement) {
    const tl = gsap.timeline();
    
    gsap.set(element, { scale: 0, opacity: 0 });
    
    tl.to(element, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "bounce.out"
    });
    
    return tl;
  }

  // Animação de wave (ondulação)
  waveIn(element: HTMLElement) {
    const tl = gsap.timeline();
    
    gsap.set(element, { y: 50, opacity: 0 });
    
    tl.to(element, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.3)"
    });
    
    return tl;
  }

  // Animação de escala com bounce
  scaleBounce(element: HTMLElement) {
    const tl = gsap.timeline();
    
    gsap.set(element, { scale: 0, opacity: 0 });
    
    tl.to(element, {
      scale: 1.1,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    })
    .to(element, {
      scale: 1,
      duration: 0.4,
      ease: "bounce.out"
    });
    
    return tl;
  }

  // Métodos auxiliares
  private getInitialPosition(direction: string) {
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
}
