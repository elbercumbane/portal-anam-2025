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


  isLoading = false;
  errorMessage = '';
  private contentCache: Map<string, HomeContent> = new Map();

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadData();
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
        
        // Carregar slides
        for (let i = 0; i < 3; i++) {
          const slideKey = `hero_slide_${i + 1}`;
          const slideContent = this.contentCache.get(slideKey);
          if (slideContent) {
            this.slides[i] = {
              titulo: slideContent.title || this.slides[i].titulo,
              subtitulo: slideContent.subtitle || this.slides[i].subtitulo,
              imagem: slideContent.imageUrl || this.slides[i].imagem
            };
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
    
    // Salvar slides
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
      
      if (existing?.id) {
        savePromises.push(
          firstValueFrom(this.apiClient.updateHomeContent(existing.id, slideData))
            .then((response: any) => {
              // Atualizar cache com resposta
              if (response && response.id) {
                this.contentCache.set(slideKey, response);
              }
            })
            .catch((error) => {
              console.error(`Erro ao salvar slide ${i + 1}:`, error);
              throw error;
            })
        );
      } else {
        savePromises.push(
          firstValueFrom(this.apiClient.createHomeContent(slideData))
            .then((response: any) => {
              // Adicionar ao cache
              if (response && response.id) {
                this.contentCache.set(slideKey, response);
              }
            })
            .catch((error) => {
              // Se der erro 409 (já existe), tentar buscar e atualizar
              if (error.status === 409) {
                return firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey))
                  .then((existingContent: any) => {
                    if (existingContent && existingContent.id) {
                      return firstValueFrom(this.apiClient.updateHomeContent(existingContent.id, slideData))
                        .then((response: any) => {
                          if (response && response.id) {
                            this.contentCache.set(slideKey, response);
                          }
                          return response;
                        });
                    }
                    // Se não encontrou, lançar erro
                    throw new Error(`Conteúdo com chave ${slideKey} não encontrado após erro 409`);
                  });
              }
              console.error(`Erro ao criar slide ${i + 1}:`, error);
              throw error;
            })
        );
      }
    }
    
    // Salvar Sobre ANAM
    const sobreAnamData = {
      sectionKey: 'sobre_anam',
      title: this.sobreAnam.titulo,
      content: this.sobreAnam.introducao,
      orderIndex: 10,
      isActive: true
    };
    const sobreAnamExisting = this.contentCache.get('sobre_anam');
    if (sobreAnamExisting?.id) {
      savePromises.push(
        firstValueFrom(this.apiClient.updateHomeContent(sobreAnamExisting.id, sobreAnamData))
      );
    } else {
      savePromises.push(
        firstValueFrom(this.apiClient.createHomeContent(sobreAnamData))
      );
    }
    
    // Salvar Missão
    const missaoData = {
      sectionKey: 'missao',
      title: this.sobreAnam.cardMissao.titulo,
      content: this.sobreAnam.cardMissao.descricao,
      orderIndex: 11,
      isActive: true
    };
    const missaoExisting = this.contentCache.get('missao');
    if (missaoExisting?.id) {
      savePromises.push(
        firstValueFrom(this.apiClient.updateHomeContent(missaoExisting.id, missaoData))
      );
    } else {
      savePromises.push(
        firstValueFrom(this.apiClient.createHomeContent(missaoData))
      );
    }
    
    // Salvar Visão
    const visaoData = {
      sectionKey: 'visao',
      title: this.sobreAnam.cardVisao.titulo,
      content: this.sobreAnam.cardVisao.descricao,
      orderIndex: 12,
      isActive: true
    };
    const visaoExisting = this.contentCache.get('visao');
    if (visaoExisting?.id) {
      savePromises.push(
        firstValueFrom(this.apiClient.updateHomeContent(visaoExisting.id, visaoData))
      );
    } else {
      savePromises.push(
        firstValueFrom(this.apiClient.createHomeContent(visaoData))
      );
    }
    
    // Salvar Nossos Valores
    const valoresData = {
      sectionKey: 'valores',
      title: this.nossosValores.titulo,
      metadata: JSON.stringify({ valores: this.nossosValores.valores }),
      orderIndex: 13,
      isActive: true
    };
    const valoresExisting = this.contentCache.get('valores');
    if (valoresExisting?.id) {
      savePromises.push(
        firstValueFrom(this.apiClient.updateHomeContent(valoresExisting.id, valoresData))
      );
    } else {
      savePromises.push(
        firstValueFrom(this.apiClient.createHomeContent(valoresData))
      );
    }
    
    // Salvar configurações de Natal (já salvo pelo saveChristmasConfig, não precisa duplicar)
    
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

    if (existing?.id) {
      firstValueFrom(this.apiClient.updateHomeContent(existing.id, slideData))
        .then((response: any) => {
          if (response && response.id) {
            this.contentCache.set(slideKey, response);
          }
        })
        .catch((error) => {
          console.error(`Erro ao salvar slide ${slideIndex + 1}:`, error);
        });
    } else {
      firstValueFrom(this.apiClient.createHomeContent(slideData))
        .then((response: any) => {
          if (response && response.id) {
            this.contentCache.set(slideKey, response);
          }
        })
        .catch((error) => {
          // Se der erro 409 (já existe), tentar buscar e atualizar
          if (error.status === 409) {
            firstValueFrom(this.apiClient.getHomeContentBySectionKey(slideKey))
              .then((existingContent: any) => {
                if (existingContent && existingContent.id) {
                  return firstValueFrom(this.apiClient.updateHomeContent(existingContent.id, slideData))
                    .then((response: any) => {
                      if (response && response.id) {
                        this.contentCache.set(slideKey, response);
                      }
                      return response;
                    });
                }
                throw new Error(`Conteúdo com chave ${slideKey} não encontrado após erro 409`);
              })
              .catch((err) => {
                console.error(`Erro ao atualizar slide ${slideIndex + 1}:`, err);
              });
          } else {
            console.error(`Erro ao criar slide ${slideIndex + 1}:`, error);
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
        .catch((error) => {
          console.error('Erro ao atualizar configurações de Natal:', error);
          // Se der erro 404 ou similar, tentar criar
          if (error.status === 404) {
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
        error: (error) => {
          // Se não encontrar (404), criar novo
          if (error.status === 404) {
            this.createChristmasConfig(christmasData);
          } else {
            // Outro erro, tentar criar mesmo assim
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

