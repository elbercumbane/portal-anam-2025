import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-navbar-user-profile',
  styleUrls: ['./navbar-user-profile.component.scss'],
  template: `
    <button 
      mat-button 
      class="user-dropdown-trigger"
      [matMenuTriggerFor]="profileMenu">
      <span class="user-name">{{ userName }}</span>
      <mat-icon class="dropdown-arrow">expand_more</mat-icon>
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obter nome do usuário: prioridade AuthService > localStorage > input
    if (!this.userName || this.userName === 'Usuário' || this.userName === 'DSI') {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.nome) {
        this.userName = currentUser.nome;
      } else {
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
      this.authService.logout();
    } else {
      this.profileOptionClick.emit(option);
    }
  }
}
