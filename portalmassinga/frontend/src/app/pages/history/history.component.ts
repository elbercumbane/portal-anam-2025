import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  
  milestones: Milestone[] = [
    {
      ano: '2020',
      titulo: 'Fundação da ANAM',
      descricao: 'Um grupo de visionários naturais de Massinga reuniu-se com o sonho de criar uma associação que promovesse o desenvolvimento social, cultural e económico da região. Nascia assim a ANAM, com um grupo de membros fundadores dedicados.',
      imagem: '/assets/FOTO1 ANAM.jpeg',
      categoria: 'Fundação'
    },
    {
      ano: '2021',
      titulo: 'Primeiro Projeto Comunitário',
      descricao: 'Lançamento do primeiro grande projeto comunitário, estabelecendo a ANAM como uma força ativa no desenvolvimento local de Massinga.',
      imagem: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
      categoria: 'Início'
    },
    {
      ano: '2022',
      titulo: 'Expansão de Atividades',
      descricao: 'A ANAM expandiu suas atividades, criando parcerias estratégicas e aumentando o número de membros e projetos realizados.',
      imagem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      categoria: 'Crescimento'
    },
    {
      ano: '2023',
      titulo: 'Transformação Digital',
      descricao: 'Lançamento da plataforma digital da ANAM, modernizando processos e ampliando o alcance dos serviços. Implementação de sistemas de gestão e comunicação online.',
      imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      categoria: 'Inovação'
    },
    {
      ano: '2024',
      titulo: 'Consolidação e Impacto',
      descricao: 'Consolidação das atividades e aumento significativo do impacto na comunidade, com mais projetos e membros ativos.',
      imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      categoria: 'Consolidação'
    },
    {
      ano: '2025',
      titulo: 'Presente e Futuro',
      descricao: 'Hoje, a ANAM conta com mais de 250 membros ativos, 50+ projetos realizados e uma visão clara de desenvolvimento sustentável para Massinga e região. Continuamos crescendo e impactando vidas.',
      imagem: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
      categoria: 'Atualidade'
    }
  ];

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

