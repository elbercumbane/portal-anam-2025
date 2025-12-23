import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-home',
  standalone: false,
  templateUrl: './projects-home.component.html',
  styleUrl: './projects-home.component.scss'
})
export class ProjectsHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;
  
  constructor(private router: Router) {}
  isAtTop = true;

  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
  }

  ngAfterViewInit() {
    // Configurar fade out/in para transição suave do vídeo com loop infinito
    if (this.heroVideo?.nativeElement) {
      this.setupVideoFadeTransition();
    }
  }

  private setupVideoFadeTransition(): void {
    const video = this.heroVideo.nativeElement;
    
    // Remover o atributo loop do HTML para controlar manualmente com fade
    video.loop = false;
    
    // Listener para quando o vídeo terminar
    video.addEventListener('ended', () => {
      // Fade out
      video.style.transition = 'opacity 0.5s ease-out';
      video.style.opacity = '0';
      
      // Após o fade out, resetar e fazer fade in
      setTimeout(() => {
        video.currentTime = 0;
        video.style.transition = 'opacity 0.5s ease-in';
        video.style.opacity = '1';
        video.play().catch((error) => {
          console.log('Erro ao reproduzir vídeo:', error);
        });
      }, 500); // Tempo do fade out
    });
    
    // Garantir que o vídeo inicie com opacidade total
    video.style.opacity = '1';
  }

  ngOnDestroy() {
    // Remover classe quando sair da página
    document.body.classList.remove('navbar-solid');
  }

  navigateTo(route: 'ativos' | 'realizados' | 'candidaturas', event: Event) {
    event.preventDefault();
    const targetRoute = route === 'ativos' ? ['/projectos', 'ativos'] : ['/projectos', route];
    this.router.navigate(targetRoute).then(() => {
      this.scrollToContent();
    });
  }

  private scrollToContent() {
    const contentSection = document.querySelector('.projectos-container');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.isAtTop = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.isAtTop = true;
  }

  handleScrollButton() {
    if (this.isAtTop) {
      this.scrollToContent();
    } else {
      this.scrollToTop();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isAtTop = window.scrollY < window.innerHeight * 0.4;
  }
}
