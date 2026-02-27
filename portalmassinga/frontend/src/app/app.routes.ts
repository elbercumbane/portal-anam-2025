import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'servicos', loadChildren: () => import('./pages/services/services.module').then(m => m.ServicesModule) },
      { path: 'eventos', redirectTo: '/', pathMatch: 'full' }, // Redireciona para home (seção de eventos já está lá)
      { path: 'eventos/inscricao/:id', loadComponent: () => import('./pages/events/event-registration/event-registration.component').then(m => m.EventRegistrationComponent) },
      { path: 'eventos/inscricao', loadComponent: () => import('./pages/events/event-registration/event-registration.component').then(m => m.EventRegistrationComponent) },
      { path: 'eventos/consultar-registro', loadComponent: () => import('./pages/events/event-registration-query/event-registration-query.component').then(m => m.EventRegistrationQueryComponent) },
      { path: 'eventos/meus-eventos', loadComponent: () => import('./pages/events/my-events/my-events.component').then(m => m.MyEventsComponent) },
      { path: 'sobre-nos', loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent) },
      { path: 'historial', redirectTo: 'sobre-nos', pathMatch: 'full' },
      { path: 'documentacao', loadChildren: () => import('./pages/documentation/documentation.module').then(m => m.DocumentationModule) },
      { path: 'projectos', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule) },
      // Manter rotas existentes
      { path: 'sobre', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
      { path: 'associar-se', loadComponent: () => import('./pages/associate/associate.component').then(m => m.AssociateComponent) },
      { path: 'noticias', loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent) },
      { path: 'contato', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
      { path: 'programas', loadComponent: () => import('./pages/programs/programs.component').then(m => m.ProgramsComponent) },
      { path: 'parceiros', loadComponent: () => import('./pages/partners/partners.component').then(m => m.PartnersComponent) },
      { path: 'simpatizantes', loadChildren: () => import('./pages/sympathizers/sympathizers.module').then(m => m.SympathizersModule) },
      { path: 'apoio', loadChildren: () => import('./pages/supporters/supporters.module').then(m => m.SupportersModule) },
    ],
  },
  // Rotas sem navbar (fora do shell)
  { path: 'marketplace', loadComponent: () => import('./pages/marktplace2/marketplace2.component').then(m => m.Marketplace2Component) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
      // Rotas de membros - fora do shell para não ter navbar
      { path: 'membros', loadChildren: () => import('./pages/members/members.module').then(m => m.MembersModule) },
      // Rotas de apoiante - fora do shell para não ter navbar
      { path: 'apoio/area-apoiante', loadComponent: () => import('./pages/supporters/supporter-area/supporter-area.component').then(m => m.SupporterAreaComponent) },
      // Área de Simpatizante desativada por enquanto (só registo). Reativar quando necessário:
      // { path: 'simpatizantes/area-simpatizante', loadComponent: () => import('./pages/sympathizers/sympathizer-area/sympathizer-area.component').then(m => m.SympathizerAreaComponent) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '**', redirectTo: '' },
];
