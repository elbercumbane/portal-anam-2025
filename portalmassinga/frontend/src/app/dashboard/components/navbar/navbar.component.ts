import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

// Import navbar components
import { NavbarMenuButtonComponent } from './components/navbar-menu-button/navbar-menu-button.component';
import { NavbarTitleComponent } from './components/navbar-title/navbar-title.component';
import { NavbarSearchComponent } from './components/navbar-search/navbar-search.component';
import { NavbarActionsComponent } from './components/navbar-actions/navbar-actions.component';
import { NavbarThemeToggleComponent } from './components/navbar-theme-toggle/navbar-theme-toggle.component';
import { NavbarNotificationsComponent } from './components/navbar-notifications/navbar-notifications.component';
import { NavbarUserProfileComponent } from './components/navbar-user-profile/navbar-user-profile.component';

@Component({
  selector: 'app-navbar',
  
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() isHandset = false;
  @Input() title: string = 'ANAM';
  @Input() subtitle: string = 'Associação de Naturais e Amigos de Massinga';
  @Input() notificationCount: number = 3;
  @Input() userName: string = 'DSI';
  @Input() userRole: string = 'Administrador';

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() refreshDashboard = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() themeToggle = new EventEmitter<boolean>();
  @Output() notificationsClick = new EventEmitter<void>();
  @Output() profileOptionClick = new EventEmitter<string>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onRefreshDashboard(): void {
    this.refreshDashboard.emit();
  }

  onSearch(query: string): void {
    this.search.emit(query);
  }

  onThemeToggle(isDarkMode: boolean): void {
    this.themeToggle.emit(isDarkMode);
  }

  onNotificationsClick(): void {
    this.notificationsClick.emit();
  }

  onProfileOptionClick(option: string): void {
    this.profileOptionClick.emit(option);
  }
}