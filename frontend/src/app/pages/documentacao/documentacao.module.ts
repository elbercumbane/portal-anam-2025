import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DocumentosHomeComponent } from './documentos-home.component';

const routes: Routes = [
  { path: '', component: DocumentosHomeComponent }
];

@NgModule({
  declarations: [
    DocumentosHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DocumentacaoModule { }

