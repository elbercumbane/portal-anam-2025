import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

interface QuickLink {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-quick-links-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-links.component.html',
  styleUrl: './quick-links.component.scss'
})
export class QuickLinksSectionComponent implements OnInit, AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}
  
  quickLinks: QuickLink[] = [
    {
      title: 'Associar-se',
      description: 'Torne-se membro da ANAM e faça parte da transformação',
      icon: 'person_add',
      link: '/associar',
      color: '#3B82F6',
      bgColor: 'linear-gradient(135deg, #3B82F615, #3B82F605)'
    },
    {
      title: 'Ver Eventos',
      description: 'Descubra os próximos eventos e atividades da associação',
      icon: 'event',
      link: '/eventos',
      color: '#EF4444',
      bgColor: 'linear-gradient(135deg, #EF444415, #EF444405)'
    },
    {
      title: 'Contactar',
      description: 'Entre em contacto connosco para mais informações',
      icon: 'mail',
      link: '/contacto',
      color: '#F59E0B',
      bgColor: 'linear-gradient(135deg, #F59E0B15, #F59E0B05)'
    },
    {
      title: 'Área de Membros',
      description: 'Aceda à sua área exclusiva de membro',
      icon: 'account_circle',
      link: '/membros',
      color: '#10B981',
      bgColor: 'linear-gradient(135deg, #10B98115, #10B98105)'
    },
    {
      title: 'Galeria',
      description: 'Veja fotos dos nossos eventos e atividades',
      icon: 'photo_library',
      link: '/galeria',
      color: '#EF4444',
      bgColor: 'linear-gradient(135deg, #EF444415, #EF444405)'
    },
    {
      title: 'Serviços',
      description: 'Conheça os serviços que oferecemos',
      icon: 'business',
      link: '/servicos',
      color: '#3B82F6',
      bgColor: 'linear-gradient(135deg, #3B82F615, #3B82F605)'
    }
  ];

  ngOnInit() {
    // Inicialização
  }

  ngAfterViewInit() {
    this.initScrollAnimations();
  }

  private initScrollAnimations() {
    const section = this.elementRef.nativeElement.querySelector('.quick-links-section');
    const cards = this.elementRef.nativeElement.querySelectorAll('.quick-link-card');
    
    if (!section || !cards.length) return;
    
    // Criar observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar os cards em cascata
          gsap.fromTo(cards, 
            {
              opacity: 0,
              y: 30,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out"
            }
          );
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(section);
  }
}

