import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { ToastComponent } from '../components/toast/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgFor,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NavbarComponent,
    FooterComponent,
    ScrollToTopComponent,
    ToastComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  appName = 'Associação';
  currentYear = new Date().getFullYear();
  developerName = 'GMabilane';
  showProjectosSubmenu = false;
  showMembrosSubmenu = false;
  
  navItems = [
    { label: 'Início', path: '' },
    { label: 'Historial', path: '', fragment: 'historial' },
    { label: 'Eventos', path: 'eventos' },
    { label: 'Serviços', path: 'servicos' },
    { label: 'Documentação', path: 'documentacao' },
    { label: 'Projectos', path: 'projectos' },
    { label: 'Área de Membros', path: 'membros' },
    { label: 'Login', path: 'login' },
  ];
  
  toggleProjectosSubmenu() {
    this.showProjectosSubmenu = !this.showProjectosSubmenu;
  }
  
  toggleMembrosSubmenu() {
    this.showMembrosSubmenu = !this.showMembrosSubmenu;
  }
  
  scrollToSection(sectionId: string) {
    if (sectionId === 'historial') {
      // Navegar para a home e depois fazer scroll para a seção
      window.location.href = '/#historial';
    }
  }
}


