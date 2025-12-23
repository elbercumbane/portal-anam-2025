import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, RouterLink],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
})
export class ProgramsComponent implements OnInit {
  @ViewChild('programasSection', { static: true }) programasSection!: ElementRef;

  programas: any[] = [
    {
      id: 1,
      titulo: 'Programa de Agricultura Sustentável',
      descricao: 'Iniciativa focada em capacitar agricultores locais com técnicas modernas e sustentáveis para aumentar a produtividade e preservar o meio ambiente.',
      objetivos: [
        'Aumentar a produtividade agrícola em 40%',
        'Reduzir o uso de químicos em 60%',
        'Capacitar 200 agricultores por ano',
        'Criar 50 hortas comunitárias'
      ],
      duracao: '3 anos',
      status: 'Ativo',
      participantes: 150,
      orcamento: '2.5M MZN',
      responsavel: 'Comissão de Agricultura',
      dataInicio: 'Janeiro 2023',
      dataFim: 'Dezembro 2025'
    },
    {
      id: 2,
      titulo: 'Programa de Educação Comunitária',
      descricao: 'Projeto educacional que visa melhorar o acesso à educação de qualidade para crianças e jovens da comunidade, com foco em alfabetização e capacitação técnica.',
      objetivos: [
        'Alfabetizar 500 adultos',
        'Apoiar 300 crianças na escola',
        'Criar 5 centros de estudo',
        'Formar 20 professores locais'
      ],
      duracao: '4 anos',
      status: 'Ativo',
      participantes: 800,
      orcamento: '4.2M MZN',
      responsavel: 'Comissão de Educação',
      dataInicio: 'Março 2022',
      dataFim: 'Fevereiro 2026'
    },
    {
      id: 3,
      titulo: 'Programa de Saúde Comunitária',
      descricao: 'Iniciativa de saúde preventiva que oferece consultas médicas, campanhas de vacinação e educação sanitária para toda a comunidade.',
      objetivos: [
        'Realizar 1000 consultas por ano',
        'Vacinar 90% das crianças',
        'Reduzir mortalidade infantil em 30%',
        'Criar 3 postos de saúde'
      ],
      duracao: '5 anos',
      status: 'Ativo',
      participantes: 2000,
      orcamento: '6.8M MZN',
      responsavel: 'Comissão de Saúde',
      dataInicio: 'Junho 2021',
      dataFim: 'Maio 2026'
    },
    {
      id: 4,
      titulo: 'Programa de Empreendedorismo Jovem',
      descricao: 'Projeto que capacita jovens com habilidades empreendedoras, oferecendo formação em gestão de negócios e apoio para criação de microempresas.',
      objetivos: [
        'Capacitar 300 jovens por ano',
        'Criar 100 microempresas',
        'Gerar 200 empregos',
        'Apoiar 50 projetos inovadores'
      ],
      duracao: '3 anos',
      status: 'Ativo',
      participantes: 450,
      orcamento: '3.1M MZN',
      responsavel: 'Comissão de Juventude',
      dataInicio: 'Setembro 2023',
      dataFim: 'Agosto 2026'
    },
    {
      id: 5,
      titulo: 'Programa de Proteção Ambiental',
      descricao: 'Iniciativa ambiental que promove a conservação dos recursos naturais, reflorestamento e práticas sustentáveis na comunidade.',
      objetivos: [
        'Plantar 10.000 árvores',
        'Criar 3 reservas naturais',
        'Educar 1000 pessoas sobre meio ambiente',
        'Reduzir poluição em 50%'
      ],
      duracao: '4 anos',
      status: 'Ativo',
      participantes: 600,
      orcamento: '2.8M MZN',
      responsavel: 'Comissão de Meio Ambiente',
      dataInicio: 'Abril 2022',
      dataFim: 'Março 2026'
    },
    {
      id: 6,
      titulo: 'Programa de Desenvolvimento de Infraestrutura',
      descricao: 'Projeto de melhoria da infraestrutura comunitária, incluindo construção de estradas, pontes, sistemas de água e energia renovável.',
      objetivos: [
        'Construir 20km de estradas',
        'Instalar 5 sistemas de água',
        'Criar 3 pontes',
        'Implementar energia solar em 200 casas'
      ],
      duracao: '5 anos',
      status: 'Em planeamento',
      participantes: 0,
      orcamento: '15.5M MZN',
      responsavel: 'Comissão de Infraestrutura',
      dataInicio: 'Janeiro 2024',
      dataFim: 'Dezembro 2028'
    }
  ];

  ngOnInit() {
    this.initScrollAnimations();
  }

  private initScrollAnimations() {
    if (this.programasSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
            
            // Animar os cards com stagger
            const cards = entry.target.querySelectorAll('.programa-card');
            gsap.fromTo(cards, 
              { opacity: 0, y: 30 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: "power2.out" 
              }
            );
            
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(this.programasSection.nativeElement);
    }
  }

  participarPrograma(programa: any): void {
    alert(`Inscrição para o programa "${programa.titulo}" realizada com sucesso! Entraremos em contacto em breve.`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ativo':
        return 'status-ativo';
      case 'Em planeamento':
        return 'status-planeamento';
      case 'Concluído':
        return 'status-concluido';
      default:
        return 'status-default';
    }
  }
}
