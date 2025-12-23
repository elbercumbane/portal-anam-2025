import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
import { ExportService, ExportColumn } from '../../services/export.service';
import { ServiceViewHelpModalComponent } from '../../components/modals/service-view-help-modal/service-view-help-modal.component';
import { AtendimentoConsolidado } from './service-view.types';

@Component({
  selector: 'app-service-view',
  
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.scss']
})
export class ServiceViewComponent implements OnInit, OnDestroy {
  @Output() navigationClick = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();
  
  filtroForm: FormGroup;
  isLoading = false;
  filtrosVisiveis = false;
  @ViewChild('helpModal') helpModal!: ServiceViewHelpModalComponent;
  exportMenuOpen = false;
  
  // Dados consolidados
  atendimentos: AtendimentoConsolidado[] = [];
  atendimentosFiltrados: AtendimentoConsolidado[] = [];
  todosAtendimentos: AtendimentoConsolidado[] = [];
  
  // Estatísticas
  estatisticas = {
    totalAvaliacoes: 0,
    avaliacaoMaxima: 5.0,
    ultimaAvaliacao: 'Nunca'
  };
  totalFiltrados = 0;
  paginaAtual = 1;
  pageSizeOptions: number[] = [50, 150, 500, 750];
  itensPorPagina = this.pageSizeOptions[0];
  totalPaginas = 1;

  // Filtros selecionados
  filtroTipoFormulario = '';
  filtroGrauSatisfacao = '';
  filtroProblemaResolvido = '';
  filtroTipoProblema = '';
  filtroServico = '';
  filtroAgradou = '';
  filtroNaoAgradou = '';
  filtroProvincia = '';
  filtroDataInicio = '';
  filtroDataFim = '';

  constructor(
    private fb: FormBuilder,
    // ApiService removido
    private exportService: ExportService
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
    this.carregarDados();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async carregarDados(): Promise<void> {
    this.isLoading = true;
    this.atendimentos = [];
    this.todosAtendimentos = [];

    try {
      // Sem backend - dados vazios
      const [dadosFae, dadosAgente, dadosUtilizador] = await Promise.all([
        Promise.resolve([]),
        Promise.resolve([]),
        Promise.resolve([])
      ]);

      const atendimentosFae = (dadosFae || []).map((item, index) => this.mapFae(item, index));
      const atendimentosAgente = (dadosAgente || []).map((item, index) => this.mapAgenteEconomico(item, index));
      const atendimentosUtilizador = (dadosUtilizador || []).map((item, index) => this.mapUtilizador(item, index));

      const todos = [
        ...atendimentosFae,
        ...atendimentosAgente,
        ...atendimentosUtilizador
      ].sort((a, b) => b.dataSubmissao.getTime() - a.dataSubmissao.getTime());

      this.todosAtendimentos = todos;
      this.atendimentosFiltrados = [...todos];
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    } catch (error) {
      console.error('Erro ao carregar atendimentos consolidados:', error);
    } finally {
      this.isLoading = false;
    }
  }

  calcularEstatisticas(): void {
    this.estatisticas.totalAvaliacoes = this.totalFiltrados;
    this.estatisticas.ultimaAvaliacao = this.totalFiltrados > 0 ? 'Hoje' : 'Nunca';
  }

  aplicarFiltros(): void {
    const dataInicio = this.filtroDataInicio ? this.normalizarData(this.filtroDataInicio, false) : null;
    const dataFim = this.filtroDataFim ? this.normalizarData(this.filtroDataFim, false) : null;

    if (dataInicio && dataFim && dataInicio > dataFim) {
      console.warn('Data início não pode ser superior à data fim.');
      return;
    }

    const normalizar = (valor: string) => this.normalizarOpcao(valor);

    this.atendimentosFiltrados = this.todosAtendimentos.filter((atendimento) => {
      if (this.filtroTipoFormulario && atendimento.tipoFormulario !== this.filtroTipoFormulario) {
        return false;
      }

      if (this.filtroGrauSatisfacao && atendimento.grauSatisfacao !== this.filtroGrauSatisfacao) {
        return false;
      }

      if (this.filtroProblemaResolvido && atendimento.problemaResolvido !== this.filtroProblemaResolvido) {
        return false;
      }

      if (this.filtroTipoProblema) {
        const tipoProblemaNormalizado = normalizar(atendimento.tipoProblema);
        if (!tipoProblemaNormalizado.includes(this.filtroTipoProblema)) {
          return false;
        }
      }

      if (this.filtroServico) {
        if (normalizar(atendimento.servico) !== this.filtroServico) {
          return false;
        }
      }

      if (this.filtroAgradou) {
        if (normalizar(atendimento.agradou) !== this.filtroAgradou) {
          return false;
        }
      }

      if (this.filtroNaoAgradou) {
        if (normalizar(atendimento.naoAgradou) !== this.filtroNaoAgradou) {
          return false;
        }
      }

      if (this.filtroProvincia) {
        if (normalizar(atendimento.provincia) !== this.filtroProvincia) {
          return false;
        }
      }

      if (dataInicio && atendimento.dataSubmissao < dataInicio) {
        return false;
      }

      if (dataFim) {
        const fimAjustado = new Date(dataFim);
        fimAjustado.setHours(23, 59, 59, 999);
        if (atendimento.dataSubmissao > fimAjustado) {
          return false;
        }
      }

      return true;
    });

    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  exportarDados(): void {
    // Implementar exportação
    console.log('Exportando dados...');
  }

  getTodosDados(): any[] {
    return this.atendimentos;
  }

  // Template methods
  refresh(): void {
    void this.carregarDados();
  }

  toggleFiltros(): void {
    this.filtrosVisiveis = !this.filtrosVisiveis;
  }

  fecharExportMenu(): void {
    this.exportMenuOpen = false;
  }

  mostrarAjuda(): void {
    setTimeout(() => {
      if (this.helpModal) {
        this.helpModal.open();
      }
    }, 0);
  }

  fechar(): void {
    // Method to close
  }

  filtrarPorTipoFormulario(event: Event): void {
    this.filtroTipoFormulario = (event.target as HTMLSelectElement).value;
  }

  filtrarPorAvaliacao(event: Event): void {
    this.filtroGrauSatisfacao = (event.target as HTMLSelectElement).value;
  }

  filtrarPorResolvido(event: Event): void {
    this.filtroProblemaResolvido = (event.target as HTMLSelectElement).value;
  }

  filtrarPorProblema(event: Event): void {
    this.filtroTipoProblema = (event.target as HTMLSelectElement).value;
  }

  filtrarPorServico(event: Event): void {
    this.filtroServico = (event.target as HTMLSelectElement).value;
  }

  filtrarPorAgradou(event: Event): void {
    this.filtroAgradou = (event.target as HTMLSelectElement).value;
  }

  filtrarPorNaoAgradou(event: Event): void {
    this.filtroNaoAgradou = (event.target as HTMLSelectElement).value;
  }

  filtrarPorProvincia(event: Event): void {
    this.filtroProvincia = (event.target as HTMLSelectElement).value;
  }

  filtrarPorDataInicio(event: Event): void {
    this.filtroDataInicio = (event.target as HTMLInputElement).value;
  }

  filtrarPorDataFim(event: Event): void {
    this.filtroDataFim = (event.target as HTMLInputElement).value;
  }

  limparFiltros(): void {
    this.filtroTipoFormulario = '';
    this.filtroGrauSatisfacao = '';
    this.filtroProblemaResolvido = '';
    this.filtroTipoProblema = '';
    this.filtroServico = '';
    this.filtroAgradou = '';
    this.filtroNaoAgradou = '';
    this.filtroProvincia = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.filtroForm.reset({
      dataInicio: '',
      dataFim: '',
      provincia: '',
      tipoFormulario: '',
      grauSatisfacao: ''
    });
    this.atendimentosFiltrados = [...this.todosAtendimentos];
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  exportarExcel(): void {
    this.exportService.exportToExcel(
      'atendimentos_consolidados',
      this.getExportColumns(),
      this.getExportDataset(),
      'Atendimentos Consolidados'
    );
    this.exportMenuOpen = false;
  }

  exportarWord(): void {
    this.exportService.exportToWord(
      'atendimentos_consolidados',
      'Atendimentos Consolidados',
      this.getExportColumns(),
      this.getExportDataset()
    );
    this.exportMenuOpen = false;
  }

  exportarPdf(): void {
    this.exportService.exportToPdf(
      'atendimentos_consolidados',
      'Atendimentos Consolidados',
      this.getExportColumns(),
      this.getExportDataset()
    );
    this.exportMenuOpen = false;
  }

  getFormTypeLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'fae': 'FAE',
      'agente-economico': 'Agente Econômico',
      'utilizador': 'Utilizador'
    };
    return labels[tipo] || 'Outro';
  }

  getFormTypeClass(tipo: string): string {
    const classes: Record<string, string> = {
      'fae': 'form-fae',
      'agente-economico': 'form-agente',
      'utilizador': 'form-utilizador'
    };
    return classes[tipo] || 'form-outro';
  }

  getSatisfactionLabel(grauSatisfacao: string): string {
    const labels: Record<string, string> = {
      'muito-satisfeito': 'Muito Satisfeito',
      'satisfeito': 'Satisfeito',
      'neutro': 'Neutro',
      'insatisfeito': 'Insatisfeito',
      'muito-insatisfeito': 'Muito Insatisfeito'
    };
    return labels[grauSatisfacao] || this.formatarTexto(grauSatisfacao);
  }

  getSatisfactionClass(grauSatisfacao: string): string {
    const classes: Record<string, string> = {
      'muito-satisfeito': 'muito-satisfeito',
      'satisfeito': 'satisfeito',
      'neutro': 'neutro',
      'insatisfeito': 'insatisfeito',
      'muito-insatisfeito': 'muito-insatisfeito'
    };
    return classes[grauSatisfacao] || 'neutro';
  }

  getProblemaResolvidoLabel(resolvido: string): string {
    if (!resolvido) {
      return 'Não informado';
    }
    const valor = resolvido.trim().toLowerCase();
    return valor === 'sim' || valor === 'yes' ? 'Sim' : 'Não';
  }

  getServiceLabel(servico: string): string {
    if (!servico) {
      return '';
    }
    const labels: Record<string, string> = {
      'atendimento-presencial': 'Atendimento Presencial',
      'atendimento-telefonico': 'Atendimento Telefônico',
      'atendimento-online': 'Atendimento Online',
      'consultoria': 'Consultoria',
      'formacao': 'Formação',
      'suporte-tecnico': 'Suporte Técnico'
    };
    return labels[servico] || this.formatarTexto(servico);
  }

  getServiceClass(servico: string): string {
    const classes: Record<string, string> = {
      'atendimento-presencial': 'atendimento-presencial',
      'atendimento-telefonico': 'atendimento-telefonico',
      'atendimento-online': 'atendimento-online',
      'consultoria': 'consultoria',
      'formacao': 'formacao',
      'suporte-tecnico': 'suporte-tecnico'
    };
    return classes[servico] || 'atendimento-presencial';
  }

  getAgradouLabel(agradou: string): string {
    const labels: Record<string, string> = {
      'atendimento': 'Atendimento',
      'rapidez': 'Rapidez',
      'localizacao': 'Localização',
      'localização': 'Localização',
      'funcionarios': 'Funcionários',
      'funcionários': 'Funcionários',
      'processo': 'Processo'
    };
    const chave = agradou ? agradou.toLowerCase() : '';
    return labels[chave] || this.formatarTexto(agradou);
  }

  getNaoAgradouLabel(naoAgradou: string): string {
    const labels: Record<string, string> = {
      'demora': 'Demora',
      'informacao': 'Falta de Informação',
      'informação': 'Falta de Informação',
      'documentacao': 'Documentação',
      'documentação': 'Documentação',
      'localizacao': 'Localização',
      'localização': 'Localização',
      'funcionarios': 'Funcionários',
      'funcionários': 'Funcionários'
    };
    const chave = naoAgradou ? naoAgradou.toLowerCase() : '';
    return labels[chave] || this.formatarTexto(naoAgradou);
  }

  private getExportDataset(): AtendimentoConsolidado[] {
    if (this.atendimentosFiltrados && this.atendimentosFiltrados.length > 0) {
      return this.atendimentosFiltrados;
    }
    if (this.todosAtendimentos && this.todosAtendimentos.length > 0) {
      return this.todosAtendimentos;
    }
    return this.atendimentos || [];
  }

  private getExportColumns(): ExportColumn[] {
    return [
      { key: 'id', label: 'ID' },
      { key: 'tipoFormulario', label: 'Tipo de Formulário', transform: (row) => this.getFormTypeLabel(row?.tipoFormulario) },
      { key: 'grauSatisfacao', label: 'Grau de Satisfação', transform: (row) => this.getSatisfactionLabel(row?.grauSatisfacao) },
      { key: 'problemaResolvido', label: 'Problema Resolvido', transform: (row) => this.getProblemaResolvidoLabel(row?.problemaResolvido) },
      { key: 'tipoProblema', label: 'Tipo de Problema' },
      { key: 'servico', label: 'Serviço', transform: (row) => this.getServiceLabel(row?.servico) },
      { key: 'agradou', label: 'O que Agradou', transform: (row) => this.getAgradouLabel(row?.agradou) },
      { key: 'naoAgradou', label: 'O que Não Agradou', transform: (row) => this.getNaoAgradouLabel(row?.naoAgradou) },
      { key: 'provincia', label: 'Província' },
      { key: 'observacoes', label: 'Observações', transform: (row) => row?.observacoes || '-' },
      { key: 'dataSubmissao', label: 'Data/Hora', transform: (row) => this.formatDateTime(row?.dataSubmissao) }
    ];
  }

  private mapFae(item: any, index: number): AtendimentoConsolidado {
    const grauSatisfacao = this.normalizarGrauSatisfacao(item?.serviceRating ?? item?.grauSatisfacao ?? item?.satisfacao);
    const problemaResolvido = this.normalizarProblemaResolvido(item?.problemResolved ?? item?.problemaResolvido ?? item?.resolvido);
    const observacoes = this.compactarObservacoes({
      problema: item?.observacoesProblema ?? item?.problemObservations,
      agradou: item?.observacoesAgradou ?? item?.likeObservations,
      naoAgradou: item?.observacoesNaoAgradou ?? item?.dislikeObservations
    });

    return {
      id: this.criarId('FAE', item?.id, index),
      tipoFormulario: 'fae',
      grauSatisfacao,
      problemaResolvido,
      tipoProblema: this.formatarTexto(item?.problem ?? item?.tipoProblema ?? item?.problema),
      servico: '',
      agradou: this.normalizarOpcao(item?.likeReason ?? item?.agradou ?? item?.oQueAgradou),
      naoAgradou: this.normalizarOpcao(item?.dislikeReason ?? item?.naoAgradou ?? item?.oQueNaoAgradou),
      provincia: this.formatarProvincia(item?.province ?? item?.provincia),
      observacoes,
      dataSubmissao: this.normalizarData(item?.createdAt ?? item?.dataSubmissao ?? item?.data)
    };
  }

  private mapAgenteEconomico(item: any, index: number): AtendimentoConsolidado {
    const grauSatisfacao = this.normalizarGrauSatisfacao(item?.serviceRating ?? item?.grauSatisfacao ?? item?.satisfacao);
    const problemaResolvido = this.normalizarProblemaResolvido(item?.problemResolved ?? item?.problemaResolvido ?? item?.resolvido);
    const observacoes = this.compactarObservacoes({
      problema: item?.problemObservations ?? item?.observacoesProblema,
      agradou: item?.likeObservations ?? item?.observacoesAgradou,
      naoAgradou: item?.dislikeObservations ?? item?.observacoesNaoAgradou
    });

    return {
      id: this.criarId('AE', item?.id, index),
      tipoFormulario: 'agente-economico',
      grauSatisfacao,
      problemaResolvido,
      tipoProblema: this.formatarTexto(item?.problem ?? item?.tipoProblema ?? item?.problema),
      servico: '',
      agradou: this.normalizarOpcao(item?.likeReason ?? item?.agradou ?? item?.oQueAgradou),
      naoAgradou: this.normalizarOpcao(item?.dislikeReason ?? item?.naoAgradou ?? item?.oQueNaoAgradou),
      provincia: this.formatarProvincia(item?.province ?? item?.provincia),
      observacoes,
      dataSubmissao: this.normalizarData(item?.createdAt ?? item?.dataSubmissao ?? item?.data)
    };
  }

  private mapUtilizador(item: any, index: number): AtendimentoConsolidado {
    const grauSatisfacao = this.normalizarGrauSatisfacao(item?.serviceRating ?? item?.grauSatisfacao ?? item?.satisfacao);
    const problemaResolvido = this.normalizarProblemaResolvido(item?.problemResolved ?? item?.problemaResolvido ?? item?.resolvido);
    const observacoes = this.compactarObservacoes({
      problema: item?.problemObservations ?? item?.observacoesProblema,
      agradou: item?.likeObservations ?? item?.observacoesAgradou,
      naoAgradou: item?.dislikeObservations ?? item?.observacoesNaoAgradou
    });

    return {
      id: this.criarId('U', item?.id, index),
      tipoFormulario: 'utilizador',
      grauSatisfacao,
      problemaResolvido,
      tipoProblema: this.formatarTexto(item?.problem ?? item?.tipoProblema ?? item?.problema),
      servico: this.normalizarOpcao(item?.system ?? item?.servico ?? item?.serviceType),
      agradou: this.normalizarOpcao(item?.likeReason ?? item?.agradou ?? item?.oQueAgradou),
      naoAgradou: this.normalizarOpcao(item?.dislikeReason ?? item?.naoAgradou ?? item?.oQueNaoAgradou),
      provincia: this.formatarProvincia(item?.province ?? item?.provincia),
      observacoes,
      dataSubmissao: this.normalizarData(item?.createdAt ?? item?.dataSubmissao ?? item?.data)
    };
  }

  private criarId(prefixo: string, idOriginal: any, index: number): string {
    if (typeof idOriginal === 'string') {
      return idOriginal;
    }
    if (typeof idOriginal === 'number') {
      return `${prefixo}${String(idOriginal).padStart(3, '0')}`;
    }
    return `${prefixo}${String(index + 1).padStart(3, '0')}`;
  }

  private normalizarGrauSatisfacao(valor: string): string {
    if (!valor) {
      return '';
    }
    const ratingMap: Record<string, string> = {
      'muito-satisfeito': 'muito-satisfeito',
      'muito_satisfeito': 'muito-satisfeito',
      'muitosatisfeito': 'muito-satisfeito',
      'muito satisfeito': 'muito-satisfeito',
      'very-satisfied': 'muito-satisfeito',
      'very_satisfied': 'muito-satisfeito',
      'verysatisfied': 'muito-satisfeito',
      'very satisfied': 'muito-satisfeito',
      'satisfeito': 'satisfeito',
      'satisfied': 'satisfeito',
      'neutro': 'neutro',
      'neutral': 'neutro',
      'insatisfeito': 'insatisfeito',
      'dissatisfied': 'insatisfeito',
      'muito-insatisfeito': 'muito-insatisfeito',
      'muito_insatisfeito': 'muito-insatisfeito',
      'muito insatisfeito': 'muito-insatisfeito',
      'very-dissatisfied': 'muito-insatisfeito',
      'very_dissatisfied': 'muito-insatisfeito',
      'very dissatisfied': 'muito-insatisfeito'
    };
    const chave = valor.toString().toLowerCase().trim();
    if (ratingMap[chave]) {
      return ratingMap[chave];
    }

    if ((chave.includes('very') || chave.includes('muito')) && (chave.includes('satisfied') || chave.includes('satisfeito'))) {
      return 'muito-satisfeito';
    }
    if ((chave.includes('very') || chave.includes('muito')) && (chave.includes('dissatisfied') || chave.includes('insatisfeito'))) {
      return 'muito-insatisfeito';
    }
    if (chave.includes('satisfeito') || chave.includes('satisfied')) {
      return 'satisfeito';
    }
    if (chave.includes('insatisfeito') || chave.includes('dissatisfied')) {
      return 'insatisfeito';
    }
    if (chave.includes('neutro') || chave.includes('neutral')) {
      return 'neutro';
    }
    return 'neutro';
  }

  private normalizarProblemaResolvido(valor: string): string {
    if (!valor) {
      return 'nao';
    }
    const chave = valor.toString().toLowerCase().trim();
    if (['sim', 'yes', 'y', 'true', '1'].includes(chave)) {
      return 'sim';
    }
    return 'nao';
  }

  private normalizarData(valor: any, fallbackNow: boolean = true): Date {
    if (!valor) {
      return fallbackNow ? new Date() : new Date('1970-01-01');
    }
    const data = valor instanceof Date ? valor : new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return fallbackNow ? new Date() : new Date('1970-01-01');
    }
    return data;
  }

  private formatarProvincia(provincia: string): string {
    if (!provincia) {
      return '';
    }
    return provincia
      .toString()
      .split(' ')
      .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
      .join(' ');
  }

  private formatarTexto(texto: string): string {
    if (!texto) {
      return '';
    }
    return texto
      .toString()
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  private normalizarOpcao(valor: string): string {
    if (!valor) {
      return '';
    }
    return valor
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .trim();
  }

  private compactarObservacoes(partes: { [key: string]: string | undefined }): string {
    const mensagens: string[] = [];

    if (partes['problema']) {
      mensagens.push(`Problema: ${partes['problema']}`);
    }
    if (partes['agradou']) {
      mensagens.push(`Agradou: ${partes['agradou']}`);
    }
    if (partes['naoAgradou']) {
      mensagens.push(`Não agradou: ${partes['naoAgradou']}`);
    }
    if (partes['geral']) {
      mensagens.push(partes['geral'] as string);
    }

    return mensagens.join(' | ');
  }

  private formatDate(valor: Date | string): string {
    if (!valor) return '';
    const data = valor instanceof Date ? valor : new Date(valor);
    if (isNaN(data.getTime())) return '';
    return data.toLocaleDateString('pt-MZ');
  }

  private formatTime(valor: Date | string): string {
    if (!valor) return '';
    const data = valor instanceof Date ? valor : new Date(valor);
    if (isNaN(data.getTime())) return '';
    return data.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private formatDateTime(valor: Date | string): string {
    const data = this.formatDate(valor);
    const hora = this.formatTime(valor);
    return [data, hora].filter(Boolean).join(' ');
  }

  private atualizarPaginacao(): void {
    this.totalFiltrados = this.atendimentosFiltrados.length;
    this.totalPaginas = Math.max(1, Math.ceil(this.totalFiltrados / this.itensPorPagina));

    if (this.paginaAtual > this.totalPaginas) {
      this.paginaAtual = this.totalPaginas;
    }
    if (this.paginaAtual < 1) {
      this.paginaAtual = 1;
    }

    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.atendimentos = this.atendimentosFiltrados.slice(inicio, fim);
    this.calcularEstatisticas();
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.atualizarPaginacao();
    }
  }

  alterarItensPorPagina(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value) && value > 0 && value !== this.itensPorPagina) {
      this.itensPorPagina = value;
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    }
  }

  irParaPrimeiraPagina(): void {
    if (this.paginaAtual !== 1) {
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    }
  }

  irParaUltimaPagina(): void {
    if (this.paginaAtual !== this.totalPaginas) {
      this.paginaAtual = this.totalPaginas;
      this.atualizarPaginacao();
    }
  }

  irParaInicioDaPagina(): void {
    this.scrollToPosition(0);
  }

  irParaFimDaPagina(): void {
    if (typeof document === 'undefined') {
      return;
    }
    const height = document.documentElement?.scrollHeight || document.body?.scrollHeight || 0;
    this.scrollToPosition(height);
  }

  private scrollToPosition(position: number): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }
}
