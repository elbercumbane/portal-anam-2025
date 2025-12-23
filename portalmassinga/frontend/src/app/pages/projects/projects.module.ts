import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsHomeComponent } from './projects-home/projects-home.component';
import { CompletedComponent } from './completed/completed.component';
import { ActiveComponent } from './active/active.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationFormComponent } from './application-form/application-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: ProjectsHomeComponent,
    children: [
      { path: '', redirectTo: 'ativos', pathMatch: 'full' },
      { path: 'realizados', component: CompletedComponent },
      { path: 'ativos', component: ActiveComponent },
      { path: 'candidaturas', component: ApplicationsComponent }
    ]
  },
  { path: 'candidatura-form/:id', component: ApplicationFormComponent }
];

@NgModule({
  declarations: [
    ProjectsHomeComponent,
    CompletedComponent,
    ActiveComponent,
    ApplicationsComponent,
    ApplicationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProjectsModule { }
