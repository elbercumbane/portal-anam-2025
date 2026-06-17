import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-navbar-user-profile',
  templateUrl: './navbar-user-profile.component.html',
  styleUrls: ['./navbar-user-profile.component.scss']
})
export class NavbarUserProfileComponent implements OnInit {
  @Input() userName: string = 'Usuário';
  @Input() userRole: string = 'Administrador';
  @Input() userEmail: string = '';
  @Output() profileOptionClick = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!this.userName || this.userName === 'Usuário' || this.userName === 'DSI') {
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

    if (!this.userEmail) {
      if (currentUser?.email) {
        this.userEmail = currentUser.email;
      } else {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
          this.userEmail = savedEmail;
        }
      }
    }

    if (!this.userRole || this.userRole === 'Administrador') {
      const role = currentUser?.role || localStorage.getItem('userRole');
      if (role) {
        this.userRole = this.formatRoleLabel(role);
      }
    }
  }

  getUserInitials(): string {
    if (!this.userName || this.userName.trim() === '') {
      return 'U';
    }

    const nameParts = this.userName.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }

  formatRoleLabel(role: string): string {
    const r = (role || '').toLowerCase();
    if (r === 'super-admin') return 'Super Administrador';
    if (r === 'admin' || r === 'administrador') return 'Administrador Principal';
    if (r === 'membro') return 'Membro';
    return role;
  }

  onProfileOption(option: string): void {
    if (option === 'logout') {
      this.authService.logout();
    } else {
      this.profileOptionClick.emit(option);
    }
  }
}
