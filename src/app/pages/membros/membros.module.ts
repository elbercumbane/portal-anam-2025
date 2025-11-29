import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MembrosHomeComponent } from './membros-home/membros-home.component';
import { OrganogramaComponent } from './organograma/organograma.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PagarCotasComponent } from './pagar-cotas/pagar-cotas.component';

const routes: Routes = [
  { path: '', component: MembrosHomeComponent },
  { path: 'organograma', component: OrganogramaComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'pagar-cotas', component: PagarCotasComponent }
];

@NgModule({
  declarations: [
    OrganogramaComponent,
    CadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterModule.forChild(routes),
    MembrosHomeComponent,
    PagarCotasComponent
  ]
})
export class MembrosModule { }
