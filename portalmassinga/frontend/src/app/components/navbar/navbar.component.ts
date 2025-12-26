import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  @Input() appName = 'Associação';
  @Input() navItems: Array<{label: string, path: string}> = [];
  @Output() menuToggle = new EventEmitter<void>();
  @HostBinding('class.solid') solid = false;
  @HostBinding('class.scrolled') scrolled = false;
  
  showMobileMenu = false;
  showPaginasSubmenu = false;
  showProjectosSubmenu = false;
  showMembrosSubmenu = false;
  showApoioSubmenu = false;
  showSimpatizantesSubmenu = false;
  isHidden = false;
  private hideTimeout: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.scrolled = scrollPosition > 40;
    this.solid = scrollPosition > 40;
    
    // Mostrar navbar ao fazer scroll
    this.showNavbar();
    
    // Se estiver fora do hero (scrolled), iniciar timer para esconder
    if (this.scrolled) {
      this.startHideTimer();
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(): void {
    // Mostrar navbar ao mover o mouse
    if (this.scrolled) {
      this.showNavbar();
      this.startHideTimer();
    }
  }

  private showNavbar(): void {
    this.isHidden = false;
    this.clearHideTimer();
  }

  private startHideTimer(): void {
    this.clearHideTimer();
    this.hideTimeout = setTimeout(() => {
      if (this.scrolled) {
        this.isHidden = true;
      }
    }, 2000);
  }

  private clearHideTimer(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  scrollToSection(sectionId: string): void {
    const currentPath = this.router.url.split('#')[0];

    if (sectionId === 'inicio') {
      if (currentPath === '/') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        this.router.navigate(['/']);
      }
    } else {
      // Para outras seções na página inicial
      if (currentPath === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        // Se não estiver na página inicial, navegar para a página inicial com fragmento
        this.router.navigate(['/'], { fragment: sectionId });
      }
    }
  }
}


