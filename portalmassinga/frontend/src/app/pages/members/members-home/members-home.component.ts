import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { OverviewComponent } from './overview/overview.component';
import { QuotasComponent } from './quotas/quotas.component';
import { ProgramsComponent } from './programs/programs.component';
import { ReportsComponent } from './reports/reports.component';

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
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule,
    OverviewComponent,
    QuotasComponent,
    ProgramsComponent,
    ReportsComponent
  ],
  templateUrl: './members-home.component.html',
  styleUrl: './members-home.component.scss'
})
export class MembersHomeComponent implements OnInit, OnDestroy {
  userName = 'Guilherme dos Santos';
  memberData: Member | null = null;
  activeTab: string = 'overview';
  currentTime = '';
  currentDate = '';
  private timeInterval: any;

  stats = [
    { icon: 'people', iconType: 'mat', number: '150+', label: 'Membros Activos', color: '#3B82F6', bgColor: '#3B82F615', borderColor: '#3B82F630' },
    { icon: 'assignment', iconType: 'mat', number: '50+', label: 'Projectos Assinados', color: '#8B5CF6', bgColor: '#8B5CF615', borderColor: '#8B5CF630' },
    { icon: 'location_on', iconType: 'mat', number: '12', label: 'Províncias Representadas', color: '#F59E0B', bgColor: '#F59E0B15', borderColor: '#F59E0B30' },
    { icon: 'account_balance_wallet', iconType: 'mat', number: '85%', label: 'Cotas Pagas', color: '#10B981', bgColor: '#10B98115', borderColor: '#10B98130' }
  ];

  memberInfo = [
    {
      icon: 'list',
      iconType: 'mat',
      title: 'Lista de Membros',
      description: 'Consulte informações sobre todos os membros da associação',
      link: '/membros/lista'
    },
    {
      icon: 'account_tree',
      iconType: 'mat',
      title: 'Organograma',
      description: 'Conheça a estrutura organizacional da associação',
      link: '/membros/organograma'
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
      icon: 'description',
      iconType: 'mat',
      title: 'Relatório Anual 2024',
      description: 'Relatório completo das atividades e resultados do ano de 2024',
      date: '15 Jan 2025',
      link: '#'
    },
    {
      icon: 'account_balance',
      iconType: 'mat',
      title: 'Relatório Financeiro Q4 2024',
      description: 'Análise financeira do último trimestre de 2024',
      date: '10 Jan 2025',
      link: '#'
    },
    {
      icon: 'trending_up',
      iconType: 'mat',
      title: 'Relatório de Projetos',
      description: 'Status e progresso de todos os projetos em execução',
      date: '05 Jan 2025',
      link: '#'
    },
    {
      icon: 'people',
      iconType: 'mat',
      title: 'Relatório de Membros',
      description: 'Estatísticas e informações sobre o quadro de membros',
      date: '01 Jan 2025',
      link: '#'
    }
  ];

  // Dados para gráfico de pizza - Distribuição de Membros por Status
  pieChartData = [
    { label: 'Aprovados', value: 65, color: '#10B981' },
    { label: 'Pendentes', value: 25, color: '#F59E0B' },
    { label: 'Rejeitados', value: 10, color: '#EF4444' }
  ];

  // Dados de contribuições do membro
  memberContributions = {
    total: 12500,
    lastContribution: new Date('2025-01-10'),
    quotasPaid: 8,
    totalQuotas: 12
  };

  // Dados para gráfico de barras de contribuições do membro (últimos 6 meses)
  memberContributionsData = {
    labels: ['Jul 2024', 'Ago 2024', 'Set 2024', 'Out 2024', 'Nov 2024', 'Dez 2024'],
    values: [1500, 2000, 1800, 2200, 2500, 1500]
  };

  // Dados para gráfico de crescimento da associação (últimos 12 meses)
  growthChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    values: [120, 125, 130, 135, 140, 145, 150, 155, 160, 170, 175, 187]
  };

  // Resumo da associação
  associationSummary = {
    partners: 4,
    activeProjects: 12,
    coverage: '8 Províncias',
    totalMembers: 187
  };

  // Dados de cotas
  quotasSummary = {
    paid: 8,
    total: 12,
    pending: 4,
    totalPaid: 12500
  };

  // Recibos
  receipts: any[] = [];

  getPieDashArray(value: number): number {
    const circumference = 2 * Math.PI * 80;
    return (value / 100) * circumference;
  }

  getPieSegmentOffset(index: number): number {
    if (index === 0) return 0;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.pieChartData[i]?.value || 0;
    }
    const circumference = 2 * Math.PI * 80;
    return -(offset / 100) * circumference;
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nome;
      // Carregar dados do membro imediatamente
      this.loadMemberData();
    }
    
    // Inicializar data e hora
    this.updateDateTime();
    // Atualizar a cada segundo
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Carregar recibos
    this.loadReceipts();
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateDateTime(): void {
    const now = new Date();
    
    // Formatar hora (HH:MM:SS)
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
    
    // Formatar data (DD de Mês de YYYY)
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    this.currentDate = `${dayName}, ${day} de ${month} de ${year}`;
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
  

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  isTabActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  loadReceipts(): void {
    // Carregar recibos do localStorage
    const storedReceipts = localStorage.getItem('payment_receipts');
    if (storedReceipts) {
      try {
        this.receipts = JSON.parse(storedReceipts);
        // Converter strings de data para objetos Date
        this.receipts = this.receipts.map(receipt => ({
          ...receipt,
          dataPagamento: new Date(receipt.dataPagamento)
        }));
      } catch (error) {
        console.error('Error loading receipts:', error);
        this.receipts = [];
      }
    } else {
      // Dados de exemplo para demonstração
      const currentYear = new Date().getFullYear();
      this.receipts = [
        {
          id: 'REC001',
          numeroMembro: '001',
          nomeMembro: this.userName,
          dataPagamento: new Date(currentYear, 0, 15),
          meses: ['Janeiro'],
          valorTotal: 1500,
          metodoPagamento: 'M-Pesa',
          numeroTelefone: '841234567',
          status: 'pago'
        },
        {
          id: 'REC002',
          numeroMembro: '001',
          nomeMembro: this.userName,
          dataPagamento: new Date(currentYear, 1, 20),
          meses: ['Fevereiro'],
          valorTotal: 1500,
          metodoPagamento: 'E-Mola',
          numeroTelefone: '841234567',
          status: 'pago'
        },
        {
          id: 'REC003',
          numeroMembro: '001',
          nomeMembro: this.userName,
          dataPagamento: new Date(currentYear - 1, 11, 10),
          meses: ['Dezembro'],
          valorTotal: 1500,
          metodoPagamento: 'M-Pesa',
          numeroTelefone: '841234567',
          status: 'pago'
        }
      ];
    }
  }

}
