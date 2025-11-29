import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectos-home',
  standalone: false,
  templateUrl: './projectos-home.component.html',
  styleUrl: './projectos-home.component.scss'
})
export class ProjectosHomeComponent implements OnInit, OnDestroy {
  
  constructor(private router: Router) {}
  isAtTop = true;

  estatisticas = [
    { 
      valor: '50+', 
      label: 'Projetos Realizados', 
      icon: 'check-circle' 
    },
    { 
      valor: '15+', 
      label: 'Projetos Ativos', 
      icon: 'rocket' 
    },
    { 
      valor: '8.5M+', 
      label: 'MZN Investidos', 
      icon: 'dollar-sign' 
    },
    { 
      valor: '10000+', 
      label: 'Vidas Impactadas', 
      icon: 'heart' 
    }
  ];

  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
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
