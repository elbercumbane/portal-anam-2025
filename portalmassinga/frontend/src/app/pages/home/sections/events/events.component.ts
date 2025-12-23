import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

interface Evento {
  id: string;
  titulo: string;
  data: string;
  local: string;
  hora: string;
  descricao: string;
  imagem: string;
}

@Component({
  selector: 'app-events-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsSectionComponent implements OnInit, AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}
  
  eventos: Evento[] = [
    {
      id: '2',
      titulo: 'Feira de Produtos Locais',
      data: '22 de Março, 2024',
      local: 'Praça Central de Massinga',
      hora: '08:00 - 18:00',
      descricao: 'Exposição e venda de produtos artesanais e agrícolas da região.',
      imagem: '/assets/mercado-maputo.jpg'
    },
    {
      id: '3',
      titulo: 'Conferência de Desenvolvimento Comunitário',
      data: '29 de Março, 2024',
      local: 'Auditório Municipal',
      hora: '14:00 - 18:00',
      descricao: 'Discussão sobre estratégias de desenvolvimento sustentável para a comunidade.',
      imagem: '/assets/desenvolvimento-comunitario.jpg'
    },
    {
      id: '4',
      titulo: 'Seminário de Capacitação Empresarial',
      data: '5 de Abril, 2024',
      local: 'Centro de Formação Profissional',
      hora: '09:00 - 16:00',
      descricao: 'Capacitação em gestão empresarial, marketing digital e finanças para pequenos negócios.',
      imagem: '/assets/slider/slide1.jpg'
    }
  ];

  ngOnInit() {
    // Inicialização
  }

  ngAfterViewInit() {
    this.initScrollAnimations();
  }

  private initScrollAnimations() {
    const section = this.elementRef.nativeElement.querySelector('.eventos');
    const cards = this.elementRef.nativeElement.querySelectorAll('.evento-card');
    
    if (!section || !cards.length) return;
    
    // Criar observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar os cards em cascata
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(section);
  }

  inscreverSe(eventoId: string) {
    console.log('Inscrição no evento:', eventoId);
    // Implementar lógica de inscrição
  }
}
