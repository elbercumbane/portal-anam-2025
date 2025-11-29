import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardStatsService } from './services/dashboard-stats.service';
import { ChartDataService, ProvinciaData, PerformanceData, MonthlyFormData, ProvinceEvaluationData } from './services/chart-data.service';
import { SatisfactionService, SatisfactionData } from './services/satisfaction.service';

// Import types used in this component
import { NavigationItem } from './components/sidebar/components/navigation/navigation.component';
import { ServiceItem } from './components/sidebar/components/navigation/submenus/view_data/service-submenu.component';

interface DashboardStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

// Interface DashboardData movida para DashboardStatsService

// Interfaces movidas para serviços

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  description: string;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon: string;
  color: string;
}

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
  userRole = '';
  activeNavigationItem = 'dashboard'; // Para controlar qual item do sidebar está ativo
  
  // Propriedades do sistema de filtros
  showFilterModal = false;
  selectedPeriod = 'month';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  
  // Data for filters
  provinces = [
    { name: 'Maputo', selected: true },
    { name: 'Sofala', selected: true },
    { name: 'Nampula', selected: true },
    { name: 'Zambézia', selected: true },
    { name: 'Tete', selected: true },
    { name: 'Niassa', selected: true },
    { name: 'Cabo Delgado', selected: true },
    { name: 'Manica', selected: true },
    { name: 'Inhambane', selected: true },
    { name: 'Gaza', selected: true }
  ];
  
  formTypes = [
    { name: 'FAE', selected: true },
    { name: 'Utilizador', selected: true },
    { name: 'Agente Econômico', selected: true },
    { name: 'Formação', selected: true }
  ];
  
  statuses = [
    { name: 'Ativo', selected: true },
    { name: 'Inativo', selected: true },
    { name: 'Em Manutenção', selected: true },
    { name: 'Pendente', selected: true }
  ];
  
  satisfactionLevels = [
    { name: 'Satisfeito', selected: true },
    { name: 'Neutro', selected: true },
    { name: 'Insatisfeito', selected: true }
  ];
  
  // Selection controls
  selectAllProvinces = true;
  selectAllFormTypes = true;
  selectAllStatuses = true;
  selectAllSatisfaction = true;
  
  // Dados do dashboard - gerenciados pelos serviços
  dashboardStats: any = {
    service: { total: 0 },
    fae: { total: 0, breakdown: {} },
    user: { total: 0, breakdown: {} },
    economicAgent: { total: 0, breakdown: {} },
    training: { total: 0, provincias: 0, cursos: 0, generos: 0, taxaSatisfacao: 0 }
  };
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

  
  stats: DashboardStats = {
    totalFormularios: 0,
    formulariosAtivos: 0,
    formulariosInativos: 0,
    totalRespostas: 0,
    taxaResposta: 0,
    ultimaAtualizacao: new Date()
  };

  quickActions: QuickAction[] = [
    {
      id: 'fae',
      title: 'FAE',
      icon: 'assignment',
      color: 'primary',
      route: '/fae',
      description: 'Funcionário ou Agente do Estado'
    },
    {
      id: 'agente',
      title: 'Agente Económico',
      icon: 'business',
      color: 'accent',
      route: '/agente-economico',
      description: 'Formulário para Agentes Económicos'
    },
    {
      id: 'utilizador',
      title: 'Utilizador',
      icon: 'person',
      color: 'warn',
      route: '/utilizador',
      description: 'Formulário para Utilizadores'
    },
    {
      id: 'formando',
      title: 'Formando',
      icon: 'school',
      color: 'primary',
      route: '/formando',
      description: 'Formulário para Formandos'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'success',
      message: 'Formulário FAE atualizado com sucesso',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: 'check_circle',
      color: 'green'
    },
    {
      id: '2',
      type: 'info',
      message: 'Novo utilizador registado no sistema',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: 'person_add',
      color: 'blue'
    },
    {
      id: '3',
      type: 'warning',
      message: 'Formulário Agente Económico precisa de revisão',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: 'warning',
      color: 'orange'
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dashboardStatsService: DashboardStatsService,
    private chartDataService: ChartDataService,
    private satisfactionService: SatisfactionService
  ) {}

  ngOnInit(): void {
    try {
    this.setupResponsiveLayout();
    this.loadDashboardData();
    this.updateGreeting();
    this.loadUserName();
    void this.loadUserDetails();
    } catch (error) {
      console.error('Erro no ngOnInit do dashboard:', error);
    }
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
      case 'fae':
        this.currentView = 'fae';
        break;
      case 'economic-agent':
        this.currentView = 'economic-agent';
        break;
      case 'user':
        this.currentView = 'user';
        break;
      case 'service':
        this.currentView = 'service';
        break;
      case 'training':
        this.currentView = 'training';
        break;
      case 'indicators':
        this.currentView = 'indicators';
        break;
      case 'report':
        this.currentView = 'report';
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
    // Remover token e informações de sessão
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userDepartment');
    localStorage.removeItem('userProvince');
    localStorage.removeItem('userRole');
    
    // Redirecionar para login
    this.router.navigate(['/login']);
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
    // Tentar obter o nome do usuário do localStorage
    const savedUserFullName = localStorage.getItem('userFullName');
    const savedUserName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('savedEmail');
    
    if (savedUserFullName && savedUserFullName.trim() !== '') {
      // Prioridade 1: Nome completo salvo
      this.userName = savedUserFullName;
    } else if (savedUserName && savedUserName.trim() !== '') {
      // Prioridade 2: Nome do usuário salvo
      this.userName = savedUserName;
    } else if (savedEmail) {
      // Prioridade 3: Extrair do email salvo
      const emailParts = savedEmail.split('@');
      if (emailParts.length > 0 && emailParts[0].trim() !== '') {
        const nameFromEmail = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
        this.userName = nameFromEmail;
        // Salvar para uso futuro
        localStorage.setItem('userName', nameFromEmail);
      } else {
        this.userName = 'Usuário';
      }
    } else {
      // Fallback: Usuário genérico
      this.userName = 'Usuário';
    }
    
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
    this.userRole = hasRole ? role!.trim() : 'Técnico Administrador';

    await this.fetchUserDetailsFromApi({
      forceUpdate: true,
      skipDepartment: hasDepartment,
      skipProvince: hasProvince,
      skipRole: hasRole
    });
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
