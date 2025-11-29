import { Injectable } from '@angular/core';
import { SatisfactionService, SatisfactionBreakdown } from './satisfaction.service';

export interface ProvinciaData {
  name: string;
  satisfaction: number;
  avaliacoes: number;
}

export interface PerformanceData {
  month: string;
  value: number;
  position: number;
}

export interface MonthlyFormData {
  fae: number[];
  economicAgent: number[];
  userEvaluation: number[];
  training: number[];
}

export interface ProvinceEvaluationData {
  name: string;
  atendimentoScore: number;
  formacaoScore: number;
  atendimentoCount: number;
  formacaoCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  
  constructor(private satisfactionService: SatisfactionService) {}
  
  /**
   * Calcula dados agregados por província
   */
  calculateProvinceData(
    faeList: any[], 
    economicAgentList: any[], 
    userEvaluationList: any[]
  ): ProvinciaData[] {
    const provinceMap = new Map<string, {
      avaliacoes: number;
      breakdown: SatisfactionBreakdown;
    }>();

    const allProvinces = [
      'Maputo', 'Sofala', 'Nampula', 'Zambézia', 'Tete',
      'Niassa', 'Cabo Delgado', 'Manica', 'Inhambane', 'Gaza', 'Central'
    ];

    // Inicializar todas as províncias
    allProvinces.forEach(province => {
      provinceMap.set(province, {
        avaliacoes: 0,
        breakdown: {
          muitoSatisfeito: 0,
          satisfeito: 0,
          neutro: 0,
          insatisfeito: 0,
          muitoInsatisfeito: 0
        }
      });
    });

    // Processar todas as avaliações
    const allEvaluations = [...faeList, ...economicAgentList, ...userEvaluationList];
    
    allEvaluations.forEach((item: any) => {
      const province = item.province || 'Central';
      const data = provinceMap.get(province);
      
      if (data) {
        data.avaliacoes++;
        const itemBreakdown = this.satisfactionService.calculateSatisfactionBreakdown([item]);
        
        // Agregar breakdowns
        data.breakdown.muitoSatisfeito += itemBreakdown.muitoSatisfeito > 0 ? 1 : 0;
        data.breakdown.satisfeito += itemBreakdown.satisfeito > 0 ? 1 : 0;
        data.breakdown.neutro += itemBreakdown.neutro > 0 ? 1 : 0;
        data.breakdown.insatisfeito += itemBreakdown.insatisfeito > 0 ? 1 : 0;
        data.breakdown.muitoInsatisfeito += itemBreakdown.muitoInsatisfeito > 0 ? 1 : 0;
      }
    });

    // Converter para array e calcular satisfação
    return Array.from(provinceMap.entries())
      .filter(([_, data]) => data.avaliacoes > 0)
      .map(([name, data]) => {
        const total = data.breakdown.muitoSatisfeito + data.breakdown.satisfeito + 
                     data.breakdown.neutro + data.breakdown.insatisfeito + 
                     data.breakdown.muitoInsatisfeito;
        
        const satisfeitos = data.breakdown.muitoSatisfeito + data.breakdown.satisfeito;
        const satisfaction = total > 0 
          ? Math.round((satisfeitos / total) * 100)
          : 0;
        
        return {
          name,
          satisfaction,
          avaliacoes: data.avaliacoes
        };
      })
      .sort((a, b) => b.avaliacoes - a.avaliacoes);
  }
  
  /**
   * Calcula dados mensais para o gráfico de performance
   */
  calculatePerformanceData(
    faeList: any[], 
    economicAgentList: any[], 
    userEvaluationList: any[], 
    trainingList: any[]
  ): { performanceData: PerformanceData[]; monthlyFormData: MonthlyFormData } {
    const monthMap = new Map<number, {
      fae: number;
      economicAgent: number;
      userEvaluation: number;
      training: number;
      total: number;
    }>();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Inicializar todos os meses
    for (let i = 0; i < 12; i++) {
      monthMap.set(i, { fae: 0, economicAgent: 0, userEvaluation: 0, training: 0, total: 0 });
    }
    
    // Processar FAE
    faeList.forEach((item: any) => {
      if (!item.createdAt && !item.created_at) return;
      const date = new Date(item.createdAt || item.created_at);
      const monthIndex = date.getMonth();
      const data = monthMap.get(monthIndex);
      if (data) {
        data.fae++;
        data.total++;
      }
    });
    
    // Processar Economic Agent
    economicAgentList.forEach((item: any) => {
      if (!item.createdAt && !item.created_at) return;
      const date = new Date(item.createdAt || item.created_at);
      const monthIndex = date.getMonth();
      const data = monthMap.get(monthIndex);
      if (data) {
        data.economicAgent++;
        data.total++;
      }
    });
    
    // Processar User Evaluation
    userEvaluationList.forEach((item: any) => {
      if (!item.createdAt && !item.created_at) return;
      const date = new Date(item.createdAt || item.created_at);
      const monthIndex = date.getMonth();
      const data = monthMap.get(monthIndex);
      if (data) {
        data.userEvaluation++;
        data.total++;
      }
    });
    
    // Processar Training
    trainingList.forEach((item: any) => {
      if (!item.createdAt && !item.created_at) return;
      const date = new Date(item.createdAt || item.created_at);
      const monthIndex = date.getMonth();
      const data = monthMap.get(monthIndex);
      if (data) {
        data.training++;
        data.total++;
      }
    });
    
    // Converter para array de PerformanceData
    const performanceData = Array.from(monthMap.entries())
      .map(([monthIndex, data]) => {
        const month = months[monthIndex];
        return { month, value: data.total, position: data.total };
      })
      .sort((a, b) => {
        const monthOrder = months.indexOf(a.month) - months.indexOf(b.month);
        return monthOrder;
      });
    
    // Armazenar dados separados por tipo
    const monthlyFormData: MonthlyFormData = {
      fae: Array.from(monthMap.values()).map(d => d.fae),
      economicAgent: Array.from(monthMap.values()).map(d => d.economicAgent),
      userEvaluation: Array.from(monthMap.values()).map(d => d.userEvaluation),
      training: Array.from(monthMap.values()).map(d => d.training)
    };
    
    return { performanceData, monthlyFormData };
  }

  calculateProvinceEvaluationSplit(
    faeList: any[],
    economicAgentList: any[],
    userEvaluationList: any[],
    trainingList: any[]
  ): ProvinceEvaluationData[] {
    // Lista completa de todas as províncias de Moçambique
    const allProvinces = [
      'Maputo Cidade',
      'Maputo Província',
      'Gaza',
      'Inhambane',
      'Sofala',
      'Manica',
      'Tete',
      'Zambézia',
      'Nampula',
      'Niassa',
      'Cabo Delgado'
    ];

    const evaluationMap = new Map<string, {
      atendimentoSum: number;
      atendimentoCount: number;
      formacaoSum: number;
      formacaoCount: number;
    }>();

    // Inicializar todas as províncias de Moçambique
    allProvinces.forEach(province => {
      evaluationMap.set(province, {
        atendimentoSum: 0,
        atendimentoCount: 0,
        formacaoSum: 0,
        formacaoCount: 0
      });
    });

    const ensureEntry = (province: string) => {
      if (!evaluationMap.has(province)) {
        evaluationMap.set(province, {
          atendimentoSum: 0,
          atendimentoCount: 0,
          formacaoSum: 0,
          formacaoCount: 0
        });
      }
      return evaluationMap.get(province)!;
    };

    const normalizeProvinceName = (province?: string): string => {
      const value = (province || '').trim();
      if (!value) {
        return 'Indefinido';
      }
      const normalized = value
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Mapear variações comuns para os nomes padrão
      const provinceMap: { [key: string]: string } = {
        'Maputo': 'Maputo Cidade',
        'Maputo Cidade': 'Maputo Cidade',
        'Maputo Provincia': 'Maputo Província',
        'Maputo Província': 'Maputo Província',
        'Gaza': 'Gaza',
        'Inhambane': 'Inhambane',
        'Sofala': 'Sofala',
        'Manica': 'Manica',
        'Tete': 'Tete',
        'Zambézia': 'Zambézia',
        'Zambezia': 'Zambézia',
        'Nampula': 'Nampula',
        'Niassa': 'Niassa',
        'Cabo Delgado': 'Cabo Delgado'
      };
      
      return provinceMap[normalized] || normalized;
    };

    const processAttendance = (item: any) => {
      const score = this.mapAttendanceRatingToScore(item?.serviceRating);
      if (score === null) {
        return;
      }
      const province = normalizeProvinceName(item?.province);
      const entry = ensureEntry(province);
      entry.atendimentoSum += score;
      entry.atendimentoCount++;
    };

    const processTraining = (item: any) => {
      const score = this.calculateTrainingRecordScore(item);
      if (score === null) {
        return;
      }
      const province = normalizeProvinceName(item?.province);
      const entry = ensureEntry(province);
      entry.formacaoSum += score;
      entry.formacaoCount++;
    };

    faeList.forEach(processAttendance);
    economicAgentList.forEach(processAttendance);
    userEvaluationList.forEach(processAttendance);
    trainingList.forEach(processTraining);

    // Retornar todas as províncias na ordem definida, mesmo sem dados
    return allProvinces.map(name => {
      const data = evaluationMap.get(name) || {
        atendimentoSum: 0,
        atendimentoCount: 0,
        formacaoSum: 0,
        formacaoCount: 0
      };
      return {
        name,
        atendimentoScore: data.atendimentoCount > 0 ? +(data.atendimentoSum / data.atendimentoCount).toFixed(1) : 0,
        formacaoScore: data.formacaoCount > 0 ? +(data.formacaoSum / data.formacaoCount).toFixed(1) : 0,
        atendimentoCount: data.atendimentoCount,
        formacaoCount: data.formacaoCount
      };
    });
  }
  
  /**
   * Gera o path SVG para o gráfico de linha mensal
   */
  getMonthlyLinePath(data: number[], maxValue: number = 100, width: number = 600, height: number = 240, padding: number = 40): string {
    if (!data || data.length === 0) return '';
    
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
  getMaxMonthlyValue(performanceData: PerformanceData[]): number {
    if (!performanceData || performanceData.length === 0) return 100;
    return Math.max(...performanceData.map(p => p.value), 100);
  }
  
  /**
   * Calcula o stroke-dasharray para o gráfico de pizza
   */
  getPieDashArray(value: number, radius: number = 80): number {
    const circumference = 2 * Math.PI * radius;
    return (value / 100) * circumference;
  }
  
  /**
   * Calcula o stroke-dashoffset para o gráfico de pizza
   */
  getPieDashOffset(previousValue: number, radius: number = 80): number {
    const circumference = 2 * Math.PI * radius;
    return -((previousValue / 100) * circumference);
  }

  private mapAttendanceRatingToScore(rating?: string): number | null {
    if (!rating || !rating.trim()) {
      return null;
    }

    const normalized = rating.toLowerCase().trim();

    if ((normalized.includes('muito') || normalized.includes('very')) && (normalized.includes('insatis') || normalized.includes('dissatisf'))) {
      return 25;
    }

    if (normalized.includes('insatis') || normalized.includes('dissatisf')) {
      return 40;
    }

    if (normalized.includes('neutro') || normalized.includes('neutral')) {
      return 60;
    }

    if (normalized.includes('excelente') || normalized.includes('excellent')) {
      return 95;
    }

    if ((normalized.includes('muito') || normalized.includes('very')) && normalized.includes('satis')) {
      return 95;
    }

    if (normalized.includes('satis')) {
      return 85;
    }

    return 70;
  }

  private mapTrainingRatingToScore(value?: string): number | null {
    if (!value || !value.trim()) {
      return null;
    }

    const normalized = value.toLowerCase().trim();

    if (normalized.includes('excelente') || normalized.includes('excellent')) {
      return 95;
    }

    if (normalized.includes('muito bom') || normalized.includes('very good')) {
      return 90;
    }

    if (normalized === 'bom' || normalized.includes('good')) {
      return 80;
    }

    if (normalized === 'regular' || normalized.includes('regular')) {
      return 65;
    }

    if (normalized.includes('fraco') || normalized.includes('poor')) {
      return 45;
    }

    return null;
  }

  private calculateTrainingRecordScore(item: any): number | null {
    if (!item) {
      return null;
    }

    const fields = [
      'theoretical', 'distribution', 'importance', 'expertise', 'teachingMethod',
      'dynamism', 'motivation', 'availability', 'functionality', 'texts', 'activities',
      'presentation', 'legislation', 'facilities', 'reception'
    ];

    const scores = fields
      .map(field => this.mapTrainingRatingToScore(this.extractFieldValue(item, field)))
      .filter((score): score is number => typeof score === 'number');

    if (!scores.length) {
      return null;
    }

    const total = scores.reduce((sum, current) => sum + current, 0);
    return total / scores.length;
  }

  private extractFieldValue(item: any, field: string): string | undefined {
    if (!item) {
      return undefined;
    }

    if (item[field] !== undefined) {
      return item[field];
    }

    const snakeCase = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    return item[snakeCase];
  }
}

