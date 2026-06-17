import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MembersHomeComponent } from './members-home/members-home.component';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { RegisterComponent } from './register/register.component';
import { PayQuotasComponent } from './pay-quotas/pay-quotas.component';
import { ViewReceiptsComponent } from './view-receipts/view-receipts.component';

const routes: Routes = [
  { path: '', component: MembersHomeComponent },
  { path: 'lista', loadComponent: () => import('./members-list/members-list.component').then(m => m.MembersListComponent) },
  { path: 'organograma', component: OrgChartComponent }, // Página pública
  { path: 'cadastro', component: RegisterComponent },
  { path: 'pagar-cotas', component: PayQuotasComponent },
  { path: 'consultar-recibos', component: ViewReceiptsComponent },
  { path: 'perfil', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'pagamento-confirmado', loadComponent: () => import('./payment-confirmed/payment-confirmed.component').then(m => m.PaymentConfirmedComponent) }
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
    NavbarComponent,
    FooterComponent,
    MembersHomeComponent,
    PayQuotasComponent,
    ViewReceiptsComponent
  ]
})
export class MembersModule { }
