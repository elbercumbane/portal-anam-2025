import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss'
})
export class ServicesComponent implements OnInit {

  // Dados dos serviços
  services = [
    {
      icon: '🎓',
      title: 'Capacitação Empresarial',
      description: 'Desenvolva as competências essenciais para o sucesso do seu negócio.',
      features: [
        'Gestão financeira',
        'Marketing digital',
        'Liderança',
        'Transformação digital'
      ],
      ctaText: 'Saber Mais',
      ctaLink: '/contato'
    },
    {
      icon: '🤝',
      title: 'Networking e Parcerias',
      description: 'Conecte-se com outros empresários e descubra oportunidades de negócio.',
      features: [
        'Eventos mensais',
        'B2B matching',
        'Feiras e exposições',
        'Mentoria entre associados'
      ],
      ctaText: 'Ver Agenda',
      ctaLink: '/eventos'
    },
    {
      icon: '💼',
      title: 'Consultoria Especializada',
      description: 'Apoio técnico personalizado para resolver desafios específicos.',
      features: [
        'Otimização de processos',
        'Planeamento estratégico',
        'Acesso a financiamento',
        'Compliance'
      ],
      ctaText: 'Solicitar',
      ctaLink: '/contato'
    },
    {
      icon: 'menu_book',
      title: 'Acesso a Recursos',
      description: 'Facilitamos o acesso a ferramentas e plataformas essenciais.',
      features: [
        'Base de fornecedores',
        'Biblioteca digital',
        'Coworking',
        'Benefícios e programas'
      ],
      ctaText: 'Aceder',
      ctaLink: '/membros'
    }
  ];

  // Passos do "Como Funciona"
  steps = [
    {
      number: 1,
      title: 'Torne-se Membro',
      description: 'Junte-se à nossa comunidade de empresários e empreendedores.'
    },
    {
      number: 2,
      title: 'Aceda aos Serviços',
      description: 'Utilize todos os recursos e serviços disponíveis para o seu negócio.'
    },
    {
      number: 3,
      title: 'Cresça e Conecte',
      description: 'Desenvolva o seu negócio através de networking e parcerias estratégicas.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
  }

  // Método para gerar ID único para cada serviço
  getServiceId(service: any): string {
    return 'service-' + service.title.toLowerCase().replace(/\s+/g, '-');
  }

  // Tags auxiliares por serviço
  getTags(service: any): string[] {
    switch (service.title) {
      case 'Capacitação Empresarial':
        return ['Formações', 'Workshops', 'Mentoria'];
      case 'Networking e Parcerias':
        return ['Eventos', 'B2B', 'Comunidade'];
      case 'Consultoria Especializada':
        return ['Estratégia', 'Processos', 'Financiamento'];
      case 'Acesso a Recursos':
        return ['Fornecedores', 'Biblioteca', 'Coworking'];
      default:
        return [];
    }
  }

  // Método para gerar ID único para cada passo
  getStepId(step: any): string {
    return 'step-' + step.number + '-title';
  }

  // Método para gerar aria-label para os passos
  getStepAriaLabel(step: any): string {
    return 'Passo ' + step.number;
  }
}
