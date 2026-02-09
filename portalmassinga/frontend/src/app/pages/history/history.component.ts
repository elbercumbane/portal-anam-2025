import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Milestone {
  ano: string;
  titulo: string;
  descricao: string;
  imagem: string;
  categoria: string;
}

interface Galeria {
  titulo: string;
  fotos: string[];
}

interface PublicoAlvo {
  iconType: 'rocket' | 'store' | 'agriculture' | 'community';
  titulo: string;
  descricao: string;
}

interface Indicador {
  valor: string;
  descricao: string;
}

interface Depoimento {
  nome: string;
  cargo: string;
  negocio: string;
  texto: string;
  avaliacao: number;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('testimonialVideo', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('testimonialVideo2', { static: false }) videoElement2!: ElementRef<HTMLVideoElement>;
  @ViewChild('testimonialVideo3', { static: false }) videoElement3!: ElementRef<HTMLVideoElement>;
  @ViewChild('testimonialSection', { static: false }) sectionElement!: ElementRef<HTMLElement>;
  
  private intersectionObserver?: IntersectionObserver;

  constructor(private sanitizer: DomSanitizer) {}

  publicosAlvo: PublicoAlvo[] = [
    { iconType: 'rocket', titulo: 'Jovens Empreendedores', descricao: 'Em fase de ideia ou início de actividade' },
    { iconType: 'store', titulo: 'Comércio Local', descricao: 'Lojas, mercados e serviços locais' },
    { iconType: 'agriculture', titulo: 'Agro-Negócio', descricao: 'Iniciativas de pequena e média escala' },
    { iconType: 'community', titulo: 'Associações Comunitárias', descricao: 'Iniciativas comunitárias organizadas' }
  ];

  indicadores: Indicador[] = [
    { valor: '300+', descricao: 'Jovens e Empreendedores Formados' },
    { valor: '150+', descricao: 'Pequenos Negócios Apoiados' },
    { valor: '50+', descricao: 'Iniciativas Financiadas' },
    { valor: '95%', descricao: 'Satisfação' }
  ];

  depoimentos: Depoimento[] = [
    { nome: 'Maria João', cargo: 'Empreendedora', negocio: 'Comércio Local', texto: 'A formação em gestão financeira da ANAM transformou completamente o meu negócio. Agora consigo controlar melhor as minhas finanças e o negócio está a crescer de forma sustentável.', avaliacao: 5 },
    { nome: 'Carlos Muchanga', cargo: 'Agricultor', negocio: 'Agro-Negócio', texto: 'O apoio da ANAM foi fundamental para conseguir financiamento para expandir a minha produção. A mentoria ajudou-me a estruturar melhor o negócio e hoje tenho mais clientes.', avaliacao: 5 },
    { nome: 'Ana Silva', cargo: 'Jovem Empreendedora', negocio: 'Serviços Digitais', texto: 'Os workshops práticos da ANAM deram-me as ferramentas necessárias para começar o meu negócio online. A rede de contactos que construí através da associação foi essencial.', avaliacao: 5 },
    { nome: 'João Pedro', cargo: 'Comerciante', negocio: 'Comércio Local', texto: 'A certificação que obtive através da ANAM deu-me mais credibilidade junto dos meus clientes. O reconhecimento no mercado local aumentou significativamente.', avaliacao: 5 }
  ];

  getIconSvg(iconType: string): SafeHtml {
    const icons: { [key: string]: string } = {
      rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
      store: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"></path></svg>`,
      agriculture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path><path d="M8 12h8"></path><path d="M6 8h12"></path><path d="M6 16h12"></path><circle cx="12" cy="4" r="1"></circle><circle cx="12" cy="20" r="1"></circle></svg>`,
      community: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[iconType] || '');
  }
  
  milestones: Milestone[] = [
    { ano: '2022', titulo: 'Expansão de Atividades', descricao: 'Expansão das atividades, parcerias estratégicas e crescimento do número de membros e projetos.', imagem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', categoria: 'Crescimento' },
    { ano: '2023', titulo: 'Transformação Digital', descricao: 'Plataforma digital da ANAM, modernizando processos e ampliando o alcance dos serviços.', imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', categoria: 'Inovação' },
    { ano: '2024', titulo: 'Consolidação e Impacto', descricao: 'Consolidação das atividades e aumento do impacto na comunidade.', imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', categoria: 'Consolidação' },
    { ano: '2025', titulo: 'Crescimento e Rede', descricao: 'Mais de 250 membros ativos, 50+ projetos realizados e parcerias reforçadas.', imagem: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', categoria: 'Expansão' },
    { ano: '2026', titulo: 'Presente e Futuro', descricao: 'Visão clara de desenvolvimento sustentável para Massinga. A jornada continua.', imagem: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', categoria: 'Atualidade' }
  ];

  /** Cor por ano: 2022 = vermelho, cresce até verde em 2026 */
  getMilestoneColor(ano: string): string {
    const y = parseInt(ano, 10);
    if (y <= 2022) return '#c0392b';
    if (y >= 2026) return '#51B155';
    const t = (y - 2022) / (2026 - 2022);
    const colors = ['#c0392b', '#d35400', '#f39c12', '#7dce82', '#51B155'];
    const i = Math.min(Math.floor(t * (colors.length - 1)), colors.length - 2);
    const ti = (t * (colors.length - 1)) - i;
    const hex = (r: number, g: number, b: number) =>
      '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
    const parse = (h: string) => ({
      r: parseInt(h.slice(1, 3), 16),
      g: parseInt(h.slice(3, 5), 16),
      b: parseInt(h.slice(5, 7), 16)
    });
    const a = parse(colors[i]);
    const b = parse(colors[i + 1]);
    return hex(
      a.r + (b.r - a.r) * ti,
      a.g + (b.g - a.g) * ti,
      a.b + (b.b - a.b) * ti
    );
  }

  galerias: Galeria[] = [
    {
      titulo: 'Momentos Históricos',
      fotos: ['/assets/slider/slide1.jpg', '/assets/slider/slide2.jpg', '/assets/slider/slide3.jpg']
    },
    {
      titulo: 'Eventos Marcantes',
      fotos: ['/assets/slider/slide2.jpg', '/assets/slider/slide3.jpg', '/assets/slider/slide1.jpg']
    }
  ];

  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
  }

  ngAfterViewInit() {
    // Aguardar um pouco para garantir que os elementos estejam prontos
    setTimeout(() => {
      // Configurar reprodução sequencial quando a seção entrar na viewport
      if (this.sectionElement) {
        this.setupSequentialVideoPlayback();
      }
    }, 100);
  }

  private setupSequentialVideoPlayback(): void {
    // Ordem: João Manuel (video1) -> Maria Silva (video3) -> António Carlos (video2) -> repetir
    const video1 = this.videoElement?.nativeElement; // João Manuel - video3.mov
    const video2 = this.videoElement3?.nativeElement; // Maria Silva - video2.mov
    const video3 = this.videoElement2?.nativeElement; // António Carlos - video1.mov

    if (!video1 || !video2 || !video3) {
      console.warn('Alguns vídeos não foram encontrados');
      return;
    }

    // Garantir que os vídeos estejam prontos
    video1.load();
    video2.load();
    video3.load();

    // Configurar listeners para quando cada vídeo terminar
    video1.addEventListener('ended', () => {
      // Quando João Manuel termina, iniciar Maria Silva
      video2.currentTime = 0;
      video2.play().catch((error) => {
        console.log('Erro ao reproduzir vídeo 2:', error);
      });
    });

    video2.addEventListener('ended', () => {
      // Quando Maria Silva termina, iniciar António Carlos
      video3.currentTime = 0;
      video3.play().catch((error) => {
        console.log('Erro ao reproduzir vídeo 3:', error);
      });
    });

    video3.addEventListener('ended', () => {
      // Quando António Carlos termina, voltar ao João Manuel
      video1.currentTime = 0;
      video1.play().catch((error) => {
        console.log('Erro ao reproduzir vídeo 1:', error);
      });
    });

    // Observer para iniciar a sequência quando a seção entrar na viewport
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Quando a seção "Vozes da Comunidade" entra na viewport, iniciar o primeiro vídeo (João Manuel)
            // Pausar outros vídeos que possam estar tocando
            if (video2 && !video2.paused) {
              video2.pause();
            }
            if (video3 && !video3.paused) {
              video3.pause();
            }
            
            // Iniciar o primeiro vídeo
            if (video1 && video1.paused) {
              video1.currentTime = 0;
              video1.play().catch((error) => {
                console.log('Erro ao reproduzir vídeo 1 automaticamente:', error);
              });
            }
          } else {
            // Quando a seção sai da viewport, pausar todos os vídeos
            if (video1 && !video1.paused) {
              video1.pause();
            }
            if (video2 && !video2.paused) {
              video2.pause();
            }
            if (video3 && !video3.paused) {
              video3.pause();
            }
          }
        });
      },
      {
        threshold: 0.1 // Iniciar quando 10% da seção estiver visível (mais sensível)
      }
    );

    this.intersectionObserver.observe(this.sectionElement.nativeElement);
  }

  ngOnDestroy() {
    // Remover classe quando sair da página
    document.body.classList.remove('navbar-solid');
    
    // Limpar observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

