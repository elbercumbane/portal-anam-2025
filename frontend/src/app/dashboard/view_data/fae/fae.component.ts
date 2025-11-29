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
import { takeUntil } from 'rxjs/operators';
// ApiService removido - sem backend
import { ExportService, ExportColumn } from '../../services/export.service';
import { FaeHelpModalComponent } from '../../components/modals/fae-help-modal/fae-help-modal.component';

// Import components

interface FAEStats {
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

interface FAEStatistics {
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
  selector: 'app-fae',
  
  templateUrl: './fae.component.html',
  styleUrls: ['./fae.component.scss']
})
export class FAEComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() navigationClick = new EventEmitter<any>();
  @ViewChild('helpModal') helpModal!: FaeHelpModalComponent;
  
  faeForm: FormGroup;
  
  // Propriedades para filtros e tabelas
  filtrosVisiveis = false;
  exportMenuOpen = false;
  isLoading = false;
  
  // Dados originais e filtrados
  avaliacoesOriginal: any[] = [];
  avaliacoesFiltradas: any[] = [];
  
  // Paginação
  paginaAtual: number = 1;
  pageSizeOptions: number[] = [50, 150, 500, 750];
  itensPorPagina: number = this.pageSizeOptions[0];
  totalPaginas: number = 1;
  
  // Filtros
  filtroGrauSatisfacao: string = '';
  filtroTipoProblema: string = '';
  filtroProblemaResolvido: string = '';
  filtroAgradou: string = '';
  filtroNaoAgradou: string = '';
  filtroProvincia: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  
  // Opções dinâmicas para filtros (baseadas nos dados reais)
  opcoesGrauSatisfacao: string[] = [];
  opcoesTipoProblema: string[] = [];
  opcoesProblemaResolvido: string[] = [];
  opcoesAgradou: string[] = [];
  opcoesNaoAgradou: string[] = [];
  opcoesProvincia: string[] = [];
  
  // Mensagens de erro de validação
  erroDataInicio: string = '';
  erroDataFim: string = '';
  
  stats: FAEStats = {
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

  faeStats: FAEStatistics = {
    mediaGeral: 4.2,
    totalAvaliacoes: 156,
    avaliacaoMaxima: 5.0,
    ultimaAvaliacao: 'Hoje'
  };

  // Evaluation data for table
  avaliacoes: any[] = [];

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

  constructor(
    private fb: FormBuilder,
    private exportService: ExportService
  ) {
    this.faeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFAEData();
    this.loadAvaliacoes();
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

  loadFAEData(): void {
    // Simular carregamento de dados
    this.stats = {
      totalFormularios: 45,
      formulariosAtivos: 38,
      formulariosInativos: 7,
      totalRespostas: 234,
      taxaResposta: 85,
      ultimaAtualizacao: new Date()
    };
  }

  async loadAvaliacoes(): Promise<void> {
    this.isLoading = true;
    try {
      // Sem backend - dados vazios
      const dados: any[] = [];
      // Normalizar dados da API - mapear campos do backend para o formato esperado
      this.avaliacoesOriginal = dados.map((item: any, index: number) => {
        // Normalizar grau de satisfação (serviceRating pode vir em diferentes formatos)
        let grauSatisfacao = (item.serviceRating || item.grauSatisfacao || item.satisfacao || 'neutro').toLowerCase().trim();
        
        // Mapear todos os formatos possíveis (português e inglês)
        const ratingMap: { [key: string]: string } = {
          // Português
          'muito-satisfeito': 'muito-satisfeito',
          'muito_satisfeito': 'muito-satisfeito',
          'muitosatisfeito': 'muito-satisfeito',
          'muito satisfeito': 'muito-satisfeito',
          'satisfeito': 'satisfeito',
          'neutro': 'neutro',
          'insatisfeito': 'insatisfeito',
          'muito-insatisfeito': 'muito-insatisfeito',
          'muito_insatisfeito': 'muito-insatisfeito',
          'muitoinsatisfeito': 'muito-insatisfeito',
          'muito insatisfeito': 'muito-insatisfeito',
          // Inglês
          'very-satisfied': 'muito-satisfeito',
          'very_satisfied': 'muito-satisfeito',
          'verysatisfied': 'muito-satisfeito',
          'very satisfied': 'muito-satisfeito',
          'satisfied': 'satisfeito',
          'neutral': 'neutro',
          'dissatisfied': 'insatisfeito',
          'very-dissatisfied': 'muito-insatisfeito',
          'very_dissatisfied': 'muito-insatisfeito',
          'verydissatisfied': 'muito-insatisfeito',
          'very dissatisfied': 'muito-insatisfeito'
        };
        
        // Verificar mapeamento direto primeiro
        if (ratingMap[grauSatisfacao]) {
          grauSatisfacao = ratingMap[grauSatisfacao];
        } else {
          // Mapeamento por palavras-chave (fallback) - verificar inglês primeiro
          const ratingLower = grauSatisfacao.toLowerCase();
          
          if ((ratingLower.includes('very') || ratingLower.includes('muito')) && 
              (ratingLower.includes('satisfied') || ratingLower.includes('satisfeito'))) {
            grauSatisfacao = 'muito-satisfeito';
          } else if ((ratingLower.includes('very') || ratingLower.includes('muito')) && 
                     (ratingLower.includes('dissatisfied') || ratingLower.includes('insatisfeito'))) {
            grauSatisfacao = 'muito-insatisfeito';
          } else if ((ratingLower.includes('satisfied') || ratingLower.includes('satisfeito')) && 
                     !ratingLower.includes('very') && !ratingLower.includes('muito')) {
            grauSatisfacao = 'satisfeito';
          } else if ((ratingLower.includes('dissatisfied') || ratingLower.includes('insatisfeito')) && 
                     !ratingLower.includes('very') && !ratingLower.includes('muito')) {
            grauSatisfacao = 'insatisfeito';
          } else if (ratingLower.includes('neutral') || ratingLower.includes('neutro')) {
            grauSatisfacao = 'neutro';
          } else {
            // Se não conseguir mapear, logar para debug e usar neutro como padrão
            console.warn(`Grau de satisfação não reconhecido: "${item.serviceRating || item.grauSatisfacao || item.satisfacao}" (normalizado: "${grauSatisfacao}"), usando 'neutro' como padrão`);
            grauSatisfacao = 'neutro';
          }
        }

        // Normalizar problema resolvido
        const problemaResolvido = (item.problemResolved || item.problemaResolvido || item.resolvido || 'nao').toLowerCase().trim();
        const resolvidoNormalizado = problemaResolvido === 'sim' || problemaResolvido === 'yes' || problemaResolvido === 's' || problemaResolvido === 'true' ? 'sim' : 'nao';

        // Formatar ID no padrão FAE001, FAE002, etc. usando o ID numérico do backend
        const idNumerico = item.id || (index + 1);
        const idFormatado = `FAE${String(idNumerico).padStart(3, '0')}`;
        
        return {
          id: idFormatado,
          idNumerico: typeof idNumerico === 'number' ? idNumerico : parseInt(String(idNumerico)) || (index + 1),
          grauSatisfacao: grauSatisfacao,
          problemaResolvido: resolvidoNormalizado,
          tipoProblema: item.problem || item.tipoProblema || item.problema || '',
          observacoesProblema: item.problemObservations || item.observacoesProblema || '',
          agradou: item.likeReason || item.agradou || item.oQueAgradou || '',
          observacoesAgradou: item.likeObservations || item.observacoesAgradou || '',
          naoAgradou: item.dislikeReason || item.naoAgradou || item.oQueNaoAgradou || '',
          observacoesNaoAgradou: item.dislikeObservations || item.observacoesNaoAgradou || '',
          provincia: item.province || item.provincia || '',
          dataSubmissao: item.createdAt ? new Date(item.createdAt) : (item.dataSubmissao ? new Date(item.dataSubmissao) : (item.data ? new Date(item.data) : new Date()))
        };
      });
      
      // Ordenar por ID numérico em ordem crescente
      this.avaliacoesOriginal.sort((a, b) => {
        const idA = a.idNumerico || 0;
        const idB = b.idNumerico || 0;
        return idA - idB;
      });
      
      this.avaliacoesFiltradas = [...this.avaliacoesOriginal];
      this.faeStats.totalAvaliacoes = this.avaliacoesOriginal.length;
      
      // Debug: verificar valores de satisfação normalizados
      const valoresSatisfacao = new Set(this.avaliacoesOriginal.map(av => av.grauSatisfacao));
      console.log('Valores de satisfação encontrados nos dados:', Array.from(valoresSatisfacao));
      console.log('Total de avaliações:', this.avaliacoesOriginal.length);
      
      this.atualizarPagina();
      
      // Calcular opções dinâmicas para filtros
      this.calcularOpcoesFiltros();
      
      // Debug: verificar opções no filtro
      console.log('Opções de satisfação no filtro:', this.opcoesGrauSatisfacao);
    } catch (error) {
      console.error('Erro ao carregar avaliações FAE:', error);
      // Manter dados estáticos como fallback
      this.avaliacoesOriginal = [];
      this.avaliacoesFiltradas = [];
      this.avaliacoes = [];
      this.atualizarPagina();
      this.calcularOpcoesFiltros();
    } finally {
      this.isLoading = false;
    }
  }

  calcularOpcoesFiltros(): void {
    // Grau de Satisfação - ordem padrão das 5 categorias
    const ordemPadrao = ['muito-insatisfeito', 'insatisfeito', 'neutro', 'satisfeito', 'muito-satisfeito'];
    const grausSatisfacao = new Set<string>();
    
    // Coletar graus de satisfação dos dados
    this.avaliacoesOriginal.forEach(av => {
      if (av.grauSatisfacao) {
        grausSatisfacao.add(av.grauSatisfacao);
      }
    });
    
    // Ordenar mantendo a ordem padrão e adicionando apenas os que existem nos dados
    this.opcoesGrauSatisfacao = ordemPadrao.filter(categoria => grausSatisfacao.has(categoria));
    
    // Se quiser mostrar todas as categorias mesmo sem dados, descomente a linha abaixo:
    // this.opcoesGrauSatisfacao = ordemPadrao;

    // Tipo de Problema
    const tiposProblema = new Set<string>();
    this.avaliacoesOriginal.forEach(av => {
      if (av.tipoProblema && av.tipoProblema.trim()) {
        tiposProblema.add(av.tipoProblema.trim());
      }
    });
    this.opcoesTipoProblema = Array.from(tiposProblema).sort();

    // Problema Resolvido
    const problemasResolvidos = new Set<string>();
    this.avaliacoesOriginal.forEach(av => {
      if (av.problemaResolvido) {
        const valor = av.problemaResolvido.toLowerCase().trim();
        problemasResolvidos.add(valor === 'sim' || valor === 'yes' || valor === 's' ? 'sim' : 'nao');
      }
    });
    this.opcoesProblemaResolvido = Array.from(problemasResolvidos).sort();

    // O que Agradou
    const agradou = new Set<string>();
    this.avaliacoesOriginal.forEach(av => {
      if (av.agradou && av.agradou.trim()) {
        agradou.add(av.agradou.trim());
      }
    });
    this.opcoesAgradou = Array.from(agradou).sort();

    // O que não Agradou
    const naoAgradou = new Set<string>();
    this.avaliacoesOriginal.forEach(av => {
      if (av.naoAgradou && av.naoAgradou.trim()) {
        naoAgradou.add(av.naoAgradou.trim());
      }
    });
    this.opcoesNaoAgradou = Array.from(naoAgradou).sort();

    // Província
    const provincias = new Set<string>();
    this.avaliacoesOriginal.forEach(av => {
      if (av.provincia && av.provincia.trim()) {
        provincias.add(av.provincia.trim());
      }
    });
    this.opcoesProvincia = Array.from(provincias).sort();
  }

  createNewFAE(): void {
    this.resetForm();
    console.log('Creating new FAE');
  }

  onRatingChange(ratingId: string, event: any): void {
    const value = event.value || event;
    const ratingItem = this.ratingItems.find(item => item.id === ratingId);
    if (ratingItem) {
      ratingItem.value = value;
    }
  }

  onSubmit(): void {
    if (this.faeForm.valid) {
      const formData = {
        ...this.faeForm.value,
        ratings: this.ratingItems.reduce((acc, item) => {
          acc[item.id] = item.value;
          return acc;
        }, {} as any)
      };
      
      console.log('FAE Form submitted:', formData);
      
      // Simular salvamento
      this.recentSubmissions.unshift({
        id: Date.now().toString(),
        instituicao: formData.nomeInstituicao,
        dataSubmissao: new Date(),
        status: 'Em Análise'
      });
      
      this.resetForm();
    }
  }

  resetForm(): void {
    this.faeForm.reset();
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
    this.loadFAEData();
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
    // Usar setTimeout para garantir que o ViewChild está inicializado
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
  filtrarPorAvaliacao(event: any): void {
    this.filtroGrauSatisfacao = event.target.value;
  }

  filtrarPorProblema(event: any): void {
    this.filtroTipoProblema = event.target.value;
  }

  filtrarPorResolvido(event: any): void {
    this.filtroProblemaResolvido = event.target.value;
  }

  filtrarPorAgradou(event: any): void {
    this.filtroAgradou = event.target.value;
  }

  filtrarPorNaoAgradou(event: any): void {
    this.filtroNaoAgradou = event.target.value;
  }

  filtrarPorProvincia(event: any): void {
    this.filtroProvincia = event.target.value;
  }

  filtrarPorDataInicio(event: any): void {
    this.filtroDataInicio = event.target.value;
    this.validarDatas();
  }

  filtrarPorDataFim(event: any): void {
    this.filtroDataFim = event.target.value;
    this.validarDatas();
  }

  validarDatas(): void {
    this.erroDataInicio = '';
    this.erroDataFim = '';

    if (this.filtroDataInicio && this.filtroDataFim) {
      const dataInicio = new Date(this.filtroDataInicio);
      const dataFim = new Date(this.filtroDataFim);
      
      // Resetar horas para comparação correta
      dataInicio.setHours(0, 0, 0, 0);
      dataFim.setHours(0, 0, 0, 0);

      if (dataInicio > dataFim) {
        this.erroDataInicio = 'Data início não pode ser superior à data fim';
        this.erroDataFim = 'Data fim não pode ser inferior à data início';
        // Limpar os filtros de data se inválidos
        this.filtroDataInicio = '';
        this.filtroDataFim = '';
        // Resetar os inputs no HTML
        setTimeout(() => {
          const dateInputs = document.querySelectorAll('.filter-date');
          dateInputs.forEach((input: any) => {
            if (input) input.value = '';
          });
        }, 0);
      }
    }
  }
  
  getMaxDateInicio(): string {
    // Data máxima para data início é a data fim (se definida)
    return this.filtroDataFim || '';
  }
  
  getMinDateFim(): string {
    // Data mínima para data fim é a data início (se definida)
    return this.filtroDataInicio || '';
  }

  aplicarFiltros(): void {
    // Validar datas antes de aplicar filtros
    this.validarDatas();
    if (this.erroDataInicio || this.erroDataFim) {
      return; // Não aplicar filtros se houver erro de validação
    }

    this.avaliacoesFiltradas = this.avaliacoesOriginal.filter(avaliacao => {
      // Filtro por grau de satisfação
      if (this.filtroGrauSatisfacao && avaliacao.grauSatisfacao !== this.filtroGrauSatisfacao) {
        return false;
      }

      // Filtro por tipo de problema
      if (this.filtroTipoProblema) {
        const tipoProblemaLower = (avaliacao.tipoProblema || '').toLowerCase();
        const filtroLower = this.filtroTipoProblema.toLowerCase();
        // Mapear valores do filtro para termos comuns
        const filtroMap: { [key: string]: string[] } = {
          'demora': ['demora', 'atendimento', 'espera', 'tempo'],
          'informacao': ['informação', 'informacao', 'falta', 'dados'],
          'documentacao': ['documentação', 'documentacao', 'documentos', 'papéis'],
          'localizacao': ['localização', 'localizacao', 'local', 'encontrar'],
          'funcionarios': ['funcionários', 'funcionarios', 'pessoal', 'staff']
        };
        const termosBusca = filtroMap[filtroLower] || [filtroLower];
        const encontrou = termosBusca.some(termo => tipoProblemaLower.includes(termo));
        if (!encontrou) {
          return false;
        }
      }

      // Filtro por problema resolvido
      if (this.filtroProblemaResolvido) {
        const resolvido = (avaliacao.problemaResolvido || '').toLowerCase().trim();
        const filtroLower = this.filtroProblemaResolvido.toLowerCase().trim();
        if (resolvido !== filtroLower && resolvido !== (filtroLower === 'sim' ? 'yes' : 'no')) {
          return false;
        }
      }

      // Filtro por agradou
      if (this.filtroAgradou && avaliacao.agradou !== this.filtroAgradou) {
        return false;
      }

      // Filtro por não agradou
      if (this.filtroNaoAgradou && avaliacao.naoAgradou !== this.filtroNaoAgradou) {
        return false;
      }

      // Filtro por província
      if (this.filtroProvincia) {
        const provinciaLower = (avaliacao.provincia || '').toLowerCase().trim();
        const filtroLower = this.filtroProvincia.toLowerCase().trim();
        // Mapear valores do filtro para nomes de províncias
        const provinciaMap: { [key: string]: string[] } = {
          'maputo': ['maputo', 'maputo cidade', 'maputo city'],
          'gaza': ['gaza'],
          'inhambane': ['inhambane'],
          'sofala': ['sofala', 'beira'],
          'manica': ['manica', 'chimoio'],
          'tete': ['tete'],
          'zambezia': ['zambezia', 'zambézia', 'quelimane'],
          'nampula': ['nampula'],
          'niassa': ['niassa', 'lichinga'],
          'cabo-delgado': ['cabo delgado', 'cabo-delgado', 'pemba']
        };
        const nomesProvincia = provinciaMap[filtroLower] || [filtroLower];
        const encontrou = nomesProvincia.some(nome => provinciaLower === nome || provinciaLower.includes(nome));
        if (!encontrou) {
          return false;
        }
      }

      // Filtro por data início
      if (this.filtroDataInicio) {
        const dataInicio = new Date(this.filtroDataInicio);
        const dataSubmissao = new Date(avaliacao.dataSubmissao);
        if (dataSubmissao < dataInicio) {
          return false;
        }
      }

      // Filtro por data fim
      if (this.filtroDataFim) {
        const dataFim = new Date(this.filtroDataFim);
        dataFim.setHours(23, 59, 59, 999); // Incluir o dia inteiro
        const dataSubmissao = new Date(avaliacao.dataSubmissao);
        if (dataSubmissao > dataFim) {
          return false;
        }
      }

      return true;
    });
    
    // Ordenar resultados filtrados por ID numérico
    this.avaliacoesFiltradas.sort((a, b) => {
      const idA = a.idNumerico || 0;
      const idB = b.idNumerico || 0;
      return idA - idB;
    });
    
    this.paginaAtual = 1; // Resetar para primeira página ao filtrar
    this.atualizarPagina();
  }
  
  atualizarPagina(): void {
    // Calcular total de páginas (mínimo 1 para evitar divisão por zero)
    const totalItens = this.avaliacoesFiltradas.length;
    this.totalPaginas = totalItens > 0 ? Math.ceil(totalItens / this.itensPorPagina) : 1;
    
    // Garantir que página atual não exceda o total
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = this.totalPaginas;
    }
    
    // Se não houver dados, garantir que página atual seja 1
    if (totalItens === 0) {
      this.paginaAtual = 1;
      this.avaliacoes = [];
      return;
    }
    
    // Calcular índices para a página atual
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    
    // Obter apenas os itens da página atual
    this.avaliacoes = this.avaliacoesFiltradas.slice(inicio, fim);
  }
  
  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
      this.atualizarPagina();
    }
  }
  
  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPagina();
    }
  }
  
  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPagina();
    }
  }

  irParaPrimeiraPagina(): void {
    if (this.paginaAtual !== 1) {
      this.paginaAtual = 1;
      this.atualizarPagina();
    }
  }

  irParaUltimaPagina(): void {
    if (this.paginaAtual !== this.totalPaginas) {
      this.paginaAtual = this.totalPaginas;
      this.atualizarPagina();
    }
  }

  alterarItensPorPagina(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value) && value > 0 && value !== this.itensPorPagina) {
      this.itensPorPagina = value;
      this.paginaAtual = 1;
      this.atualizarPagina();
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

  limparFiltros(): void {
    this.filtroGrauSatisfacao = '';
    this.filtroTipoProblema = '';
    this.filtroProblemaResolvido = '';
    this.filtroAgradou = '';
    this.filtroNaoAgradou = '';
    this.filtroProvincia = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.erroDataInicio = '';
    this.erroDataFim = '';
    this.avaliacoesFiltradas = [...this.avaliacoesOriginal];
    this.paginaAtual = 1;
    this.atualizarPagina();
    
    // Resetar os valores dos inputs no HTML
    const selects = document.querySelectorAll('.filter-select');
    selects.forEach((select: any) => select.value = '');
    const dates = document.querySelectorAll('.filter-date');
    dates.forEach((date: any) => date.value = '');
  }

  // Export methods
  exportarExcel(): void {
    const dados = this.getExportDataset();
    this.exportService.exportToExcel('fae_avaliacoes', this.getExportColumns(), dados, 'Avaliações FAE');
    this.exportMenuOpen = false;
  }

  exportarWord(): void {
    const dados = this.getExportDataset();
    this.exportService.exportToWord('fae_avaliacoes', 'Avaliações FAE', this.getExportColumns(), dados);
    this.exportMenuOpen = false;
  }

  exportarPdf(): void {
    const dados = this.getExportDataset();
    this.exportService.exportToPdf('fae_avaliacoes', 'Avaliações FAE', this.getExportColumns(), dados);
    this.exportMenuOpen = false;
  }


  // Helper methods for labels
  getAgradouLabel(agradou: string): string {
    if (!agradou) return '';
    
    const labels: { [key: string]: string } = {
      'atendimento': 'Atendimento',
      'rapidez': 'Rapidez',
      'localizacao': 'Localização',
      'localização': 'Localização',
      'funcionarios': 'Funcionários',
      'funcionários': 'Funcionários',
      'processo': 'Processo'
    };
    
    const valorLower = agradou.toLowerCase().trim();
    return labels[valorLower] || this.formatarTexto(agradou);
  }

  getNaoAgradouLabel(naoAgradou: string): string {
    if (!naoAgradou) return '';
    
    const labels: { [key: string]: string } = {
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
    
    const valorLower = naoAgradou.toLowerCase().trim();
    return labels[valorLower] || this.formatarTexto(naoAgradou);
  }
  
  getTipoProblemaLabel(tipoProblema: string): string {
    if (!tipoProblema) return '';
    
    const labels: { [key: string]: string } = {
      'demora': 'Demora no Atendimento',
      'demora no atendimento': 'Demora no Atendimento',
      'informacao': 'Falta de Informação',
      'informação': 'Falta de Informação',
      'falta de informação': 'Falta de Informação',
      'documentacao': 'Documentação',
      'documentação': 'Documentação',
      'localizacao': 'Localização',
      'localização': 'Localização',
      'funcionarios': 'Funcionários',
      'funcionários': 'Funcionários'
    };
    
    const valorLower = tipoProblema.toLowerCase().trim();
    return labels[valorLower] || this.formatarTexto(tipoProblema);
  }
  
  formatarProvincia(provincia: string): string {
    if (!provincia) return '';
    
    // Capitalizar primeira letra de cada palavra
    return provincia.split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  }

  getProblemaResolvidoLabel(resolvido: string): string {
    if (!resolvido) return 'Não informado';
    const valor = (resolvido || '').toLowerCase().trim();
    return valor === 'sim' || valor === 'yes' || valor === 's' ? 'Sim' : 'Não';
  }
  
  isProblemaResolvido(resolvido: string): boolean {
    if (!resolvido) return false;
    const valor = (resolvido || '').toLowerCase().trim();
    return valor === 'sim' || valor === 'yes' || valor === 's';
  }
  
  isProblemaNaoResolvido(resolvido: string): boolean {
    if (!resolvido) return true;
    const valor = (resolvido || '').toLowerCase().trim();
    return valor === 'nao' || valor === 'não' || valor === 'no' || valor === 'n';
  }

  getSatisfactionLabel(grauSatisfacao: string): string {
    if (!grauSatisfacao) return '';
    
    const labels: { [key: string]: string } = {
      'muito-satisfeito': 'Muito Satisfeito',
      'muito_satisfeito': 'Muito Satisfeito',
      'muitosatisfeito': 'Muito Satisfeito',
      'satisfeito': 'Satisfeito',
      'neutro': 'Neutro',
      'neutral': 'Neutro',
      'insatisfeito': 'Insatisfeito',
      'muito-insatisfeito': 'Muito Insatisfeito',
      'muito_insatisfeito': 'Muito Insatisfeito',
      'muitoinsatisfeito': 'Muito Insatisfeito'
    };
    
    const valorLower = grauSatisfacao.toLowerCase().trim();
    return labels[valorLower] || this.formatarTexto(grauSatisfacao);
  }
  
  formatarTexto(texto: string): string {
    if (!texto) return '';
    
    // Substituir hífens e underscores por espaços
    let formatado = texto.replace(/[-_]/g, ' ');
    
    // Capitalizar primeira letra de cada palavra
    formatado = formatado.split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
    
    return formatado.trim();
  }

  getSatisfactionClass(grauSatisfacao: string): string {
    const classes: { [key: string]: string } = {
      'muito-satisfeito': 'muito-satisfeito',
      'satisfeito': 'satisfeito',
      'neutro': 'neutro',
      'insatisfeito': 'insatisfeito',
      'muito-insatisfeito': 'muito-insatisfeito'
    };
    return classes[grauSatisfacao] || 'neutro';
  }

  private getExportDataset(): any[] {
    if (this.avaliacoesFiltradas && this.avaliacoesFiltradas.length) {
      return this.avaliacoesFiltradas;
    }
    if (this.avaliacoesOriginal && this.avaliacoesOriginal.length) {
      return this.avaliacoesOriginal;
    }
    return [];
  }

  private getExportColumns(): ExportColumn[] {
    return [
      { key: 'id', label: 'ID' },
      { key: 'grauSatisfacao', label: 'Grau de Satisfação', transform: (row) => this.getSatisfactionLabel(row?.grauSatisfacao) },
      { key: 'problemaResolvido', label: 'Problema Resolvido', transform: (row) => this.getProblemaResolvidoLabel(row?.problemaResolvido) },
      { key: 'tipoProblema', label: 'Tipo de Problema', transform: (row) => this.getTipoProblemaLabel(row?.tipoProblema || '') },
      { key: 'observacoesProblema', label: 'Observações do Problema', transform: (row) => row?.observacoesProblema || '-' },
      { key: 'agradou', label: 'O que lhe Agradou', transform: (row) => this.getAgradouLabel(row?.agradou || '') },
      { key: 'observacoesAgradou', label: 'Observações do Agradou', transform: (row) => row?.observacoesAgradou || '-' },
      { key: 'naoAgradou', label: 'O que não lhe Agradou', transform: (row) => this.getNaoAgradouLabel(row?.naoAgradou || '') },
      { key: 'observacoesNaoAgradou', label: 'Observações do Não Agradou', transform: (row) => row?.observacoesNaoAgradou || '-' },
      { key: 'provincia', label: 'Província', transform: (row) => this.formatarProvincia(row?.provincia || '') },
      { key: 'dataSubmissao', label: 'Data e Hora', transform: (row) => this.formatDateTime(row?.dataSubmissao) }
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
    const data = valor instanceof Date ? valor : (valor ? new Date(valor) : null);
    if (!data || isNaN(data.getTime())) return '';
    const dataFormatada = this.formatDate(data);
    const horaFormatada = this.formatTime(data);
    return [dataFormatada, horaFormatada].filter(Boolean).join(' ');
  }
}
