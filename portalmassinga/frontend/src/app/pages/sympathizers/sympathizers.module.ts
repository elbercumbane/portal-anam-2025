import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'porque-tornar-se', 
    loadComponent: () => import('./why-become-sympathizer/why-become-sympathizer.component').then(m => m.WhyBecomeSympathizerComponent) 
  },
  { 
    path: 'torne-se-simpatizante', 
    loadComponent: () => import('./become-sympathizer/become-sympathizer.component').then(m => m.BecomeSympathizerComponent) 
  },
  { 
    path: 'area-simpatizante', 
    loadComponent: () => import('./sympathizer-area/sympathizer-area.component').then(m => m.SympathizerAreaComponent) 
  },
  { path: '', redirectTo: 'porque-tornar-se', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class SympathizersModule { }

