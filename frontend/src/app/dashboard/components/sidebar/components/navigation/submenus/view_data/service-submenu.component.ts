import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

export interface ServiceItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-service-submenu',
  
  templateUrl: './service-submenu.component.html',
  styleUrls: ['./service-submenu.component.scss']
})
export class ServiceSubmenuComponent {
  @Input() isExpanded = false;
  @Output() itemClick = new EventEmitter<ServiceItem>();

  serviceItems: ServiceItem[] = [
    {
      id: 'fae',
      label: 'FAE',
      icon: 'headset_mic',
      route: '/fae',
      description: 'Formulário de Atendimento ao Estudante'
    },
    {
      id: 'agente-economico',
      label: 'Agente Econômico',
      icon: 'business',
      route: '/agente-economico',
      description: 'Formulário para Agentes Econômicos'
    },
    {
      id: 'utilizador',
      label: 'Utilizador',
      icon: 'account_circle',
      route: '/utilizador',
      description: 'Formulário de Utilizador'
    }
  ];

  onItemClick(item: ServiceItem): void {
    this.itemClick.emit(item);
  }
}
