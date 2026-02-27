import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardStatsService } from './services/dashboard-stats.service';
import { ChartDataService, ProvinciaData, PerformanceData, MonthlyFormData, ProvinceEvaluationData } from './services/chart-data.service';
import { SatisfactionService, SatisfactionData } from './services/satisfaction.service';
import { ApiClientService } from '../services/api-client.service';
import { AuthService } from '../services/auth.service';

// Import types
import { NavigationItem } from './components/sidebar/components/navigation/navigation.component';
import { ServiceItem } from './components/sidebar/components/navigation/submenus/view_data/service-submenu.component';
import { DashboardStats, QuickAction, RecentActivity, FilterItem } from './dashboard.types';
import { 
  PROVINCES, FORM_TYPES, STATUSES, SATISFACTION_LEVELS,
  QUICK_ACTIONS, INITIAL_ACTIVITIES,
  INITIAL_STATS, INITIAL_ASSOCIATION_STATS, INITIAL_TREASURY_STATS, INITIAL_DASHBOARD_STATS
} from './dashboard.data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isHandset = false;
  sidebarOpen = true;
  formularios: any = null;
  currentDate = new Date();
  currentDateTime = '';
  currentView = 'dashboard'; // Para controlar qual view está ativa
  greeting = 'Boa noite';
  userName = '';
  userEmail = '';
  userRole = '';
  activeNavigationItem = 'dashboard'; // Para controlar qual item do sidebar está ativo
  pendingMembersCount = 0; // Membros pendentes de aprovação (badge no sidebar)
  
  // Propriedades do sistema de filtros
  showFilterModal = false;
  selectedPeriod = 'month';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  
  // Data for filters (from dashboard.data.ts)
  provinces: FilterItem[] = [...PROVINCES];
  formTypes: FilterItem[] = [...FORM_TYPES];
  statuses: FilterItem[] = [...STATUSES];
  satisfactionLevels: FilterItem[] = [...SATISFACTION_LEVELS];
  
  // Selection controls
  selectAllProvinces = true;
  selectAllFormTypes = true;
  selectAllStatuses = true;
  selectAllSatisfaction = true;
  
  // Dashboard data - Association (from dashboard.data.ts)
  associationStats = { ...INITIAL_ASSOCIATION_STATS };
  treasuryStats = { ...INITIAL_TREASURY_STATS };

  partners: any[] = [];

  // Dados para gráficos
  growthChartData: number[] = [];
  growthChartMonths: string[] = [];
  growthChartMax: number = 200;

  treasuryChartData: any[] = [];
  treasuryChartMax: number = 60000;

  // Dashboard stats - managed by services
  dashboardStats: any = { ...INITIAL_DASHBOARD_STATS };
  provinciasData: ProvinciaData[] = [];
  satisfactionData: SatisfactionData[] = [];
  performanceData: PerformanceData[] = [];
  monthlyFormData: MonthlyFormData = {
    fae: [],
    economicAgent: [],
    userEvaluation: [],
    training: []
  };
  provinceEvaluationData: ProvinceEvaluationData[] = [];

  
  stats: DashboardStats = { ...INITIAL_STATS };
  quickActions: QuickAction[] = [...QUICK_ACTIONS];
  recentActivities: RecentActivity[] = [...INITIAL_ACTIVITIES];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardStatsService: DashboardStatsService,
    private chartDataService: ChartDataService,
    private satisfactionService: SatisfactionService,
    private apiClient: ApiClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    try {
    const user = this.authService.getCurrentUser();
    if (user?.mustChangePassword) {
      this.router.navigate(['/login']);
      return;
    }
    this.setupResponsiveLayout();
    this.loadDashboardData();
    this.updateGreeting();
    this.loadUserName();
    void this.loadUserDetails();
    this.setupMemberDetailRouting();
    } catch (error) {
      console.error('Erro no ngOnInit do dashboard:', error);
    }
  }

  private setupMemberDetailRouting(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const view = params['view'];
      const memberId = params['memberId'];
      if (view === 'membro' && memberId) {
        this.currentView = 'membro-detalhe';
        this.activeNavigationItem = 'membros-gestao';
      } else if (this.currentView === 'membro-detalhe') {
        // Usuário clicou Voltar - voltar para gestão de membros
        this.currentView = 'membros-gestao';
        this.activeNavigationItem = 'membros-gestao';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupResponsiveLayout(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isHandset = result.matches;
        this.sidebarOpen = !this.isHandset;
      });
  }

  private loadDashboardData(): void {
    this.formularios = {
      fae: { ativo: true },
      agente: { ativo: true },
      utilizador: { ativo: true },
      formando: { ativo: true }
    };
    
    this.loadRealData();
    this.calculateStats();
  }
  
  private async loadRealData(): Promise<void> {
    try {
      // Carregar contagem de membros pendentes
      this.loadPendingMembersCount();
      // Carregar dados da associação
      this.loadAssociationData();

      // Carregar dados da tesouraria
      this.loadTreasuryData();
      
      // Carregar parceiros
      this.loadPartners();
      
      // Carregar dados do dashboard usando o serviço (sem backend)
      this.dashboardStats = await this.dashboardStatsService.loadDashboardData();
      
      // Garantir que dashboardStats não seja null
      if (!this.dashboardStats) {
        console.warn('DashboardStats é null, inicializando com valores padrão');
        this.dashboardStats = {
          service: { total: 0 },
          fae: { total: 0, breakdown: {} },
          user: { total: 0, breakdown: {} },
          economicAgent: { total: 0, breakdown: {} },
          training: { total: 0, provincias: 0, cursos: 0, generos: 0, taxaSatisfacao: 0 }
        };
      }
      
      // Dados vazios para gráficos (sem backend)
      const faeList: any[] = [];
      const economicAgentList: any[] = [];
      const userEvaluationList: any[] = [];
      const trainingList: any[] = [];
      
      // Calcular dados de províncias
      this.provinciasData = this.chartDataService.calculateProvinceData(
        faeList, 
        economicAgentList, 
        userEvaluationList
      );
      
      // Calcular dados mensais
      const chartData = this.chartDataService.calculatePerformanceData(
        faeList, 
        economicAgentList, 
        userEvaluationList, 
        trainingList
      );
      this.performanceData = chartData.performanceData;
      this.monthlyFormData = chartData.monthlyFormData;
      this.provinceEvaluationData = this.chartDataService.calculateProvinceEvaluationSplit(
        faeList,
        economicAgentList,
        userEvaluationList,
        trainingList
      );
      
      // Calcular dados de satisfação agregados - usar 5 categorias completas
      if (this.dashboardStats.fae && this.dashboardStats.user && this.dashboardStats.economicAgent) {
      const allBreakdowns = [
          this.dashboardStats.fae.breakdown || {},
          this.dashboardStats.user.breakdown || {},
          this.dashboardStats.economicAgent.breakdown || {}
      ];
      const aggregatedBreakdown = this.satisfactionService.aggregateBreakdowns(allBreakdowns);
      this.satisfactionData = this.satisfactionService.getFullPieChartData(aggregatedBreakdown);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Inicializar com valores padrão em caso de erro
      this.dashboardStats = {
        service: { total: 0 },
        fae: { total: 0, breakdown: {} },
        user: { total: 0, breakdown: {} },
        economicAgent: { total: 0, breakdown: {} },
        training: { total: 0, provincias: 0, cursos: 0, generos: 0, taxaSatisfacao: 0 }
      };
    }
  }
  
  // Métodos removidos - agora estão nos serviços

  private calculateStats(): void {
    if (!this.formularios) return;

    const formulariosArray = this.getFormulariosArray();
    this.stats.totalFormularios = formulariosArray.length;
    this.stats.formulariosAtivos = formulariosArray.filter(f => f.ativo).length;
    this.stats.formulariosInativos = formulariosArray.filter(f => !f.ativo).length;
    this.stats.totalRespostas = Math.floor(Math.random() * 1000) + 500; // Simulado
    this.stats.taxaResposta = Math.round((this.stats.totalRespostas / this.stats.totalFormularios) * 100);
    this.stats.ultimaAtualizacao = new Date();
  }

  private updateDateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Africa/Maputo'
    };
    this.currentDateTime = now.toLocaleDateString('pt-MZ', options);
  }

  getFormulariosArray(): any[] {
    if (!this.formularios) return [];
    
    return [
      this.formularios.fae,
      this.formularios.agente,
      this.formularios.utilizador,
      this.formularios.formando
    ].filter(formulario => formulario);
  }

  getFormulariosAtivos(): any[] {
    return this.getFormulariosArray().filter(formulario => formulario.ativo);
  }

  getFormulariosInativos(): any[] {
    return this.getFormulariosArray().filter(formulario => !formulario.ativo);
  }

  navigateToView(view: string): void {
    this.currentView = view;
    this.activeNavigationItem = view;
  }

  getSatisfacaoGeral(): number {
    if (!this.satisfactionData || this.satisfactionData.length === 0) return 0;
    const muitoSatisfeito = this.satisfactionData.find(s => s.label === 'Muito Satisfeito')?.value || 0;
    const satisfeito = this.satisfactionData.find(s => s.label === 'Satisfeito')?.value || 0;
    return muitoSatisfeito + satisfeito;
  }
  
  /**
   * Retorna os dados de satisfação para o gráfico de pizza (5 categorias)
   */
  getSatisfactionPieData(): SatisfactionData[] {
    return this.satisfactionData || [];
  }
  
  /**
   * Calcula o offset acumulado para cada segmento do gráfico de pizza
   */
  getPieSegmentOffset(index: number): number {
    if (index === 0) return 0;
    
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.satisfactionData[i]?.value || 0;
    }
    return this.chartDataService.getPieDashOffset(offset);
  }
  
  // Métodos delegados para serviços
  getPieDashArray(value: number): number {
    return this.chartDataService.getPieDashArray(value);
  }
  
  getPieDashOffset(previousValue: number): number {
    return this.chartDataService.getPieDashOffset(previousValue);
  }
  
  getMonthlyLinePath(data: number[], maxValue: number = 100): string {
    return this.chartDataService.getMonthlyLinePath(data, maxValue);
  }
  
  getMaxMonthlyValue(): number {
    return this.chartDataService.getMaxMonthlyValue(this.performanceData);
  }
  
  getMonthlyFormData(): MonthlyFormData {
    return this.monthlyFormData;
  }

  getTotalSistema(): number {
    return this.dashboardStats.indicators.total + 
           this.dashboardStats.gestao.total;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getActionColor(action: QuickAction): string {
    return action.color;
  }

  getActivityIcon(activity: RecentActivity): string {
    return activity.icon;
  }

  getActivityColor(activity: RecentActivity): string {
    return activity.color;
  }

  loadPendingMembersCount(): void {
    this.apiClient.getPendingApplicationsCount().subscribe({
      next: (count) => {
        this.pendingMembersCount = count;
      },
      error: () => {
        this.pendingMembersCount = 0;
      }
    });
  }

  // Carregar dados da associação
  private loadAssociationData(): void {
    // Dados falsos para demonstração
    this.associationStats = {
      totalMembros: 187,
      novosEsteMes: 15,
      crescimento: 8.7,
      membrosAtivos: 175
    };

    // Dados para gráfico de crescimento (últimos 12 meses)
    this.growthChartData = [120, 125, 130, 135, 140, 145, 150, 155, 160, 170, 175, 187];
    this.growthChartMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    this.growthChartMax = 200;
  }

  // Carregar dados da tesouraria
  private loadTreasuryData(): void {
    // Dados falsos para demonstração
    this.treasuryStats = {
      saldo: 125000,
      receitas: 45000,
      despesas: 32000,
      transacoes: 28
    };

    // Dados para gráfico de tesouraria (últimos 6 meses)
    this.treasuryChartData = [
      { month: 'Jul', receitas: 38000, despesas: 28000 },
      { month: 'Ago', receitas: 42000, despesas: 30000 },
      { month: 'Set', receitas: 40000, despesas: 31000 },
      { month: 'Out', receitas: 45000, despesas: 32000 },
      { month: 'Nov', receitas: 48000, despesas: 35000 },
      { month: 'Dez', receitas: 45000, despesas: 32000 }
    ];
    this.treasuryChartMax = 60000;
  }

  // Carregar parceiros
  private loadPartners(): void {
    // TODO: Substituir por dados reais do backend
    this.partners = [
      { nome: 'Câmara Municipal de Massinga', tipo: 'Instituição Pública', ativo: true },
      { nome: 'Associação de Desenvolvimento Local', tipo: 'ONG', ativo: true },
      { nome: 'Banco de Moçambique', tipo: 'Instituição Financeira', ativo: true },
      { nome: 'Universidade Eduardo Mondlane', tipo: 'Instituição de Ensino', ativo: false }
    ];
  }

  // Formatar moeda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // Métodos para gráficos e visualizações
  getActivePartners(): number {
    return this.partners?.filter(p => p.ativo).length || 0;
  }

  getTreasuryChange(): string {
    const change = this.treasuryStats?.receitas - this.treasuryStats?.despesas || 0;
    return this.formatCurrency(change);
  }

  // Sparklines para cards
  getMembersSparkline(): string {
    const data = [120, 125, 130, 135, 140, 145, 150, 155, 160, 170, 175, 187];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 200;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    return data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range * height);
      return `${x},${y}`;
    }).join(' ');
  }

  getTreasurySparkline(): string {
    const data = [38000, 42000, 40000, 45000, 48000, 45000];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 200;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    return data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range * height);
      return `${x},${y}`;
    }).join(' ');
  }

  // Métodos para gráfico de crescimento
  getGrowthLinePath(): string {
    const data = this.growthChartData;
    const max = this.growthChartMax;
    const width = 700;
    const height = 240;
    const stepX = width / (data.length - 1);
    const startX = 60;
    const startY = 260;
    
    const points = data.map((value, index) => {
      const x = startX + (index * stepX);
      const y = startY - (value / max * height);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }

  getGrowthAreaPath(): string {
    const linePath = this.getGrowthLinePath();
    const data = this.growthChartData;
    const max = this.growthChartMax;
    const width = 700;
    const height = 240;
    const stepX = width / (data.length - 1);
    const startX = 60;
    const startY = 260;
    
    const firstX = startX;
    const lastX = startX + ((data.length - 1) * stepX);
    
    return `${linePath} L ${lastX},${startY} L ${firstX},${startY} Z`;
  }

  getGrowthPoints(): any[] {
    const data = this.growthChartData;
    const max = this.growthChartMax;
    const width = 700;
    const height = 240;
    const stepX = width / (data.length - 1);
    const startX = 60;
    const startY = 260;
    
    return data.map((value, index) => ({
      x: startX + (index * stepX),
      y: startY - (value / max * height)
    }));
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
    }
  }

  getTipoConfig(tipo: string): any {
    const tipos: { [key: string]: any } = {
      'fae': {
        url: '/fae',
        btnClass: 'btn-warning',
        btnId: 'btnFAE',
        icon: 'assignment',
        titulo: 'FAE',
        descricao: 'Funcionário ou Agente do Estado'
      },
      'agente': {
        url: '/agente-economico',
        btnClass: 'btn-success',
        btnId: 'btnAgente',
        icon: 'business',
        titulo: 'Agente Económico',
        descricao: 'Formulário para Agentes Económicos'
      },
      'utilizador': {
        url: '/utilizador',
        btnClass: 'btn-info',
        btnId: 'btnUtilizador',
        icon: 'person',
        titulo: 'Utilizador',
        descricao: 'Formulário para Utilizadores'
      },
      'formando': {
        url: '/formando',
        btnClass: 'btn-primary',
        btnId: 'btnFormado',
        icon: 'school',
        titulo: 'Formando',
        descricao: 'Formulário para Formandos'
      }
    };
    return tipos[tipo];
  }

  onNavigationClick(item: NavigationItem): void {
    console.log('Navigation clicked:', item);
    
    // Definir item ativo
    this.activeNavigationItem = item.id;
    
    // Navegação interna baseada no ID do item
    switch(item.id) {
      case 'dashboard':
        this.currentView = 'dashboard';
        break;
      case 'attendance-lists':
      case 'attendance-lists-upload':
        this.currentView = 'attendance-lists-upload';
        break;
      case 'attendance-lists-view':
        this.currentView = 'attendance-lists-view';
        break;
      case 'form-management':
        this.currentView = 'form-management';
        break;
      case 'user-management':
        this.currentView = 'user-management';
        break;
      case 'sair':
        // Implementar logout
        this.logout();
        break;
      // Páginas do Portal
      case 'home':
        this.currentView = 'home';
        break;
      case 'documentacao':
        this.currentView = 'documentacao';
        break;
      case 'servicos':
        this.currentView = 'servicos';
        break;
      case 'eventos':
        this.currentView = 'eventos';
        break;
      case 'historial':
        this.currentView = 'historial';
        break;
      case 'galeria':
        this.currentView = 'galeria';
        break;
      case 'parceiros':
        this.currentView = 'parceiros';
        break;
      case 'programas':
        this.currentView = 'programas';
        break;
      case 'noticias':
        this.currentView = 'noticias';
        break;
      case 'associar':
        this.currentView = 'associar';
        break;
      case 'contato':
        this.currentView = 'contato';
        break;
      // Projectos
      case 'projectos-ativos':
        this.currentView = 'projectos-ativos';
        break;
      case 'projectos-realizados':
        this.currentView = 'projectos-realizados';
        break;
      case 'candidaturas':
        this.currentView = 'candidaturas';
        break;
      // Membros
      case 'membros-home':
        this.currentView = 'membros-home';
        break;
      case 'membros-gestao':
        this.currentView = 'membros-gestao';
        break;
      case 'membros-organograma':
        this.currentView = 'membros-organograma';
        break;
      case 'apoio-gestao':
        this.currentView = 'apoio-gestao';
        break;
      case 'simpatizantes-gestao':
        this.currentView = 'simpatizantes-gestao';
        break;
      case 'eventos-gestao':
        this.currentView = 'eventos-gestao';
        break;
      case 'eventos-inscricoes':
        this.currentView = 'eventos-inscricoes';
        break;
      // Tesouraria
      case 'tesouraria-cotas':
        this.currentView = 'tesouraria-cotas';
        break;
      case 'tesouraria-gestao':
        this.currentView = 'tesouraria-gestao';
        break;
      case 'tesouraria-relatorios':
        this.currentView = 'tesouraria-relatorios';
        break;
      // Indicadores
      case 'indicadores-geral':
        this.currentView = 'indicadores-geral';
        break;
      case 'indicadores-desempenho':
        this.currentView = 'indicadores-desempenho';
        break;
      case 'indicadores-satisfacao':
        this.currentView = 'indicadores-satisfacao';
        break;
      case 'indicadores-metricas':
        this.currentView = 'indicadores-metricas';
        break;
      // Configurações
      case 'config-notificacoes':
        this.currentView = 'config-notificacoes';
        break;
      case 'config-galeria':
        this.currentView = 'galeria';  // Reutiliza componente de galeria
        break;
      default:
        this.currentView = 'dashboard';
    }
  }

  onServiceItemClick(item: ServiceItem): void {
    // Handle service item click if needed
    console.log('Service item clicked:', item);
  }

  // Filter system methods
  openFilterDialog(): void {
    this.showFilterModal = true;
  }

  closeFilterDialog(): void {
    this.showFilterModal = false;
  }

  toggleAllProvinces(): void {
    this.provinces.forEach(province => {
      province.selected = this.selectAllProvinces;
    });
  }

  updateProvinceSelection(): void {
    this.selectAllProvinces = this.provinces.every(province => province.selected);
  }

  toggleAllFormTypes(): void {
    this.formTypes.forEach(formType => {
      formType.selected = this.selectAllFormTypes;
    });
  }

  updateFormTypeSelection(): void {
    this.selectAllFormTypes = this.formTypes.every(formType => formType.selected);
  }

  toggleAllStatuses(): void {
    this.statuses.forEach(status => {
      status.selected = this.selectAllStatuses;
    });
  }

  updateStatusSelection(): void {
    this.selectAllStatuses = this.statuses.every(status => status.selected);
  }

  toggleAllSatisfaction(): void {
    this.satisfactionLevels.forEach(satisfaction => {
      satisfaction.selected = this.selectAllSatisfaction;
    });
  }

  updateSatisfactionSelection(): void {
    this.selectAllSatisfaction = this.satisfactionLevels.every(satisfaction => satisfaction.selected);
  }

  resetFilters(): void {
    this.selectedPeriod = 'month';
    this.customStartDate = null;
    this.customEndDate = null;
    
    this.selectAllProvinces = true;
    this.selectAllFormTypes = true;
    this.selectAllStatuses = true;
    this.selectAllSatisfaction = true;
    
    this.toggleAllProvinces();
    this.toggleAllFormTypes();
    this.toggleAllStatuses();
    this.toggleAllSatisfaction();
  }

  applyFilters(): void {
    // Aqui você pode implementar a lógica para aplicar os filtros
    // Por enquanto, apenas fecha o modal
    console.log('Aplicando filtros:', {
      period: this.selectedPeriod,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      selectedProvinces: this.provinces.filter(p => p.selected),
      selectedFormTypes: this.formTypes.filter(f => f.selected),
      selectedStatuses: this.statuses.filter(s => s.selected),
      selectedSatisfaction: this.satisfactionLevels.filter(s => s.selected)
    });
    
    this.closeFilterDialog();
  }

  // Methods for new province cards
  getProvinciasSatisfeitas(): number {
    return this.provinciasData.filter(p => p.satisfaction >= 75).length;
  }

  getProvinciasInsatisfeitas(): number {
    return this.provinciasData.filter(p => p.satisfaction < 70).length;
  }

  getTotalAvaliacoes(): number {
    return this.provinciasData.reduce((total, p) => total + p.avaliacoes, 0);
  }

  getSatisfactionColor(satisfaction: number): string {
    if (satisfaction >= 75) return '#4CAF50';
    if (satisfaction >= 70) return '#FF9800';
    return '#F44336';
  }

  getCrescimentoSatisfacao(): number {
    return 13; // Simulado
  }

  getTempoMedioResposta(): string {
    return '12min';
  }

  getTaxaConclusao(): number {
    return 78;
  }

  getUsuariosAtivos(): number {
    return 156;
  }

  getTopProvincia(): any {
    return this.provinciasData.reduce((prev, current) => 
      (prev.satisfaction > current.satisfaction) ? prev : current
    );
  }

  getTopProvincias(): any[] {
    return [...this.provinciasData]
      .sort((a, b) => b.satisfaction - a.satisfaction)
      .slice(0, 4);
  }

  getTotalProvincias(): number {
    return this.provinciasData.length;
  }

  getTotalSatisfeitos(): number {
    return this.provinciasData.reduce((total, p) => total + Math.round(p.avaliacoes * p.satisfaction / 100), 0);
  }

  getTotalNeutros(): number {
    return this.provinciasData.reduce((total, p) => total + Math.round(p.avaliacoes * 0.2), 0);
  }

  getTotalInsatisfeitos(): number {
    return this.provinciasData.reduce((total, p) => total + Math.round(p.avaliacoes * (100 - p.satisfaction) / 100), 0);
  }

  getPercentualSatisfeitos(): number {
    const total = this.getTotalAvaliacoes();
    return Math.round((this.getTotalSatisfeitos() / total) * 100);
  }

  getPercentualNeutros(): number {
    const total = this.getTotalAvaliacoes();
    return Math.round((this.getTotalNeutros() / total) * 100);
  }

  getPercentualInsatisfeitos(): number {
    const total = this.getTotalAvaliacoes();
    return Math.round((this.getTotalInsatisfeitos() / total) * 100);
  }

  logout(): void {
    this.authService.logout();
  }

  updateGreeting(): void {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Boa tarde';
    } else {
      this.greeting = 'Boa noite';
    }
  }

  loadUserName(): void {
    // Prioridade 1: AuthService (currentUser)
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.nome && currentUser.nome.trim() !== '') {
      this.userName = currentUser.nome;
      return;
    }
    // Prioridade 2: localStorage legado
    const savedUserFullName = localStorage.getItem('userFullName');
    const savedUserName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedUserFullName && savedUserFullName.trim() !== '') {
      this.userName = savedUserFullName;
    } else if (savedUserName && savedUserName.trim() !== '') {
      this.userName = savedUserName;
    } else if (savedEmail) {
      const emailParts = savedEmail.split('@');
      if (emailParts.length > 0 && emailParts[0].trim() !== '') {
        this.userName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
      } else {
        this.userName = 'Usuário';
      }
    } else {
      this.userName = 'Usuário';
    }
    
    // Carregar email e role do utilizador (para Detalhes da Sessão)
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const u = JSON.parse(currentUser);
        this.userEmail = u?.email || '';
        if (u?.role) {
          this.userRole = this.formatRoleLabel(u.role);
        }
      }
    } catch (_) {}
    console.log('Nome do usuário carregado:', this.userName);
  }

  private async loadUserDetails(): Promise<void> {
    const department = localStorage.getItem('userDepartment');
    const province = localStorage.getItem('userProvince');
    const role = localStorage.getItem('userRole');

    const hasDepartment = !!(department && department.trim() !== '');
    const hasProvince = !!(province && province.trim() !== '');
    const hasRole = !!(role && role.trim() !== '');

    const departmentLabel = hasDepartment ? department!.trim() : 'Departamento não definido';
    const provinceLabel = hasProvince ? province!.trim() : 'Província não definida';
    if (hasRole && !this.userRole) this.userRole = this.formatRoleLabel(role!.trim());

    await this.fetchUserDetailsFromApi({
      forceUpdate: true,
      skipDepartment: hasDepartment,
      skipProvince: hasProvince,
      skipRole: hasRole
    });
  }

  formatRoleLabel(role: string): string {
    const r = (role || '').toLowerCase();
    if (r === 'super-admin') return 'Super Administrador';
    if (r === 'admin' || r === 'administrador') return 'Administrador';
    if (r === 'membro') return 'Membro';
    return role;
  }

  private async fetchUserDetailsFromApi(options: {
    forceUpdate?: boolean;
    skipDepartment?: boolean;
    skipProvince?: boolean;
    skipRole?: boolean;
  } = {}): Promise<void> {
    // Sem backend - dados vêm apenas do localStorage
    // Não fazer nada, já que não há API disponível
  }

  onProfileOptionClick(option: string): void {
    if (option === 'users') {
      // Navegar para gestão de usuários
      this.navigateToView('user-management');
    } else if (option === 'profile') {
      // Navegar para perfil do usuário
      this.navigateToView('profile');
    } else if (option === 'settings') {
      // Navegar para configurações (se implementado)
      console.log('Navegar para configurações');
    } else if (option === 'logout') {
      this.logout();
    }
  }
}
