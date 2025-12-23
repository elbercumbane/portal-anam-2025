// Animações para a página de pagamento de cotas
import { gsap } from 'gsap';

// Inicializar todas as animações da página
export function inicializarAnimacoesPagamento(): gsap.core.Tween[] {
  const animacoes: gsap.core.Tween[] = [];

  // Animação do overlay de fundo
  const overlay = document.querySelector('.animated-overlay');
  if (overlay) {
    const anim = gsap.to(overlay, {
      opacity: 0.6,
      scale: 1.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    animacoes.push(anim);
  }

  // Animações das partículas
  animacoes.push(...inicializarAnimacoesParticulas());
  
  // Animações dos elementos decorativos
  animacoes.push(...inicializarAnimacoesElementos());
  
  // Animação de entrada dos cards
  inicializarAnimacoesCards();

  return animacoes;
}

// Animações das partículas flutuantes
function inicializarAnimacoesParticulas(): gsap.core.Tween[] {
  const animacoes: gsap.core.Tween[] = [];
  const particulas = document.querySelectorAll('.particle');
  
  particulas.forEach((particula, indice) => {
    const anim = gsap.to(particula, {
      y: -window.innerHeight - 100,
      x: `+=${(Math.random() - 0.5) * 200}`,
      rotation: 360,
      opacity: 0,
      duration: 15 + Math.random() * 10,
      delay: indice * 0.3,
      repeat: -1,
      ease: 'none'
    });
    animacoes.push(anim);
  });

  return animacoes;
}

// Animações dos elementos decorativos
function inicializarAnimacoesElementos(): gsap.core.Tween[] {
  const animacoes: gsap.core.Tween[] = [];
  const elementos = document.querySelectorAll('.element');
  
  elementos.forEach((elemento, indice) => {
    const anim = gsap.to(elemento, {
      rotation: 360,
      scale: 1.2,
      duration: 20 + indice * 5,
      repeat: -1,
      ease: 'none'
    });
    animacoes.push(anim);
  });

  return animacoes;
}

// Animação de entrada dos cards
function inicializarAnimacoesCards(): void {
  const cards = document.querySelectorAll('.section-card');
  cards.forEach((card, indice) => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: indice * 0.1,
      ease: 'power3.out'
    });
  });
}

// Limpar todas as animações
export function destruirAnimacoes(animacoes: gsap.core.Tween[]): void {
  animacoes.forEach(anim => anim.kill());
}

