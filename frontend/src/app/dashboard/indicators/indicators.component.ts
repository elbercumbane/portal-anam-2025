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
import { Subject } from 'rxjs';
// ApiService removido - sem backend

interface IndicadoresStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

interface IndicadorDetalhado {
  tipoFormulario: string;
  tempoMedio: string;
  tempoMinimo: string;
  tempoMaximo: string;
  totalAvaliacoes: number;
  taxaSatisfacao: number;
  ultimaAtualizacao: Date;
}

interface RegistroIndividual {
  id: number;
  tipoFormulario: string;
  tempoDuracao: string;
  dataInicio: Date;
  dataFim: Date;
  duracaoSegundos: number;
  sessionId: string;
  userIdentifier: string;
}

interface EvaluationTimeData {
  id: number;
  formType: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  userIdentifier: string;
  sessionId: string;
  createdAt: string;
  machineId: string;
  browserType: string;
}


export interface TempoPorFormulario {
  tipo: string;
  tempo: number;
  segundos: number;
}

interface DistribuicaoTempo {
  faixa: string;
  quantidade: number;
}

@Component({
  selector: 'app-indicators',
  
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() navigationClick = new EventEmitter<any>();
  
  indicadoresForm: FormGroup;
  
  // Propriedades para filtros e tabelas
  filtrosVisiveis = false;
  exportMenuOpen = false;
  mostrarAnaliseDetalhada = false;
  
  // Filtros ativos
  filtroTipoFormulario: string = '';
  filtroPeriodo: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  filtroOrdenacao: string = 'id-crescente'; // id-crescente, id-decrescente, tempo-crescente, tempo-decrescente, media
  filtroVisualizacao: string = 'todos'; // todos, acima-limite, abaixo-limite
  
  // Registros filtrados para exibição
  registrosFiltrados: RegistroIndividual[] = [];
  
  // Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  
  // Métricas principais
  tempoMedioPreenchimento = '0 min 0s';
  tempoMaisRapido = '0 min 0s';
  tempoMaisLento = '0 min 0s';
  taxaConclusao = 0;
  totalAvaliacoes = 0;
  totalAvaliacoesIniciadas = 0;
  totalAvaliacoesConcluidas = 0;
  
  isLoading = false;
  erroCarregamento = '';
  
  stats: IndicadoresStats = {
    totalFormularios: 0,
    formulariosAtivos: 0,
    formulariosInativos: 0,
    totalRespostas: 0,
    taxaResposta: 0,
    ultimaAtualizacao: new Date()
  };

  // Chart data
  tempoPorFormulario: TempoPorFormulario[] = [];

  distribuicaoTempos: DistribuicaoTempo[] = [];

  // Detailed data for table (agregado por tipo)
  indicadores: IndicadorDetalhado[] = [];
  
  // Registros individuais para exibir na tabela
  registrosIndividuais: RegistroIndividual[] = [];
  
  // Raw data from API
  evaluationTimes: EvaluationTimeData[] = [];
  todasAvaliacoes: EvaluationTimeData[] = []; // Todas as avaliações (iniciadas e concluídas)

  constructor(
    private fb: FormBuilder,
    // ApiService removido
  ) {
    this.indicadoresForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadIndicadoresData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      tipoFormulario: ['', [Validators.required]],
      periodo: ['', [Validators.required]],
      provincia: ['', [Validators.required]]
    });
  }

  async loadIndicadoresData(): Promise<void> {
    this.isLoading = true;
    this.erroCarregamento = '';

    try {
      // Sem backend - dados vazios
      const evaluations: EvaluationTimeData[] = [];
      
      // Guardar todas as avaliações para calcular taxa de conclusão
      this.todasAvaliacoes = evaluations;
      
      // Filtrar apenas avaliações completas (com endTime) para métricas de tempo
      // Incluir todos os registros, mesmo com durationSeconds null ou 0
      this.evaluationTimes = evaluations.filter(e => e.endTime != null);
      
      // Calcular métricas
      this.calcularMetricas();
      
      // Preparar registros individuais para a tabela
      this.prepararRegistrosIndividuais();
      
      // Aplicar filtros iniciais
      this.aplicarFiltros();
      
      // Atualizar stats
    this.stats = {
        totalFormularios: 4, // FAE, Economic Agent, User, Training
        formulariosAtivos: 4,
        formulariosInativos: 0,
        totalRespostas: this.evaluationTimes.length,
        taxaResposta: this.taxaConclusao,
      ultimaAtualizacao: new Date()
    };
    } catch (error: any) {
      this.erroCarregamento = 'Não foi possível carregar os dados de indicadores.';
      this.evaluationTimes = [];
    } finally {
      this.isLoading = false;
    }
  }

  private calcularMetricas(): void {
    if (this.evaluationTimes.length === 0) {
      this.tempoMedioPreenchimento = '0 min 0s';
      this.tempoMaisRapido = '0 min 0s';
      this.tempoMaisLento = '0 min 0s';
      this.totalAvaliacoes = 0;
      this.taxaConclusao = 0;
      return;
    }

    // Calcular tempo médio, mínimo e máximo
    // Incluir todos os registros, mesmo com 0 segundos
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

    this.totalAvaliacoes = this.evaluationTimes.length;
    
    // Calcular taxa de conclusão (avaliações completas / total de iniciadas)
    const totalIniciadas = this.todasAvaliacoes.length;
    const totalConcluidas = this.evaluationTimes.length;
    
    this.totalAvaliacoesIniciadas = totalIniciadas;
    this.totalAvaliacoesConcluidas = totalConcluidas;
    
    if (totalIniciadas > 0) {
      this.taxaConclusao = Math.round((totalConcluidas / totalIniciadas) * 100);
    } else {
      this.taxaConclusao = 0;
    }

    // Calcular dados por formulário
    this.calcularDadosPorFormulario();
    
    // Calcular distribuição de tempos
    this.calcularDistribuicaoTempos();
  }

  private calcularDadosPorFormulario(): void {
    const formTypes = ['FAE', 'ECONOMIC_AGENT', 'USER_EVALUATION', 'TRAINING'];
    const formTypeLabels: { [key: string]: string } = {
      'FAE': 'FAE',
      'ECONOMIC_AGENT': 'Agente Econômico',
      'USER_EVALUATION': 'Utilizador',
      'TRAINING': 'Formação'
    };

    const formTypeMap: { [key: string]: string } = {
      'FAE': 'fae',
      'ECONOMIC_AGENT': 'agente-economico',
      'USER_EVALUATION': 'utilizador',
      'TRAINING': 'formacao'
    };

    this.tempoPorFormulario = [];
    this.indicadores = [];

    for (const formType of formTypes) {
      const evaluations = this.evaluationTimes.filter(e => e.formType === formType);
      
      if (evaluations.length > 0) {
        // Incluir todos os registros, mesmo com 0 segundos
        const durations = evaluations
          .map(e => e.durationSeconds || 0)
          .filter(d => d != null) as number[];

        if (durations.length > 0) {
          const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
          const minDuration = Math.min(...durations);
          const maxDuration = Math.max(...durations);

          // Adicionar ao gráfico (tempo em minutos)
          this.tempoPorFormulario.push({
            tipo: formTypeLabels[formType],
            tempo: Math.round(avgDuration / 60),
            segundos: Math.round(avgDuration)
          });

          // Adicionar à tabela
          const latestEvaluation = evaluations.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

          this.indicadores.push({
            tipoFormulario: formTypeMap[formType],
            tempoMedio: this.formatarTempo(avgDuration),
            tempoMinimo: this.formatarTempo(minDuration),
            tempoMaximo: this.formatarTempo(maxDuration),
            totalAvaliacoes: evaluations.length,
            taxaSatisfacao: 0, // Não temos dados de satisfação aqui
            ultimaAtualizacao: new Date(latestEvaluation.createdAt)
          });
        }
      }
    }
  }

  private calcularDistribuicaoTempos(): void {
    const distribuicoes = [
      { faixa: '0-5 min', min: 0, max: 300 },
      { faixa: '5-10 min', min: 300, max: 600 },
      { faixa: '10-15 min', min: 600, max: 900 },
      { faixa: '15-20 min', min: 900, max: 1200 },
      { faixa: '20-30 min', min: 1200, max: 1800 },
      { faixa: '30+ min', min: 1800, max: Infinity }
    ];

    this.distribuicaoTempos = distribuicoes.map(dist => {
      const quantidade = this.evaluationTimes.filter(e => {
        const duration = e.durationSeconds || 0;
        return duration >= dist.min && duration < dist.max;
      }).length;
      return { faixa: dist.faixa, quantidade };
    });
  }

  private formatarTempo(segundos: number): string {
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
  
  isTempoAcimaLimite(duracaoSegundos: number): boolean {
    const limiteSegundos = 180; // 3 minutos
    return duracaoSegundos > limiteSegundos;
  }

  refresh(): void {
    void this.loadIndicadoresData();
  }

  private prepararRegistrosIndividuais(): void {
    this.registrosIndividuais = this.evaluationTimes.map(e => {
      const formTypeMap: { [key: string]: string } = {
        'FAE': 'fae',
        'ECONOMIC_AGENT': 'agente-economico',
        'USER_EVALUATION': 'utilizador',
        'TRAINING': 'formacao'
      };

      return {
        id: e.id,
        tipoFormulario: formTypeMap[e.formType] || e.formType,
        tempoDuracao: this.formatarTempo(e.durationSeconds || 0),
        dataInicio: new Date(e.startTime),
        dataFim: new Date(e.endTime),
        duracaoSegundos: e.durationSeconds || 0,
        sessionId: e.sessionId,
        userIdentifier: e.userIdentifier || '-'
      };
    }).sort((a, b) => a.id - b.id); // Ordenar por ID em ordem crescente
  }

  // Filter methods
  toggleFiltros(): void {
    this.filtrosVisiveis = !this.filtrosVisiveis;
  }

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  fecharExportMenu(): void {
    this.exportMenuOpen = false;
  }

  mostrarAjuda(): void {
    console.log('Mostrar ajuda');
  }

  abrirAnaliseDetalhada(): void {
    this.mostrarAnaliseDetalhada = true;
  }

  fecharAnaliseDetalhada(): void {
    this.mostrarAnaliseDetalhada = false;
  }

  fechar(): void {
    // Emitir evento para voltar ao dashboard
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  // Filter methods
  filtrarPorTipoFormulario(event: any): void {
    this.filtroTipoFormulario = event.target.value;
    this.aplicarFiltros();
  }

  filtrarPorPeriodo(event: any): void {
    this.filtroPeriodo = event.target.value;
    this.aplicarFiltros();
  }

  filtrarPorDataInicio(event: any): void {
    this.filtroDataInicio = event.target.value;
    this.aplicarFiltros();
  }

  filtrarPorDataFim(event: any): void {
    this.filtroDataFim = event.target.value;
    this.aplicarFiltros();
  }

  filtrarPorOrdenacao(event: any): void {
    this.filtroOrdenacao = event.target.value;
    this.aplicarFiltros();
  }

  filtrarPorVisualizacao(event: any): void {
    this.filtroVisualizacao = event.target.value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let filtrados = [...this.registrosIndividuais];

    // Filtro por tipo de formulário
    if (this.filtroTipoFormulario) {
      filtrados = filtrados.filter(r => r.tipoFormulario === this.filtroTipoFormulario);
    }

    // Filtro por período
    if (this.filtroPeriodo) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      filtrados = filtrados.filter(r => {
        const dataFim = new Date(r.dataFim);
        dataFim.setHours(0, 0, 0, 0);
        
        switch (this.filtroPeriodo) {
          case 'hoje':
            return dataFim.getTime() === hoje.getTime();
          case 'semana':
            const semanaAtras = new Date(hoje);
            semanaAtras.setDate(semanaAtras.getDate() - 7);
            return dataFim >= semanaAtras;
          case 'mes':
            const mesAtras = new Date(hoje);
            mesAtras.setMonth(mesAtras.getMonth() - 1);
            return dataFim >= mesAtras;
          case 'trimestre':
            const trimestreAtras = new Date(hoje);
            trimestreAtras.setMonth(trimestreAtras.getMonth() - 3);
            return dataFim >= trimestreAtras;
          case 'ano':
            const anoAtras = new Date(hoje);
            anoAtras.setFullYear(anoAtras.getFullYear() - 1);
            return dataFim >= anoAtras;
          default:
            return true;
        }
      });
    }

    // Filtro por data início
    if (this.filtroDataInicio) {
      const dataInicio = new Date(this.filtroDataInicio);
      dataInicio.setHours(0, 0, 0, 0);
      filtrados = filtrados.filter(r => {
        const dataFim = new Date(r.dataFim);
        dataFim.setHours(0, 0, 0, 0);
        return dataFim >= dataInicio;
      });
    }

    // Filtro por data fim
    if (this.filtroDataFim) {
      const dataFim = new Date(this.filtroDataFim);
      dataFim.setHours(23, 59, 59, 999);
      filtrados = filtrados.filter(r => {
        const dataFimRegistro = new Date(r.dataFim);
        return dataFimRegistro <= dataFim;
      });
    }

    // Filtro por visualização (acima/abaixo do limite)
    if (this.filtroVisualizacao === 'acima-limite') {
      filtrados = filtrados.filter(r => this.isTempoAcimaLimite(r.duracaoSegundos));
    } else if (this.filtroVisualizacao === 'abaixo-limite') {
      filtrados = filtrados.filter(r => !this.isTempoAcimaLimite(r.duracaoSegundos));
    }

    // Ordenação
    switch (this.filtroOrdenacao) {
      case 'id-crescente':
        filtrados.sort((a, b) => a.id - b.id);
        break;
      case 'id-decrescente':
        filtrados.sort((a, b) => b.id - a.id);
        break;
      case 'tempo-crescente':
        filtrados.sort((a, b) => a.duracaoSegundos - b.duracaoSegundos);
        break;
      case 'tempo-decrescente':
        filtrados.sort((a, b) => b.duracaoSegundos - a.duracaoSegundos);
        break;
      case 'data-recente':
        filtrados.sort((a, b) => b.dataFim.getTime() - a.dataFim.getTime());
        break;
      case 'data-antiga':
        filtrados.sort((a, b) => a.dataFim.getTime() - b.dataFim.getTime());
        break;
      default:
        filtrados.sort((a, b) => a.id - b.id);
    }

    this.registrosFiltrados = filtrados;
    this.paginaAtual = 1; // Resetar para primeira página ao aplicar filtros
  }
  
  // Getter para registros paginados
  get registrosPaginados(): RegistroIndividual[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.registrosFiltrados.slice(inicio, fim);
  }
  
  // Getter para total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.registrosFiltrados.length / this.itensPorPagina);
  }
  
  // Métodos de paginação
  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }
  
  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }
  
  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }
  
  get inicioRegistro(): number {
    if (this.registrosFiltrados.length === 0) return 0;
    return (this.paginaAtual - 1) * this.itensPorPagina + 1;
  }
  
  get fimRegistro(): number {
    const fim = this.paginaAtual * this.itensPorPagina;
    return Math.min(fim, this.registrosFiltrados.length);
  }

  limparFiltros(): void {
    this.filtroTipoFormulario = '';
    this.filtroPeriodo = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.filtroOrdenacao = 'id-crescente';
    this.filtroVisualizacao = 'todos';
    this.aplicarFiltros();
  }
  
  getMediaTempo(): string {
    if (this.registrosFiltrados.length === 0) return '0s';
    const total = this.registrosFiltrados.reduce((sum, r) => sum + r.duracaoSegundos, 0);
    const media = total / this.registrosFiltrados.length;
    return this.formatarTempo(media);
  }
  
  getTempoMaisAlto(): string {
    if (this.registrosFiltrados.length === 0) return '0s';
    const max = Math.max(...this.registrosFiltrados.map(r => r.duracaoSegundos));
    return this.formatarTempo(max);
  }
  
  getTempoMaisCurto(): string {
    if (this.registrosFiltrados.length === 0) return '0s';
    const min = Math.min(...this.registrosFiltrados.map(r => r.duracaoSegundos));
    return this.formatarTempo(min);
  }
  
  getTotalRegistrosFiltrados(): number {
    return this.registrosFiltrados.length;
  }
  
  getRegistrosAcimaLimite(): number {
    return this.registrosFiltrados.filter(r => this.isTempoAcimaLimite(r.duracaoSegundos)).length;
  }

  // Export methods
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

  // Helper methods for labels and classes
  getFormTypeLabel(tipoFormulario: string): string {
    const labels: { [key: string]: string } = {
      'fae': 'FAE',
      'agente-economico': 'Agente Econômico',
      'utilizador': 'Utilizador',
      'formacao': 'Formação'
    };
    return labels[tipoFormulario] || tipoFormulario;
  }

  getFormTypeClass(tipoFormulario: string): string {
    const classes: { [key: string]: string } = {
      'fae': 'fae',
      'agente-economico': 'agente-economico',
      'utilizador': 'utilizador',
      'formacao': 'formacao'
    };
    return classes[tipoFormulario] || 'fae';
  }

  getBarClass(tipo: string): string {
    const classes: { [key: string]: string } = {
      'FAE': 'fae',
      'Agente Econômico': 'agente-economico',
      'Utilizador': 'utilizador',
      'Formação': 'formacao'
    };
    return classes[tipo] || 'fae';
  }

  getSatisfactionClass(taxaSatisfacao: number): string {
    if (taxaSatisfacao >= 90) return 'high';
    if (taxaSatisfacao >= 80) return 'medium';
    return 'low';
  }

  // Propriedades calculadas para gráficos
  get tempoMaximo(): number {
    if (this.tempoPorFormulario.length === 0) return 1;
    return Math.max(...this.tempoPorFormulario.map(item => Number(item.tempo) || 0), 1);
  }

  get quantidadeMaxima(): number {
    return Math.max(...this.distribuicaoTempos.map(item => item.quantidade));
  }
}
