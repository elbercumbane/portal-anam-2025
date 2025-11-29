import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'servicos', loadChildren: () => import('./pages/servicos/servicos.module').then(m => m.ServicosModule) },
      { path: 'eventos', redirectTo: '/', pathMatch: 'full' }, // Redireciona para home (seção de eventos já está lá)
      { path: 'historial', loadComponent: () => import('./pages/historial/historial.component').then(m => m.HistorialComponent) },
      { path: 'documentacao', loadChildren: () => import('./pages/documentacao/documentacao.module').then(m => m.DocumentacaoModule) },
      { path: 'projectos', loadChildren: () => import('./pages/projectos/projectos.module').then(m => m.ProjectosModule) },
      { path: 'membros', loadChildren: () => import('./pages/membros/membros.module').then(m => m.MembrosModule) },
      // Manter rotas existentes
      { path: 'sobre', loadComponent: () => import('./pages/sobre/sobre.component').then(m => m.SobreComponent) },
      { path: 'associar-se', loadComponent: () => import('./pages/associar/associar.component').then(m => m.AssociarComponent) },
      { path: 'noticias', loadComponent: () => import('./pages/noticias/noticias.component').then(m => m.NoticiasComponent) },
      { path: 'contato', loadComponent: () => import('./pages/contato/contato.component').then(m => m.ContatoComponent) },
      { path: 'programas', loadComponent: () => import('./pages/programas/programas.component').then(m => m.ProgramasComponent) },
      { path: 'parceiros', loadComponent: () => import('./pages/parceiros/parceiros.component').then(m => m.ParceirosComponent) },
    ],
  },
      { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '**', redirectTo: '' },
];
