import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServicesHomeComponent } from './services-home.component';
import { ServiceCardComponent } from './sections/service-card.component';

const routes: Routes = [
  { path: '', component: ServicesHomeComponent }
];

@NgModule({
  declarations: [
    ServicesHomeComponent,
    ServiceCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ServicesModule { }
