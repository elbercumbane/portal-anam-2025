import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'porque-apoiar', 
    loadComponent: () => import('./why-support/why-support.component').then(m => m.WhySupportComponent) 
  },
  { 
    path: 'torne-se-apoiante', 
    loadComponent: () => import('./become-supporter/become-supporter.component').then(m => m.BecomeSupporterComponent) 
  },
  { 
    path: 'area-apoiante', 
    loadComponent: () => import('./supporter-area/supporter-area.component').then(m => m.SupporterAreaComponent) 
  },
  { path: '', redirectTo: 'porque-apoiar', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class SupportersModule { }

