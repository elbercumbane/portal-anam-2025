import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const scrollTriggerConfig = {
  // Configurações globais do ScrollTrigger
  global: {
    scroller: window,
    refreshPriority: -1,
    ignoreMobileResize: true,
  },
  
  // Configurações para diferentes tipos de animação
  animations: {
    // Animação de entrada suave
    fadeInUp: {
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    
    // Animação de entrada rápida
    quickFadeIn: {
      start: 'top 90%',
      end: 'bottom 10%',
      toggleActions: 'play none none reverse'
    },
    
    // Animação de entrada lenta
    slowFadeIn: {
      start: 'top 70%',
      end: 'bottom 30%',
      toggleActions: 'play none none reverse'
    }
  },
  
  // Configurações responsivas
  responsive: {
    mobile: {
      start: 'top 85%',
      end: 'bottom 15%'
    },
    tablet: {
      start: 'top 80%',
      end: 'bottom 20%'
    },
    desktop: {
      start: 'top 75%',
      end: 'bottom 25%'
    }
  }
};

// Função para obter configuração baseada no tamanho da tela
export function getResponsiveConfig() {
  const width = window.innerWidth;
  
  if (width < 768) {
    return scrollTriggerConfig.responsive.mobile;
  } else if (width < 1024) {
    return scrollTriggerConfig.responsive.tablet;
  } else {
    return scrollTriggerConfig.responsive.desktop;
  }
}
