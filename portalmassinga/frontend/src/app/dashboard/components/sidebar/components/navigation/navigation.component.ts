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
  badgeCount?: number;  // Contador para badge (ex: membros pendentes)
}

@Component({
  selector: 'app-navigation',
  
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {
  @Input() navigationItems: NavigationItem[] = [];
  @Input() activeItem: string = 'dashboard';
  @Input() pendingMembersCount = 0;  // Número de membros a aguardar aprovação
  @Output() navigationClick = new EventEmitter<NavigationItem>();
  @Output() serviceItemClick = new EventEmitter<ServiceItem>();

  serviceExpanded = false;
  projectosExpanded = false;
  membrosExpanded = false;
  apoioExpanded = false;
  simpatizantesExpanded = false;
  eventosExpanded = false;
  paginasExpanded = false;
  configuracoesExpanded = false;
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

  toggleApoio(): void {
    this.apoioExpanded = !this.apoioExpanded;
  }

  toggleSimpatizantes(): void {
    this.simpatizantesExpanded = !this.simpatizantesExpanded;
  }

  toggleEventos(): void {
    this.eventosExpanded = !this.eventosExpanded;
  }

  togglePaginas(): void {
    this.paginasExpanded = !this.paginasExpanded;
  }

  toggleConfiguracoes(): void {
    this.configuracoesExpanded = !this.configuracoesExpanded;
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
    // Expand configuracoes submenu if any item is active
    const configItems = ['home', 'sobre', 'documentacao', 'servicos', 'eventos', 'historial', 'parceiros', 'programas', 'noticias', 'associar', 'contato', 'config-notificacoes', 'config-galeria'];
    this.configuracoesExpanded = configItems.includes(this.activeItem);

    // Expand projectos submenu if any item is active
    const projectosItems = ['projectos', 'projectos-home', 'projectos-ativos', 'projectos-realizados', 'candidaturas'];
    this.projectosExpanded = projectosItems.includes(this.activeItem);

    // Expand membros submenu if any item is active
    const membrosItems = ['membros', 'membros-home', 'membros-gestao', 'membros-cadastro', 'membros-organograma'];
    this.membrosExpanded = membrosItems.includes(this.activeItem);

    // Expand apoio submenu if any item is active
    const apoioItems = ['apoio-gestao'];
    this.apoioExpanded = apoioItems.includes(this.activeItem);

    // Expand simpatizantes submenu if any item is active
    const simpatizantesItems = ['simpatizantes-gestao'];
    this.simpatizantesExpanded = simpatizantesItems.includes(this.activeItem);

    // Expand eventos submenu if any item is active
    const eventosItems = ['eventos-gestao', 'eventos-inscricoes'];
    this.eventosExpanded = eventosItems.includes(this.activeItem);

    // Expand tesouraria submenu if any item is active
    const tesourariaItems = ['tesouraria', 'tesouraria-cotas', 'tesouraria-gestao', 'tesouraria-relatorios'];
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

  /** Itens de Configurações: Páginas do site + Notificações + Galeria */
  getConfiguracoesItems(): NavigationItem[] {
    return [
      ...this.getPaginasItems(),
      {
        id: 'config-notificacoes',
        label: 'Notificações',
        icon: 'notifications',
        route: '/dashboard/config/notificacoes',
        active: false
      },
      {
        id: 'config-galeria',
        label: 'Imagens da Galeria',
        icon: 'collections',
        route: '/dashboard/config/galeria',
        active: false
      }
    ];
  }

  // Páginas do site (usado dentro de Configurações)
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
        id: 'documentacao',
        label: 'Documentação',
        icon: 'description',
        route: '/dashboard/pages/documentacao',
        active: false
      },
      {
        id: 'servicos',
        label: 'Serviços',
        icon: 'miscellaneous_services',
        route: '/dashboard/pages/servicos',
        active: false
      },
      {
        id: 'eventos',
        label: 'Eventos',
        icon: 'celebration',
        route: '/dashboard/pages/eventos',
        active: false
      },
      {
        id: 'historial',
        label: 'Historial',
        icon: 'history_edu',
        route: '/dashboard/pages/historial',
        active: false
      },
      {
        id: 'galeria',
        label: 'Galeria',
        icon: 'collections',
        route: '/dashboard/pages/galeria',
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
        icon: 'assignment',
        route: '/dashboard/pages/programas',
        active: false
      },
      {
        id: 'noticias',
        label: 'Notícias',
        icon: 'newspaper',
        route: '/dashboard/pages/noticias',
        active: false
      },
      {
        id: 'associar',
        label: 'Associar-se',
        icon: 'person_add',
        route: '/dashboard/pages/associar',
        active: false
      },
      {
        id: 'contato',
        label: 'Contato',
        icon: 'contact_support',
        route: '/dashboard/pages/contato',
        active: false
      }
    ];
  }

  getProjectosItems(): NavigationItem[] {
    return [
      {
        id: 'projectos-ativos',
        label: 'Projectos em Execução',
        icon: 'play_circle_filled',
        route: '/dashboard/pages/projectos/ativos',
        active: false
      },
      {
        id: 'projectos-realizados',
        label: 'Projetos Realizados',
        icon: 'task_alt',
        route: '/dashboard/pages/projectos/realizados',
        active: false
      },
      {
        id: 'candidaturas',
        label: 'Projectos a serem realizados',
        icon: 'pending_actions',
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
        icon: 'group_work',
        route: '/dashboard/pages/membros/home',
        active: false
      },
      {
        id: 'membros-gestao',
        label: 'Gestão de Membros',
        icon: 'admin_panel_settings',
        route: '/dashboard/pages/membros/gestao',
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

  getApoioItems(): NavigationItem[] {
    return [
      {
        id: 'apoio-gestao',
        label: 'Gestão de Apoiantes',
        icon: 'handshake',
        route: '/dashboard/pages/apoio/gestao',
        active: false
      }
    ];
  }

  getSimpatizantesItems(): NavigationItem[] {
    return [
      {
        id: 'simpatizantes-gestao',
        label: 'Gestão de Simpatizantes',
        icon: 'thumb_up',
        route: '/dashboard/pages/simpatizantes/gestao',
        active: false
      }
    ];
  }

  getMembrosGestaoItem(): NavigationItem {
    return {
      id: 'membros-gestao',
      label: 'Gestão de Membros',
      icon: 'admin_panel_settings',
      route: '/dashboard/pages/membros/gestao',
      active: false,
      badgeCount: this.pendingMembersCount
    };
  }

  getSairItem(): NavigationItem {
    return {
      id: 'sair',
      label: 'Sair',
      icon: 'logout',
      route: '/login',
      active: false
    };
  }

  getApoioGestaoItem(): NavigationItem {
    return this.getApoioItems()[0];
  }

  getSimpatizantesGestaoItem(): NavigationItem {
    return this.getSimpatizantesItems()[0];
  }

  getEventosItems(): NavigationItem[] {
    return [
      {
        id: 'eventos-gestao',
        label: 'Gestão de Eventos',
        icon: 'event_note',
        route: '/dashboard/pages/eventos/gestao',
        active: false
      },
      {
        id: 'eventos-inscricoes',
        label: 'Inscrições em Eventos',
        icon: 'how_to_reg',
        route: '/dashboard/pages/eventos/inscricoes',
        active: false
      }
    ];
  }

  getTesourariaItems(): NavigationItem[] {
    return [
      {
        id: 'tesouraria-cotas',
        label: 'Gestão de Cotas',
        icon: 'payments',
        route: '/dashboard/tesouraria/cotas',
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
        icon: 'summarize',
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
        icon: 'insights',
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
