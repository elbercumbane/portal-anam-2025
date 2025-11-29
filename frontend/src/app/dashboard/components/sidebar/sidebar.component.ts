import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Import sub-components
import { NavigationComponent, NavigationItem } from './components/navigation/navigation.component';
import { ServiceItem } from './components/navigation/submenus/view_data/service-submenu.component';
import { UserInfo } from './components/user-info/user-info.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isHandset = false;
  @Input() sidebarOpen = true;
  @Input() activeNavigationItem = 'dashboard';
  @Input() navigationItems: NavigationItem[] = [];
  @Input() userName = 'Usuário';
  @Input() userRole = 'Técnico Administrador';
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() navigationClick = new EventEmitter<NavigationItem>();
  @Output() serviceItemClick = new EventEmitter<ServiceItem>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onNavigationClick(item: NavigationItem): void {
    this.navigationClick.emit(item);
  }

  onServiceItemClick(item: ServiceItem): void {
    this.serviceItemClick.emit(item);
  }

  get userInfo(): UserInfo {
    return {
      username: this.userName || 'Usuário',
      role: this.userRole
    };
  }
}
