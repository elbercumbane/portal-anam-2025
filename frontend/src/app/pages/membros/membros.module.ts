import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MembrosHomeComponent } from './membros-home/membros-home.component';
import { OrganogramaComponent } from './organograma/organograma.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PagarCotasComponent } from './pagar-cotas/pagar-cotas.component';
import { ConsultarRecibosComponent } from './consultar-recibos/consultar-recibos.component';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: '', component: MembrosHomeComponent, canActivate: [authGuard] },
  { path: 'organograma', component: OrganogramaComponent, canActivate: [authGuard] },
  { path: 'cadastro', component: CadastroComponent, canActivate: [authGuard] },
  { path: 'pagar-cotas', component: PagarCotasComponent, canActivate: [authGuard] },
  { path: 'consultar-recibos', component: ConsultarRecibosComponent, canActivate: [authGuard] },
  { path: 'pagamento-confirmado', loadComponent: () => import('./pagamento-confirmado/pagamento-confirmado.component').then(m => m.PagamentoConfirmadoComponent), canActivate: [authGuard] }
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
    PagarCotasComponent,
    ConsultarRecibosComponent
  ]
})
export class MembrosModule { }
