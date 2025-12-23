import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const configuracaoScrollTrigger = {
  // Configurações globais do ScrollTrigger
  global: {
    scroller: window,
    refreshPriority: -1,
    ignoreMobileResize: true,
  },
  
  // Configurações para diferentes tipos de animação
  animacoes: {
    // Animação de entrada suave
    entradaSuave: {
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    
    // Animação de entrada rápida
    entradaRapida: {
      start: 'top 90%',
      end: 'bottom 10%',
      toggleActions: 'play none none reverse'
    },
    
    // Animação de entrada lenta
    entradaLenta: {
      start: 'top 70%',
      end: 'bottom 30%',
      toggleActions: 'play none none reverse'
    }
  },
  
  // Configurações responsivas
  responsivo: {
    celular: {
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

// Manter compatibilidade com nome antigo
export const scrollTriggerConfig = configuracaoScrollTrigger;

// Função para obter configuração baseada no tamanho da tela
export function obterConfiguracaoResponsiva() {
  const largura = window.innerWidth;
  
  if (largura < 768) {
    return configuracaoScrollTrigger.responsivo.celular;
  } else if (largura < 1024) {
    return configuracaoScrollTrigger.responsivo.tablet;
  } else {
    return configuracaoScrollTrigger.responsivo.desktop;
  }
}

// Manter compatibilidade com nome antigo
export const getResponsiveConfig = obterConfiguracaoResponsiva;
