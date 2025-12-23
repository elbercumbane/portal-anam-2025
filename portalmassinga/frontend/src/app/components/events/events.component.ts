import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
})
export class EventsComponent implements OnInit {
  @ViewChild('eventosSection', { static: true }) eventosSection!: ElementRef;

  // Dados para eventos
  eventos: any[] = [
    {
      titulo: 'Workshop de Agricultura Sustentável',
      data: '15 de Janeiro, 2024',
      descricao: 'Aprenda técnicas modernas de agricultura sustentável para melhorar a produtividade das suas culturas.',
      local: 'Centro Comunitário de Massinga',
      horario: '09:00 - 16:00'
    },
    {
      titulo: 'Encontro Mensal da Associação',
      data: '20 de Janeiro, 2024',
      descricao: 'Reunião mensal para discutir projetos, desafios e oportunidades da nossa comunidade.',
      local: 'Sede da Associação',
      horario: '18:00 - 20:00'
    },
    {
      titulo: 'Palestra sobre Educação',
      data: '25 de Janeiro, 2024',
      descricao: 'Como melhorar a educação das nossas crianças e jovens. Estratégias e recursos disponíveis.',
      local: 'Escola Primária de Massinga',
      horario: '14:00 - 17:00'
    },
    {
      titulo: 'Feira de Produtos Locais',
      data: '30 de Janeiro, 2024',
      descricao: 'Feira para promover e vender produtos locais da nossa comunidade. Venha apoiar os nossos produtores.',
      local: 'Praça Central de Massinga',
      horario: '08:00 - 14:00'
    }
  ];

  ngOnInit() {
    this.initScrollAnimations();
  }

  private initScrollAnimations() {
    // Configurar posição inicial da seção
    gsap.set(this.eventosSection.nativeElement, { opacity: 0, y: 50 });
    
    // Criar um observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar a entrada da seção
          gsap.to(this.eventosSection.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.eventosSection.nativeElement);
  }

  inscreverSe(evento: any): void {
    alert(`Inscrição para "${evento.titulo}" realizada com sucesso!`);
  }
}
