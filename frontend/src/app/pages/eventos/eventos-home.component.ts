import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroTabsComponent } from './sections/filtro-tabs.component';
import { ListaEventosComponent } from './sections/lista-eventos.component';

@Component({
  selector: 'app-eventos-home',
  standalone: false,
  templateUrl: './eventos-home.component.html',
  styleUrl: './eventos-home.component.scss'
})
export class EventosHomeComponent {
  tab: string = 'Próximos';
  
  onTabChange(tab: string) {
    this.tab = tab;
  }
}
