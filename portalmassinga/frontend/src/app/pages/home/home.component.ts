import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../services/api-client.service';

// Import section components
import { HistorySectionComponent } from './sections/history/history.component';
import { EventsSectionComponent } from './sections/events/events.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { PartnersSectionComponent } from './sections/partners/partners.component';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';
import { StatsSectionComponent } from './sections/stats/stats.component';
import { NewsSectionComponent } from './sections/news/news.component';
import { SantaPopupComponent } from './sections/santa-popup/santa-popup.component';

// Importar dados
import { SLIDE_TEXTOS } from './home.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule, 
    CommonModule,
    RouterModule,
    HistorySectionComponent,
    EventsSectionComponent, 
    GalleryComponent, 
    PartnersSectionComponent,
    ScrollToTopComponent,
    StatsSectionComponent,
    NewsSectionComponent,
    SantaPopupComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public currentSlide = 0;
  private slideTimeout: any;
  public isTransitioning = false;
  public isLoading = true;
  
  // Configurações de Natal (carregadas da BD)
  enableSnow = false;
  enableSanta = false;
  christmasMessage = 'Feliz Natal e Próspero 2025 🎄';
  snowflakes: number[] = [];
  
  // Dados padrão (fallback caso a BD não esteja disponível)
  slides = [
    { 
      titulo: '',
      subtitulo: '',
      imagem: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    },
    { 
      titulo: '',
      subtitulo: '',
      imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    },
    { 
      titulo: '',
      subtitulo: '',
      imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    },
    { 
      titulo: '',
      subtitulo: '',
      imagem: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    }
  ];

  // Configuração dos botões por slide (será carregado da BD)
  slideButtons = [
    { 
      text: 'Torne-se Membro', 
      link: '/associar', 
      color: '#FFD700'
    },
    { 
      text: 'Torne-se Simpatizante', 
      link: '/associar', 
      color: '#EF4444'
    },
    { 
      text: 'Torne-se Apoiante', 
      link: '/associar', 
      color: '#60A5FA'
    },
    { 
      text: 'Torne-se Parceiro', 
      link: '/parceiros', 
      color: '#4CAF50'
    }
  ];

  getCurrentButton() {
    return this.slideButtons[this.currentSlide] || this.slideButtons[0];
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiClient: ApiClientService
  ) {}

  ngOnInit() {
    // Carregar conteúdo da base de dados
    this.loadContentFromDatabase();
    
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          this.scrollToSection(fragment);
        }, 100);
      }
    });
  }

  /**
   * Carrega todo o conteúdo da página inicial diretamente da base de dados
   */
  loadContentFromDatabase(): void {
    this.isLoading = true;
    
    this.apiClient.getHomeContent(true).subscribe({
      next: (contents: any[]) => {
        console.log('📋 Todos os conteúdos recebidos:', contents.length);
        
        // Processar slides do hero
        const heroSlides = contents
          .filter(c => c.sectionKey && c.sectionKey.startsWith('hero_slide_'))
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        
        console.log('📸 Slides do Hero encontrados:', heroSlides.length);
        console.log('📸 Dados completos dos slides:', JSON.stringify(heroSlides, null, 2));
        
        // Garantir que sempre processamos 4 slides (criar slides vazios se necessário)
        console.log(`📸 Processando slides do Hero (encontrados: ${heroSlides.length}, esperados: 4)`);
        
        // Processar sempre 4 slides
        for (let index = 0; index < 4; index++) {
          // Buscar o slide correspondente na BD pelo sectionKey
          const slideKey = `hero_slide_${index + 1}`;
          const content = heroSlides.find(s => s.sectionKey === slideKey);
          
          if (!content) {
            console.warn(`⚠️ Slide ${index + 1} (${slideKey}) não encontrado na BD, mantendo valores padrão`);
            // Manter os valores padrão se não encontrar na BD
            continue;
          }
          
          // Garantir que a imagem seja carregada corretamente
          // Tentar diferentes variações do nome do campo (pode vir como imageUrl ou image_url)
          // O Lombok/Jackson serializa como camelCase (imageUrl)
          const imageUrl = content.imageUrl || content['imageUrl'] || content.image_url || content['image_url'] || null;
          
          console.log(`📸 Slide ${index + 1} (${content.sectionKey}):`, {
            imageUrl: imageUrl ? (imageUrl.substring(0, 50) + '...') : 'null',
            imageUrlType: typeof imageUrl,
            imageUrlLength: imageUrl ? imageUrl.length : 0,
            imageUrlIsNull: imageUrl === null,
            imageUrlIsUndefined: imageUrl === undefined,
            imageUrlIsEmpty: imageUrl === '',
            title: content.title,
            allFields: Object.keys(content)
          });
          
          // Atualizar slide com dados da BD
          // Se não houver imagem na BD, manter a imagem padrão
          let finalImageUrl = imageUrl;
          
          if (!finalImageUrl || finalImageUrl === null || finalImageUrl === undefined || finalImageUrl.toString().trim() === '' || finalImageUrl === 'null') {
            console.warn(`⚠️ Slide ${index + 1} sem imagem válida na BD, usando fallback:`, this.slides[index]?.imagem);
            finalImageUrl = this.slides[index]?.imagem || '';
          } else {
            // Processar a URL da imagem
            finalImageUrl = finalImageUrl.toString().trim();
            
            // Se for base64 (data:image), usar diretamente
            if (finalImageUrl.startsWith('data:image')) {
              console.log(`✅ Slide ${index + 1} usando imagem base64 da BD`);
            } 
            // Se for URL HTTP/HTTPS, usar diretamente
            else if (finalImageUrl.startsWith('http://') || finalImageUrl.startsWith('https://')) {
              console.log(`✅ Slide ${index + 1} usando imagem URL externa da BD: ${finalImageUrl.substring(0, 50)}...`);
            }
            // Se for caminho relativo, garantir que comece com /
            else if (!finalImageUrl.startsWith('/')) {
              finalImageUrl = '/' + finalImageUrl;
              console.log(`✅ Slide ${index + 1} usando imagem relativa da BD: ${finalImageUrl}`);
            } else {
              console.log(`✅ Slide ${index + 1} usando imagem da BD: ${finalImageUrl.substring(0, 50)}...`);
            }
          }
          
          // Atualizar o slide com os dados da BD
          this.slides[index] = {
            titulo: content.title || this.slides[index]?.titulo || SLIDE_TEXTOS[index]?.titulo || '',
            subtitulo: content.subtitle || this.slides[index]?.subtitulo || SLIDE_TEXTOS[index]?.subtitulo || '',
            imagem: finalImageUrl
          };
          
          console.log(`✅ Slide ${index + 1} FINAL configurado:`, {
            titulo: this.slides[index].titulo?.substring(0, 30) + '...',
            imagem: this.slides[index].imagem ? (this.slides[index].imagem.substring(0, 50) + '...') : 'vazia',
            imagemLength: this.slides[index].imagem?.length || 0,
            isBase64: this.slides[index].imagem?.startsWith('data:image') || false
          });
          
          // Carregar configurações do botão do metadata
          if (content.metadata) {
            try {
              const metadata = JSON.parse(content.metadata);
              if (metadata.buttonText && index < this.slideButtons.length) {
                this.slideButtons[index] = {
                  text: metadata.buttonText,
                  link: metadata.buttonLink || this.slideButtons[index].link,
                  color: metadata.buttonColor || this.slideButtons[index].color
                };
              }
            } catch (e) {
              console.warn('Erro ao parsear metadata do slide', index, e);
            }
          }
        }
        
        // Log final para debug - mostrar todos os 4 slides
        console.log('🎯 Slides FINAIS após processamento (4 slides):', this.slides.map((s, i) => ({
          index: i + 1,
          titulo: s.titulo?.substring(0, 30) + '...',
          imagem: s.imagem ? (s.imagem.substring(0, 50) + '...') : 'vazia',
          imagemLength: s.imagem?.length || 0,
          isBase64: s.imagem?.startsWith('data:image') || false
        })));
        
        // Carregar configurações de Natal
        const christmasConfig = contents.find(c => c.sectionKey === 'christmas_config');
        if (christmasConfig && christmasConfig.metadata) {
          try {
            const metadata = JSON.parse(christmasConfig.metadata);
            this.enableSnow = metadata.enableSnow === true;
            this.enableSanta = metadata.enableSanta === true;
            this.christmasMessage = metadata.christmasMessage || this.christmasMessage;
            
            // Aplicar efeitos após carregar configurações
            if (this.enableSnow) {
              console.log('❄️ Habilitando efeito de neve...');
              this.createSnowEffect();
              console.log('❄️ Flocos de neve criados:', this.snowflakes.length);
            } else {
              console.log('❄️ Efeito de neve desabilitado');
              this.snowflakes = [];
            }
          } catch (e) {
            console.warn('Erro ao parsear configurações de Natal:', e);
          }
        }
        
        this.isLoading = false;
        // Iniciar ciclo de slides após carregar dados
        this.startSlideCycle();
      },
      error: (error) => {
        console.error('Erro ao carregar conteúdo da base de dados:', error);
        // Usar dados padrão em caso de erro
        this.slides.forEach((slide, index) => {
          slide.titulo = SLIDE_TEXTOS[index]?.titulo || '';
          slide.subtitulo = SLIDE_TEXTOS[index]?.subtitulo || '';
        });
        this.isLoading = false;
        this.startSlideCycle();
      }
    });
  }

  getCurrentTitle(): string {
    return this.slides[this.currentSlide]?.titulo || SLIDE_TEXTOS[this.currentSlide]?.titulo || '';
  }

  getCurrentSubtitle(): string {
    return this.slides[this.currentSlide]?.subtitulo || SLIDE_TEXTOS[this.currentSlide]?.subtitulo || '';
  }

  private startSlideCycle() {
    this.scheduleNextSlide();
  }

  private scheduleNextSlide() {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }

    this.slideTimeout = setTimeout(() => {
      this.nextSlide();
      this.scheduleNextSlide();
    }, 8000); // 8 segundos por slide
  }

  public nextSlide() {
    this.isTransitioning = true;
    setTimeout(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      setTimeout(() => {
        this.isTransitioning = false;
      }, 200);
    }, 400);
    if (this.slideTimeout) clearTimeout(this.slideTimeout);
    this.scheduleNextSlide();
  }

  public goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length && index !== this.currentSlide) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.currentSlide = index;
        setTimeout(() => {
          this.isTransitioning = false;
        }, 200);
      }, 400);
      if (this.slideTimeout) clearTimeout(this.slideTimeout);
      this.scheduleNextSlide();
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Cria o efeito de neve dinamicamente
   */
  createSnowEffect(): void {
    // Criar array de flocos de neve (50 flocos)
    this.snowflakes = Array.from({ length: 50 }, (_, i) => i);
    console.log('❄️ Efeito de neve criado com', this.snowflakes.length, 'flocos');
  }

  /**
   * Retorna posição X aleatória para cada floco de neve
   */
  getSnowflakePosition(index: number): number {
    // Usar índice para criar posições pseudo-aleatórias consistentes
    return (index * 7.3) % 100;
  }

  /**
   * Retorna delay aleatório para cada floco de neve
   */
  getSnowflakeDelay(index: number): number {
    // Usar índice para criar delays pseudo-aleatórios consistentes
    return (index * 0.1) % 5;
  }

  /**
   * Retorna duração aleatória para cada floco de neve
   */
  getSnowflakeDuration(index: number): number {
    // Usar índice para criar durações pseudo-aleatórias consistentes (6-14 segundos)
    return 6 + ((index * 0.15) % 8);
  }

  /**
   * Retorna drift (desvio horizontal) para cada floco de neve
   */
  getSnowflakeDrift(index: number): number {
    // Criar movimento lateral variado para cada floco
    return (index * 3.7) % 60 - 30; // Entre -30px e 30px
  }

  ngOnDestroy() {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }
  }
}
