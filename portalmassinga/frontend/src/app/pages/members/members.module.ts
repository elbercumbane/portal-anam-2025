import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MembersHomeComponent } from './members-home/members-home.component';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { RegisterComponent } from './register/register.component';
import { PayQuotasComponent } from './pay-quotas/pay-quotas.component';
import { ViewReceiptsComponent } from './view-receipts/view-receipts.component';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: '', component: MembersHomeComponent, canActivate: [authGuard] },
  { path: 'organograma', component: OrgChartComponent }, // Página pública
  { path: 'cadastro', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'pagar-cotas', component: PayQuotasComponent, canActivate: [authGuard] },
  { path: 'consultar-recibos', component: ViewReceiptsComponent, canActivate: [authGuard] },
  { path: 'perfil', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'pagamento-confirmado', loadComponent: () => import('./payment-confirmed/payment-confirmed.component').then(m => m.PaymentConfirmedComponent), canActivate: [authGuard] }
];

@NgModule({
  declarations: [
    OrgChartComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    RouterModule.forChild(routes),
    MembersHomeComponent,
    PayQuotasComponent,
    ViewReceiptsComponent
  ]
})
export class MembersModule { }
