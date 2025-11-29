import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProjectosHomeComponent } from './projectos-home/projectos-home.component';
import { RealizadosComponent } from './realizados/realizados.component';
import { AtivosComponent } from './ativos/ativos.component';
import { CandidaturasComponent } from './candidaturas/candidaturas.component';
import { CandidaturaFormComponent } from './candidatura-form/candidatura-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: ProjectosHomeComponent,
    children: [
      { path: '', redirectTo: 'ativos', pathMatch: 'full' },
      { path: 'realizados', component: RealizadosComponent },
      { path: 'ativos', component: AtivosComponent },
      { path: 'candidaturas', component: CandidaturasComponent }
    ]
  },
  { path: 'candidatura-form/:id', component: CandidaturaFormComponent }
];

@NgModule({
  declarations: [
    ProjectosHomeComponent,
    RealizadosComponent,
    AtivosComponent,
    CandidaturasComponent,
    CandidaturaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProjectosModule { }

