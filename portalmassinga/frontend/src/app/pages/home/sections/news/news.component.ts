import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { NOTICIAS } from '../../../news/news.data';

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
  
  news: NewsItem[] = NOTICIAS.slice(0, 3).map(n => ({
    id: n.id,
    title: n.titulo,
    excerpt: n.resumo,
    date: n.data,
    category: n.categoria,
    image: n.imagem,
    link: '/noticias'
  }));

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

