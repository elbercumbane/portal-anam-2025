// Dashboard Types and Interfaces

export interface DashboardStats {
  totalFormularios: number;
  formulariosAtivos: number;
  formulariosInativos: number;
  totalRespostas: number;
  taxaResposta: number;
  ultimaAtualizacao: Date;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  description: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface FilterItem {
  name: string;
  selected: boolean;
}

export interface AssociationStats {
  totalMembros: number;
  novosEsteMes: number;
  crescimento: number;
  membrosAtivos: number;
}

export interface TreasuryStats {
  saldo: number;
  receitas: number;
  despesas: number;
  transacoes: number;
}

