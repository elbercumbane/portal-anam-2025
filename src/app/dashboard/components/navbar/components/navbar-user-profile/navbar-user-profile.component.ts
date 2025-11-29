import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar-user-profile',
  styleUrls: ['./navbar-user-profile.component.scss'],
  template: `
    <button 
      mat-icon-button 
      class="action-btn user-profile" 
      matTooltip="Perfil do Usuário"
      [matMenuTriggerFor]="profileMenu">
      <mat-icon class="profile-icon">account_circle</mat-icon>
    </button>
    
    <mat-menu #profileMenu="matMenu" class="profile-menu" xPosition="before">
      <div class="profile-header">
        <div class="profile-avatar">
          <span class="avatar-text">{{ getUserInitials() }}</span>
        </div>
        <div class="profile-info">
          <div class="profile-name">{{ userName }}</div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <button mat-menu-item (click)="onProfileOption('profile')">
        <mat-icon>person</mat-icon>
        <span>Perfil</span>
      </button>
      
      <button mat-menu-item (click)="onProfileOption('users')">
        <mat-icon>group</mat-icon>
        <span>Gestão de Usuários</span>
      </button>
      
      <button mat-menu-item (click)="onProfileOption('settings')">
        <mat-icon>settings</mat-icon>
        <span>Configurações</span>
      </button>
      
      <mat-divider></mat-divider>
      
      <button mat-menu-item (click)="onProfileOption('logout')" class="logout-item">
        <mat-icon>logout</mat-icon>
        <span>Sair</span>
      </button>
    </mat-menu>
  `,
})
export class NavbarUserProfileComponent implements OnInit {
  @Input() userName: string = 'Usuário';
  @Input() userRole: string = 'Administrador';
  @Output() profileOptionClick = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Obter nome completo do localStorage se disponível e se userName não foi passado
    if (!this.userName || this.userName === 'Usuário' || this.userName === 'DSI') {
      const savedFullName = localStorage.getItem('userFullName');
      if (savedFullName) {
        this.userName = savedFullName;
      } else {
        const savedUserName = localStorage.getItem('userName');
        if (savedUserName) {
          this.userName = savedUserName;
        }
      }
    }
  }

  getUserInitials(): string {
    if (!this.userName || this.userName.trim() === '') {
      return 'U';
    }
    
    const nameParts = this.userName.trim().split(' ');
    if (nameParts.length === 1) {
      // Se houver apenas um nome, pegar as duas primeiras letras
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      // Pegar a primeira letra do primeiro e último nome
      const firstInitial = nameParts[0].charAt(0).toUpperCase();
      const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
      return firstInitial + lastInitial;
    }
  }

  onProfileOption(option: string): void {
    if (option === 'logout') {
      this.logout();
    } else {
      this.profileOptionClick.emit(option);
    }
  }
  
  private logout(): void {
    // Remover token e informações de sessão
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userName');
    
    // Redirecionar para login
    this.router.navigate(['/login']);
  }
}
