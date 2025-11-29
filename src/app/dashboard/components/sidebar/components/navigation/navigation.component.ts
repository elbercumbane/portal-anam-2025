import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

// Import submenu component
import { ServiceItem } from './submenus/view_data/service-submenu.component';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  active: boolean;
  hasSubmenu?: boolean;
  submenuItems?: NavigationItem[];
}

@Component({
  selector: 'app-navigation',
  
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {
  @Input() navigationItems: NavigationItem[] = [];
  @Input() activeItem: string = 'dashboard';
  @Output() navigationClick = new EventEmitter<NavigationItem>();
  @Output() serviceItemClick = new EventEmitter<ServiceItem>();

  serviceExpanded = false;

  onNavigationClick(item: NavigationItem): void {
    this.navigationClick.emit(item);
  }

  onServiceItemClick(item: ServiceItem): void {
    this.serviceItemClick.emit(item);
  }

  toggleService(): void {
    this.serviceExpanded = !this.serviceExpanded;
  }


  ngOnInit(): void {
    this.updateSubmenuStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeItem']) {
      this.updateSubmenuStates();
    }
  }

  private updateSubmenuStates(): void {
    // Expand service submenu if any item is active
    const serviceItems = ['fae', 'economic-agent', 'user', 'service'];
    this.serviceExpanded = serviceItems.includes(this.activeItem);

    // Expand attendance lists submenu if any item is active
  }


  getDefaultNavigationItems(): NavigationItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'home',
        route: 'dashboard',
        active: true
      },
      {
        id: 'overview',
        label: 'Visão Geral',
        icon: 'dashboard',
        route: 'dashboard/overview',
        active: false
      },
      {
        id: 'fae',
        label: 'FAE',
        icon: 'assignment',
        route: 'dashboard/view_data/fae',
        active: false
      },
      {
        id: 'economic-agent',
        label: 'Agente Econômico',
        icon: 'business',
        route: 'dashboard/view_data/economic-agent',
        active: false
      },
      {
        id: 'user',
        label: 'Utilizador',
        icon: 'person',
        route: 'dashboard/view_data/user',
        active: false
      },
      {
        id: 'service',
        label: 'Atendimento',
        icon: 'support_agent',
        route: 'dashboard/view_data/service-view',
        active: false
      },
      {
        id: 'training',
        label: 'Formação',
        icon: 'school',
        route: 'dashboard/training',
        active: false
      },
      {
        id: 'indicators',
        label: 'Indicadores',
        icon: 'assessment',
        route: 'dashboard/indicators',
        active: false
      },
      {
        id: 'report',
        label: 'Relatório',
        icon: 'description',
        route: 'dashboard/report',
        active: false
      },
      {
        id: 'attendance-lists-upload',
        label: 'Carregar Lista de Presença',
        icon: 'cloud_upload',
        route: 'dashboard/attendance-lists/upload',
        active: false
      },
      {
        id: 'attendance-lists-view',
        label: 'Ver Listas',
        icon: 'visibility',
        route: 'dashboard/attendance-lists/view',
        active: false
      },
      {
        id: 'form-management',
        label: 'Gestão de Formulários',
        icon: 'settings',
        route: 'dashboard/form-management',
        active: false
      },
      {
        id: 'sair',
        label: 'Sair',
        icon: 'logout',
        route: 'login',
        active: false
      }
    ];
  }
}
