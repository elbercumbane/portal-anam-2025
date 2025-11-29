import { Component, Input } from '@angular/core';

export interface UserInfo {
  username: string;
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
    return this.userInfo.username.substring(0, 2).toUpperCase();
  }
}
