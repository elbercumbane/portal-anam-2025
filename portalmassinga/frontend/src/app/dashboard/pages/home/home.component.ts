import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiClientService } from '../../../services/api-client.service';
import { firstValueFrom } from 'rxjs';

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

interface StatItem {
  icon: string;
  number: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface EventItem {
  id: string;
  titulo: string;
  data: string;
  local: string;
  hora: string;
  descricao: string;
  imagem: string;
}

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  link: string;
}

interface GalleryItem {
  id: number;
  titulo: string;
  data: string;
  local: string;
  descricao: string;
  fotos: Array<{src: string; alt: string}>;
  categoria: string;
  participantes: number;
}

interface PartnersData {
  title: string;
  subtitle: string;
  images: string[];
}

interface HomeContent {
  id?: string;
  sectionKey: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  orderIndex?: number;
  isActive?: boolean;
  metadata?: string;
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
    },
    { 
      titulo: 'Nossos Valores', 
      subtitulo: 'Desenvolvimento de Competências, Networking Empresarial e Oportunidades em Tempo Real.', 
      imagem: '/assets/FOTO1 ANAM.jpeg' 
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

  // Estatísticas
  stats: StatItem[] = [
    { icon: 'people', number: '200+', label: 'Membros e não Membros Activos', color: '#60A5FA', bgColor: '#60A5FA15', borderColor: '#60A5FA30' },
    { icon: 'assignment', number: '50+', label: 'Projectos Realizados', color: '#4CAF50', bgColor: '#4CAF5015', borderColor: '#4CAF5030' },
    { icon: 'location_on', number: '12', label: 'Províncias Representadas', color: '#60A5FA', bgColor: '#60A5FA15', borderColor: '#60A5FA30' },
    { icon: 'handshake', number: '25+', label: 'Parceiros Estratégicos', color: '#4CAF50', bgColor: '#4CAF5015', borderColor: '#4CAF5030' }
  ];

  // Eventos
  eventos: EventItem[] = [
    { id: '2', titulo: 'Feira de Produtos Locais', data: '22 de Março, 2024', local: 'Praça Central de Massinga', hora: '08:00 - 18:00', descricao: 'Exposição e venda de produtos artesanais e agrícolas da região.', imagem: '/assets/mercado-maputo.jpg' },
    { id: '3', titulo: 'Conferência de Desenvolvimento Comunitário', data: '29 de Março, 2024', local: 'Auditório Municipal', hora: '14:00 - 18:00', descricao: 'Discussão sobre estratégias de desenvolvimento sustentável para a comunidade.', imagem: '/assets/desenvolvimento-comunitario.jpg' },
    { id: '4', titulo: 'Seminário de Capacitação Empresarial', data: '5 de Abril, 2024', local: 'Centro de Formação Profissional', hora: '09:00 - 16:00', descricao: 'Capacitação em gestão empresarial, marketing digital e finanças para pequenos negócios.', imagem: '/assets/slider/slide1.jpg' }
  ];

  // Notícias
  news: NewsItem[] = [
    { id: 1, title: 'Nova Parceria com Empresas Locais', excerpt: 'A ANAM estabeleceu uma nova parceria estratégica com empresas locais para promover o desenvolvimento económico da região.', date: '15 de Janeiro, 2025', category: 'Parcerias', image: '/assets/slider/slide1.jpg', link: '/noticias/1' },
    { id: 2, title: 'Workshop de Capacitação Realizado com Sucesso', excerpt: 'Mais de 50 participantes beneficiaram do workshop de capacitação em gestão empresarial realizado no mês passado.', date: '10 de Janeiro, 2025', category: 'Eventos', image: '/assets/slider/slide2.jpg', link: '/noticias/2' },
    { id: 3, title: 'Projeto de Desenvolvimento Comunitário Iniciado', excerpt: 'Iniciámos um novo projeto focado no desenvolvimento sustentável das comunidades rurais do distrito de Massinga.', date: '5 de Janeiro, 2025', category: 'Projetos', image: '/assets/slider/slide3.jpg', link: '/noticias/3' }
  ];

  // Galeria
  galeria: GalleryItem[] = [
    { id: 1, titulo: 'Feira de Produtos Locais', data: '30 de Janeiro, 2024', local: 'Praça Central de Massinga', descricao: 'Uma feira vibrante onde produtores locais apresentam e vendem os seus produtos frescos.', categoria: 'Feira', participantes: 150, fotos: [{src: '/assets/slider/slide1.jpg', alt: 'Feira'}] },
    { id: 2, titulo: 'Workshop de Agricultura Sustentável', data: '15 de Janeiro, 2024', local: 'Centro Comunitário de Massinga', descricao: 'Sessão prática de capacitação onde agricultores aprendem técnicas modernas.', categoria: 'Workshop', participantes: 45, fotos: [{src: '/assets/slider/slide2.jpg', alt: 'Workshop'}] },
    { id: 3, titulo: 'Encontro Mensal da Associação', data: '20 de Janeiro, 2024', local: 'Sede da Associação', descricao: 'Reunião estratégica onde membros discutem projetos em curso.', categoria: 'Reunião', participantes: 25, fotos: [{src: '/assets/galeria/encontro1.jpg', alt: 'Encontro'}] },
    { id: 4, titulo: 'Festival Cultural', data: '10 de Fevereiro, 2024', local: 'Praça Central de Massinga', descricao: 'Celebração da cultura local com música, dança e gastronomia tradicional.', categoria: 'Cultural', participantes: 300, fotos: [{src: '/assets/galeria/festival1.jpg', alt: 'Festival'}] }
  ];

  // Parceiros
  partners: PartnersData = {
    title: 'Nossos Parceiros',
    subtitle: 'Organizações que acreditam na nossa missão',
    images: ['/assets/parceiros.png', '/assets/parceiros2.png']
  };


  isLoading = false;
  errorMessage = '';
  private contentCache: Map<string, HomeContent> = new Map();

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Inicializar conteúdo padrão na base de dados
   * Salva todos os conteúdos atuais organizados por seção
   */
  initializeContent(): void {
    if (confirm('Deseja inicializar o conteúdo padrão na base de dados? Isso irá salvar todos os conteúdos atuais organizados por seção.')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.apiClient.initializeHomeContent().subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            alert(`✅ Conteúdo inicializado com sucesso!\n${response.itemsProcessed} itens processados.`);
            // Recarregar dados após inicialização
            this.loadData();
          } else {
            this.errorMessage = response.message || 'Erro ao inicializar conteúdo';
            alert('Erro: ' + this.errorMessage);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao inicializar conteúdo: ' + (error.message || 'Erro desconhecido');
          alert('Erro ao inicializar conteúdo: ' + this.errorMessage);
          console.error('Erro ao inicializar conteúdo:', error);
        }
      });
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.apiClient.getHomeContent(false).subscribe({
      next: (contents: HomeContent[]) => {
        this.contentCache.clear();
        contents.forEach(content => {
          this.contentCache.set(content.sectionKey, content);
        });
        
        // Carregar slides (garantir 4 slides)
        for (let i = 0; i < 4; i++) {
          const slideKey = `hero_slide_${i + 1}`;
          const slideContent = this.contentCache.get(slideKey);
          if (slideContent) {
            // Garantir que o array tem pelo menos i+1 elementos
            if (!this.slides[i]) {
              this.slides[i] = { titulo: '', subtitulo: '', imagem: '' };
            }
            this.slides[i] = {
              titulo: slideContent.title || this.slides[i].titulo,
              subtitulo: slideContent.subtitle || this.slides[i].subtitulo,
              imagem: slideContent.imageUrl || this.slides[i].imagem
            };
          } else {
            // Se não existe na BD, garantir que o array tem o elemento
            if (!this.slides[i]) {
              this.slides[i] = { titulo: '', subtitulo: '', imagem: '' };
            }
          }
        }
        
        // Carregar Sobre ANAM
        const sobreAnamContent = this.contentCache.get('sobre_anam');
        if (sobreAnamContent) {
          this.sobreAnam.titulo = sobreAnamContent.title || this.sobreAnam.titulo;
          this.sobreAnam.introducao = sobreAnamContent.content || this.sobreAnam.introducao;
        }
        
        // Carregar Missão
        const missaoContent = this.contentCache.get('missao');
        if (missaoContent) {
          this.sobreAnam.cardMissao.titulo = missaoContent.title || this.sobreAnam.cardMissao.titulo;
          this.sobreAnam.cardMissao.descricao = missaoContent.content || this.sobreAnam.cardMissao.descricao;
        }
        
        // Carregar Visão
        const visaoContent = this.contentCache.get('visao');
        if (visaoContent) {
          this.sobreAnam.cardVisao.titulo = visaoContent.title || this.sobreAnam.cardVisao.titulo;
          this.sobreAnam.cardVisao.descricao = visaoContent.content || this.sobreAnam.cardVisao.descricao;
        }
        
        // Carregar Nossos Valores
        const valoresContent = this.contentCache.get('valores');
        if (valoresContent) {
          this.nossosValores.titulo = valoresContent.title || this.nossosValores.titulo;
          if (valoresContent.metadata) {
            try {
              const valoresData = JSON.parse(valoresContent.metadata);
              if (valoresData.valores && Array.isArray(valoresData.valores)) {
                this.nossosValores.valores = valoresData.valores;
              }
            } catch (e) {
              console.error('Erro ao parsear metadata de valores:', e);
            }
          }
        }
        
        // Carregar configurações de Natal
        const christmasContent = this.contentCache.get('christmas_config');
        if (christmasContent) {
          if (christmasContent.metadata) {
            try {
              const christmasData = JSON.parse(christmasContent.metadata);
              this.enableSnow = christmasData.enableSnow !== false; // Default true
              this.enableSanta = christmasData.enableSanta !== false; // Default true
              this.christmasMessage = christmasData.christmasMessage || 'Feliz Natal e Próspero 2025 🎄';
            } catch (e) {
              console.error('Erro ao parsear metadata de natal:', e);
            }
          }
          // Garantir que o ID está no cache se o conteúdo existe
          if (!christmasContent.id && contents.find((c: any) => c.sectionKey === 'christmas_config')) {
            const dbContent = contents.find((c: any) => c.sectionKey === 'christmas_config');
            if (dbContent) {
              this.contentCache.set('christmas_config', dbContent);
            }
          }
        }

        // Carregar Estatísticas
        const statsItems = contents
          .filter(c => c.sectionKey && c.sectionKey.startsWith('stats_item_'))
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        if (statsItems.length > 0) {
          this.stats = statsItems.slice(0, 4).map(item => {
            let metadata: any = {};
            if (item.metadata) {
              try {
                metadata = JSON.parse(item.metadata);
              } catch (e) {
                console.warn('Erro ao parsear metadata de stats:', e);
              }
            }
            return {
              icon: metadata.icon || 'info',
              number: item.title || '',
              label: item.subtitle || '',
              color: metadata.color || '#60A5FA',
              bgColor: metadata.bgColor || '#60A5FA15',
              borderColor: metadata.borderColor || '#60A5FA30'
            };
          });
        }

        // Carregar Eventos
        const eventItems = contents
          .filter(c => c.sectionKey && c.sectionKey.startsWith('event_'))
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        if (eventItems.length > 0) {
          this.eventos = eventItems.slice(0, 3).map(item => {
            let metadata: any = {};
            if (item.metadata) {
              try {
                metadata = JSON.parse(item.metadata);
              } catch (e) {
                console.warn('Erro ao parsear metadata de evento:', e);
              }
            }
            return {
              id: metadata.eventoId || item.sectionKey.replace('event_', ''),
              titulo: item.title || '',
              data: metadata.data || '',
              local: metadata.local || '',
              hora: metadata.hora || '',
              descricao: item.subtitle || '',
              imagem: item.imageUrl || '/assets/slider/slide1.jpg'
            };
          });
        }

        // Carregar Notícias
        const newsItems = contents
          .filter(c => c.sectionKey && c.sectionKey.startsWith('news_item_'))
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        if (newsItems.length > 0) {
          this.news = newsItems.slice(0, 3).map((item, index) => {
            let metadata: any = {};
            if (item.metadata) {
              try {
                metadata = JSON.parse(item.metadata);
              } catch (e) {
                console.warn('Erro ao parsear metadata de notícia:', e);
              }
            }
            return {
              id: index + 1,
              title: item.title || '',
              excerpt: metadata.excerpt || item.subtitle || '',
              date: metadata.data || '',
              category: metadata.categoria || 'Geral',
              image: item.imageUrl || '/assets/slider/slide1.jpg',
              link: metadata.link || `/noticias/${index + 1}`
            };
          });
        }

        // Carregar Galeria
        const galleryItems = contents
          .filter(c => c.sectionKey && c.sectionKey.startsWith('gallery_event_'))
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        if (galleryItems.length > 0) {
          this.galeria = galleryItems.slice(0, 4).map((item, index) => {
            let metadata: any = {};
            if (item.metadata) {
              try {
                metadata = JSON.parse(item.metadata);
              } catch (e) {
                console.warn('Erro ao parsear metadata de galeria:', e);
              }
            }
            return {
              id: index + 1,
              titulo: item.title || '',
              data: metadata.data || '',
              local: metadata.local || '',
              descricao: item.subtitle || '',
              fotos: metadata.fotos || [{ src: item.imageUrl || '/assets/slider/slide1.jpg', alt: item.title || '' }],
              categoria: metadata.categoria || 'Geral',
              participantes: metadata.participantes || 0
            };
          });
        }

        // Carregar Parceiros
        const partnersContent = this.contentCache.get('partners_section');
        if (partnersContent) {
          this.partners.title = partnersContent.title || this.partners.title;
          this.partners.subtitle = partnersContent.subtitle || this.partners.subtitle;
          if (partnersContent.metadata) {
            try {
              const metadata = JSON.parse(partnersContent.metadata);
              if (metadata.images && Array.isArray(metadata.images) && metadata.images.length >= 2) {
                this.partners.images = metadata.images.slice(0, 2);
              }
            } catch (e) {
              console.warn('Erro ao parsear metadata de parceiros:', e);
            }
          }
        }
        // Garantir sempre 2 imagens
        if (this.partners.images.length < 2) {
          while (this.partners.images.length < 2) {
            this.partners.images.push('/assets/parceiros.png');
          }
        }

        
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar dados: ' + (error.message || 'Erro desconhecido');
        this.isLoading = false;
        console.error('Erro ao carregar dados da API:', error);
      }
    });
  }

  saveData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const savePromises: Promise<any>[] = [];
    
    // Salvar slides - sempre substituir conteúdo existente
    for (let i = 0; i < this.slides.length; i++) {
      const slideKey = `hero_slide_${i + 1}`;
      const existing = this.contentCache.get(slideKey);
      const slideData: any = {
        sectionKey: slideKey,
        title: this.slides[i].titulo || '',
        subtitle: this.slides[i].subtitulo || '',
        imageUrl: this.slides[i].imagem || '',
        orderIndex: i,
        isActive: true
      };
      
      // Sempre substituir: se existe, atualizar; se não existe, criar ou buscar e atualizar
      if (existing?.id) {
        savePromises.push(
          firstValueFrom(this.apiClient.updateHomeContent(existing.id, slideData))
            .then((response: any) => {
              if (response && response.id) {
                this.contentCache.set(slideKey, response);
                console.log(`✅ Slide ${i + 1} substituído na base de dados`);
              }
            })
            .catch((error) => {
              console.error(`Erro ao substituir slide ${i + 1}:`, error);
              throw error;
            })
        );
      } else {
        // Buscar primeiro para ver se já existe na BD
        savePromises.push(
          firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey))
            .then((existingContent: any) => {
              if (existingContent && existingContent.id) {
                // Já existe, atualizar (substituir)
                return firstValueFrom(this.apiClient.updateHomeContent(existingContent.id, slideData))
                  .then((response: any) => {
                    if (response && response.id) {
                      this.contentCache.set(slideKey, response);
                      console.log(`✅ Slide ${i + 1} substituído na base de dados`);
                    }
                    return response;
                  });
              } else {
                // Não existe, criar novo
                return firstValueFrom(this.apiClient.createHomeContent(slideData))
                  .then((response: any) => {
                    if (response && response.id) {
                      this.contentCache.set(slideKey, response);
                      console.log(`✅ Slide ${i + 1} criado na base de dados`);
                    }
                    return response;
                  });
              }
            })
        .catch((error: any) => {
          // Se não encontrou (404), criar novo
          if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('não encontrado')) {
            console.log(`⚠️ Slide ${i + 1} não encontrado (404), criando novo...`);
            return firstValueFrom(this.apiClient.createHomeContent(slideData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(slideKey, response);
                  console.log(`✅ Slide ${i + 1} criado na base de dados`);
                }
                return response;
              })
              .catch((createError: any) => {
                // Se der erro de conflito (409), tentar atualizar
                if (createError?.status === 409 || createError?.message?.includes('já existe')) {
                  return firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey))
                    .then((foundContent: any) => {
                      if (foundContent && foundContent.id) {
                        return firstValueFrom(this.apiClient.updateHomeContent(foundContent.id, slideData))
                          .then((response: any) => {
                            if (response && response.id) {
                              this.contentCache.set(slideKey, response);
                              console.log(`✅ Slide ${i + 1} atualizado após conflito`);
                            }
                            return response;
                          });
                      }
                      throw createError;
                    });
                }
                throw createError;
              });
          }
          console.error(`Erro ao processar slide ${i + 1}:`, error);
          throw error;
        })
        );
      }
    }
    
    // Salvar Sobre ANAM - sempre substituir
    const sobreAnamData = {
      sectionKey: 'sobre_anam',
      title: this.sobreAnam.titulo,
      content: this.sobreAnam.introducao,
      orderIndex: 10,
      isActive: true
    };
    savePromises.push(this.saveOrUpdateContent('sobre_anam', sobreAnamData));
    
    // Salvar Missão - sempre substituir
    const missaoData = {
      sectionKey: 'missao',
      title: this.sobreAnam.cardMissao.titulo,
      content: this.sobreAnam.cardMissao.descricao,
      orderIndex: 11,
      isActive: true
    };
    savePromises.push(this.saveOrUpdateContent('missao', missaoData));
    
    // Salvar Visão - sempre substituir
    const visaoData = {
      sectionKey: 'visao',
      title: this.sobreAnam.cardVisao.titulo,
      content: this.sobreAnam.cardVisao.descricao,
      orderIndex: 12,
      isActive: true
    };
    savePromises.push(this.saveOrUpdateContent('visao', visaoData));
    
    // Salvar Nossos Valores - sempre substituir
    const valoresData = {
      sectionKey: 'valores',
      title: this.nossosValores.titulo,
      metadata: JSON.stringify({ valores: this.nossosValores.valores }),
      orderIndex: 13,
      isActive: true
    };
    savePromises.push(this.saveOrUpdateContent('valores', valoresData));
    
    // Salvar configurações de Natal (já salvo pelo saveChristmasConfig, não precisa duplicar)
    
    // Salvar Estatísticas
    for (let i = 0; i < this.stats.length; i++) {
      const statKey = `stats_item_${i + 1}`;
      const stat = this.stats[i];
      const metadata = JSON.stringify({
        icon: stat.icon,
        color: stat.color,
        bgColor: stat.bgColor,
        borderColor: stat.borderColor
      });
      
      const statData: any = {
        sectionKey: statKey,
        title: stat.number,
        subtitle: stat.label,
        orderIndex: 20 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(statKey, statData));
    }
    
    // Salvar Eventos
    for (let i = 0; i < this.eventos.length; i++) {
      const eventKey = `event_${i + 1}`;
      const evento = this.eventos[i];
      const metadata = JSON.stringify({
        data: evento.data,
        local: evento.local,
        hora: evento.hora,
        eventoId: evento.id
      });
      
      const eventData: any = {
        sectionKey: eventKey,
        title: evento.titulo,
        subtitle: evento.descricao,
        imageUrl: evento.imagem,
        orderIndex: 30 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(eventKey, eventData));
    }
    
    // Salvar Notícias
    for (let i = 0; i < this.news.length; i++) {
      const newsKey = `news_item_${i + 1}`;
      const noticia = this.news[i];
      const metadata = JSON.stringify({
        data: noticia.date,
        categoria: noticia.category,
        excerpt: noticia.excerpt,
        link: noticia.link
      });
      
      const newsData: any = {
        sectionKey: newsKey,
        title: noticia.title,
        subtitle: noticia.excerpt,
        imageUrl: noticia.image,
        orderIndex: 40 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(newsKey, newsData));
    }
    
    // Salvar Galeria
    for (let i = 0; i < this.galeria.length; i++) {
      const galleryKey = `gallery_event_${i + 1}`;
      const item = this.galeria[i];
      const metadata = JSON.stringify({
        data: item.data,
        local: item.local,
        categoria: item.categoria,
        participantes: item.participantes,
        fotos: item.fotos
      });
      
      const galleryData: any = {
        sectionKey: galleryKey,
        title: item.titulo,
        subtitle: item.descricao,
        imageUrl: item.fotos && item.fotos.length > 0 ? item.fotos[0].src : '/assets/slider/slide1.jpg',
        orderIndex: 50 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(galleryKey, galleryData));
    }
    
    // Salvar Parceiros
    // Garantir sempre 2 imagens
    if (this.partners.images.length < 2) {
      while (this.partners.images.length < 2) {
        this.partners.images.push('/assets/parceiros.png');
      }
    }
    if (this.partners.images.length > 2) {
      this.partners.images = this.partners.images.slice(0, 2);
    }
    
    const partnersMetadata = JSON.stringify({
      images: this.partners.images
    });
    
    const partnersData: any = {
      sectionKey: 'partners_section',
      title: this.partners.title,
      subtitle: this.partners.subtitle,
      orderIndex: 60,
      isActive: true,
      metadata: partnersMetadata
    };
    
    savePromises.push(this.saveOrUpdateContent('partners_section', partnersData));
    
    Promise.all(savePromises).then(() => {
      this.isLoading = false;
      alert('Dados salvos com sucesso na base de dados!');
      this.loadData(); // Recarregar para atualizar cache
    }).catch((error) => {
      this.isLoading = false;
      this.errorMessage = 'Erro ao salvar: ' + (error.message || 'Erro desconhecido');
      alert('Erro ao salvar dados: ' + this.errorMessage);
      console.error('Erro ao salvar dados:', error);
    });
  }

  onSnowToggleChange(): void {
    this.saveChristmasConfig();
  }

  onSantaToggleChange(): void {
    this.saveChristmasConfig();
  }

  onChristmasMessageChange(): void {
    this.saveChristmasConfig();
  }

  saveSlide(slideIndex: number): void {
    if (slideIndex < 0 || slideIndex >= this.slides.length) {
      return;
    }

    const slideKey = `hero_slide_${slideIndex + 1}`;
    const existing = this.contentCache.get(slideKey);
    const slideData: any = {
      sectionKey: slideKey,
      title: this.slides[slideIndex].titulo || '',
      subtitle: this.slides[slideIndex].subtitulo || '',
      imageUrl: this.slides[slideIndex].imagem || '',
      orderIndex: slideIndex,
      isActive: true
    };

    // Sempre substituir o conteúdo existente na base de dados
    if (existing?.id) {
      // Atualizar conteúdo existente
      firstValueFrom(this.apiClient.updateHomeContent(existing.id, slideData))
        .then((response: any) => {
          if (response && response.id) {
            this.contentCache.set(slideKey, response);
            console.log(`✅ Slide ${slideIndex + 1} atualizado na base de dados`);
            console.log(`📸 Dados salvos do Slide ${slideIndex + 1}:`, {
              sectionKey: response.sectionKey,
              title: response.title,
              imageUrl: response.imageUrl ? (response.imageUrl.substring(0, 50) + '...') : 'vazia',
              imageUrlLength: response.imageUrl?.length || 0,
              isBase64: response.imageUrl?.startsWith('data:image') || false
            });
            alert(`✅ Slide ${slideIndex + 1} salvo com sucesso!`);
            // Verificar se foi salvo corretamente
            this.verifySlideSaved(slideIndex);
          } else {
            console.error(`❌ Slide ${slideIndex + 1}: Resposta sem ID`, response);
            alert(`⚠️ Slide ${slideIndex + 1} salvo mas sem confirmação da base de dados`);
          }
        })
        .catch(async (error: any) => {
          // Se for erro 400 relacionado a tamanho de coluna, tentar migrar automaticamente
          if (error?.status === 400 && (error?.error?.includes('could not execute statement') || error?.error?.includes('value too long') || error?.message?.includes('could not execute'))) {
            console.log(`⚠️ Erro 400 detectado, tentando migrar coluna image_url automaticamente...`);
            try {
              await firstValueFrom(this.apiClient.migrateImageUrl());
              console.log(`✅ Migração executada, tentando salvar novamente...`);
              // Tentar novamente após migração
              if (!existing?.id) {
                throw new Error('ID não disponível para atualização');
              }
              return firstValueFrom(this.apiClient.updateHomeContent(existing.id, slideData))
                .then((response: any) => {
                  if (response && response.id) {
                    this.contentCache.set(slideKey, response);
                    console.log(`✅ Slide ${slideIndex + 1} atualizado na base de dados após migração`);
                    alert(`✅ Slide ${slideIndex + 1} salvo com sucesso após migração automática!`);
                    // Verificar se foi salvo corretamente
                    this.verifySlideSaved(slideIndex);
                  }
                  return response;
                })
                .catch((retryError: any) => {
                  const errorMsg = retryError?.error?.message || retryError?.message || retryError?.error || 'Erro desconhecido';
                  alert(`Erro ao salvar slide ${slideIndex + 1} após migração: ${errorMsg}`);
                });
            } catch (migrationError: any) {
              console.error(`Erro ao migrar:`, migrationError);
              alert(`Erro ao migrar coluna image_url. Por favor, execute manualmente: POST http://localhost:8081/api/home-content/migrate-image-url`);
            }
          } else {
            console.error(`Erro ao atualizar slide ${slideIndex + 1}:`, error);
            const errorMsg = error?.error?.message || error?.message || error?.error || 'Erro desconhecido';
            alert(`Erro ao salvar slide ${slideIndex + 1}: ${errorMsg}`);
          }
        });
    } else {
      // Criar novo conteúdo ou buscar e atualizar se já existir
      firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey))
        .then((existingContent: any) => {
          if (existingContent && existingContent.id) {
            // Já existe, atualizar
            return firstValueFrom(this.apiClient.updateHomeContent(existingContent.id, slideData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(slideKey, response);
                  console.log(`✅ Slide ${slideIndex + 1} atualizado na base de dados`);
                  console.log(`📸 Dados salvos do Slide ${slideIndex + 1}:`, {
                    sectionKey: response.sectionKey,
                    title: response.title,
                    imageUrl: response.imageUrl ? (response.imageUrl.substring(0, 50) + '...') : 'vazia',
                    imageUrlLength: response.imageUrl?.length || 0,
                    isBase64: response.imageUrl?.startsWith('data:image') || false
                  });
                  alert(`✅ Slide ${slideIndex + 1} salvo com sucesso!`);
                  // Verificar se foi salvo corretamente
                  this.verifySlideSaved(slideIndex);
                }
                return response;
              })
              .catch(async (error: any) => {
                return this.handleErrorWithMigration(error, async () => {
                  if (!existingContent?.id) {
                    throw new Error('ID não disponível para atualização');
                  }
                  const response = await firstValueFrom(this.apiClient.updateHomeContent(existingContent.id, slideData));
                  if (response && response.id) {
                    this.contentCache.set(slideKey, response);
                    console.log(`✅ Slide ${slideIndex + 1} atualizado na base de dados após migração`);
                    alert(`✅ Slide ${slideIndex + 1} salvo com sucesso após migração automática!`);
                    // Verificar se foi salvo corretamente
                    this.verifySlideSaved(slideIndex);
                  }
                  return response;
                });
              });
          } else {
            // Não existe, criar novo
            return firstValueFrom(this.apiClient.createHomeContent(slideData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(slideKey, response);
                  console.log(`✅ Slide ${slideIndex + 1} criado na base de dados`);
                  console.log(`📸 Dados salvos do Slide ${slideIndex + 1}:`, {
                    sectionKey: response.sectionKey,
                    title: response.title,
                    imageUrl: response.imageUrl ? (response.imageUrl.substring(0, 50) + '...') : 'vazia',
                    imageUrlLength: response.imageUrl?.length || 0,
                    isBase64: response.imageUrl?.startsWith('data:image') || false
                  });
                  alert(`✅ Slide ${slideIndex + 1} criado com sucesso!`);
                  // Verificar se foi salvo corretamente
                  this.verifySlideSaved(slideIndex);
                }
                return response;
              })
              .catch(async (error: any) => {
                return this.handleErrorWithMigration(error, async () => {
                  const response = await firstValueFrom(this.apiClient.createHomeContent(slideData));
                  if (response && response.id) {
                    this.contentCache.set(slideKey, response);
                    console.log(`✅ Slide ${slideIndex + 1} criado na base de dados após migração`);
                    alert(`✅ Slide ${slideIndex + 1} salvo com sucesso após migração automática!`);
                    // Verificar se foi salvo corretamente
                    this.verifySlideSaved(slideIndex);
                  }
                  return response;
                });
              });
          }
        })
        .catch((error: any) => {
          // Se não encontrou (404), criar novo
          if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('não encontrado')) {
            console.log(`⚠️ Slide ${slideIndex + 1} não encontrado (404), criando novo...`);
            firstValueFrom(this.apiClient.createHomeContent(slideData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(slideKey, response);
                  console.log(`✅ Slide ${slideIndex + 1} criado na base de dados`);
                  console.log(`📸 Dados salvos do Slide ${slideIndex + 1}:`, {
                    sectionKey: response.sectionKey,
                    title: response.title,
                    imageUrl: response.imageUrl ? (response.imageUrl.substring(0, 50) + '...') : 'vazia',
                    imageUrlLength: response.imageUrl?.length || 0,
                    isBase64: response.imageUrl?.startsWith('data:image') || false
                  });
                  alert(`✅ Slide ${slideIndex + 1} criado com sucesso!`);
                }
              })
              .catch((createError: any) => {
                // Se der erro de conflito (409), tentar atualizar
                if (createError?.status === 409 || createError?.message?.includes('já existe')) {
                  firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey))
                    .then((foundContent: any) => {
                      if (foundContent && foundContent.id) {
                        return firstValueFrom(this.apiClient.updateHomeContent(foundContent.id, slideData))
                          .then((response: any) => {
                            if (response && response.id) {
                              this.contentCache.set(slideKey, response);
                              console.log(`✅ Slide ${slideIndex + 1} atualizado após conflito`);
                            }
                          });
                      }
                      throw createError;
                    })
                    .catch((updateError: any) => {
                      console.error(`Erro ao atualizar slide ${slideIndex + 1}:`, updateError);
                      const errorMsg = updateError?.error?.message || updateError?.message || updateError?.error || 'Erro desconhecido';
                      alert(`Erro ao salvar slide ${slideIndex + 1}: ${errorMsg}`);
                    });
                } else {
                  console.error(`Erro ao criar slide ${slideIndex + 1}:`, createError);
                  const errorMsg = createError?.error?.message || createError?.message || createError?.error || 'Erro desconhecido';
                  alert(`Erro ao salvar slide ${slideIndex + 1}: ${errorMsg}`);
                }
              });
          } else {
            console.error(`Erro ao buscar slide ${slideIndex + 1}:`, error);
            const errorMsg = error?.error?.message || error?.message || error?.error || 'Erro desconhecido';
            alert(`Erro ao salvar slide ${slideIndex + 1}: ${errorMsg}`);
          }
        });
    }
  }

  saveChristmasConfig(): void {
    const christmasData = {
      sectionKey: 'christmas_config',
      metadata: JSON.stringify({
        enableSnow: this.enableSnow,
        enableSanta: this.enableSanta,
        christmasMessage: this.christmasMessage
      }),
      orderIndex: 0,
      isActive: true
    };
    
    const christmasExisting = this.contentCache.get('christmas_config');
    
    // Se já existe no cache com ID, atualizar diretamente
    if (christmasExisting?.id) {
      firstValueFrom(this.apiClient.updateHomeContent(christmasExisting.id, christmasData))
        .then((response: any) => {
          // Atualizar cache com resposta do servidor
          if (response && response.id) {
            this.contentCache.set('christmas_config', response);
          } else {
            christmasExisting.metadata = christmasData.metadata;
          }
        })
        .catch((error: any) => {
          console.error('Erro ao atualizar configurações de Natal:', error);
          // Se der erro 404 ou similar, tentar criar
          if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('não encontrado')) {
            console.log('⚠️ Configuração de Natal não encontrada (404), criando nova...');
            this.createChristmasConfig(christmasData);
          } else {
            alert('Erro ao salvar configurações: ' + (error.error || error.message || 'Erro desconhecido'));
          }
        });
    } else {
      // Se não existe no cache, tentar buscar primeiro
      this.apiClient.getHomeContentBySectionKey('christmas_config').subscribe({
        next: (existing: any) => {
          if (existing && existing.id) {
            // Existe na base de dados, atualizar
            firstValueFrom(this.apiClient.updateHomeContent(existing.id, christmasData))
              .then((response: any) => {
                this.contentCache.set('christmas_config', response);
              })
              .catch((error) => {
                console.error('Erro ao atualizar configurações de Natal:', error);
                alert('Erro ao salvar configurações: ' + (error.error || error.message || 'Erro desconhecido'));
              });
          } else {
            // Não existe, criar
            this.createChristmasConfig(christmasData);
          }
        },
        error: (error: any) => {
          // Se não encontrar (404), criar novo
          if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('não encontrado')) {
            console.log('⚠️ Configuração de Natal não encontrada (404), criando nova...');
            this.createChristmasConfig(christmasData);
          } else {
            // Outro erro, tentar criar mesmo assim
            console.log('⚠️ Erro ao buscar configuração de Natal, tentando criar...');
            this.createChristmasConfig(christmasData);
          }
        }
      });
    }
  }

  private createChristmasConfig(christmasData: any): void {
    firstValueFrom(this.apiClient.createHomeContent(christmasData))
      .then((response: any) => {
        // Adicionar ao cache
        if (response && response.id) {
          this.contentCache.set('christmas_config', response);
        }
      })
      .catch((error) => {
        console.error('Erro ao criar configurações de Natal:', error);
        // Se for erro 409 (já existe), tentar atualizar
        if (error.status === 409) {
          // Buscar o existente e atualizar
          this.apiClient.getHomeContentBySectionKey('christmas_config').subscribe({
            next: (existing: any) => {
              if (existing && existing.id) {
                firstValueFrom(this.apiClient.updateHomeContent(existing.id, christmasData))
                  .then((response: any) => {
                    this.contentCache.set('christmas_config', response);
                  })
                  .catch((err) => {
                    alert('Erro ao atualizar configurações: ' + (err.error || err.message || 'Erro desconhecido'));
                  });
              }
            }
          });
        } else {
          alert('Erro ao salvar configurações: ' + (error.error || error.message || 'Erro desconhecido'));
        }
      });
  }

  getSlidePlaceholder(index: number): string {
    const placeholders = [
      'Bem-vindo à Associação de Naturais e Amigos de Massinga',
      'Nossa Missão',
      'Nossa Visão',
      'Nossos Valores'
    ];
    return placeholders[index] || 'Título do Slide';
  }

  getSlideSubtitlePlaceholder(index: number): string {
    const placeholders = [
      '',
      'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.',
      'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.',
      'Desenvolvimento de Competências, Networking Empresarial e Oportunidades em Tempo Real.'
    ];
    return placeholders[index] || 'Descrição do slide';
  }

  // Armazenar informações do editor ativo
  private activeEditorInfo: { slideIndex: number; field: 'title' | 'subtitle'; element: HTMLElement } | null = null;

  /**
   * Salva informações do editor quando o usuário interage com ele
   */
  saveEditorInfo(slideIndex: number, field: 'title' | 'subtitle', element: HTMLElement | null): void {
    if (element && element instanceof HTMLElement) {
      this.activeEditorInfo = { slideIndex, field, element };
    }
  }


  /**
   * Aplica cor ao texto selecionado no editor visual - VERSÃO SIMPLIFICADA E ROBUSTA
   */
  applyColorToSelection(slideIndex: number, field: 'title' | 'subtitle', colorClass: string): void {
    // Encontrar o editor
    const fieldId = `${field}-${slideIndex}`;
    const editor = document.querySelector(`[data-field="${fieldId}"]`) as HTMLElement;
    
    if (!editor) {
      alert('⚠️ Erro: Campo não encontrado.');
      return;
    }

    // Obter seleção atual
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      alert('⚠️ Por favor, selecione o texto primeiro!\n\n📝 Passos:\n1. Clique no campo de texto\n2. Arraste para selecionar o texto\n3. Clique em uma cor');
      editor.focus();
      return;
    }

    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      alert('⚠️ Por favor, selecione o texto primeiro!\n\n📝 Passos:\n1. Clique no campo de texto\n2. Arraste para selecionar o texto\n3. Clique em uma cor');
      editor.focus();
      return;
    }

    // Verificar se a seleção está dentro do editor correto
    const container = range.commonAncestorContainer;
    if (!editor.contains(container instanceof Node ? container : container as any)) {
      alert('⚠️ Por favor, selecione o texto no campo correto.');
      editor.focus();
      return;
    }

    // Obter texto selecionado
    const selectedText = range.toString();
    if (!selectedText || selectedText.trim().length === 0) {
      alert('⚠️ Por favor, selecione algum texto.');
      return;
    }

    // Criar span com a classe de cor
    const span = document.createElement('span');
    span.className = colorClass;
    span.textContent = selectedText;
    
    try {
      // Deletar conteúdo selecionado e inserir o span
      range.deleteContents();
      range.insertNode(span);
      
      // Colapsar range após o span inserido
      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Atualizar o modelo
      this.updateSlideFromEditor(slideIndex, field, editor);
      
      // Salvar
      this.saveSlide(slideIndex);
      
      // Feedback visual
      console.log('✅ Cor aplicada:', colorClass, 'ao texto:', selectedText);
      
    } catch (e) {
      console.error('Erro ao aplicar cor:', e);
      alert('⚠️ Erro ao aplicar cor. Tente selecionar o texto novamente.');
    }
  }

  /**
   * Atualiza o modelo do slide a partir do conteúdo do editor
   */
  private updateSlideFromEditor(slideIndex: number, field: 'title' | 'subtitle', editor: HTMLElement): void {
    if (!editor) return;
    
    const htmlContent = editor.innerHTML;
    // Normalizar HTML: converter <div> para <br> e preservar estrutura
    let normalizedHtml = htmlContent
      .replace(/<div><\/div>/g, '<br>')
      .replace(/<div>/g, '<br>')
      .replace(/<\/div>/g, '')
      .replace(/<br\s*\/?><br\s*\/?>/g, '<br><br>') // Preservar dois enters como dois <br>
      .replace(/&nbsp;/g, ' '); // Preservar espaços
    
    const fieldName = field === 'title' ? 'titulo' : 'subtitulo';
    this.slides[slideIndex][fieldName] = normalizedHtml;
    
    // Atualizar o innerHTML do editor para manter sincronizado (sem disparar eventos)
    setTimeout(() => {
      if (editor.innerHTML !== normalizedHtml) {
        const selection = window.getSelection();
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
        editor.innerHTML = normalizedHtml;
        if (range && selection) {
          try {
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            // Ignorar erro de range inválido
          }
        }
      }
    }, 0);
  }

  /**
   * Converte texto HTML para exibição no editor (preserva formatação)
   */
  getPlainTextAsHtml(text: string): string {
    if (!text) return '';
    // Se já tem HTML, normalizar e retornar
    if (text.includes('<') && text.includes('>')) {
      // Normalizar quebras de linha
      return text
        .replace(/\n/g, '<br>')
        .replace(/<div>/g, '<br>')
        .replace(/<\/div>/g, '');
    }
    // Converter quebras de linha para <br>
    return text.replace(/\n/g, '<br>');
  }

  /**
   * Handler para input no editor
   */
  onEditorInput(event: any, slideIndex: number, field: 'title' | 'subtitle'): void {
    const editor = event?.target as HTMLElement | null;
    // Salvar informações do editor
    if (editor && editor instanceof HTMLElement) {
      this.saveEditorInfo(slideIndex, field, editor);
    }
  }

  /**
   * Handler para blur no editor (quando perde foco)
   */
  onEditorBlur(event: any, slideIndex: number, field: 'title' | 'subtitle'): void {
    const editor = event?.target as HTMLElement | null;
    if (editor && editor instanceof HTMLElement) {
      this.updateSlideFromEditor(slideIndex, field, editor);
      this.saveSlide(slideIndex);
    }
  }

  /**
   * Handler para teclas pressionadas no editor
   */
  onEditorKeyDown(event: any, slideIndex: number, field: 'title' | 'subtitle'): void {
    const editor = event?.target as HTMLElement | null;
    if (!editor || !(editor instanceof HTMLElement)) {
      return;
    }
    
    // Quando Enter é pressionado, criar <br> em vez de <div>
    if (event.key === 'Enter') {
      event.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        
        // Mover cursor após o <br>
        range.setStartAfter(br);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Atualizar modelo
        setTimeout(() => {
          this.updateSlideFromEditor(slideIndex, field, editor);
        }, 0);
      }
    }
  }

  /**
   * Insere uma tag de cor no texto do slide (método antigo - mantido para compatibilidade)
   * @param slideIndex Índice do slide
   * @param field Campo a modificar ('title' ou 'subtitle')
   * @param colorClass Classe CSS de cor (ex: 'highlight-letter-red')
   */
  insertColorTag(slideIndex: number, field: 'title' | 'subtitle', colorClass: string): void {
    const fieldName = field === 'title' ? 'titulo' : 'subtitulo';
    const currentText = this.slides[slideIndex]?.[fieldName] || '';
    
    // Criar um prompt para o usuário inserir o texto que deseja colorir
    const textToColor = prompt(`Digite o texto exato que deseja colorir com a classe "${colorClass}":\n\nExemplo: "Valores" ou "Associação"\n\nTexto atual: ${currentText.substring(0, 100)}${currentText.length > 100 ? '...' : ''}`, '');
    
    if (textToColor && textToColor.trim()) {
      // Verificar se o texto existe no conteúdo atual (sem considerar HTML existente)
      const textWithoutHtml = currentText.replace(/<[^>]*>/g, '');
      
      if (textWithoutHtml.includes(textToColor)) {
        // Se já existe HTML, tentar substituir de forma inteligente
        let newText = currentText;
        
        // Se o texto já está dentro de uma tag span, substituir a tag inteira
        const spanRegex = new RegExp(`<span[^>]*>${textToColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</span>`, 'gi');
        if (spanRegex.test(newText)) {
          newText = newText.replace(spanRegex, `<span class='${colorClass}'>${textToColor}</span>`);
        } else {
          // Substituir apenas a primeira ocorrência do texto simples
          const index = newText.indexOf(textToColor);
          if (index !== -1) {
            // Verificar se não está dentro de uma tag HTML
            const beforeText = newText.substring(0, index);
            const afterText = newText.substring(index + textToColor.length);
            const lastOpenTag = beforeText.lastIndexOf('<');
            const lastCloseTag = beforeText.lastIndexOf('>');
            
            // Se não está dentro de uma tag HTML, substituir
            if (lastOpenTag === -1 || (lastCloseTag !== -1 && lastCloseTag > lastOpenTag)) {
              newText = beforeText + `<span class='${colorClass}'>${textToColor}</span>` + afterText;
            } else {
              // Tentar substituir de forma mais simples (substitui apenas a primeira ocorrência)
              newText = newText.replace(textToColor, `<span class='${colorClass}'>${textToColor}</span>`);
            }
          }
        }
        
        if (field === 'title') {
          this.slides[slideIndex].titulo = newText;
        } else {
          this.slides[slideIndex].subtitulo = newText;
        }
        
        // Salvar automaticamente
        this.saveSlide(slideIndex);
        alert(`✅ Cor aplicada ao texto "${textToColor}"`);
      } else {
        alert(`⚠️ O texto "${textToColor}" não foi encontrado no campo atual.\n\nTexto atual: ${textWithoutHtml.substring(0, 100)}${textWithoutHtml.length > 100 ? '...' : ''}`);
      }
    }
  }

  getSlideImagePreview(index: number): string {
    if (this.slides[index]?.imagem) {
      return this.slides[index].imagem;
    }
    const images = [
      '/assets/FOTO1 ANAM.jpeg',
      '/assets/FOTO 4 ANAM.jpeg',
      '/assets/FOTO 3 ANAM.jpeg',
      '/assets/FOTO1 ANAM.jpeg'
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

  /**
   * Verifica se um slide foi salvo corretamente na base de dados
   */
  async verifySlideSaved(slideIndex: number): Promise<void> {
    const slideKey = `hero_slide_${slideIndex + 1}`;
    try {
      const savedContent = await firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey));
      if (savedContent && savedContent.id) {
        console.log(`✅ Verificação: Slide ${slideIndex + 1} encontrado na BD:`, {
          sectionKey: savedContent.sectionKey,
          title: savedContent.title,
          imageUrl: savedContent.imageUrl ? (savedContent.imageUrl.substring(0, 50) + '...') : 'vazia',
          imageUrlLength: savedContent.imageUrl?.length || 0,
          isBase64: savedContent.imageUrl?.startsWith('data:image') || false
        });
        // Atualizar cache
        this.contentCache.set(slideKey, savedContent);
      } else {
        console.warn(`⚠️ Verificação: Slide ${slideIndex + 1} não encontrado na BD`);
      }
    } catch (error: any) {
      console.error(`❌ Erro ao verificar Slide ${slideIndex + 1}:`, error);
    }
  }

  /**
   * Método auxiliar para tratar erro 400 e executar migração automática se necessário
   */
  private async handleErrorWithMigration(error: any, retryFn: () => Promise<any>): Promise<any> {
    // Se for erro 400 relacionado a tamanho de coluna, tentar migrar automaticamente
    if (error?.status === 400 && (error?.error?.includes('could not execute statement') || error?.error?.includes('value too long') || error?.message?.includes('could not execute'))) {
      console.log(`⚠️ Erro 400 detectado, tentando migrar coluna image_url automaticamente...`);
      try {
        await firstValueFrom(this.apiClient.migrateImageUrl());
        console.log(`✅ Migração executada, tentando novamente...`);
        // Tentar novamente após migração
        return await retryFn();
      } catch (migrationError: any) {
        console.error(`Erro ao migrar ou executar após migração:`, migrationError);
        throw error; // Lançar o erro original
      }
    }
    throw error;
  }

  /**
   * Método auxiliar para salvar ou atualizar conteúdo
   * Sempre substitui o conteúdo existente na base de dados
   */
  private saveOrUpdateContent(sectionKey: string, contentData: any): Promise<any> {
    const existing = this.contentCache.get(sectionKey);
    
    if (existing?.id) {
      // Atualizar conteúdo existente (substituir)
      return firstValueFrom(this.apiClient.updateHomeContent(existing.id, contentData))
        .then((response: any) => {
          if (response && response.id) {
            this.contentCache.set(sectionKey, response);
            console.log(`✅ ${sectionKey} substituído na base de dados`);
          }
          return response;
        })
        .catch(async (error: any) => {
          return this.handleErrorWithMigration(error, async () => {
            if (!existing?.id) {
              throw new Error('ID não disponível para atualização');
            }
            const response = await firstValueFrom(this.apiClient.updateHomeContent(existing.id, contentData));
            if (response && response.id) {
              this.contentCache.set(sectionKey, response);
              console.log(`✅ ${sectionKey} substituído na base de dados após migração`);
            }
            return response;
          }).catch((finalError: any) => {
            console.error(`Erro ao substituir ${sectionKey}:`, finalError);
            throw finalError;
          });
        });
    } else {
      // Buscar primeiro para ver se já existe na BD
      return firstValueFrom(this.apiClient.getHomeContentBySectionKey(sectionKey))
        .then((existingContent: any) => {
          if (existingContent && existingContent.id) {
            // Já existe, atualizar (substituir)
            return firstValueFrom(this.apiClient.updateHomeContent(existingContent.id, contentData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(sectionKey, response);
                  console.log(`✅ ${sectionKey} substituído na base de dados`);
                }
                return response;
              });
          } else {
            // Não existe, criar novo
            return firstValueFrom(this.apiClient.createHomeContent(contentData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(sectionKey, response);
                  console.log(`✅ ${sectionKey} criado na base de dados`);
                }
                return response;
              })
              .catch(async (error: any) => {
                return this.handleErrorWithMigration(error, async () => {
                  const response = await firstValueFrom(this.apiClient.createHomeContent(contentData));
                  if (response && response.id) {
                    this.contentCache.set(sectionKey, response);
                    console.log(`✅ ${sectionKey} criado na base de dados após migração`);
                  }
                  return response;
                });
              });
          }
        })
        .catch((error: any) => {
          // Se não encontrou (404), criar novo
          if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('não encontrado')) {
            console.log(`⚠️ Conteúdo ${sectionKey} não encontrado (404), criando novo...`);
            return firstValueFrom(this.apiClient.createHomeContent(contentData))
              .then((response: any) => {
                if (response && response.id) {
                  this.contentCache.set(sectionKey, response);
                  console.log(`✅ ${sectionKey} criado na base de dados`);
                }
                return response;
              })
              .catch((createError: any) => {
                console.error(`Erro ao criar ${sectionKey}:`, createError);
                // Se der erro de conflito (409), tentar atualizar
                if (createError?.status === 409 || createError?.message?.includes('já existe')) {
                  // Buscar novamente e atualizar
                  return firstValueFrom(this.apiClient.getHomeContentBySectionKey(sectionKey))
                    .then((foundContent: any) => {
                      if (foundContent && foundContent.id) {
                        return firstValueFrom(this.apiClient.updateHomeContent(foundContent.id, contentData))
                          .then((response: any) => {
                            if (response && response.id) {
                              this.contentCache.set(sectionKey, response);
                              console.log(`✅ ${sectionKey} atualizado após conflito`);
                            }
                            return response;
                          });
                      }
                      throw createError;
                    });
                }
                throw createError;
              });
          }
          console.error(`Erro ao processar ${sectionKey}:`, error);
          throw error;
        });
    }
  }

  triggerFileInput(slideIndex: number): void {
    const fileInput = document.getElementById(`fileInput${slideIndex}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageSelected(event: Event, slideIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida (JPG, PNG, GIF)');
        return;
      }

      // Converter para base64 e comprimir
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        try {
          // Comprimir imagem antes de salvar
          const compressedImage = await this.compressImage(base64Image, 1920, 0.8);
          // Atualizar a imagem do slide
          if (this.slides[slideIndex]) {
            this.slides[slideIndex].imagem = compressedImage;
            // Salvar automaticamente após selecionar a imagem
            this.saveSlide(slideIndex);
          }
        } catch (error) {
          console.error('Erro ao comprimir imagem:', error);
          // Se falhar a compressão, usar a imagem original
          if (this.slides[slideIndex]) {
            this.slides[slideIndex].imagem = base64Image;
            this.saveSlide(slideIndex);
          }
        }
      };
      reader.onerror = () => {
        alert('Erro ao ler a imagem. Por favor, tente novamente.');
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para comprimir imagem antes de salvar
  private compressImage(base64Image: string, maxWidth: number = 1920, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar se necessário
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = base64Image;
    });
  }

  // ========== MÉTODOS PARA SOBRE ANAM ==========
  saveSobreAnam(): void {
    const sobreAnamData = {
      sectionKey: 'sobre_anam',
      title: this.sobreAnam.titulo,
      content: this.sobreAnam.introducao,
      orderIndex: 10,
      isActive: true
    };
    
    this.saveOrUpdateContent('sobre_anam', sobreAnamData)
      .then(() => {
        console.log('✅ Sobre ANAM salvo');
      })
      .catch(error => {
        console.error('Erro ao salvar Sobre ANAM:', error);
        alert('Erro ao salvar Sobre ANAM');
      });
  }

  // ========== MÉTODOS PARA MISSÃO ==========
  saveMissao(): void {
    const missaoData = {
      sectionKey: 'missao',
      title: this.sobreAnam.cardMissao.titulo,
      content: this.sobreAnam.cardMissao.descricao,
      orderIndex: 11,
      isActive: true
    };
    
    this.saveOrUpdateContent('missao', missaoData)
      .then(() => {
        console.log('✅ Missão salva');
      })
      .catch(error => {
        console.error('Erro ao salvar Missão:', error);
        alert('Erro ao salvar Missão');
      });
  }

  // ========== MÉTODOS PARA VISÃO ==========
  saveVisao(): void {
    const visaoData = {
      sectionKey: 'visao',
      title: this.sobreAnam.cardVisao.titulo,
      content: this.sobreAnam.cardVisao.descricao,
      orderIndex: 12,
      isActive: true
    };
    
    this.saveOrUpdateContent('visao', visaoData)
      .then(() => {
        console.log('✅ Visão salva');
      })
      .catch(error => {
        console.error('Erro ao salvar Visão:', error);
        alert('Erro ao salvar Visão');
      });
  }

  // ========== MÉTODOS PARA VALORES ==========
  saveValores(): void {
    const valoresData = {
      sectionKey: 'valores',
      title: this.nossosValores.titulo,
      metadata: JSON.stringify({ valores: this.nossosValores.valores }),
      orderIndex: 13,
      isActive: true
    };
    
    this.saveOrUpdateContent('valores', valoresData)
      .then(() => {
        console.log('✅ Valores salvos');
      })
      .catch(error => {
        console.error('Erro ao salvar Valores:', error);
        alert('Erro ao salvar Valores');
      });
  }

  // ========== MÉTODOS PARA ESTATÍSTICAS ==========
  saveStats(): void {
    const savePromises: Promise<any>[] = [];
    
    for (let i = 0; i < this.stats.length; i++) {
      const statKey = `stats_item_${i + 1}`;
      const stat = this.stats[i];
      const metadata = JSON.stringify({
        icon: stat.icon,
        color: stat.color,
        bgColor: stat.bgColor,
        borderColor: stat.borderColor
      });
      
      const statData: any = {
        sectionKey: statKey,
        title: stat.number,
        subtitle: stat.label,
        orderIndex: 20 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(statKey, statData));
    }
    
    Promise.all(savePromises).then(() => {
      console.log('✅ Estatísticas salvas');
    }).catch(error => {
      console.error('Erro ao salvar estatísticas:', error);
      alert('Erro ao salvar estatísticas');
    });
  }

  // ========== MÉTODOS PARA EVENTOS ==========
  saveEventos(): void {
    const savePromises: Promise<any>[] = [];
    
    for (let i = 0; i < this.eventos.length; i++) {
      const eventKey = `event_${i + 1}`;
      const evento = this.eventos[i];
      const metadata = JSON.stringify({
        data: evento.data,
        local: evento.local,
        hora: evento.hora,
        eventoId: evento.id
      });
      
      const eventData: any = {
        sectionKey: eventKey,
        title: evento.titulo,
        subtitle: evento.descricao,
        imageUrl: evento.imagem,
        orderIndex: 30 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(eventKey, eventData));
    }
    
    Promise.all(savePromises).then(() => {
      console.log('✅ Eventos salvos');
    }).catch(error => {
      console.error('Erro ao salvar eventos:', error);
      alert('Erro ao salvar eventos');
    });
  }

  triggerEventoFileInput(index: number): void {
    const fileInput = document.getElementById(`eventoFileInput${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onEventoImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        try {
          const compressedImage = await this.compressImage(base64Image, 1920, 0.8);
          if (this.eventos[index]) {
            this.eventos[index].imagem = compressedImage;
            this.saveEventos();
          }
        } catch (error) {
          console.error('Erro ao comprimir imagem:', error);
          if (this.eventos[index]) {
            this.eventos[index].imagem = base64Image;
            this.saveEventos();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // ========== MÉTODOS PARA NOTÍCIAS ==========
  saveNews(): void {
    const savePromises: Promise<any>[] = [];
    
    for (let i = 0; i < this.news.length; i++) {
      const newsKey = `news_item_${i + 1}`;
      const noticia = this.news[i];
      const metadata = JSON.stringify({
        data: noticia.date,
        categoria: noticia.category,
        excerpt: noticia.excerpt,
        link: noticia.link
      });
      
      const newsData: any = {
        sectionKey: newsKey,
        title: noticia.title,
        subtitle: noticia.excerpt,
        imageUrl: noticia.image,
        orderIndex: 40 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(newsKey, newsData));
    }
    
    Promise.all(savePromises).then(() => {
      console.log('✅ Notícias salvas');
    }).catch(error => {
      console.error('Erro ao salvar notícias:', error);
      alert('Erro ao salvar notícias');
    });
  }

  triggerNewsFileInput(index: number): void {
    const fileInput = document.getElementById(`newsFileInput${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onNewsImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        try {
          const compressedImage = await this.compressImage(base64Image, 1920, 0.8);
          if (this.news[index]) {
            this.news[index].image = compressedImage;
            this.saveNews();
          }
        } catch (error) {
          console.error('Erro ao comprimir imagem:', error);
          if (this.news[index]) {
            this.news[index].image = base64Image;
            this.saveNews();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // ========== MÉTODOS PARA GALERIA ==========
  saveGaleria(): void {
    const savePromises: Promise<any>[] = [];
    
    for (let i = 0; i < this.galeria.length; i++) {
      const galleryKey = `gallery_event_${i + 1}`;
      const item = this.galeria[i];
      const metadata = JSON.stringify({
        data: item.data,
        local: item.local,
        categoria: item.categoria,
        participantes: item.participantes,
        fotos: item.fotos
      });
      
      const galleryData: any = {
        sectionKey: galleryKey,
        title: item.titulo,
        subtitle: item.descricao,
        imageUrl: item.fotos && item.fotos.length > 0 ? item.fotos[0].src : '/assets/slider/slide1.jpg',
        orderIndex: 50 + i,
        isActive: true,
        metadata: metadata
      };
      
      savePromises.push(this.saveOrUpdateContent(galleryKey, galleryData));
    }
    
    Promise.all(savePromises).then(() => {
      console.log('✅ Galeria salva');
    }).catch(error => {
      console.error('Erro ao salvar galeria:', error);
      alert('Erro ao salvar galeria');
    });
  }

  triggerGaleriaFotoInput(eventIndex: number, fotoIndex: number): void {
    const fileInput = document.getElementById(`galeriaFotoInput${eventIndex}_${fotoIndex}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onGaleriaFotoSelected(event: Event, eventIndex: number, fotoIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        try {
          const compressedImage = await this.compressImage(base64Image, 1920, 0.8);
          if (this.galeria[eventIndex] && this.galeria[eventIndex].fotos[fotoIndex]) {
            this.galeria[eventIndex].fotos[fotoIndex].src = compressedImage;
            this.saveGaleria();
          }
        } catch (error) {
          console.error('Erro ao comprimir imagem:', error);
          if (this.galeria[eventIndex] && this.galeria[eventIndex].fotos[fotoIndex]) {
            this.galeria[eventIndex].fotos[fotoIndex].src = base64Image;
            this.saveGaleria();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addFoto(eventIndex: number): void {
    if (this.galeria[eventIndex]) {
      this.galeria[eventIndex].fotos.push({ src: '/assets/slider/slide1.jpg', alt: '' });
      this.saveGaleria();
    }
  }

  removeFoto(eventIndex: number, fotoIndex: number): void {
    if (this.galeria[eventIndex] && this.galeria[eventIndex].fotos.length > 1) {
      this.galeria[eventIndex].fotos.splice(fotoIndex, 1);
      this.saveGaleria();
    }
  }

  // ========== MÉTODOS PARA PARCEIROS ==========
  savePartners(): void {
    // Garantir sempre 2 imagens
    if (this.partners.images.length < 2) {
      while (this.partners.images.length < 2) {
        this.partners.images.push('/assets/parceiros.png');
      }
    }
    if (this.partners.images.length > 2) {
      this.partners.images = this.partners.images.slice(0, 2);
    }
    
    const metadata = JSON.stringify({
      images: this.partners.images
    });
    
    const partnersData: any = {
      sectionKey: 'partners_section',
      title: this.partners.title,
      subtitle: this.partners.subtitle,
      orderIndex: 60,
      isActive: true,
      metadata: metadata
    };
    
    this.saveOrUpdateContent('partners_section', partnersData)
      .then(() => {
        console.log('✅ Parceiros salvos');
      })
      .catch(error => {
        console.error('Erro ao salvar parceiros:', error);
        alert('Erro ao salvar parceiros');
      });
  }

  triggerPartnerFileInput(index: number): void {
    const fileInput = document.getElementById(`partnerFileInput${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onPartnerImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        try {
          const compressedImage = await this.compressImage(base64Image, 1920, 0.8);
          if (this.partners.images[index] !== undefined) {
            this.partners.images[index] = compressedImage;
            this.savePartners();
          }
        } catch (error) {
          console.error('Erro ao comprimir imagem:', error);
          if (this.partners.images[index] !== undefined) {
            this.partners.images[index] = base64Image;
            this.savePartners();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
}

