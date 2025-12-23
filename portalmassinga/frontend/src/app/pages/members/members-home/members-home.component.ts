import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

interface Member {
  id: string;
  nome: string;
  nomePai?: string;
  nomeMae?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  profissao?: string;
  celular?: string;
  email?: string;
  telefone?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  nomeConjuge?: string;
  dataNascimentoConjuge?: string;
  filiacaoPaiConjuge?: string;
  filiacaoMaeConjuge?: string;
  dependentes?: Array<{
    nome: string;
    parentesco: string;
    profissao?: string;
    idade?: number;
  }>;
  localTrabalho?: string;
  cargo?: string;
  enderecoTrabalho?: string;
  telefoneTrabalho?: string;
  foto?: string;
  dataCadastro?: string;
  status: string;
  aceitaTermos?: boolean;
  outrasInformacoes?: string;
}

@Component({
  selector: 'app-members-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './members-home.component.html',
  styleUrl: './members-home.component.scss'
})
export class MembersHomeComponent implements OnInit {
  userName = '';
  memberData: Member | null = null;

  stats = [
    { icon: '👥', number: '150+', label: 'Membros Activos' },
    { icon: '📊', number: '50+', label: 'Projectos Assinados' },
    { icon: 'location_on', number: '12', label: 'Províncias Representadas' },
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
    { icon: 'person', label: 'Meu Perfil', link: '/membros/perfil' },
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
      // Carregar dados do membro
      setTimeout(() => {
        this.loadMemberData();
      }, 100);
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  loadMemberData(): void {
    // Primeiro tentar usar o método do AuthService
    let memberData = this.authService.getCurrentMemberData();
    if (memberData) {
      this.memberData = memberData;
      return;
    }
    
    // Se não encontrou, tentar buscar diretamente pelo email
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return;
    }
    
    const userEmail = currentUser.email.toLowerCase().trim();
    
    // Buscar dados do membro no localStorage
    const stored = localStorage.getItem('anam_applications');
    if (!stored) {
      return;
    }
    
    try {
      const members: Member[] = JSON.parse(stored);
      
      const member = members.find(m => {
        if (!m.email) return false;
        const memberEmail = m.email.toLowerCase().trim();
        return memberEmail === userEmail;
      });
      
      if (member) {
        this.memberData = member;
        localStorage.setItem('currentMemberData', JSON.stringify(member));
      } else {
        // Tentar buscar pelo nome como fallback
        const memberByName = members.find(m => 
          m.nome && m.nome.toLowerCase().trim() === currentUser.nome.toLowerCase().trim()
        );
        if (memberByName) {
          this.memberData = memberByName;
          localStorage.setItem('currentMemberData', JSON.stringify(memberByName));
        }
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    }
  }
  
  getEstadoCivilLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'solteiro': 'Solteiro(a)',
      'casado': 'Casado(a)',
      'uniao_marital': 'União Marital',
      'viuvo': 'Viúvo(a)',
      'divorciado': 'Divorciado(a)'
    };
    return labels[value] || value;
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Aprovado':
        return 'status-approved';
      case 'Pendente':
        return 'status-pending';
      case 'Rejeitado':
        return 'status-rejected';
      default:
        return '';
    }
  }

  logout(): void {
    this.authService.logout();
  }
  
  onActionClick(action: any): void {
    // Se for "Meu Perfil", garantir que os dados estejam carregados antes de navegar
    if (action.link === '/membros/perfil' && !this.memberData) {
      this.loadMemberData();
    }
  }
}
