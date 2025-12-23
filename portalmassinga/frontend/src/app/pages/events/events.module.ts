import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventosHomeComponent } from './eventos-home.component';
import { FiltroTabsComponent } from './sections/filtro-tabs.component';
import { ListaEventosComponent } from './sections/lista-eventos.component';

const routes: Routes = [
  { path: '', component: EventosHomeComponent }
];

@NgModule({
  declarations: [
    EventosHomeComponent,
    FiltroTabsComponent,
    ListaEventosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EventsModule { }

