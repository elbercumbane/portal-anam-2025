import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroTabsComponent } from './sections/filtro-tabs.component';
import { ListaEventosComponent } from './sections/lista-eventos.component';

@Component({
  selector: 'app-events-home',
  standalone: false,
  templateUrl: './eventos-home.component.html',
  styleUrl: './eventos-home.component.scss'
})
export class EventsHomeComponent {
  tab: string = 'Próximos';
  
  onTabChange(tab: string) {
    this.tab = tab;
  }
}
