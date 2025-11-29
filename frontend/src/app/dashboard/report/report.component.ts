import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ApiService removido - sem backend
import { DashboardStatsService } from '../services/dashboard-stats.service';
import { ChartDataService, ProvinciaData, PerformanceData, MonthlyFormData } from '../services/chart-data.service';
import { SatisfactionService, SatisfactionData } from '../services/satisfaction.service';

interface EvaluationTimeData {
  id: number;
  formType: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number | null;
  sessionId: string;
  userIdentifier: string | null;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() navigationClick = new EventEmitter<any>();
  
  filtroForm: FormGroup;
  isLoading = false;
  filtrosVisiveis = false;
  exportMenuOpen = false;
  
  // Filtros de data
  dataInicio: string = '';
  dataFim: string = '';
  filtroTipoFormulario: string = '';
  filtroProvincia: string = '';
  filtroSatisfacao: string = '';
  
  // Dados do Dashboard
  dashboardStats: any = null;
  provinciasData: ProvinciaData[] = [];
  performanceData: PerformanceData[] = [];
  monthlyFormData: MonthlyFormData = {
    fae: [],
    economicAgent: [],
    userEvaluation: [],
    training: []
  };
  satisfactionData: SatisfactionData[] = [];
  
  // Dados dos Formulários
  dadosFAE: any[] = [];
  dadosAgenteEconomico: any[] = [];
  dadosUtilizador: any[] = [];
  dadosFormacao: any[] = [];
  
  // Dados dos Indicadores
  evaluationTimes: EvaluationTimeData[] = [];
  todasAvaliacoes: EvaluationTimeData[] = [];
  tempoMedioPreenchimento = '0 min 0s';
  tempoMaisRapido = '0 min 0s';
  tempoMaisLento = '0 min 0s';
  taxaConclusao = 0;
  totalAvaliacoesIniciadas = 0;
  totalAvaliacoesConcluidas = 0;
  
  // Estatísticas
  estatisticas = {
    totalAvaliacoes: 0,
    totalRespostas: 0,
    taxaResposta: 0,
    ultimaAtualizacao: new Date()
  };
  
  // Aba ativa
  abaAtiva = 0;

  constructor(
    private fb: FormBuilder,
    // ApiService removido
    private dashboardStatsService: DashboardStatsService,
    private chartDataService: ChartDataService,
    private satisfactionService: SatisfactionService
  ) {
    this.filtroForm = this.fb.group({
      dataInicio: [''],
      dataFim: [''],
      provincia: [''],
      tipoFormulario: [''],
      grauSatisfacao: ['']
    });
  }

  ngOnInit(): void {
    this.carregarTodosDados();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async carregarTodosDados(): Promise<void> {
    this.isLoading = true;
    
    try {
      // Carregar dados do dashboard
      await this.carregarDadosDashboard();
      
      // Carregar dados dos formulários
      await this.carregarDadosFormularios();
      
      // Carregar dados dos indicadores
      await this.carregarDadosIndicadores();
      
      // Calcular estatísticas
      this.calcularEstatisticas();
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async carregarDadosDashboard(): Promise<void> {
    try {
      // Carregar dados do dashboard
      this.dashboardStats = await this.dashboardStatsService.loadDashboardData();
      
      // Sem backend - dados vazios
      const [faeList, economicAgentList, userEvaluationList, trainingList] = await Promise.all([
        Promise.resolve([]), // Sem backend - dados vazios
        Promise.resolve([]), // Sem backend - dados vazios
        Promise.resolve([]), // Sem backend - dados vazios
        Promise.resolve([])  // Sem backend - dados vazios
      ]);
      
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
      
      // Calcular dados de satisfação agregados
      const allBreakdowns = [
        this.dashboardStats.fae.breakdown,
        this.dashboardStats.user.breakdown,
        this.dashboardStats.economicAgent.breakdown
      ];
      const aggregatedBreakdown = this.satisfactionService.aggregateBreakdowns(allBreakdowns);
      this.satisfactionData = this.satisfactionService.getFullPieChartData(aggregatedBreakdown);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  }

  private async carregarDadosFormularios(): Promise<void> {
    try {
      const [faeList, economicAgentList, userEvaluationList, trainingList] = await Promise.all([
        Promise.resolve([]), // Sem backend - dados vazios
        Promise.resolve([]), // Sem backend - dados vazios
        Promise.resolve([]), // Sem backend - dados vazios
        Promise.resolve([])  // Sem backend - dados vazios
      ]);
      
      this.dadosFAE = faeList;
      this.dadosAgenteEconomico = economicAgentList;
      this.dadosUtilizador = userEvaluationList;
      this.dadosFormacao = trainingList;
    } catch (error) {
      console.error('Erro ao carregar dados dos formulários:', error);
    }
  }

  private async carregarDadosIndicadores(): Promise<void> {
    try {
      // Carregar todas as avaliações (iniciadas e concluídas)
      // Sem backend - dados vazios
      const evaluations: EvaluationTimeData[] = [];
      
      // Guardar todas as avaliações
      this.todasAvaliacoes = evaluations;
      
      // Filtrar apenas avaliações completas (com endTime)
      this.evaluationTimes = evaluations.filter(e => e.endTime != null);
      
      // Calcular métricas
      this.calcularMetricasIndicadores();
    } catch (error) {
      console.error('Erro ao carregar dados dos indicadores:', error);
    }
  }

  private calcularMetricasIndicadores(): void {
    if (this.evaluationTimes.length === 0) {
      this.tempoMedioPreenchimento = '0 min 0s';
      this.tempoMaisRapido = '0 min 0s';
      this.tempoMaisLento = '0 min 0s';
      this.totalAvaliacoesIniciadas = 0;
      this.totalAvaliacoesConcluidas = 0;
      this.taxaConclusao = 0;
      return;
    }

    const durations = this.evaluationTimes
      .map(e => e.durationSeconds || 0)
      .filter(d => d != null) as number[];

    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);

      this.tempoMedioPreenchimento = this.formatarTempo(avgDuration);
      this.tempoMaisRapido = this.formatarTempo(minDuration);
      this.tempoMaisLento = this.formatarTempo(maxDuration);
    }

    this.totalAvaliacoesIniciadas = this.todasAvaliacoes.length;
    this.totalAvaliacoesConcluidas = this.evaluationTimes.length;
    
    if (this.totalAvaliacoesIniciadas > 0) {
      this.taxaConclusao = Math.round((this.totalAvaliacoesConcluidas / this.totalAvaliacoesIniciadas) * 100);
    } else {
      this.taxaConclusao = 0;
    }
  }

  formatarTempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = Math.floor(segundos % 60);
    
    if (horas > 0) {
      return `${horas}h ${minutos}min ${segs}s`;
    } else if (minutos > 0) {
      return `${minutos}min ${segs}s`;
    } else {
      return `${segs}s`;
    }
  }

  calcularEstatisticas(): void {
    const totalFAE = this.dadosFAE.length;
    const totalAgente = this.dadosAgenteEconomico.length;
    const totalUtilizador = this.dadosUtilizador.length;
    const totalFormacao = this.dadosFormacao.length;
    
    this.estatisticas.totalAvaliacoes = totalFAE + totalAgente + totalUtilizador + totalFormacao;
    this.estatisticas.ultimaAtualizacao = new Date();
  }

  aplicarFiltros(): void {
    // Aplicar filtros de data e outros
    this.dataInicio = this.filtroForm.get('dataInicio')?.value || '';
    this.dataFim = this.filtroForm.get('dataFim')?.value || '';
    this.filtroTipoFormulario = this.filtroForm.get('tipoFormulario')?.value || '';
    this.filtroProvincia = this.filtroForm.get('provincia')?.value || '';
    this.filtroSatisfacao = this.filtroForm.get('grauSatisfacao')?.value || '';
    
    // Recarregar dados com filtros
    this.carregarTodosDados();
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.dataInicio = '';
    this.dataFim = '';
    this.filtroTipoFormulario = '';
    this.filtroProvincia = '';
    this.filtroSatisfacao = '';
    this.carregarTodosDados();
  }

  filtrarPorTipoFormulario(event: any): void {
    this.filtroTipoFormulario = event.target.value;
  }

  filtrarPorSatisfacao(event: any): void {
    this.filtroSatisfacao = event.target.value;
  }

  filtrarPorProvincia(event: any): void {
    this.filtroProvincia = event.target.value;
  }

  filtrarPorDataInicio(event: any): void {
    this.dataInicio = event.target.value;
  }

  filtrarPorDataFim(event: any): void {
    this.dataFim = event.target.value;
  }

  exportarRelatorio(): void {
    console.log('Exportando relatório...');
  }

  exportarExcel(): void {
    console.log('Exportar para Excel');
    this.exportMenuOpen = false;
  }

  exportarWord(): void {
    console.log('Exportar para Word');
    this.exportMenuOpen = false;
  }

  exportarPdf(): void {
    console.log('Exportar para PDF');
    this.exportMenuOpen = false;
  }

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  fecharExportMenu(): void {
    this.exportMenuOpen = false;
  }

  // Template methods
  toggleFiltros(): void {
    this.filtrosVisiveis = !this.filtrosVisiveis;
  }

  mostrarAjuda(): void {
    console.log('Mostrar ajuda');
  }

  fechar(): void {
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  getTotalAvaliacoes(): number {
    return this.estatisticas.totalAvaliacoes;
  }

  getTotalFAE(): number {
    return this.dadosFAE.length;
  }

  getTotalAgenteEconomico(): number {
    return this.dadosAgenteEconomico.length;
  }

  getTotalUtilizador(): number {
    return this.dadosUtilizador.length;
  }

  getTotalFormacao(): number {
    return this.dadosFormacao.length;
  }

  // Métodos para gráficos
  getMaxMonthlyValue(): number {
    if (!this.monthlyFormData) return 1;
    const allValues = [
      ...(this.monthlyFormData.fae || []),
      ...(this.monthlyFormData.economicAgent || []),
      ...(this.monthlyFormData.userEvaluation || []),
      ...(this.monthlyFormData.training || [])
    ];
    return Math.max(...allValues, 1);
  }

  getMonthlyLinePath(values: number[], maxValue: number): string {
    if (!values || values.length === 0 || maxValue === 0) return '';
    
    const width = 600;
    const height = 240;
    const startX = 40;
    const startY = 260;
    
    let path = '';
    values.forEach((value, index) => {
      const x = startX + (index * (width / (values.length - 1 || 1)));
      const y = startY - ((value / maxValue) * height);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  }

  getFilteredMonthlyData(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  getFilteredProvincesData(): ProvinciaData[] {
    return this.provinciasData || [];
  }

  getSatisfactionClass(satisfaction: string): string {
    const sat = satisfaction?.toLowerCase() || '';
    if (sat.includes('muito satisfeito') || sat.includes('very satisfied')) return 'satisfaction-very-satisfied';
    if (sat.includes('satisfeito') || sat.includes('satisfied')) return 'satisfaction-satisfied';
    if (sat.includes('neutro') || sat.includes('neutral')) return 'satisfaction-neutral';
    if (sat.includes('insatisfeito') || sat.includes('dissatisfied')) return 'satisfaction-dissatisfied';
    if (sat.includes('muito insatisfeito') || sat.includes('very dissatisfied')) return 'satisfaction-very-dissatisfied';
    return '';
  }

  getSatisfactionLabel(satisfaction: string): string {
    const sat = satisfaction?.toLowerCase() || '';
    if (sat.includes('muito satisfeito') || sat.includes('very satisfied')) return 'Muito Satisfeito';
    if (sat.includes('satisfeito') || sat.includes('satisfied')) return 'Satisfeito';
    if (sat.includes('neutro') || sat.includes('neutral')) return 'Neutro';
    if (sat.includes('insatisfeito') || sat.includes('dissatisfied')) return 'Insatisfeito';
    if (sat.includes('muito insatisfeito') || sat.includes('very dissatisfied')) return 'Muito Insatisfeito';
    return satisfaction || '-';
  }

  getProblemaResolvidoLabel(resolvido: string): string {
    if (resolvido === 'sim' || resolvido === 'yes') return 'Sim';
    if (resolvido === 'nao' || resolvido === 'no') return 'Não';
    return resolvido || '-';
  }

  getAgradouLabel(agradou: string): string {
    return agradou || '-';
  }

  getNaoAgradouLabel(naoAgradou: string): string {
    return naoAgradou || '-';
  }

  getServiceClass(servico: string): string {
    return servico?.toLowerCase().replace(/\s+/g, '-') || '';
  }

  getServiceLabel(servico: string): string {
    return servico || '-';
  }

  // Métodos para gráficos de pizza
  getPieDashArray(value: number): string {
    const circumference = 2 * Math.PI * 80;
    const dashArray = (value / 100) * circumference;
    return `${dashArray} ${circumference}`;
  }

  getPieSegmentOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const circumference = 2 * Math.PI * 80;
      offset += (this.satisfactionData[i]?.value || 0) / 100 * circumference;
    }
    return -offset;
  }

  getSatisfacaoGeral(): number {
    if (!this.satisfactionData || this.satisfactionData.length === 0) return 0;
    const total = this.satisfactionData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return 0;
    
    // Calcular satisfação geral (muito satisfeito + satisfeito)
    const muitoSatisfeito = this.satisfactionData.find(s => s.label.includes('Muito Satisfeito'))?.value || 0;
    const satisfeito = this.satisfactionData.find(s => s.label.includes('Satisfeito') && !s.label.includes('Muito'))?.value || 0;
    
    return Math.round(((muitoSatisfeito + satisfeito) / total) * 100);
  }
}
