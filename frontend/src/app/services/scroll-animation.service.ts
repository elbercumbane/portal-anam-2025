import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  observeElement(element: ElementRef): void {
    this.observer.observe(element.nativeElement);
  }

  unobserveElement(element: ElementRef): void {
    this.observer.unobserve(element.nativeElement);
  }

  // Método para animar elementos com diferentes tipos de animação
  animateOnScroll(element: ElementRef, animationType: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'scaleIn' = 'fadeIn'): void {
    const el = element.nativeElement;
    el.classList.add('scroll-animate', `animate-${animationType}`);
    this.observer.observe(el);
  }

  // Método para animar múltiplos elementos
  animateMultipleElements(elements: ElementRef[], animationType: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'scaleIn' = 'fadeIn', stagger: number = 100): void {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateOnScroll(element, animationType);
      }, index * stagger);
    });
  }

  // Método para animar contadores
  animateCounter(element: ElementRef, targetValue: number, duration: number = 2000): void {
    const el = element.nativeElement;
    let startValue = 0;
    const increment = targetValue / (duration / 16);
    
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= targetValue) {
        el.textContent = targetValue.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(startValue).toLocaleString();
      }
    }, 16);
  }

  // Método para animar progress bars
  animateProgressBar(element: ElementRef, targetPercentage: number, duration: number = 1500): void {
    const el = element.nativeElement;
    let currentPercentage = 0;
    const increment = targetPercentage / (duration / 16);
    
    const timer = setInterval(() => {
      currentPercentage += increment;
      if (currentPercentage >= targetPercentage) {
        el.style.width = `${targetPercentage}%`;
        clearInterval(timer);
      } else {
        el.style.width = `${currentPercentage}%`;
      }
    }, 16);
  }

  // Método para animar timeline
  animateTimeline(elements: ElementRef[], delay: number = 200): void {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateOnScroll(element, 'slideInLeft');
      }, index * delay);
    });
  }

  // Método para animar cards com stagger
  animateCards(elements: ElementRef[], stagger: number = 150): void {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateOnScroll(element, 'scaleIn');
      }, index * stagger);
    });
  }

  // Método para animar texto com efeito de digitação
  typeWriter(element: ElementRef, text: string, speed: number = 50): void {
    const el = element.nativeElement;
    let i = 0;
    el.textContent = '';
    
    const timer = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  // Método para animar elementos com parallax
  setupParallax(element: ElementRef, speed: number = 0.5): void {
    const el = element.nativeElement;
    
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      el.style.transform = `translateY(${rate}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }

  // Método para animar elementos com hover effects
  setupHoverAnimation(element: ElementRef, effect: 'lift' | 'scale' | 'glow' | 'rotate' = 'lift'): void {
    const el = element.nativeElement;
    
    el.addEventListener('mouseenter', () => {
      el.classList.add(`hover-${effect}`);
    });
    
    el.addEventListener('mouseleave', () => {
      el.classList.remove(`hover-${effect}`);
    });
  }

  // Método para limpar observadores
  disconnect(): void {
    this.observer.disconnect();
  }
}
