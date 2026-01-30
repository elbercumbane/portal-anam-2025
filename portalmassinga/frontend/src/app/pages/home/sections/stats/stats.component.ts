import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

interface StatItem {
  icon: string;
  number: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsSectionComponent implements OnInit, AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}
  
  stats: StatItem[] = [
    { 
      icon: 'people', 
      number: '200+', 
      label: 'Membros e não Membros Activos', 
      color: '#60A5FA', 
      bgColor: '#60A5FA15', 
      borderColor: '#60A5FA30' 
    },
    { 
      icon: 'assignment', 
      number: '50+', 
      label: 'Projectos Realizados', 
      color: '#4CAF50', 
      bgColor: '#4CAF5015', 
      borderColor: '#4CAF5030' 
    },
    { 
      icon: 'location_on', 
      number: '12', 
      label: 'Províncias Representadas', 
      color: '#60A5FA', 
      bgColor: '#60A5FA15', 
      borderColor: '#60A5FA30' 
    },
    { 
      icon: 'handshake', 
      number: '25+', 
      label: 'Parceiros Estratégicos', 
      color: '#4CAF50', 
      bgColor: '#4CAF5015', 
      borderColor: '#4CAF5030' 
    }
  ];

  ngOnInit() {
    // Inicialização
  }

  ngAfterViewInit() {
    this.initScrollAnimations();
  }

  private initScrollAnimations() {
    const section = this.elementRef.nativeElement.querySelector('.stats-section');
    const cards = this.elementRef.nativeElement.querySelectorAll('.stat-card');
    
    if (!section || !cards.length) return;
    
    // Criar observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar os cards em cascata com contador
          cards.forEach((card: HTMLElement, index: number) => {
            const numberElement = card.querySelector('.stat-number');
            const finalNumber = numberElement?.textContent || '';
            
            // Animar o card
            gsap.fromTo(card, 
              {
                opacity: 0,
                y: 50,
                scale: 0.8
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "back.out(1.7)"
              }
            );
            
            // Animar contador se houver número
            if (numberElement && finalNumber) {
              this.animateCounter(numberElement, finalNumber);
            }
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(section);
  }

  private animateCounter(element: Element, finalValue: string): void {
    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    const hasPlus = finalValue.includes('+');
    const hasPercent = finalValue.includes('%');
    
    if (isNaN(numericValue)) return;
    
    const duration = 2; // segundos
    const steps = 60;
    const increment = numericValue / (duration * steps);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      
      let displayValue = Math.floor(current).toString();
      if (hasPlus) displayValue += '+';
      if (hasPercent) displayValue += '%';
      
      element.textContent = displayValue;
    }, (duration * 1000) / steps);
  }

  getDecorationGradient(color: string): string {
    return `linear-gradient(135deg, ${color}08, ${color}03)`;
  }

  getIconGradient(color: string): string {
    return `linear-gradient(135deg, ${color}, ${color}DD)`;
  }

}

