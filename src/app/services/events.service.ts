import { Injectable } from '@angular/core';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  image: string;
  category: 'workshop' | 'meeting' | 'celebration' | 'volunteer';
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
  organizer: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Workshop de Desenvolvimento Comunitário',
      description: 'Um workshop prático sobre estratégias de desenvolvimento comunitário sustentável, com foco em projetos de impacto social.',
      date: new Date('2024-02-15T09:00:00'),
      location: 'Centro Comunitário de Massinga',
      image: '/assets/galeria/workshop1.jpg',
      category: 'workshop',
      status: 'upcoming',
      maxParticipants: 50,
      currentParticipants: 23,
      price: 0,
      organizer: 'ANAM',
      tags: ['desenvolvimento', 'comunidade', 'sustentabilidade']
    },
    {
      id: 2,
      title: 'Reunião Anual de Membros',
      description: 'Reunião anual para apresentação de relatórios, eleição de novos membros da diretoria e discussão de projetos futuros.',
      date: new Date('2024-03-10T14:00:00'),
      location: 'Auditório Municipal de Massinga',
      image: '/assets/galeria/encontro1.jpg',
      category: 'meeting',
      status: 'upcoming',
      maxParticipants: 200,
      currentParticipants: 156,
      price: 0,
      organizer: 'ANAM',
      tags: ['reunião', 'membros', 'governança']
    },
    {
      id: 3,
      title: 'Festival Cultural de Massinga',
      description: 'Celebração da cultura local com apresentações musicais, danças tradicionais, feira de artesanato e gastronomia típica.',
      date: new Date('2024-04-20T10:00:00'),
      location: 'Praça Central de Massinga',
      image: '/assets/galeria/festival1.jpg',
      category: 'celebration',
      status: 'upcoming',
      maxParticipants: 1000,
      currentParticipants: 0,
      price: 0,
      organizer: 'ANAM + Prefeitura',
      tags: ['cultura', 'festival', 'tradição']
    },
    {
      id: 4,
      title: 'Campanha de Limpeza Comunitária',
      description: 'Ação voluntária para limpeza de áreas públicas e conscientização sobre preservação ambiental.',
      date: new Date('2024-01-28T08:00:00'),
      location: 'Parque Municipal de Massinga',
      image: '/assets/galeria/limpeza1.jpg',
      category: 'volunteer',
      status: 'completed',
      maxParticipants: 100,
      currentParticipants: 87,
      price: 0,
      organizer: 'ANAM',
      tags: ['voluntariado', 'meio ambiente', 'limpeza']
    },
    {
      id: 5,
      title: 'Curso de Empreendedorismo',
      description: 'Curso prático sobre criação e gestão de pequenos negócios, com foco em sustentabilidade financeira.',
      date: new Date('2024-02-05T09:00:00'),
      location: 'Escola Técnica de Massinga',
      image: '/assets/galeria/workshop2.jpg',
      category: 'workshop',
      status: 'ongoing',
      maxParticipants: 30,
      currentParticipants: 28,
      price: 50,
      organizer: 'ANAM + SEBRAE',
      tags: ['empreendedorismo', 'negócios', 'capacitação']
    },
    {
      id: 6,
      title: 'Feira de Produtos Locais',
      description: 'Feira para exposição e venda de produtos artesanais e agrícolas da região, promovendo o comércio local.',
      date: new Date('2024-03-25T07:00:00'),
      location: 'Mercado Municipal de Massinga',
      image: '/assets/galeria/feira1.jpg',
      category: 'celebration',
      status: 'upcoming',
      maxParticipants: 500,
      currentParticipants: 0,
      price: 0,
      organizer: 'ANAM',
      tags: ['feira', 'produtos locais', 'comércio']
    }
  ];

  constructor() { }

  getAllEvents(): Event[] {
    return this.events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getUpcomingEvents(): Event[] {
    const now = new Date();
    return this.events
      .filter(event => event.date >= now && event.status === 'upcoming')
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getEventById(id: number): Event | undefined {
    return this.events.find(event => event.id === id);
  }

  getEventsByCategory(category: Event['category']): Event[] {
    return this.events.filter(event => event.category === category);
  }

  getFeaturedEvents(limit: number = 3): Event[] {
    return this.getUpcomingEvents().slice(0, limit);
  }

  searchEvents(query: string): Event[] {
    const lowercaseQuery = query.toLowerCase();
    return this.events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}
