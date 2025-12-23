import { Component, Output, EventEmitter, OnInit } from '@angular/core';

interface SlideData {
  titulo: string;
  subtitulo: string;
  imagem: string;
}

interface SobreAnamData {
  titulo: string;
  introducao: string;
  cardMissao: {
    titulo: string;
    descricao: string;
  };
  cardVisao: {
    titulo: string;
    descricao: string;
  };
}

interface ValorData {
  titulo: string;
  descricao: string;
}

interface NossosValoresData {
  titulo: string;
  valores: ValorData[];
}

interface ChristmasConfig {
  enableSnow: boolean;
  enableSanta: boolean;
  christmasMessage: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  // Configurações de Natal
  enableSnow = true;
  enableSanta = true;
  christmasMessage = 'Feliz Natal e Próspero 2025 🎄';

  // Slides do Hero
  slides: SlideData[] = [
    { 
      titulo: 'Bem-vindo à Associação de Naturais e Amigos de Massinga', 
      subtitulo: '', 
      imagem: '/assets/FOTO1 ANAM.jpeg' 
    },
    { 
      titulo: 'Nossa Missão', 
      subtitulo: 'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.', 
      imagem: '/assets/FOTO 4 ANAM.jpeg' 
    },
    { 
      titulo: 'Nossa Visão', 
      subtitulo: 'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.', 
      imagem: '/assets/FOTO 3 ANAM.jpeg' 
    }
  ];

  // Seção Sobre ANAM
  sobreAnam: SobreAnamData = {
    titulo: 'Sobre a ANAM',
    introducao: 'Promovemos o desenvolvimento sustentável e o bem-estar socioeconómico das comunidades do Distrito de Massinga.',
    cardMissao: {
      titulo: 'Missão',
      descricao: 'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.'
    },
    cardVisao: {
      titulo: 'Visão',
      descricao: 'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.'
    }
  };

  // Seção Nossos Valores
  nossosValores: NossosValoresData = {
    titulo: 'Nossos Valores',
    valores: [
      {
        titulo: 'Desenvolvimento de Competências',
        descricao: 'Acesse uma força de trabalho qualificada, identifique programas de capacitação e gerencie necessidades de capital humano.'
      },
      {
        titulo: 'Networking Empresarial',
        descricao: 'Conecte-se com profissionais de alto nível, tomadores de decisão e agentes-chave em múltiplos setores.'
      },
      {
        titulo: 'Oportunidades em Tempo Real',
        descricao: 'Participe de projetos nos setores de mineração, energia, agricultura e infraestrutura com dados transparentes e em tempo real.'
      }
    ]
  };

  private readonly STORAGE_KEY = 'anam_home_page_data';

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        
        // Carregar configurações de Natal
        if (data.christmas) {
          this.enableSnow = data.christmas.enableSnow ?? true;
          this.enableSanta = data.christmas.enableSanta ?? true;
          this.christmasMessage = data.christmas.christmasMessage || 'Feliz Natal e Próspero 2025 🎄';
        }
        
        // Carregar slides (mesclar com valores padrão)
        if (data.slides && Array.isArray(data.slides)) {
          this.slides = data.slides.map((slide: SlideData, index: number) => ({
            titulo: slide.titulo || this.slides[index].titulo,
            subtitulo: slide.subtitulo || this.slides[index].subtitulo,
            imagem: slide.imagem || this.slides[index].imagem
          }));
        }
        
        // Carregar seção Sobre ANAM (mesclar com valores padrão)
        if (data.sobreAnam) {
          this.sobreAnam = {
            titulo: data.sobreAnam.titulo || this.sobreAnam.titulo,
            introducao: data.sobreAnam.introducao || this.sobreAnam.introducao,
            cardMissao: {
              titulo: data.sobreAnam.cardMissao?.titulo || this.sobreAnam.cardMissao.titulo,
              descricao: data.sobreAnam.cardMissao?.descricao || this.sobreAnam.cardMissao.descricao
            },
            cardVisao: {
              titulo: data.sobreAnam.cardVisao?.titulo || this.sobreAnam.cardVisao.titulo,
              descricao: data.sobreAnam.cardVisao?.descricao || this.sobreAnam.cardVisao.descricao
            }
          };
        }
        
        // Carregar seção Nossos Valores (mesclar com valores padrão)
        if (data.nossosValores) {
          this.nossosValores = {
            titulo: data.nossosValores.titulo || this.nossosValores.titulo,
            valores: this.nossosValores.valores.map((valorPadrao, index) => ({
              titulo: data.nossosValores.valores?.[index]?.titulo || valorPadrao.titulo,
              descricao: data.nossosValores.valores?.[index]?.descricao || valorPadrao.descricao
            }))
          };
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }

  saveData(): void {
    const data = {
      christmas: {
        enableSnow: this.enableSnow,
        enableSanta: this.enableSanta,
        christmasMessage: this.christmasMessage
      },
      slides: this.slides,
      sobreAnam: this.sobreAnam,
      nossosValores: this.nossosValores
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  onSnowToggleChange(): void {
    this.saveData();
  }

  onSantaToggleChange(): void {
    this.saveData();
  }

  onChristmasMessageChange(): void {
    this.saveData();
  }

  getSlidePlaceholder(index: number): string {
    const placeholders = [
      'Bem-vindo à Associação de Naturais e Amigos de Massinga',
      'Nossa Missão',
      'Nossa Visão'
    ];
    return placeholders[index] || 'Título do Slide';
  }

  getSlideSubtitlePlaceholder(index: number): string {
    const placeholders = [
      '',
      'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.',
      'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.'
    ];
    return placeholders[index] || 'Descrição do slide';
  }

  getSlideImagePreview(index: number): string {
    if (this.slides[index]?.imagem) {
      return this.slides[index].imagem;
    }
    const images = [
      '/assets/FOTO1 ANAM.jpeg',
      '/assets/FOTO 4 ANAM.jpeg',
      '/assets/FOTO 3 ANAM.jpeg'
    ];
    return images[index] || '/assets/slider/slide1.jpg';
  }

  getValorPlaceholder(index: number): string {
    const placeholders = [
      'Desenvolvimento de Competências',
      'Networking Empresarial',
      'Oportunidades em Tempo Real'
    ];
    return placeholders[index] || 'Título do Valor';
  }

  getValorDescricaoPlaceholder(index: number): string {
    const placeholders = [
      'Acesse uma força de trabalho qualificada, identifique programas de capacitação e gerencie necessidades de capital humano.',
      'Conecte-se com profissionais de alto nível, tomadores de decisão e agentes-chave em múltiplos setores.',
      'Participe de projetos nos setores de mineração, energia, agricultura e infraestrutura com dados transparentes e em tempo real.'
    ];
    return placeholders[index] || 'Descrição do valor';
  }
}

