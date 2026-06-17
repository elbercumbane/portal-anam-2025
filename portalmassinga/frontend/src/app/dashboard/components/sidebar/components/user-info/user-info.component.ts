import { Component, Input } from '@angular/core';

export interface UserInfo {
  username: string;
  email?: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  @Input() userInfo: UserInfo = {
    username: 'DSI',
    role: 'Administrador'
  };

  getUserInitials(): string {
    const name = this.userInfo.username || 'Usuário';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
