import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject } from 'rxjs';
// ApiService removido - sem backend

interface ProvinciaData {
  name: string;
  formularios: number;
  atendimentos: number;
  satisfacao: number;
}

type ProvinceStats = {
  formularios: number;
  atendimentos: number;
  satisfeitos: number;
  neutros: number;
  insatisfeitos: number;
  total: number;
};

@Component({
  selector: 'app-overview',
  
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Filter state
  showFilterPanel = false;
  selectedPeriod = 'year';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  
  // Filtros por categoria
  selectedProvinces: string[] = [];
  selectedFormTypes: string[] = [];
  selectedStatuses: string[] = [];
  selectedSatisfactionLevels: string[] = [];
  
  // Opções para filtros
  provinces = [
    'Maputo', 'Sofala', 'Nampula', 'Zambézia', 'Tete',
    'Niassa', 'Cabo Delgado', 'Manica', 'Inhambane', 'Gaza'
  ];
  
  formTypes = ['FAE', 'Utilizador', 'Agente Econômico', 'Formação'];
  statuses = ['Ativo', 'Inativo', 'Em Manutenção', 'Pendente'];
  satisfactionLevels = ['Satisfeito', 'Neutro', 'Insatisfeito'];
  
  // Dashboard data
  dashboardData: {
    totalFormularios: number;
    totalAtendimentos: number;
    totalFormacoes: number;
    satisfacaoGeral: number;
    provinciasData: any[];
    monthlyData: any[];
    satisfactionData: {
      satisfeito: number;
      neutro: number;
      insatisfeito: number;
    };
    performanceData: {
      tempoMedioResposta: string;
      taxaConclusao: number;
      usuariosAtivos: number;
      crescimento: number;
    };
  } = {
    totalFormularios: 0,
    totalAtendimentos: 0,
    totalFormacoes: 0,
    satisfacaoGeral: 0,
    
    // Data by province
    provinciasData: [] as any[],
    
    // Monthly data
    monthlyData: [] as any[],
    
    // Satisfaction data
    satisfactionData: {
      satisfeito: 0,
      neutro: 0,
      insatisfeito: 0
    },
    
    // Performance data
    performanceData: {
      tempoMedioResposta: '0min',
      taxaConclusao: 0,
      usuariosAtivos: 0,
      crescimento: 0
    }
  };


  constructor() {}

  ngOnInit(): void {
    // Inicializar com todos os filtros selecionados
    this.selectedProvinces = [...this.provinces];
    this.selectedFormTypes = [...this.formTypes];
    this.selectedStatuses = [...this.statuses];
    this.selectedSatisfactionLevels = [...this.satisfactionLevels];
    
    // Carregar dados reais
    this.loadRealData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filter methods
  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters(): void {
    console.log('Aplicando filtros:', {
      period: this.selectedPeriod,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      provinces: this.selectedProvinces,
      formTypes: this.selectedFormTypes,
      statuses: this.selectedStatuses,
      satisfactionLevels: this.selectedSatisfactionLevels
    });
    
    // Aqui você implementaria a lógica para filtrar os dados
    this.showFilterPanel = false;
  }

  resetFilters(): void {
    this.selectedPeriod = 'year';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProvinces = [...this.provinces];
    this.selectedFormTypes = [...this.formTypes];
    this.selectedStatuses = [...this.statuses];
    this.selectedSatisfactionLevels = [...this.satisfactionLevels];
  }

  // Chart data methods
  getFilteredProvincesData(): ProvinciaData[] {
    return this.dashboardData.provinciasData.filter((provincia: ProvinciaData) => 
      this.selectedProvinces.includes(provincia.name)
    );
  }

  getFilteredMonthlyData() {
    return this.dashboardData.monthlyData;
  }

  getTotalFormularios(): number {
    return this.getFilteredProvincesData().reduce((total, p) => total + p.formularios, 0);
  }

  getTotalAtendimentos(): number {
    return this.getFilteredProvincesData().reduce((total, p) => total + p.atendimentos, 0);
  }

  getSatisfacaoGeral(): number {
    const provincias = this.getFilteredProvincesData();
    if (provincias.length === 0) return 0;
    return Math.round(provincias.reduce((total, p) => total + p.satisfacao, 0) / provincias.length);
  }

  getTopProvincia(): any {
    const provincias = this.getFilteredProvincesData();
    return provincias.reduce((prev, current) => 
      (prev.satisfacao > current.satisfacao) ? prev : current
    );
  }

  getSatisfactionColor(satisfaction: number): string {
    if (satisfaction >= 75) return '#4CAF50';
    if (satisfaction >= 70) return '#FF9800';
    return '#F44336';
  }

  /**
   * Carrega dados (sem backend - dados vazios)
   */
  private async loadRealData(): Promise<void> {
    try {
      // Sem backend - dados vazios
      const faeList: any[] = [];
      const economicAgentList: any[] = [];
      const userEvaluationList: any[] = [];
      const trainingList: any[] = [];

      this.syncAvailableProvinces([faeList, economicAgentList, userEvaluationList, trainingList]);

      // Calcular dados por província (com dados vazios)
      this.calculateProvinceData(faeList, economicAgentList, userEvaluationList);
      
      // Calcular dados de satisfação geral
      this.calculateSatisfactionData(faeList, economicAgentList, userEvaluationList);
      
      // Calcular dados mensais
      this.calculateMonthlyData(faeList, economicAgentList, userEvaluationList, trainingList);
      
      // Calcular totais
      this.dashboardData.totalFormularios = faeList.length + economicAgentList.length + userEvaluationList.length;
      this.dashboardData.totalAtendimentos = faeList.length + economicAgentList.length + userEvaluationList.length;
      this.dashboardData.totalFormacoes = trainingList.length;
    } catch (error: any) {
      console.error('Erro ao carregar dados do overview:', error);
    }
  }

  /**
   * Calcula dados agregados por província
   */
  private calculateProvinceData(faeList: any[], economicAgentList: any[], userEvaluationList: any[]): void {
    const provinceMap = new Map<string, ProvinceStats>();

    const ensureProvinceEntry = (province: string): ProvinceStats => {
      if (!provinceMap.has(province)) {
        provinceMap.set(province, this.createEmptyProvinceStats());
      }
      return provinceMap.get(province)!;
    };

    this.provinces.forEach(province => {
      provinceMap.set(province, this.createEmptyProvinceStats());
    });

    const processItem = (item: any) => {
      const province = this.normalizeProvinceName(item?.province);
      const data = ensureProvinceEntry(province);

      data.formularios++;
      data.atendimentos++;
      data.total++;

      const rating = (item?.serviceRating || '').toLowerCase();
      if (rating.includes('muito') && rating.includes('satis')) {
        data.satisfeitos++;
      } else if (rating === 'satisfeito' || rating === 'satisfied') {
        data.satisfeitos++;
      } else if (rating === 'neutro' || rating === 'neutral') {
        data.neutros++;
      } else if (rating) {
        data.insatisfeitos++;
      }
    };

    faeList.forEach(processItem);
    economicAgentList.forEach(processItem);
    userEvaluationList.forEach(processItem);

    this.dashboardData.provinciasData = Array.from(provinceMap.entries()).map(([name, data]) => {
      const satisfacao = data.total > 0 
        ? Math.round((data.satisfeitos / data.total) * 100)
        : 0;
      
      return {
        name,
        formularios: data.formularios,
        atendimentos: data.atendimentos,
        satisfacao
      } as ProvinciaData;
    });
  }

  private createEmptyProvinceStats(): ProvinceStats {
    return {
      formularios: 0,
      atendimentos: 0,
      satisfeitos: 0,
      neutros: 0,
      insatisfeitos: 0,
      total: 0
    };
  }

  private syncAvailableProvinces(dataSources: any[][]): void {
    const normalized = new Set<string>();

    this.provinces.forEach(province => normalized.add(this.normalizeProvinceName(province)));

    dataSources.forEach(list => {
      list.forEach(item => normalized.add(this.normalizeProvinceName(item?.province)));
    });

    this.provinces = Array.from(normalized).sort();
    const updatedSelection = new Set(this.selectedProvinces.map(p => this.normalizeProvinceName(p)));

    this.provinces.forEach(province => {
      if (!updatedSelection.has(province)) {
        updatedSelection.add(province);
      }
    });

    this.selectedProvinces = Array.from(updatedSelection);
  }

  /**
   * Calcula dados de satisfação geral
   */
  private calculateSatisfactionData(faeList: any[], economicAgentList: any[], userEvaluationList: any[]): void {
    let satisfeitos = 0;
    let neutros = 0;
    let insatisfeitos = 0;
    let total = 0;

    const allEvaluations = [...faeList, ...economicAgentList, ...userEvaluationList];

    allEvaluations.forEach((item: any) => {
      const rating = (item.serviceRating || '').toLowerCase();
      total++;
      
      if (rating === 'muito-satisfeito' || rating === 'satisfeito' || rating === 'muito satisfeito') {
        satisfeitos++;
      } else if (rating === 'neutro') {
        neutros++;
      } else if (rating === 'muito-insatisfeito' || rating === 'insatisfeito' || rating === 'muito insatisfeito') {
        insatisfeitos++;
      }
    });

    if (total > 0) {
      this.dashboardData.satisfactionData = {
        satisfeito: Math.round((satisfeitos / total) * 100),
        neutro: Math.round((neutros / total) * 100),
        insatisfeito: Math.round((insatisfeitos / total) * 100)
      };
      
      this.dashboardData.satisfacaoGeral = Math.round((satisfeitos / total) * 100);
    }
  }

  /**
   * Calcula dados mensais para o gráfico de linha
   */
  private calculateMonthlyData(faeList: any[], economicAgentList: any[], userEvaluationList: any[], trainingList: any[]): void {
    const monthMap = new Map<string, {
      fae: number;
      economicAgent: number;
      userEvaluation: number;
      training: number;
    }>();

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Inicializar todos os meses
    months.forEach(month => {
      monthMap.set(month, { fae: 0, economicAgent: 0, userEvaluation: 0, training: 0 });
    });

    // Processar dados por mês
    const processItem = (item: any, type: 'fae' | 'economicAgent' | 'userEvaluation' | 'training') => {
      if (!item.createdAt && !item.created_at) return;
      
      const date = new Date(item.createdAt || item.created_at);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      
      const data = monthMap.get(monthName);
      if (data) {
        if (type === 'fae') data.fae++;
        else if (type === 'economicAgent') data.economicAgent++;
        else if (type === 'userEvaluation') data.userEvaluation++;
        else if (type === 'training') data.training++;
      }
    };

    faeList.forEach(item => processItem(item, 'fae'));
    economicAgentList.forEach(item => processItem(item, 'economicAgent'));
    userEvaluationList.forEach(item => processItem(item, 'userEvaluation'));
    trainingList.forEach(item => processItem(item, 'training'));

    // Converter para array
    this.dashboardData.monthlyData = Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }));
  }

  /**
   * Retorna dados de satisfação para o gráfico de pizza
   */
  getSatisfactionPieData(): { label: string; value: number; color: string }[] {
    const data = this.dashboardData.satisfactionData;
    return [
      { label: 'Satisfeito', value: data.satisfeito, color: '#4CAF50' },
      { label: 'Neutro', value: data.neutro, color: '#FF9800' },
      { label: 'Insatisfeito', value: data.insatisfeito, color: '#F44336' }
    ];
  }

  /**
   * Gera o path SVG para o gráfico de linha mensal
   */
  getMonthlyLinePath(data: number[], maxValue: number = 100): string {
    if (!data || data.length === 0) return '';
    
    const width = 700;
    const height = 240;
    const padding = 50;
    const startX = padding;
    const startY = padding + height;
    const stepX = width / (data.length - 1 || 1);
    const maxHeight = height - 20;
    
    const points = data.map((value, index) => {
      const x = startX + (index * stepX);
      const y = startY - ((value / maxValue) * maxHeight);
      return `${x} ${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }
  
  /**
   * Retorna o valor máximo para normalizar o gráfico
   */
  getMaxMonthlyValue(): number {
    if (!this.dashboardData.monthlyData || this.dashboardData.monthlyData.length === 0) return 100;
    const maxFae = Math.max(...this.dashboardData.monthlyData.map((d: any) => d.fae || 0), 0);
    const maxEconomicAgent = Math.max(...this.dashboardData.monthlyData.map((d: any) => d.economicAgent || 0), 0);
    const maxUserEvaluation = Math.max(...this.dashboardData.monthlyData.map((d: any) => d.userEvaluation || 0), 0);
    const maxTraining = Math.max(...this.dashboardData.monthlyData.map((d: any) => d.training || 0), 0);
    return Math.max(maxFae, maxEconomicAgent, maxUserEvaluation, maxTraining, 100);
  }
  
  /**
   * Retorna dados mensais para cada tipo de formulário
   */
  getMonthlyFormData(): { fae: number[]; economicAgent: number[]; userEvaluation: number[]; training: number[] } {
    if (!this.dashboardData.monthlyData || this.dashboardData.monthlyData.length === 0) {
      return { fae: [], economicAgent: [], userEvaluation: [], training: [] };
    }
    return {
      fae: this.dashboardData.monthlyData.map((d: any) => d.fae || 0),
      economicAgent: this.dashboardData.monthlyData.map((d: any) => d.economicAgent || 0),
      userEvaluation: this.dashboardData.monthlyData.map((d: any) => d.userEvaluation || 0),
      training: this.dashboardData.monthlyData.map((d: any) => d.training || 0)
    };
  }
  
  /**
   * Retorna performanceData para o template
   */
  get performanceData(): any[] {
    return this.dashboardData.monthlyData || [];
  }

  private normalizeProvinceName(province?: string): string {
    const value = (province || '').trim();
    if (!value) {
      return 'Indefinido';
    }

    return value
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
