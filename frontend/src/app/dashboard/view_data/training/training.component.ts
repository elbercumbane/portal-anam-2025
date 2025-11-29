import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

interface FormacaoStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

interface FormacaoStatistics {
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

interface Formacao {
  id: string;
  nuit: string;
  courseName: string;
  startDate: Date;
  endDate: Date;
  province: string;
  courseLocation: string;
  gender: string;
  // Conteúdo do Curso
  theoretical: string;
  distribution: string;
  importance: string;
  // Formador
  expertise: string;
  teachingMethod: string;
  dynamism: string;
  motivation: string;
  // Aplicação
  availability: string;
  functionality: string;
  // Material Didático
  texts: string;
  activities: string;
  presentation: string;
  legislation: string;
  // Logística
  facilities: string;
  reception: string;
  // Outros
  observations?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-training',
  
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() navigationClick = new EventEmitter<any>();
  
  // Propriedades para filtros e tabelas
  filtrosVisiveis = false;
  exportMenuOpen = false;
  
  stats: FormacaoStats = {
    totalFormularios: 0,
    formulariosAtivos: 0,
    formulariosInativos: 0,
    totalRespostas: 0,
    taxaResposta: 0,
    ultimaAtualizacao: new Date()
  };

  formacaoStats: FormacaoStatistics = {
    mediaGeral: 4.2,
    totalAvaliacoes: 156,
    avaliacaoMaxima: 5.0,
    ultimaAvaliacao: 'Hoje'
  };

  // Loading state
  isLoading = false;
  erroCarregamento = '';
  
  // Training data
  formacoes: Formacao[] = [];
  formacoesPaginadas: Formacao[] = [];
  recentSubmissions: Submission[] = [];
  pageSizeOptions: number[] = [50, 150, 500, 750];
  itensPorPagina = this.pageSizeOptions[0];
  paginaAtual = 1;
  totalPaginas = 1;
  

  constructor(
    // ApiService removido
  ) {
  }

  ngOnInit(): void {
    void this.loadFormacaoData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async loadFormacaoData(): Promise<void> {
    this.isLoading = true;
    this.erroCarregamento = '';

    try {
      // Sem backend - dados vazios
      const dados: any[] = [];
      const mapeados = (dados || []).map((item: any, index: number) => 
        this.mapApiFormacao(item, index)
      ).filter(Boolean) as Formacao[];
      
      // Ordenar por data de criação (crescente - mais antigo primeiro)
      mapeados.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      
      this.formacoes = mapeados;
    } catch (error) {
      this.erroCarregamento = 'Não foi possível carregar os dados de formação.';
      this.formacoes = [];
    } finally {
      this.atualizarPaginacao();
      this.atualizarEstatisticas();
      this.atualizarRecentSubmissions();
      this.isLoading = false;
    }
  }


  // Filter methods
  refresh(): void {
    void this.loadFormacaoData();
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
    // Implementar modal de ajuda
  }

  fechar(): void {
    // Emitir evento para voltar ao dashboard
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  // Filter methods
  filtrarPorNomeCurso(): void {
    // Implementar filtro
  }

  filtrarPorNUIT(): void {
    // Implementar filtro
  }

  filtrarPorProvincia(): void {
    // Implementar filtro
  }

  filtrarPorLocalCurso(): void {
    // Implementar filtro
  }

  filtrarPorGenero(): void {
    // Implementar filtro
  }

  filtrarPorDataInicio(): void {
    // Implementar filtro
  }

  filtrarPorDataFim(): void {
    // Implementar filtro
  }

  aplicarFiltros(): void {
    // Implementar filtros
  }

  limparFiltros(): void {
    // Implementar limpeza de filtros
  }

  // Export methods
  exportarExcel(): void {
    this.exportMenuOpen = false;
  }

  exportarWord(): void {
    this.exportMenuOpen = false;
  }

  exportarPdf(): void {
    this.exportMenuOpen = false;
  }

  // Helper methods for labels
  getGenderLabel(genero: string): string {
    const generoNormalizado = this.normalizarGenero(genero);
    const labels: { [key: string]: string } = {
      masculino: 'Masculino',
      feminino: 'Feminino',
      outro: 'Outro'
    };
    return labels[generoNormalizado] || this.formatarTexto(genero);
  }

  getGenderClass(genero: string): string {
    const generoNormalizado = this.normalizarGenero(genero);
    const classes: { [key: string]: string } = {
      masculino: 'masculino',
      feminino: 'feminino',
      outro: 'outro'
    };
    return classes[generoNormalizado] || 'outro';
  }

  getSatisfactionClass(value: string): string {
    if (!value) return 'neutro';
    const val = value.toLowerCase().trim();
    
    // Muito Insatisfeito - vermelho
    if (val.includes('very') && (val.includes('dissatisfied') || val.includes('poor'))) {
      return 'muito-insatisfeito';
    }
    if (val.includes('muito') && val.includes('insatisfeito')) {
      return 'muito-insatisfeito';
    }
    
    // Insatisfeito - vermelho
    if (val.includes('dissatisfied') || val.includes('poor') || val.includes('insatisfeito')) {
      return 'insatisfeito';
    }
    
    // Neutro - laranja
    if (val.includes('neutral') || val.includes('neutro')) {
      return 'neutro';
    }
    
    // Muito Satisfeito - verde
    if (val.includes('very') && (val.includes('satisfied') || val.includes('good'))) {
      return 'muito-satisfeito';
    }
    if (val.includes('muito') && val.includes('satisfeito')) {
      return 'muito-satisfeito';
    }
    if (val.includes('excellent')) {
      return 'muito-satisfeito';
    }
    
    // Satisfeito - verde
    if (val.includes('satisfied') || val.includes('good') || val.includes('satisfeito')) {
      return 'satisfeito';
    }
    
    return 'neutro';
  }

  getSatisfactionText(value: string): string {
    if (!value) return '-';
    const val = value.toLowerCase().trim();
    if (val.includes('very') && (val.includes('dissatisfied') || val.includes('poor'))) {
      return 'Muito Insatisfeito';
    } else if (val.includes('dissatisfied') || val.includes('poor')) {
      return 'Insatisfeito';
    } else if (val.includes('neutral')) {
      return 'Neutro';
    } else if (val.includes('satisfied') || val.includes('good')) {
      if (val.includes('very')) {
        return 'Muito Satisfeito';
      }
      return 'Satisfeito';
    } else if (val.includes('excellent')) {
      return 'Muito Satisfeito';
    }
    return value; // Retorna o valor original se não reconhecer
  }

  private mapApiFormacao(item: any, index: number): Formacao | null {
    if (!item) {
      return null;
    }

    return {
      id: this.criarId(item.id, index),
      nuit: String(item.nuit || '').trim(),
      courseName: item.courseName || '',
      startDate: this.normalizarData(item.startDate),
      endDate: this.normalizarData(item.endDate),
      province: item.province || '',
      courseLocation: item.courseLocation || '',
      gender: item.gender || '',
      // Conteúdo do Curso
      theoretical: item.theoretical || '',
      distribution: item.distribution || '',
      importance: item.importance || '',
      // Formador
      expertise: item.expertise || '',
      teachingMethod: item.teachingMethod || '',
      dynamism: item.dynamism || '',
      motivation: item.motivation || '',
      // Aplicação
      availability: item.availability || '',
      functionality: item.functionality || '',
      // Material Didático
      texts: item.texts || '',
      activities: item.activities || '',
      presentation: item.presentation || '',
      legislation: item.legislation || '',
      // Logística
      facilities: item.facilities || '',
      reception: item.reception || '',
      // Outros
      observations: item.observations || '',
      createdAt: this.normalizarData(item.createdAt || new Date())
    };
  }


  private atualizarEstatisticas(): void {
    const total = this.formacoes.length;
    this.stats = {
      totalFormularios: total,
      formulariosAtivos: total,
      formulariosInativos: 0,
      totalRespostas: total,
      taxaResposta: total > 0 ? 100 : 0,
      ultimaAtualizacao: new Date()
    };

    const mediaGeral = 0; // Não calculamos mais média, apenas satisfação final

    this.formacaoStats = {
      mediaGeral,
      totalAvaliacoes: total,
      avaliacaoMaxima: 5.0,
      ultimaAvaliacao: total ? this.formatarData(this.formacoes[0]?.endDate ?? new Date()) : 'Nunca'
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
    const total = this.formacoes.length;
    this.totalPaginas = Math.max(1, Math.ceil(total / this.itensPorPagina));
    if (this.paginaAtual > this.totalPaginas) {
      this.paginaAtual = this.totalPaginas;
    }
    if (this.paginaAtual < 1) {
      this.paginaAtual = 1;
    }
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.formacoesPaginadas = this.formacoes.slice(inicio, fim);
  }

  private atualizarRecentSubmissions(): void {
    this.recentSubmissions = this.formacoes
      .slice(0, 4)
      .map((formacao, index) => ({
        id: String(index + 1),
        instituicao: formacao.courseName,
        dataSubmissao: formacao.endDate,
        status: 'Concluído'
      }));
  }

  calcularSatisfacaoFinal(formacao: Formacao): string {
    const avaliacoes = [
      formacao.theoretical, formacao.distribution, formacao.importance,
      formacao.expertise, formacao.teachingMethod, formacao.dynamism, formacao.motivation,
      formacao.availability, formacao.functionality,
      formacao.texts, formacao.activities, formacao.presentation, formacao.legislation,
      formacao.facilities, formacao.reception
    ].filter(v => v && v.trim());

    const contagem: { [key: string]: number } = {};
    avaliacoes.forEach(av => {
      const texto = this.getSatisfactionText(av);
      contagem[texto] = (contagem[texto] || 0) + 1;
    });

    return Object.keys(contagem).reduce((a, b) => contagem[a] > contagem[b] ? a : b, 'Neutro');
  }

  getSatisfacaoFinalClass(formacao: Formacao): string {
    const satisfacao = this.calcularSatisfacaoFinal(formacao);
    const classes: { [key: string]: string } = {
      'Muito Insatisfeito': 'muito-insatisfeito',
      'Insatisfeito': 'insatisfeito',
      'Neutro': 'neutro',
      'Satisfeito': 'satisfeito',
      'Muito Satisfeito': 'muito-satisfeito'
    };
    return classes[satisfacao] || 'neutro';
  }


  private normalizarGenero(genero: string): string {
    const chave = (genero || '').toString().toLowerCase().trim();
    if (['f', 'feminino', 'female', 'mulher'].includes(chave)) {
      return 'feminino';
    }
    if (['m', 'masculino', 'male', 'homem'].includes(chave)) {
      return 'masculino';
    }
    return 'outro';
  }

  private normalizarData(valor: any): Date {
    if (!valor) {
      return new Date();
    }

    if (valor instanceof Date) {
      return valor;
    }

    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return new Date(`${valor}T00:00:00`);
    }

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
      return new Date();
    }
    return data;
  }

  private criarId(originalId: any, index: number): string {
    if (typeof originalId === 'string' && originalId.trim().length > 0) {
      return originalId;
    }
    if (typeof originalId === 'number') {
      return `F${String(originalId).padStart(3, '0')}`;
    }
    return `F${String(index + 1).padStart(3, '0')}`;
  }

  private formatarProvincia(provincia: string): string {
    if (!provincia) {
      return '';
    }
    return provincia
      .toString()
      .split(' ')
      .filter(Boolean)
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
      .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  private formatarData(data: Date): string {
    if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  }
}

