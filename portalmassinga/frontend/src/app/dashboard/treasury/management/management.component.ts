import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pagamento {
  id: string;
  membro: string;
  tipo: 'Cota Mensal' | 'Cota Anual' | 'Doação' | 'Outro';
  valor: number;
  data: string;
  metodo: 'M-Pesa' | 'Emola' | 'Transferência' | 'Dinheiro';
  status: 'Pago' | 'Pendente' | 'Atrasado';
  referencia?: string;
}

interface Despesa {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  data: string;
  fornecedor?: string;
  status: 'Pago' | 'Pendente';
}

interface TopMembro {
  nome: string;
  totalPago: number;
  pagamentos: number;
  ultimoPagamento: string;
}

@Component({
  selector: 'app-treasury-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class TreasuryManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  // Dados mockados
  pagamentos: Pagamento[] = [];
  despesas: Despesa[] = [];
  topMembros: TopMembro[] = [];
  
  // Filtros
  filteredPagamentos: Pagamento[] = [];
  filteredDespesas: Despesa[] = [];
  searchTerm = '';
  tipoFilter = 'all';
  statusFilter = 'all';
  categoriaFilter = 'all';
  dateFilter = 'all';
  activeTab: 'pagamentos' | 'despesas' = 'pagamentos';
  
  // Estatísticas
  totalReceitas = 0;
  totalDespesas = 0;
  saldoDisponivel = 0;
  membrosEmDia = 0;
  membrosAtrasados = 0;
  
  // Situação Atual da Associação
  situacaoAtual = {
    totalMembros: 187,
    membrosAtivos: 175,
    taxaAdesao: 93.6,
    receitaMensalMedia: 0,
    despesaMensalMedia: 0,
    saldoMesAnterior: 0,
    variacaoSaldo: 0,
    percentualVariacao: 0,
    proximosVencimentos: 0,
    cotasPendentes: 0,
    valorCotasPendentes: 0,
    alertas: [] as string[]
  };

  constructor() {}

  ngOnInit(): void {
    this.loadMockData();
    this.calculateStats();
  }

  loadMockData(): void {
    // Pagamentos mockados
    this.pagamentos = [
      {
        id: '1',
        membro: 'Guilherme Mabilane',
        tipo: 'Cota Mensal',
        valor: 500,
        data: '2025-01-15',
        metodo: 'M-Pesa',
        status: 'Pago',
        referencia: 'MP123456'
      },
      {
        id: '2',
        membro: 'Marta Fabiano dos Anjos Sozinho',
        tipo: 'Cota Anual',
        valor: 5000,
        data: '2025-01-10',
        metodo: 'Transferência',
        status: 'Pago',
        referencia: 'TR789012'
      },
      {
        id: '3',
        membro: 'João Silva',
        tipo: 'Cota Mensal',
        valor: 500,
        data: '2025-01-20',
        metodo: 'Emola',
        status: 'Pendente',
        referencia: 'EM345678'
      },
      {
        id: '4',
        membro: 'Maria Santos',
        tipo: 'Cota Mensal',
        valor: 500,
        data: '2024-12-15',
        metodo: 'M-Pesa',
        status: 'Atrasado',
        referencia: 'MP901234'
      },
      {
        id: '5',
        membro: 'Carlos Mendes',
        tipo: 'Doação',
        valor: 2000,
        data: '2025-01-05',
        metodo: 'Transferência',
        status: 'Pago',
        referencia: 'TR567890'
      },
      {
        id: '6',
        membro: 'Ana Costa',
        tipo: 'Cota Anual',
        valor: 5000,
        data: '2025-01-12',
        metodo: 'M-Pesa',
        status: 'Pago',
        referencia: 'MP234567'
      },
      {
        id: '7',
        membro: 'Pedro Alves',
        tipo: 'Cota Mensal',
        valor: 500,
        data: '2025-01-18',
        metodo: 'Dinheiro',
        status: 'Pago',
        referencia: 'DN001'
      },
      {
        id: '8',
        membro: 'Sofia Lima',
        tipo: 'Cota Mensal',
        valor: 500,
        data: '2025-01-22',
        metodo: 'Emola',
        status: 'Pendente',
        referencia: 'EM890123'
      }
    ];

    // Despesas mockadas
    this.despesas = [
      {
        id: '1',
        descricao: 'Material de escritório',
        categoria: 'Administração',
        valor: 1500,
        data: '2025-01-10',
        fornecedor: 'Papelaria Central',
        status: 'Pago'
      },
      {
        id: '2',
        descricao: 'Aluguel do espaço para evento',
        categoria: 'Eventos',
        valor: 3000,
        data: '2025-01-15',
        fornecedor: 'Centro Comunitário',
        status: 'Pago'
      },
      {
        id: '3',
        descricao: 'Transporte para workshop',
        categoria: 'Logística',
        valor: 800,
        data: '2025-01-18',
        fornecedor: 'Transportes Massinga',
        status: 'Pendente'
      },
      {
        id: '4',
        descricao: 'Refeições para reunião',
        categoria: 'Administração',
        valor: 1200,
        data: '2025-01-20',
        fornecedor: 'Restaurante Local',
        status: 'Pago'
      },
      {
        id: '5',
        descricao: 'Material de limpeza',
        categoria: 'Manutenção',
        valor: 600,
        data: '2025-01-22',
        fornecedor: 'Supermercado',
        status: 'Pendente'
      }
    ];

    // Top membros mockados
    this.topMembros = [
      {
        nome: 'Marta Fabiano dos Anjos Sozinho',
        totalPago: 15000,
        pagamentos: 3,
        ultimoPagamento: '2025-01-10'
      },
      {
        nome: 'Guilherme Mabilane',
        totalPago: 6000,
        pagamentos: 12,
        ultimoPagamento: '2025-01-15'
      },
      {
        nome: 'Carlos Mendes',
        totalPago: 4500,
        pagamentos: 9,
        ultimoPagamento: '2025-01-05'
      },
      {
        nome: 'Ana Costa',
        totalPago: 5000,
        pagamentos: 1,
        ultimoPagamento: '2025-01-12'
      },
      {
        nome: 'Pedro Alves',
        totalPago: 3000,
        pagamentos: 6,
        ultimoPagamento: '2025-01-18'
      }
    ];

    this.filteredPagamentos = [...this.pagamentos];
    this.filteredDespesas = [...this.despesas];
  }

  calculateStats(): void {
    this.totalReceitas = this.pagamentos
      .filter(p => p.status === 'Pago')
      .reduce((sum, p) => sum + p.valor, 0);
    
    this.totalDespesas = this.despesas
      .filter(d => d.status === 'Pago')
      .reduce((sum, d) => sum + d.valor, 0);
    
    this.saldoDisponivel = this.totalReceitas - this.totalDespesas;
    
    const membrosUnicos = new Set(this.pagamentos.map(p => p.membro));
    this.membrosEmDia = Array.from(membrosUnicos).filter(membro => {
      const ultimoPagamento = this.pagamentos
        .filter(p => p.membro === membro && p.status === 'Pago')
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      if (!ultimoPagamento) return false;
      const dataUltimo = new Date(ultimoPagamento.data);
      const hoje = new Date();
      const diffMeses = (hoje.getFullYear() - dataUltimo.getFullYear()) * 12 + 
                       (hoje.getMonth() - dataUltimo.getMonth());
      return diffMeses <= 1;
    }).length;
    
    this.membrosAtrasados = Array.from(membrosUnicos).length - this.membrosEmDia;
    
    // Calcular situação atual
    this.calculateSituacaoAtual();
  }
  
  calculateSituacaoAtual(): void {
    // Receita mensal média (últimos 3 meses)
    const pagamentosUltimos3Meses = this.pagamentos.filter(p => {
      const dataPagamento = new Date(p.data);
      const hoje = new Date();
      const diffMeses = (hoje.getFullYear() - dataPagamento.getFullYear()) * 12 + 
                       (hoje.getMonth() - dataPagamento.getMonth());
      return diffMeses <= 3 && p.status === 'Pago';
    });
    this.situacaoAtual.receitaMensalMedia = pagamentosUltimos3Meses.length > 0
      ? pagamentosUltimos3Meses.reduce((sum, p) => sum + p.valor, 0) / 3
      : 0;
    
    // Despesa mensal média
    const despesasUltimos3Meses = this.despesas.filter(d => {
      const dataDespesa = new Date(d.data);
      const hoje = new Date();
      const diffMeses = (hoje.getFullYear() - dataDespesa.getFullYear()) * 12 + 
                       (hoje.getMonth() - dataDespesa.getMonth());
      return diffMeses <= 3 && d.status === 'Pago';
    });
    this.situacaoAtual.despesaMensalMedia = despesasUltimos3Meses.length > 0
      ? despesasUltimos3Meses.reduce((sum, d) => sum + d.valor, 0) / 3
      : 0;
    
    // Saldo do mês anterior (simulado)
    this.situacaoAtual.saldoMesAnterior = this.saldoDisponivel - (this.situacaoAtual.receitaMensalMedia - this.situacaoAtual.despesaMensalMedia);
    this.situacaoAtual.variacaoSaldo = this.saldoDisponivel - this.situacaoAtual.saldoMesAnterior;
    this.situacaoAtual.percentualVariacao = this.situacaoAtual.saldoMesAnterior > 0
      ? (this.situacaoAtual.variacaoSaldo / this.situacaoAtual.saldoMesAnterior) * 100
      : 0;
    
    // Cotas pendentes
    this.situacaoAtual.cotasPendentes = this.pagamentos.filter(p => p.status === 'Pendente' || p.status === 'Atrasado').length;
    this.situacaoAtual.valorCotasPendentes = this.pagamentos
      .filter(p => p.status === 'Pendente' || p.status === 'Atrasado')
      .reduce((sum, p) => sum + p.valor, 0);
    
    // Próximos vencimentos (simulado - próximos 7 dias)
    this.situacaoAtual.proximosVencimentos = this.pagamentos.filter(p => {
      if (p.status !== 'Pendente') return false;
      const dataPagamento = new Date(p.data);
      const hoje = new Date();
      const diffDias = Math.floor((dataPagamento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 0 && diffDias <= 7;
    }).length;
    
    // Alertas
    this.situacaoAtual.alertas = [];
    if (this.membrosAtrasados > 10) {
      this.situacaoAtual.alertas.push(`${this.membrosAtrasados} membros com pagamentos em atraso`);
    }
    if (this.saldoDisponivel < 10000) {
      this.situacaoAtual.alertas.push('Saldo disponível abaixo do recomendado');
    }
    if (this.situacaoAtual.proximosVencimentos > 0) {
      this.situacaoAtual.alertas.push(`${this.situacaoAtual.proximosVencimentos} pagamentos vencendo nos próximos 7 dias`);
    }
    if (this.situacaoAtual.percentualVariacao < -10) {
      this.situacaoAtual.alertas.push('Redução significativa no saldo disponível');
    }
  }

  filterData(): void {
    // Filtrar pagamentos
    this.filteredPagamentos = this.pagamentos.filter(p => {
      const matchesSearch = !this.searchTerm || 
        p.membro.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.referencia?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesTipo = this.tipoFilter === 'all' || p.tipo === this.tipoFilter;
      const matchesStatus = this.statusFilter === 'all' || p.status === this.statusFilter;
      
      return matchesSearch && matchesTipo && matchesStatus;
    });

    // Filtrar despesas
    this.filteredDespesas = this.despesas.filter(d => {
      const matchesSearch = !this.searchTerm || 
        d.descricao.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.fornecedor?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategoria = this.categoriaFilter === 'all' || d.categoria === this.categoriaFilter;
      const matchesStatus = this.statusFilter === 'all' || d.status === this.statusFilter;
      
      return matchesSearch && matchesCategoria && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterData();
  }

  onFilterChange(): void {
    this.filterData();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(value);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pago':
        return 'status-paid';
      case 'Pendente':
        return 'status-pending';
      case 'Atrasado':
        return 'status-overdue';
      default:
        return '';
    }
  }
  
  getCurrentDate(): string {
    return new Date().toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getLiquidezPercentual(): number {
    const ideal = 50000; // Saldo ideal
    return Math.min((this.saldoDisponivel / ideal) * 100, 100);
  }
  
  getLiquidezClass(): string {
    const percentual = this.getLiquidezPercentual();
    if (percentual >= 70) return 'excellent';
    if (percentual >= 40) return 'good';
    if (percentual >= 20) return 'warning';
    return 'critical';
  }
  
  getCoberturaPercentual(): number {
    if (this.situacaoAtual.despesaMensalMedia === 0) return 100;
    const meses = this.saldoDisponivel / this.situacaoAtual.despesaMensalMedia;
    return Math.min((meses / 6) * 100, 100); // 6 meses = 100%
  }
  
  getCoberturaClass(): string {
    const percentual = this.getCoberturaPercentual();
    if (percentual >= 80) return 'excellent';
    if (percentual >= 50) return 'good';
    if (percentual >= 30) return 'warning';
    return 'critical';
  }
  
  getInadimplenciaPercentual(): number {
    if (this.situacaoAtual.totalMembros === 0) return 0;
    return (this.membrosAtrasados / this.situacaoAtual.totalMembros) * 100;
  }
  
  getInadimplenciaClass(): string {
    const percentual = this.getInadimplenciaPercentual();
    if (percentual <= 5) return 'excellent';
    if (percentual <= 10) return 'good';
    if (percentual <= 20) return 'warning';
    return 'critical';
  }
}
