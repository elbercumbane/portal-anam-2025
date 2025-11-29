import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { ExportService, ExportColumn } from '../../services/export.service';
import { UserHelpModalComponent } from '../../components/modals/user-help-modal/user-help-modal.component';

interface UtilizadorStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

interface RatingItem {
  id: string;
  label: string;
  value: number;
}

interface UtilizadorStatistics {
  mediaGeral: number;
  totalAvaliacoes: number;
  avaliacaoMaxima: number;
  ultimaAvaliacao: string;
}

interface Submission {
  id: string;
  instituicao: string;
  dataSubmissao: Date;
  status: string;
}

@Component({
  selector: 'app-user',
  
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() navigationClick = new EventEmitter<any>();
  @ViewChild('helpModal') helpModal!: UserHelpModalComponent;
  
  utilizadorForm: FormGroup;
  
  // Propriedades para filtros e tabelas
  filtrosVisiveis = false;
  exportMenuOpen = false;
  
  stats: UtilizadorStats = {
    totalFormularios: 0,
    formulariosAtivos: 0,
    formulariosInativos: 0,
    totalRespostas: 0,
    taxaResposta: 0,
    ultimaAtualizacao: new Date()
  };

  ratingItems: RatingItem[] = [
    { id: 'qualidade-servico', label: 'Qualidade do Serviço', value: 3 },
    { id: 'tempo-resposta', label: 'Tempo de Resposta', value: 3 },
    { id: 'atendimento', label: 'Atendimento', value: 3 },
    { id: 'infraestrutura', label: 'Infraestrutura', value: 3 },
    { id: 'profissionalismo', label: 'Profissionalismo', value: 3 },
    { id: 'satisfacao-geral', label: 'Satisfação Geral', value: 3 }
  ];

  utilizadorStats: UtilizadorStatistics = {
    mediaGeral: 4.2,
    totalAvaliacoes: 0,
    avaliacaoMaxima: 5.0,
    ultimaAvaliacao: 'Nunca'
  };

  avaliacoes: any[] = [];
  avaliacoesPaginadas: any[] = [];
  private readonly fallbackAvaliacoes: any[] = [
    {
      id: 'U001',
      grauSatisfacao: 'muito-satisfeito',
      problemaResolvido: 'sim',
      tipoProblema: 'Demora no Atendimento',
      servico: 'atendimento-presencial',
      agradou: 'atendimento',
      naoAgradou: 'demora',
      provincia: 'Maputo',
      observacoes: 'Atendimento muito profissional e eficiente',
      dataSubmissao: new Date('2025-09-25')
    },
    {
      id: 'U002',
      grauSatisfacao: 'satisfeito',
      problemaResolvido: 'nao',
      tipoProblema: 'Falta de Informação',
      servico: 'atendimento-telefonico',
      agradou: 'rapidez',
      naoAgradou: 'informacao',
      provincia: 'Gaza',
      observacoes: 'Processo rápido mas faltou informação inicial',
      dataSubmissao: new Date('2025-09-24')
    },
    {
      id: 'U003',
      grauSatisfacao: 'neutro',
      problemaResolvido: 'sim',
      tipoProblema: 'Documentação',
      servico: 'atendimento-online',
      agradou: 'localizacao',
      naoAgradou: 'documentacao',
      provincia: 'Inhambane',
      observacoes: 'Localização boa mas documentação confusa',
      dataSubmissao: new Date('2025-09-23')
    },
    {
      id: 'U004',
      grauSatisfacao: 'insatisfeito',
      problemaResolvido: 'nao',
      tipoProblema: 'Localização',
      servico: 'consultoria',
      agradou: 'funcionarios',
      naoAgradou: 'localizacao',
      provincia: 'Sofala',
      observacoes: 'Funcionários atenciosos mas localização difícil',
      dataSubmissao: new Date('2025-09-22')
    },
    {
      id: 'U005',
      grauSatisfacao: 'muito-insatisfeito',
      problemaResolvido: 'sim',
      tipoProblema: 'Funcionários',
      servico: 'formacao',
      agradou: 'processo',
      naoAgradou: 'funcionarios',
      provincia: 'Manica',
      observacoes: 'Processo bem estruturado mas funcionários mal preparados',
      dataSubmissao: new Date('2025-09-21')
    },
    {
      id: 'U006',
      grauSatisfacao: 'satisfeito',
      problemaResolvido: 'sim',
      tipoProblema: 'Suporte Técnico',
      servico: 'suporte-tecnico',
      agradou: 'rapidez',
      naoAgradou: 'informacao',
      provincia: 'Tete',
      observacoes: 'Suporte técnico eficiente e rápido',
      dataSubmissao: new Date('2025-09-20')
    }
  ];

  recentSubmissions: Submission[] = [
    {
      id: '1',
      instituicao: 'Instituto Nacional de Estatística',
      dataSubmissao: new Date(Date.now() - 1000 * 60 * 30),
      status: 'Concluído'
    },
    {
      id: '2',
      instituicao: 'Ministério da Educação',
      dataSubmissao: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'Em Análise'
    },
    {
      id: '3',
      instituicao: 'Banco de Moçambique',
      dataSubmissao: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'Concluído'
    },
    {
      id: '4',
      instituicao: 'Autoridade Tributária',
      dataSubmissao: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: 'Pendente'
    }
  ];

  pageSizeOptions: number[] = [50, 150, 500, 750];
  itensPorPagina = this.pageSizeOptions[0];
  paginaAtual = 1;
  totalPaginas = 1;

  constructor(
    private fb: FormBuilder,
    // ApiService removido
    private exportService: ExportService
  ) {
    this.utilizadorForm = this.createForm();
  }

  ngOnInit(): void {
    void this.loadUtilizadorData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nomeInstituicao: ['', [Validators.required, Validators.minLength(3)]],
      numeroIdentificacao: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      comentarios: ['']
    });
  }

  async loadUtilizadorData(): Promise<void> {
    try {
      // Sem backend - dados vazios
      const dados: any[] = [];
      const mapeados = (dados || []).map((item: any, index: number) => this.mapApiAvaliacao(item, index));

      if (mapeados.length > 0) {
        this.avaliacoes = mapeados;
      } else {
        this.avaliacoes = this.getFallbackAvaliacoes();
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações de utilizador:', error);
      this.avaliacoes = this.getFallbackAvaliacoes();
    } finally {
      if (this.avaliacoes.length === 0) {
        this.avaliacoes = this.getFallbackAvaliacoes();
      }
      this.atualizarPaginacao();
      this.atualizarEstatisticas();
    }
  }

  createNewUtilizador(): void {
    this.resetForm();
    console.log('Creating new Utilizador');
  }

  onRatingChange(ratingId: string, event: any): void {
    const value = event.value || event;
    const ratingItem = this.ratingItems.find(item => item.id === ratingId);
    if (ratingItem) {
      ratingItem.value = value;
    }
  }

  onSubmit(): void {
    if (this.utilizadorForm.valid) {
      const formData = {
        ...this.utilizadorForm.value,
        ratings: this.ratingItems.map(item => ({ id: item.id, value: item.value }))
      };
      console.log('Utilizador Submitted:', formData);
      this.resetForm();
    } else {
      console.log('Formulário inválido');
    }
  }

  resetForm(): void {
    this.utilizadorForm.reset();
    this.ratingItems.forEach(item => item.value = 3);
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'Concluído': 'primary',
      'Em Análise': 'accent',
      'Pendente': 'warn'
    };
    return statusColors[status] || 'primary';
  }

  // Filter methods
  refresh(): void {
    void this.loadUtilizadorData();
  }

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
    setTimeout(() => {
      if (this.helpModal) {
        this.helpModal.open();
      }
    }, 0);
  }

  fechar(): void {
    // Emitir evento para voltar ao dashboard
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  // Filter methods
  filtrarPorAvaliacao(): void {
    console.log('Filtrar por avaliação');
  }

  filtrarPorProblema(): void {
    console.log('Filtrar por problema');
  }

  filtrarPorResolvido(): void {
    console.log('Filtrar por resolvido');
  }

  filtrarPorServico(): void {
    console.log('Filtrar por serviço');
  }

  filtrarPorAgradou(): void {
    console.log('Filtrar por agradou');
  }

  filtrarPorNaoAgradou(): void {
    console.log('Filtrar por não agradou');
  }

  filtrarPorProvincia(): void {
    console.log('Filtrar por província');
  }

  filtrarPorDataInicio(): void {
    console.log('Filtrar por data início');
  }

  filtrarPorDataFim(): void {
    console.log('Filtrar por data fim');
  }

  aplicarFiltros(): void {
    console.log('Aplicar filtros');
  }

  limparFiltros(): void {
    console.log('Limpar filtros');
  }

  // Export methods
  exportarExcel(): void {
    this.exportService.exportToExcel('utilizador_avaliacoes', this.getExportColumns(), this.getExportDataset(), 'Avaliações Utilizador');
    this.exportMenuOpen = false;
  }

  exportarWord(): void {
    this.exportService.exportToWord('utilizador_avaliacoes', 'Avaliações Utilizador', this.getExportColumns(), this.getExportDataset());
    this.exportMenuOpen = false;
  }

  exportarPdf(): void {
    this.exportService.exportToPdf('utilizador_avaliacoes', 'Avaliações Utilizador', this.getExportColumns(), this.getExportDataset());
    this.exportMenuOpen = false;
  }

  // Helper methods for labels
  getAgradouLabel(agradou: string): string {
    const labels: { [key: string]: string } = {
      'atendimento': 'Atendimento',
      'rapidez': 'Rapidez',
      'localizacao': 'Localização',
      'funcionarios': 'Funcionários',
      'processo': 'Processo'
    };
    const chave = (agradou || '').toLowerCase();
    return labels[chave] || this.formatarTexto(agradou);
  }

  getNaoAgradouLabel(naoAgradou: string): string {
    const labels: { [key: string]: string } = {
      'demora': 'Demora',
      'informacao': 'Falta de Informação',
      'documentacao': 'Documentação',
      'localizacao': 'Localização',
      'funcionarios': 'Funcionários'
    };
    const chave = (naoAgradou || '').toLowerCase();
    return labels[chave] || this.formatarTexto(naoAgradou);
  }

  getProblemaResolvidoLabel(resolvido: string): string {
    return this.normalizarProblemaResolvido(resolvido) === 'sim' ? 'Sim' : 'Não';
  }

  getSatisfactionLabel(grauSatisfacao: string): string {
    const labels: { [key: string]: string } = {
      'muito-satisfeito': 'Muito Satisfeito',
      'satisfeito': 'Satisfeito',
      'neutro': 'Neutro',
      'insatisfeito': 'Insatisfeito',
      'muito-insatisfeito': 'Muito Insatisfeito'
    };
    const chave = this.normalizarGrauSatisfacao(grauSatisfacao);
    return labels[chave] || this.formatarTexto(grauSatisfacao);
  }

  getSatisfactionClass(grauSatisfacao: string): string {
    const classes: { [key: string]: string } = {
      'muito-satisfeito': 'muito-satisfeito',
      'satisfeito': 'satisfeito',
      'neutro': 'neutro',
      'insatisfeito': 'insatisfeito',
      'muito-insatisfeito': 'muito-insatisfeito'
    };
    const chave = this.normalizarGrauSatisfacao(grauSatisfacao);
    return classes[chave] || 'neutro';
  }

  getServiceLabel(servico: string): string {
    const labels: { [key: string]: string } = {
      'atendimento-presencial': 'Atendimento Presencial',
      'atendimento-telefonico': 'Atendimento Telefônico',
      'atendimento-online': 'Atendimento Online',
      'consultoria': 'Consultoria',
      'formacao': 'Formação',
      'suporte-tecnico': 'Suporte Técnico'
    };
    const chave = this.normalizarOpcao(servico);
    return labels[chave] || this.formatarTexto(servico);
  }

  getServiceClass(servico: string): string {
    const classes: { [key: string]: string } = {
      'atendimento-presencial': 'atendimento-presencial',
      'atendimento-telefonico': 'atendimento-telefonico',
      'atendimento-online': 'atendimento-online',
      'consultoria': 'consultoria',
      'formacao': 'formacao',
      'suporte-tecnico': 'suporte-tecnico'
    };
    const chave = this.normalizarOpcao(servico);
    return classes[chave] || 'atendimento-presencial';
  }

  private mapApiAvaliacao(item: any, index: number): any {
    const grauSatisfacao = this.normalizarGrauSatisfacao(item?.serviceRating ?? item?.grauSatisfacao ?? item?.satisfacao);
    const problemaResolvido = this.normalizarProblemaResolvido(item?.problemResolved ?? item?.problemaResolvido ?? item?.resolvido);

    return {
      id: this.criarId('U', item?.id, index),
      grauSatisfacao,
      problemaResolvido,
      tipoProblema: this.formatarTexto(item?.problem ?? item?.tipoProblema ?? ''),
      servico: this.normalizarOpcao(item?.system ?? item?.servico ?? item?.serviceType),
      agradou: this.normalizarOpcao(item?.likeReason ?? item?.agradou ?? item?.oQueAgradou),
      naoAgradou: this.normalizarOpcao(item?.dislikeReason ?? item?.naoAgradou ?? item?.oQueNaoAgradou),
      provincia: this.formatarProvincia(item?.province ?? item?.provincia),
      observacoes: this.compactarObservacoes({
        problema: item?.problemObservations ?? item?.observacoesProblema,
        agradou: item?.likeObservations ?? item?.observacoesAgradou,
        naoAgradou: item?.dislikeObservations ?? item?.observacoesNaoAgradou,
        geral: item?.observacoes
      }),
      dataSubmissao: this.normalizarData(item?.createdAt ?? item?.dataSubmissao ?? item?.data)
    };
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

  alterarItensPorPagina(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value) && value > 0 && value !== this.itensPorPagina) {
      this.itensPorPagina = value;
      this.paginaAtual = 1;
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

  private atualizarPaginacao(): void {
    const total = this.avaliacoes.length;
    this.totalPaginas = Math.max(1, Math.ceil(total / this.itensPorPagina));
    if (this.paginaAtual > this.totalPaginas) {
      this.paginaAtual = this.totalPaginas;
    }
    if (this.paginaAtual < 1) {
      this.paginaAtual = 1;
    }
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.avaliacoesPaginadas = this.avaliacoes.slice(inicio, fim);
  }

  private getFallbackAvaliacoes(): any[] {
    return this.fallbackAvaliacoes.map(avaliacao => ({
      ...avaliacao,
      dataSubmissao: this.normalizarData(avaliacao.dataSubmissao)
    }));
  }

  private atualizarEstatisticas(): void {
    const total = this.avaliacoes.length;
    this.stats = {
      totalFormularios: total,
      formulariosAtivos: total,
      formulariosInativos: 0,
      totalRespostas: total,
      taxaResposta: total > 0 ? 100 : 0,
      ultimaAtualizacao: new Date()
    };

    this.utilizadorStats = {
      ...this.utilizadorStats,
      totalAvaliacoes: total,
      ultimaAvaliacao: total > 0 ? 'Hoje' : 'Nunca'
    };
  }

  private normalizarGrauSatisfacao(valor: string): string {
    if (!valor) {
      return 'neutro';
    }
    const ratingMap: { [key: string]: string } = {
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
    return ['sim', 'yes', 'y', 'true', '1'].includes(chave) ? 'sim' : 'nao';
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

  private normalizarData(valor: any): Date {
    if (!valor) {
      return new Date();
    }
    const data = valor instanceof Date ? new Date(valor) : new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return new Date();
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
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ')
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

  private criarId(prefixo: string, idOriginal: any, index: number): string {
    if (typeof idOriginal === 'string' && idOriginal.trim().length > 0) {
      return idOriginal;
    }
    if (typeof idOriginal === 'number') {
      return `${prefixo}${String(idOriginal).padStart(3, '0')}`;
    }
    return `${prefixo}${String(index + 1).padStart(3, '0')}`;
  }

  private getExportDataset(): any[] {
    return this.avaliacoes || [];
  }

  private getExportColumns(): ExportColumn[] {
    return [
      { key: 'id', label: 'ID' },
      { key: 'grauSatisfacao', label: 'Grau de Satisfação', transform: (row) => this.getSatisfactionLabel(row?.grauSatisfacao) },
      { key: 'problemaResolvido', label: 'Problema Resolvido', transform: (row) => this.getProblemaResolvidoLabel(row?.problemaResolvido) },
      { key: 'tipoProblema', label: 'Tipo de Problema' },
      { key: 'servico', label: 'Serviço', transform: (row) => this.getServiceLabel(row?.servico) },
      { key: 'agradou', label: 'O que lhe Agradou', transform: (row) => this.getAgradouLabel(row?.agradou) },
      { key: 'naoAgradou', label: 'O que não lhe Agradou', transform: (row) => this.getNaoAgradouLabel(row?.naoAgradou) },
      { key: 'provincia', label: 'Província' },
      { key: 'observacoes', label: 'Observações', transform: (row) => row?.observacoes || '-' },
      { key: 'dataSubmissao', label: 'Data/Hora', transform: (row) => this.formatDateTime(row?.dataSubmissao) }
    ];
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
}
