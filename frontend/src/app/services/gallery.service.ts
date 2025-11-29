import { Injectable } from '@angular/core';

export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: 'events' | 'community' | 'projects' | 'people' | 'nature';
  date: Date;
  photographer?: string;
  tags: string[];
  featured: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private images: GalleryImage[] = [
    {
      id: 1,
      title: 'Workshop de Capacitação',
      description: 'Membros da comunidade participando de workshop sobre desenvolvimento sustentável.',
      imageUrl: '/assets/galeria/workshop1.jpg',
      thumbnailUrl: '/assets/galeria/workshop1.jpg',
      category: 'events',
      date: new Date('2024-01-15'),
      photographer: 'João Silva',
      tags: ['workshop', 'capacitação', 'comunidade'],
      featured: true
    },
    {
      id: 2,
      title: 'Encontro de Membros',
      description: 'Reunião mensal da ANAM com apresentação de projetos e discussões.',
      imageUrl: '/assets/galeria/encontro1.jpg',
      thumbnailUrl: '/assets/galeria/encontro1.jpg',
      category: 'events',
      date: new Date('2024-01-10'),
      photographer: 'Maria Santos',
      tags: ['reunião', 'membros', 'governança'],
      featured: true
    },
    {
      id: 3,
      title: 'Festival Cultural',
      description: 'Celebração da cultura local com apresentações musicais e danças tradicionais.',
      imageUrl: '/assets/galeria/festival1.jpg',
      thumbnailUrl: '/assets/galeria/festival1.jpg',
      category: 'events',
      date: new Date('2023-12-20'),
      photographer: 'Carlos Mendes',
      tags: ['festival', 'cultura', 'tradição'],
      featured: true
    },
    {
      id: 4,
      title: 'Campanha de Limpeza',
      description: 'Voluntários da ANAM em ação de limpeza do parque municipal.',
      imageUrl: '/assets/galeria/limpeza1.jpg',
      thumbnailUrl: '/assets/galeria/limpeza1.jpg',
      category: 'projects',
      date: new Date('2024-01-05'),
      photographer: 'Ana Costa',
      tags: ['voluntariado', 'meio ambiente', 'limpeza'],
      featured: false
    },
    {
      id: 5,
      title: 'Feira de Produtos Locais',
      description: 'Exposição de produtos artesanais e agrícolas da região.',
      imageUrl: '/assets/galeria/feira1.jpg',
      thumbnailUrl: '/assets/galeria/feira1.jpg',
      category: 'community',
      date: new Date('2023-12-15'),
      photographer: 'Pedro Oliveira',
      tags: ['feira', 'produtos locais', 'comércio'],
      featured: false
    },
    {
      id: 6,
      title: 'Crianças na Escola',
      description: 'Crianças da comunidade local na escola, beneficiando dos projetos educacionais da ANAM.',
      imageUrl: '/assets/galeria/workshop2.jpg',
      thumbnailUrl: '/assets/galeria/workshop2.jpg',
      category: 'people',
      date: new Date('2024-01-08'),
      photographer: 'Sofia Pereira',
      tags: ['educação', 'crianças', 'escola'],
      featured: true
    },
    {
      id: 7,
      title: 'Paisagem de Massinga',
      description: 'Vista panorâmica da bela paisagem natural de Massinga.',
      imageUrl: '/assets/galeria/workshop3.jpg',
      thumbnailUrl: '/assets/galeria/workshop3.jpg',
      category: 'nature',
      date: new Date('2023-11-30'),
      photographer: 'Miguel Fernandes',
      tags: ['natureza', 'paisagem', 'Massinga'],
      featured: false
    },
    {
      id: 8,
      title: 'Projeto de Agricultura',
      description: 'Famílias locais participando do projeto de agricultura sustentável.',
      imageUrl: '/assets/galeria/workshop4.jpg',
      thumbnailUrl: '/assets/galeria/workshop4.jpg',
      category: 'projects',
      date: new Date('2023-12-05'),
      photographer: 'Isabel Rodrigues',
      tags: ['agricultura', 'sustentabilidade', 'famílias'],
      featured: false
    },
    {
      id: 9,
      title: 'Celebração Comunitária',
      description: 'Momentos de alegria e união durante as celebrações comunitárias.',
      imageUrl: '/assets/galeria/festival2.jpg',
      thumbnailUrl: '/assets/galeria/festival2.jpg',
      category: 'community',
      date: new Date('2023-12-10'),
      photographer: 'António Silva',
      tags: ['celebração', 'comunidade', 'união'],
      featured: true
    },
    {
      id: 10,
      title: 'Reunião de Planejamento',
      description: 'Equipe da ANAM em reunião de planejamento de novos projetos.',
      imageUrl: '/assets/galeria/encontro2.jpg',
      thumbnailUrl: '/assets/galeria/encontro2.jpg',
      category: 'events',
      date: new Date('2024-01-12'),
      photographer: 'Rosa Martins',
      tags: ['planejamento', 'equipe', 'projetos'],
      featured: false
    },
    {
      id: 11,
      title: 'Atividade com Jovens',
      description: 'Jovens da comunidade participando de atividades educacionais e recreativas.',
      imageUrl: '/assets/galeria/festival3.jpg',
      thumbnailUrl: '/assets/galeria/festival3.jpg',
      category: 'people',
      date: new Date('2024-01-03'),
      photographer: 'Lucas Ferreira',
      tags: ['jovens', 'educação', 'atividades'],
      featured: false
    },
    {
      id: 12,
      title: 'Projeto de Saúde',
      description: 'Campanha de saúde comunitária promovida pela ANAM.',
      imageUrl: '/assets/galeria/limpeza2.jpg',
      thumbnailUrl: '/assets/galeria/limpeza2.jpg',
      category: 'projects',
      date: new Date('2023-12-25'),
      photographer: 'Carmen Lima',
      tags: ['saúde', 'comunidade', 'campanha'],
      featured: true
    }
  ];

  constructor() { }

  getAllImages(): GalleryImage[] {
    return this.images.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getFeaturedImages(): GalleryImage[] {
    return this.images.filter(image => image.featured);
  }

  getImagesByCategory(category: GalleryImage['category']): GalleryImage[] {
    return this.images.filter(image => image.category === category);
  }

  getImageById(id: number): GalleryImage | undefined {
    return this.images.find(image => image.id === id);
  }

  searchImages(query: string): GalleryImage[] {
    const lowercaseQuery = query.toLowerCase();
    return this.images.filter(image => 
      image.title.toLowerCase().includes(lowercaseQuery) ||
      image.description.toLowerCase().includes(lowercaseQuery) ||
      image.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getRecentImages(limit: number = 6): GalleryImage[] {
    return this.getAllImages().slice(0, limit);
  }

  getCategories(): string[] {
    const categories = this.images.map(image => image.category);
    return [...new Set(categories)];
  }
}
