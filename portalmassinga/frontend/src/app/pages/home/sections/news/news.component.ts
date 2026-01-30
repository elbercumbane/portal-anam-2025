import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsSectionComponent implements OnInit, AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}
  
  news: NewsItem[] = [
    {
      id: 1,
      title: 'Nova Parceria com Empresas Locais',
      excerpt: 'A ANAM estabeleceu uma nova parceria estratégica com empresas locais para promover o desenvolvimento económico da região.',
      date: '15 de Janeiro, 2025',
      category: 'Parcerias',
      image: '/assets/slider/slide1.jpg',
      link: '/noticias/1'
    },
    {
      id: 2,
      title: 'Workshop de Capacitação Realizado com Sucesso',
      excerpt: 'Mais de 50 participantes beneficiaram do workshop de capacitação em gestão empresarial realizado no mês passado.',
      date: '10 de Janeiro, 2025',
      category: 'Eventos',
      image: '/assets/slider/slide2.jpg',
      link: '/noticias/2'
    },
    {
      id: 3,
      title: 'Projeto de Desenvolvimento Comunitário Iniciado',
      excerpt: 'Iniciámos um novo projeto focado no desenvolvimento sustentável das comunidades rurais do distrito de Massinga.',
      date: '5 de Janeiro, 2025',
      category: 'Projetos',
      image: '/assets/slider/slide3.jpg',
      link: '/noticias/3'
    }
  ];

  ngOnInit() {
    // Inicialização
  }

  ngAfterViewInit() {
    this.initScrollAnimations();
  }

  private initScrollAnimations() {
    const section = this.elementRef.nativeElement.querySelector('.news-section');
    const cards = this.elementRef.nativeElement.querySelectorAll('.news-card');
    
    if (!section || !cards.length) return;
    
    // Criar observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar os cards em cascata
          gsap.fromTo(cards, 
            {
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
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

