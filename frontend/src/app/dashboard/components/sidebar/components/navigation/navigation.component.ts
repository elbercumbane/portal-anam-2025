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
  projectosExpanded = false;
  membrosExpanded = false;
  paginasExpanded = false;
  tesourariaExpanded = false;
  indicadoresExpanded = false;

  onNavigationClick(item: NavigationItem): void {
    this.navigationClick.emit(item);
  }

  onServiceItemClick(item: ServiceItem): void {
    this.serviceItemClick.emit(item);
  }

  toggleService(): void {
    this.serviceExpanded = !this.serviceExpanded;
  }

  toggleProjectos(): void {
    this.projectosExpanded = !this.projectosExpanded;
  }

  toggleMembros(): void {
    this.membrosExpanded = !this.membrosExpanded;
  }

  togglePaginas(): void {
    this.paginasExpanded = !this.paginasExpanded;
  }

  toggleTesouraria(): void {
    this.tesourariaExpanded = !this.tesourariaExpanded;
  }

  toggleIndicadores(): void {
    this.indicadoresExpanded = !this.indicadoresExpanded;
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
    // Expand paginas submenu if any item is active
    const paginasItems = ['home', 'sobre', 'documentacao', 'servicos', 'eventos', 'historial', 'parceiros', 'programas', 'noticias', 'associar', 'contato'];
    this.paginasExpanded = paginasItems.includes(this.activeItem);

    // Expand projectos submenu if any item is active
    const projectosItems = ['projectos', 'projectos-home', 'projectos-ativos', 'projectos-realizados', 'candidaturas'];
    this.projectosExpanded = projectosItems.includes(this.activeItem);

    // Expand membros submenu if any item is active
    const membrosItems = ['membros', 'membros-home', 'membros-cadastro', 'membros-organograma'];
    this.membrosExpanded = membrosItems.includes(this.activeItem);

    // Expand tesouraria submenu if any item is active
    const tesourariaItems = ['tesouraria', 'tesouraria-pagar-cotas', 'tesouraria-gestao', 'tesouraria-relatorios'];
    this.tesourariaExpanded = tesourariaItems.includes(this.activeItem);

    // Expand indicadores submenu if any item is active
    const indicadoresItems = ['indicadores', 'indicadores-geral', 'indicadores-desempenho', 'indicadores-satisfacao', 'indicadores-metricas'];
    this.indicadoresExpanded = indicadoresItems.includes(this.activeItem);
  }


  getDefaultNavigationItems(): NavigationItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard',
        active: true
      }
    ];
  }

  // Categorias do Portal (similar ao navbar)
  getPaginasItems(): NavigationItem[] {
    return [
      {
        id: 'home',
        label: 'Página Inicial',
        icon: 'home',
        route: '/dashboard/pages/home',
        active: false
      },
      {
        id: 'sobre',
        label: 'Sobre',
        icon: 'info',
        route: '/dashboard/pages/sobre',
        active: false
      },
      {
        id: 'documentacao',
        label: 'Documentação',
        icon: 'folder_open',
        route: '/dashboard/pages/documentacao',
        active: false
      },
      {
        id: 'servicos',
        label: 'Serviços',
        icon: 'room_service',
        route: '/dashboard/pages/servicos',
        active: false
      },
      {
        id: 'eventos',
        label: 'Eventos',
        icon: 'event',
        route: '/dashboard/pages/eventos',
        active: false
      },
      {
        id: 'historial',
        label: 'Historial',
        icon: 'history',
        route: '/dashboard/pages/historial',
        active: false
      },
      {
        id: 'parceiros',
        label: 'Parceiros',
        icon: 'handshake',
        route: '/dashboard/pages/parceiros',
        active: false
      },
      {
        id: 'programas',
        label: 'Programas',
        icon: 'event_note',
        route: '/dashboard/pages/programas',
        active: false
      },
      {
        id: 'noticias',
        label: 'Notícias',
        icon: 'article',
        route: '/dashboard/pages/noticias',
        active: false
      },
      {
        id: 'associar',
        label: 'Associar-se',
        icon: 'person_add_alt',
        route: '/dashboard/pages/associar',
        active: false
      },
      {
        id: 'contato',
        label: 'Contato',
        icon: 'contact_mail',
        route: '/dashboard/pages/contato',
        active: false
      }
    ];
  }

  getProjectosItems(): NavigationItem[] {
    return [
      {
        id: 'projectos-ativos',
        label: 'Projetos Ativos',
        icon: 'play_circle',
        route: '/dashboard/pages/projectos/ativos',
        active: false
      },
      {
        id: 'projectos-realizados',
        label: 'Projetos Realizados',
        icon: 'check_circle',
        route: '/dashboard/pages/projectos/realizados',
        active: false
      },
      {
        id: 'candidaturas',
        label: 'Candidaturas',
        icon: 'description',
        route: '/dashboard/pages/projectos/candidaturas',
        active: false
      }
    ];
  }

  getMembrosItems(): NavigationItem[] {
    return [
      {
        id: 'membros-home',
        label: 'Área de Membros',
        icon: 'people',
        route: '/dashboard/pages/membros/home',
        active: false
      },
      {
        id: 'membros-organograma',
        label: 'Organograma',
        icon: 'account_tree',
        route: '/dashboard/pages/membros/organograma',
        active: false
      }
    ];
  }

  getTesourariaItems(): NavigationItem[] {
    return [
      {
        id: 'tesouraria-pagar-cotas',
        label: 'Pagar Cotas',
        icon: 'payment',
        route: '/dashboard/pages/tesouraria/pagar-cotas',
        active: false
      },
      {
        id: 'tesouraria-gestao',
        label: 'Gestão Financeira',
        icon: 'account_balance',
        route: '/dashboard/pages/tesouraria/gestao',
        active: false
      },
      {
        id: 'tesouraria-relatorios',
        label: 'Relatórios',
        icon: 'assessment',
        route: '/dashboard/pages/tesouraria/relatorios',
        active: false
      }
    ];
  }

  getIndicadoresItems(): NavigationItem[] {
    return [
      {
        id: 'indicadores-geral',
        label: 'Visão Geral',
        icon: 'dashboard',
        route: '/dashboard/indicadores/geral',
        active: false
      },
      {
        id: 'indicadores-desempenho',
        label: 'Desempenho',
        icon: 'trending_up',
        route: '/dashboard/indicadores/desempenho',
        active: false
      },
      {
        id: 'indicadores-satisfacao',
        label: 'Satisfação',
        icon: 'sentiment_satisfied',
        route: '/dashboard/indicadores/satisfacao',
        active: false
      },
      {
        id: 'indicadores-metricas',
        label: 'Métricas',
        icon: 'analytics',
        route: '/dashboard/indicadores/metricas',
        active: false
      }
    ];
  }
}
