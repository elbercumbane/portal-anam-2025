import { Injectable } from '@angular/core';
import { SatisfactionService, SatisfactionBreakdown } from './satisfaction.service';

export interface DashboardData {
  service: {
    total: number;
  };
  fae: {
    total: number;
    breakdown: SatisfactionBreakdown;
  };
  user: {
    total: number;
    breakdown: SatisfactionBreakdown;
  };
  economicAgent: {
    total: number;
    breakdown: SatisfactionBreakdown;
  };
  training: {
    total: number; // Total de avaliações
    cursos: number; // Cursos únicos
    provincias: number; // Províncias únicas
    generos: number; // Gêneros únicos
    taxaSatisfacao: number;
  };
  indicators: {
    total: number;
    taxaConclusao: number;
    tempoMedio: string;
    usuariosAtivos: number;
  };
  gestao: {
    total: number;
    ativos: number;
    inativos: number;
    manutencao: number;
    percentualAtivos: number;
    percentualInativos: number;
    percentualManutencao: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService {
  
  constructor(
    private satisfactionService: SatisfactionService
  ) {}
  
  /**
   * Carrega todos os dados do dashboard (sem backend - dados mockados)
   */
  async loadDashboardData(): Promise<DashboardData> {
    try {
      // Retornar dados vazios/mockados - sem backend
      const faeList: any[] = [];
      const economicAgentList: any[] = [];
      const userEvaluationList: any[] = [];
      const trainingList: any[] = [];
      const usersList: any[] = [];
      
      const dashboardData: DashboardData = {
        service: { total: 0 },
        fae: { total: 0, breakdown: this.satisfactionService.calculateSatisfactionBreakdown([]) },
        user: { total: 0, breakdown: this.satisfactionService.calculateSatisfactionBreakdown([]) },
        economicAgent: { total: 0, breakdown: this.satisfactionService.calculateSatisfactionBreakdown([]) },
        training: {
          total: 0,
          cursos: 0,
          provincias: 0,
          generos: 0,
          taxaSatisfacao: 0
        },
        indicators: {
          total: 0,
          taxaConclusao: 0,
          tempoMedio: '0min',
          usuariosAtivos: 0
        },
        gestao: {
          total: 0,
          ativos: 0,
          inativos: 0,
          manutencao: 0,
          percentualAtivos: 0,
          percentualInativos: 0,
          percentualManutencao: 0
        }
      };
      
      // Calcular estatísticas FAE
      dashboardData.fae.total = faeList.length;
      dashboardData.fae.breakdown = this.satisfactionService.calculateSatisfactionBreakdown(faeList);
      
      // Calcular estatísticas Economic Agent
      dashboardData.economicAgent.total = economicAgentList.length;
      dashboardData.economicAgent.breakdown = this.satisfactionService.calculateSatisfactionBreakdown(economicAgentList);
      
      // Calcular estatísticas User Evaluation
      dashboardData.user.total = userEvaluationList.length;
      dashboardData.user.breakdown = this.satisfactionService.calculateSatisfactionBreakdown(userEvaluationList);
      
      // Calcular total de atendimentos (service)
      dashboardData.service.total = 
        dashboardData.fae.total + 
        dashboardData.user.total + 
        dashboardData.economicAgent.total;
      
      // Calcular estatísticas Training
      this.calculateTrainingStats(trainingList, dashboardData.training);
      
      // Calcular estatísticas de usuários
      const activeUsers = (usersList as any[]).filter((u: any) => u.active === true || u.active === 1);
      dashboardData.indicators.usuariosAtivos = activeUsers.length;
      
      return dashboardData;
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      throw error;
    }
  }
  
  /**
   * Calcula estatísticas de formação
   */
  private calculateTrainingStats(trainingList: any[], trainingData: DashboardData['training']): void {
    if (!trainingList || trainingList.length === 0) {
      return;
    }
    
    // Total de avaliações = total de registros
    trainingData.total = trainingList.length;
    
    // Contar cursos únicos
    const uniqueCourses = new Set(trainingList.map((t: any) => t.courseName || '').filter((name: string) => name.trim() !== ''));
    trainingData.cursos = uniqueCourses.size;
    
    // Contar províncias únicas
    const uniqueProvinces = new Set(trainingList.map((t: any) => t.province || '').filter((province: string) => province.trim() !== ''));
    trainingData.provincias = uniqueProvinces.size;
    
    // Contar gêneros únicos
    const uniqueGenders = new Set(trainingList.map((t: any) => t.gender || '').filter((gender: string) => gender.trim() !== ''));
    trainingData.generos = uniqueGenders.size;
    
    // Calcular taxa de satisfação baseada nas avaliações
    let satisfeitos = 0;
    trainingList.forEach((t: any) => {
      const evaluations = [
        t.theoretical, t.distribution, t.importance,
        t.expertise, t.teachingMethod, t.dynamism, t.motivation,
        t.availability, t.functionality,
        t.texts, t.activities, t.presentation, t.legislation,
        t.facilities, t.reception
      ];
      
      const positiveCount = evaluations.filter((evaluation: string) => {
        const evalLower = (evaluation || '').toLowerCase();
        return evalLower === 'muito-satisfeito' || evalLower === 'satisfeito' || 
               evalLower === 'muito satisfeito';
      }).length;
      
      // Se mais da metade das avaliações são positivas, considera satisfeito
      if (positiveCount > evaluations.length / 2) {
        satisfeitos++;
      }
    });
    
    trainingData.taxaSatisfacao = trainingList.length > 0 
      ? Math.round((satisfeitos / trainingList.length) * 100) 
      : 0;
  }
}

