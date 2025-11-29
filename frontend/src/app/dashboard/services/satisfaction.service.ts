import { Injectable } from '@angular/core';

export interface SatisfactionBreakdown {
  muitoSatisfeito: number;
  satisfeito: number;
  neutro: number;
  insatisfeito: number;
  muitoInsatisfeito: number;
}

export interface SatisfactionData {
  label: string;
  value: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class SatisfactionService {
  
  /**
   * Calcula a distribuição de satisfação a partir de uma lista de avaliações
   */
  calculateSatisfactionBreakdown(dataList: any[]): SatisfactionBreakdown {
    let muitoSatisfeito = 0;
    let satisfeito = 0;
    let neutro = 0;
    let insatisfeito = 0;
    let muitoInsatisfeito = 0;
    
    dataList.forEach((item: any) => {
      const rating = (item.serviceRating || '').toLowerCase().trim();
      
      if (rating === 'muito-satisfeito' || rating === 'muito satisfeito') {
        muitoSatisfeito++;
      } else if (rating === 'satisfeito') {
        satisfeito++;
      } else if (rating === 'neutro') {
        neutro++;
      } else if (rating === 'insatisfeito') {
        insatisfeito++;
      } else if (rating === 'muito-insatisfeito' || rating === 'muito insatisfeito') {
        muitoInsatisfeito++;
      }
    });
    
    const total = dataList.length;
    
    return {
      muitoSatisfeito: total > 0 ? Math.round((muitoSatisfeito / total) * 100) : 0,
      satisfeito: total > 0 ? Math.round((satisfeito / total) * 100) : 0,
      neutro: total > 0 ? Math.round((neutro / total) * 100) : 0,
      insatisfeito: total > 0 ? Math.round((insatisfeito / total) * 100) : 0,
      muitoInsatisfeito: total > 0 ? Math.round((muitoInsatisfeito / total) * 100) : 0
    };
  }
  
  /**
   * Converte breakdown em dados para gráfico de pizza (agrupando para 3 categorias)
   */
  getPieChartData(breakdown: SatisfactionBreakdown): SatisfactionData[] {
    // Agrupar: Muito Satisfeito + Satisfeito, Neutro, Insatisfeito + Muito Insatisfeito
    const satisfeito = breakdown.muitoSatisfeito + breakdown.satisfeito;
    const neutro = breakdown.neutro;
    const insatisfeito = breakdown.insatisfeito + breakdown.muitoInsatisfeito;
    
    return [
      { label: 'Satisfeito', value: satisfeito, color: '#4CAF50' },
      { label: 'Neutro', value: neutro, color: '#FF9800' },
      { label: 'Insatisfeito', value: insatisfeito, color: '#F44336' }
    ];
  }
  
  /**
   * Retorna dados completos para gráfico com 5 categorias
   * Ordem: Muito Satisfeito -> Satisfeito -> Neutro -> Insatisfeito -> Muito Insatisfeito
   */
  getFullPieChartData(breakdown: SatisfactionBreakdown): SatisfactionData[] {
    return [
      { label: 'Muito Satisfeito', value: breakdown.muitoSatisfeito, color: '#2E7D32' },
      { label: 'Satisfeito', value: breakdown.satisfeito, color: '#4CAF50' },
      { label: 'Neutro', value: breakdown.neutro, color: '#FF9800' },
      { label: 'Insatisfeito', value: breakdown.insatisfeito, color: '#F44336' },
      { label: 'Muito Insatisfeito', value: breakdown.muitoInsatisfeito, color: '#C62828' }
    ].filter(item => item.value > 0); // Remover categorias com valor 0 para melhor visualização
  }
  
  /**
   * Calcula satisfação geral (percentual de satisfeitos)
   */
  getSatisfactionPercentage(breakdown: SatisfactionBreakdown): number {
    return breakdown.muitoSatisfeito + breakdown.satisfeito;
  }
  
  /**
   * Agrega múltiplos breakdowns
   */
  aggregateBreakdowns(breakdowns: SatisfactionBreakdown[]): SatisfactionBreakdown {
    const total = breakdowns.reduce((sum, b) => 
      sum + b.muitoSatisfeito + b.satisfeito + b.neutro + b.insatisfeito + b.muitoInsatisfeito, 0);
    
    if (total === 0) {
      return {
        muitoSatisfeito: 0,
        satisfeito: 0,
        neutro: 0,
        insatisfeito: 0,
        muitoInsatisfeito: 0
      };
    }
    
    const aggregated = breakdowns.reduce((acc, b) => ({
      muitoSatisfeito: acc.muitoSatisfeito + b.muitoSatisfeito,
      satisfeito: acc.satisfeito + b.satisfeito,
      neutro: acc.neutro + b.neutro,
      insatisfeito: acc.insatisfeito + b.insatisfeito,
      muitoInsatisfeito: acc.muitoInsatisfeito + b.muitoInsatisfeito
    }), {
      muitoSatisfeito: 0,
      satisfeito: 0,
      neutro: 0,
      insatisfeito: 0,
      muitoInsatisfeito: 0
    });
    
    // Calcular percentuais baseados no total agregado
    const totalCount = aggregated.muitoSatisfeito + aggregated.satisfeito + 
                      aggregated.neutro + aggregated.insatisfeito + aggregated.muitoInsatisfeito;
    
    if (totalCount === 0) {
      return aggregated;
    }
    
    return {
      muitoSatisfeito: Math.round((aggregated.muitoSatisfeito / totalCount) * 100),
      satisfeito: Math.round((aggregated.satisfeito / totalCount) * 100),
      neutro: Math.round((aggregated.neutro / totalCount) * 100),
      insatisfeito: Math.round((aggregated.insatisfeito / totalCount) * 100),
      muitoInsatisfeito: Math.round((aggregated.muitoInsatisfeito / totalCount) * 100)
    };
  }
}

