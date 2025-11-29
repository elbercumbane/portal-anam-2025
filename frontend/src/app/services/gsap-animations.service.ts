import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollTriggerConfig, getResponsiveConfig } from './scroll-trigger-config';

@Injectable({
  providedIn: 'root'
})
export class GsapAnimationsService {

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Animação para a seção de histórico
  animateHistorialSection() {
    const responsiveConfig = getResponsiveConfig();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.historial',
        start: responsiveConfig.start,
        end: responsiveConfig.end,
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.historial h2', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    })
    .from('.historial .lead', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.circular-card', {
      duration: 1,
      y: 100,
      opacity: 0,
      scale: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.3
    }, '-=0.6');
  }

  // Animação para a seção de eventos
  animateEventosSection() {
    const responsiveConfig = getResponsiveConfig();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.eventos',
        start: responsiveConfig.start,
        end: responsiveConfig.end,
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.eventos h2', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    })
    .from('.evento-card', {
      duration: 0.8,
      y: 80,
      opacity: 0,
      ease: 'power2.out',
      stagger: 0.2
    }, '-=0.4');
  }

  // Animação para a seção de galeria
  animateGaleriaSection() {
    const responsiveConfig = getResponsiveConfig();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.galeria-section',
        start: responsiveConfig.start,
        end: responsiveConfig.end,
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.galeria-section h2', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    })
    .from('.galeria-section .intro-text', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.galeria-grid .evento-card', {
      duration: 0.8,
      y: 60,
      opacity: 0,
      scale: 0.9,
      ease: 'power2.out',
      stagger: 0.15
    }, '-=0.6');
  }

  // Animação para a seção de parceiros
  animateParceirosSection() {
    const responsiveConfig = getResponsiveConfig();
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.partners',
        start: responsiveConfig.start,
        end: responsiveConfig.end,
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.partners .title', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    })
    .from('.logo-card', {
      duration: 0.6,
      y: 40,
      opacity: 0,
      scale: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.1
    }, '-=0.4');
  }

  // Animação para o rodapé
  animateFooterSection() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.footer-simple',
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from('.footer-simple .footer-content', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    })
    .from('.footer-simple .footer-bottom', {
      duration: 0.6,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.4');
  }

  // Animação para o hero
  animateHeroSection() {
    const tl = gsap.timeline();

    tl.from('.hero__title', {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: 'power3.out'
    })
    .from('.hero__subtitle', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.8')
    .from('.hero__button', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      scale: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.6');
  }

  // Animação de hover para cards
  setupCardHoverAnimations() {
    gsap.utils.toArray('.evento-card, .circular-card, .logo-card').forEach((card: any) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          duration: 0.3,
          scale: 1.05,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.3,
          scale: 1,
          ease: 'power2.out'
        });
      });
    });
  }

  // Inicializar todas as animações
  initAllAnimations() {
    this.animateHistorialSection();
    this.animateEventosSection();
    this.animateGaleriaSection();
    this.animateParceirosSection();
    this.animateFooterSection();
    this.setupCardHoverAnimations();
  }

  // Limpar animações
  killAllAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
