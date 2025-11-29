import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject } from 'rxjs';
// ApiService removido - sem backend

interface EvaluationTimeData {
  id: number;
  formType: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number | null;
  sessionId: string;
  userIdentifier: string | null;
}

interface TempoPorFormulario {
  tipo: string;
  tempo: number;
  segundos: number;
}

interface DistribuicaoTempo {
  faixa: string;
  quantidade: number;
}

@Component({
  selector: 'app-detailed-analysis',
  templateUrl: './detailed-analysis.component.html',
  styleUrls: ['./detailed-analysis.component.scss']
})
export class DetailedAnalysisComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Input() evaluationTimes: EvaluationTimeData[] = [];
  @Input() todasAvaliacoes: EvaluationTimeData[] = [];
  @Input() tempoMedioPreenchimento: string = '0 min 0s';
  @Input() tempoMaisRapido: string = '0s';
  @Input() tempoMaisLento: string = '0s';
  @Input() taxaConclusao: number = 0;
  @Input() totalAvaliacoesIniciadas: number = 0;
  @Input() totalAvaliacoesConcluidas: number = 0;
  @Input() tempoPorFormulario: TempoPorFormulario[] = [];
  @Input() distribuicaoTempos: DistribuicaoTempo[] = [];
  
  @Output() close = new EventEmitter<void>();
  
  // Dados carregados da API
  evaluationTimesData: EvaluationTimeData[] = [];
  todasAvaliacoesData: EvaluationTimeData[] = [];
  
  isLoading = false;
  erroCarregamento = '';
  
  // Dados para gráficos temporais
  dadosTemporais: Array<{ data: string; tempoMedio: number; concluidas: number; iniciadas: number }> = [];
  
  // Dados para comparação entre formulários
  comparacaoFormularios: Array<{ tipo: string; tempoMedio: number; concluidas: number; taxa: number }> = [];
  
  // Dados para gráfico de taxa de conclusão ao longo do tempo
  taxaConclusaoTemporal: Array<{ data: string; taxa: number }> = [];

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }
  
  async loadData(): Promise<void> {
    this.isLoading = true;
    this.erroCarregamento = '';

    try {
      // Sem backend - dados vazios
      const evaluations: EvaluationTimeData[] = [];
      
      // Guardar todas as avaliações
      this.todasAvaliacoesData = evaluations;
      
      // Filtrar apenas avaliações completas (com endTime)
      this.evaluationTimesData = evaluations.filter(e => e.endTime != null);
      
      // Preparar dados para gráficos
      this.prepararDadosTemporais();
      this.prepararComparacaoFormularios();
      this.prepararTaxaConclusaoTemporal();
    } catch (error: any) {
      this.erroCarregamento = 'Não foi possível carregar os dados.';
      this.evaluationTimesData = [];
      this.todasAvaliacoesData = [];
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepararDadosTemporais(): void {
    // Agrupar por data
    const dadosPorData: { [key: string]: { tempos: number[]; concluidas: number; iniciadas: number } } = {};
    
    this.todasAvaliacoesData.forEach(e => {
      const data = new Date(e.startTime).toISOString().split('T')[0];
      if (!dadosPorData[data]) {
        dadosPorData[data] = { tempos: [], concluidas: 0, iniciadas: 0 };
      }
      dadosPorData[data].iniciadas++;
      
      if (e.endTime) {
        dadosPorData[data].concluidas++;
        if (e.durationSeconds) {
          dadosPorData[data].tempos.push(e.durationSeconds);
        }
      }
    });
    
    this.dadosTemporais = Object.keys(dadosPorData)
      .sort()
      .map(data => {
        const dados = dadosPorData[data];
        const tempoMedio = dados.tempos.length > 0
          ? dados.tempos.reduce((a, b) => a + b, 0) / dados.tempos.length
          : 0;
        
        return {
          data: this.formatarData(data),
          tempoMedio,
          concluidas: dados.concluidas,
          iniciadas: dados.iniciadas
        };
      });
  }

  private prepararComparacaoFormularios(): void {
    const formTypeMap: { [key: string]: string } = {
      'FAE': 'FAE',
      'ECONOMIC_AGENT': 'Agente Econômico',
      'USER_EVALUATION': 'Utilizador',
      'TRAINING': 'Formação'
    };
    
    const dadosPorFormulario: { [key: string]: { tempos: number[]; concluidas: number; iniciadas: number } } = {};
    
    this.todasAvaliacoesData.forEach(e => {
      const tipo = formTypeMap[e.formType] || e.formType;
      if (!dadosPorFormulario[tipo]) {
        dadosPorFormulario[tipo] = { tempos: [], concluidas: 0, iniciadas: 0 };
      }
      dadosPorFormulario[tipo].iniciadas++;
      
      if (e.endTime) {
        dadosPorFormulario[tipo].concluidas++;
        if (e.durationSeconds) {
          dadosPorFormulario[tipo].tempos.push(e.durationSeconds);
        }
      }
    });
    
    this.comparacaoFormularios = Object.keys(dadosPorFormulario).map(tipo => {
      const dados = dadosPorFormulario[tipo];
      const tempoMedio = dados.tempos.length > 0
        ? dados.tempos.reduce((a, b) => a + b, 0) / dados.tempos.length
        : 0;
      const taxa = dados.iniciadas > 0
        ? (dados.concluidas / dados.iniciadas) * 100
        : 0;
      
      return {
        tipo,
        tempoMedio,
        concluidas: dados.concluidas,
        taxa
      };
    });
  }

  private prepararTaxaConclusaoTemporal(): void {
    const dadosPorData: { [key: string]: { concluidas: number; iniciadas: number } } = {};
    
    this.todasAvaliacoesData.forEach(e => {
      const data = new Date(e.startTime).toISOString().split('T')[0];
      if (!dadosPorData[data]) {
        dadosPorData[data] = { concluidas: 0, iniciadas: 0 };
      }
      dadosPorData[data].iniciadas++;
      if (e.endTime) {
        dadosPorData[data].concluidas++;
      }
    });
    
    this.taxaConclusaoTemporal = Object.keys(dadosPorData)
      .sort()
      .map(data => {
        const dados = dadosPorData[data];
        const taxa = dados.iniciadas > 0
          ? (dados.concluidas / dados.iniciadas) * 100
          : 0;
        
        return {
          data: this.formatarData(data),
          taxa
        };
      });
  }

  formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
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

  getMaxTempoMedio(): number {
    if (this.dadosTemporais.length === 0) return 1;
    return Math.max(...this.dadosTemporais.map(d => d.tempoMedio), 1);
  }

  getMaxTaxaConclusao(): number {
    if (this.taxaConclusaoTemporal.length === 0) return 100;
    return Math.max(...this.taxaConclusaoTemporal.map(d => d.taxa), 100);
  }

  getMaxTempoFormulario(): number {
    if (this.comparacaoFormularios.length === 0) return 1;
    return Math.max(...this.comparacaoFormularios.map(d => d.tempoMedio), 1);
  }

  getMaxConcluidas(): number {
    if (this.dadosTemporais.length === 0) return 1;
    return Math.max(...this.dadosTemporais.map(d => d.concluidas), 1);
  }
  
  getTempoMedioPath(): string {
    const values = this.dadosTemporais.map(d => d.tempoMedio);
    return this.getLinePath(values, this.getMaxTempoMedio());
  }
  
  getTaxaConclusaoPath(): string {
    const values = this.taxaConclusaoTemporal.map(d => d.taxa);
    return this.getLinePath(values, this.getMaxTaxaConclusao());
  }

  getLinePath(values: number[], maxValue: number): string {
    if (values.length === 0 || maxValue === 0) return '';
    
    const width = 840;
    const height = 300;
    const startX = 80;
    const startY = 360;
    
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
  
  getTempoMedioAreaPath(): string {
    const values = this.dadosTemporais.map(d => d.tempoMedio);
    const maxValue = this.getMaxTempoMedio();
    if (values.length === 0 || maxValue === 0) return '';
    
    const width = 840;
    const height = 300;
    const startX = 80;
    const startY = 360;
    
    let path = '';
    values.forEach((value, index) => {
      const x = startX + (index * (width / (values.length - 1 || 1)));
      const y = startY - ((value / maxValue) * height);
      
      if (index === 0) {
        path += `M ${x} ${startY} L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    // Fechar o caminho
    const lastX = startX + ((values.length - 1) * (width / (values.length - 1 || 1)));
    path += ` L ${lastX} ${startY} Z`;
    
    return path;
  }
  
  getTaxaConclusaoAreaPath(): string {
    const values = this.taxaConclusaoTemporal.map(d => d.taxa);
    const maxValue = this.getMaxTaxaConclusao();
    if (values.length === 0 || maxValue === 0) return '';
    
    const width = 840;
    const height = 300;
    const startX = 80;
    const startY = 360;
    
    let path = '';
    values.forEach((value, index) => {
      const x = startX + (index * (width / (values.length - 1 || 1)));
      const y = startY - ((value / maxValue) * height);
      
      if (index === 0) {
        path += `M ${x} ${startY} L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    // Fechar o caminho
    const lastX = startX + ((values.length - 1) * (width / (values.length - 1 || 1)));
    path += ` L ${lastX} ${startY} Z`;
    
    return path;
  }
  
  getXPosition(index: number, total: number): number {
    const width = 840;
    const startX = 80;
    return startX + (index * (width / (total - 1 || 1)));
  }
  
  getYPosition(value: number, maxValue: number): number {
    const height = 300;
    const startY = 360;
    return startY - ((value / maxValue) * height);
  }
  
  getMaxIniciadas(): number {
    if (this.dadosTemporais.length === 0) return 1;
    return Math.max(...this.dadosTemporais.map(d => d.iniciadas), 1);
  }
  
  Math = Math; // Expor Math para o template

  fechar(): void {
    this.close.emit();
  }
}

