import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-membros-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './membros-home.component.html',
  styleUrl: './membros-home.component.scss'
})
export class MembrosHomeComponent implements OnInit {
  userName = '';
  userInitials = '';

  stats = [
    { icon: '👥', number: '150+', label: 'Membros Activos' },
    { icon: '📊', number: '50+', label: 'Projectos Assinados' },
    { icon: '📍', number: '12', label: 'Províncias Representadas' },
    { icon: '💰', number: '85%', label: 'Cotas Pagas' }
  ];

  memberInfo = [
    {
      icon: '📋',
      title: 'Lista de Membros',
      description: 'Consulte informações sobre todos os membros da associação',
      link: '/membros/lista'
    },
    {
      icon: '📈',
      title: 'Estatísticas',
      description: 'Visualize dados e métricas sobre a associação',
      link: '/membros/estatisticas'
    },
    {
      icon: '🏢',
      title: 'Organograma',
      description: 'Conheça a estrutura organizacional da associação',
      link: '/membros/organograma'
    },
    {
      icon: '💳',
      title: 'Pagamento de Cotas',
      description: 'Efetue o pagamento das suas cotas de forma rápida',
      link: '/membros/pagar-cotas'
    }
  ];

  programs = [
    {
      name: 'Programa de Desenvolvimento Comunitário',
      description: 'Iniciativa focada no desenvolvimento sustentável das comunidades locais de Massinga.',
      status: 'ativo',
      statusLabel: 'Em Andamento',
      date: 'Jan 2025 - Dez 2025',
      location: 'Massinga, Inhambane'
    },
    {
      name: 'Programa de Educação e Capacitação',
      description: 'Ofertas de formação profissional e capacitação técnica para jovens e adultos.',
      status: 'ativo',
      statusLabel: 'Em Andamento',
      date: 'Mar 2025 - Nov 2025',
      location: 'Várias Províncias'
    },
    {
      name: 'Programa de Apoio à Saúde',
      description: 'Campanhas de saúde e apoio médico às comunidades mais necessitadas.',
      status: 'planejado',
      statusLabel: 'Planejado',
      date: 'Abr 2025 - Set 2025',
      location: 'Massinga'
    }
  ];

  reports = [
    {
      icon: '📄',
      title: 'Relatório Anual 2024',
      description: 'Relatório completo das atividades e resultados do ano de 2024',
      date: '15 Jan 2025',
      link: '#'
    },
    {
      icon: '📊',
      title: 'Relatório Financeiro Q4 2024',
      description: 'Análise financeira do último trimestre de 2024',
      date: '10 Jan 2025',
      link: '#'
    },
    {
      icon: '📈',
      title: 'Relatório de Projetos',
      description: 'Status e progresso de todos os projetos em execução',
      date: '05 Jan 2025',
      link: '#'
    },
    {
      icon: '👥',
      title: 'Relatório de Membros',
      description: 'Estatísticas e informações sobre o quadro de membros',
      date: '01 Jan 2025',
      link: '#'
    }
  ];

  quickActions = [
    { icon: 'payment', label: 'Pagar Cotas', link: '/membros/pagar-cotas' },
    { icon: 'receipt_long', label: 'Consultar Recibos', link: '/membros/consultar-recibos' },
    { icon: 'person_add', label: 'Cadastro', link: '/membros/cadastro' },
    { icon: 'account_tree', label: 'Organograma', link: '/membros/organograma' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nome;
      this.userInitials = user.nome
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
}
}
