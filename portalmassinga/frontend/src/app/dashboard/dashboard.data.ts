// Dashboard Static Data

import { QuickAction, RecentActivity, FilterItem } from './dashboard.types';

// Provinces list
export const PROVINCES: FilterItem[] = [
  { name: 'Maputo', selected: true },
  { name: 'Sofala', selected: true },
  { name: 'Nampula', selected: true },
  { name: 'Zambézia', selected: true },
  { name: 'Tete', selected: true },
  { name: 'Niassa', selected: true },
  { name: 'Cabo Delgado', selected: true },
  { name: 'Manica', selected: true },
  { name: 'Inhambane', selected: true },
  { name: 'Gaza', selected: true }
];

// Form types
export const FORM_TYPES: FilterItem[] = [
  { name: 'FAE', selected: true },
  { name: 'Utilizador', selected: true },
  { name: 'Agente Econômico', selected: true },
  { name: 'Formação', selected: true }
];

// Statuses
export const STATUSES: FilterItem[] = [
  { name: 'Ativo', selected: true },
  { name: 'Inativo', selected: true },
  { name: 'Em Manutenção', selected: true },
  { name: 'Pendente', selected: true }
];

// Satisfaction levels
export const SATISFACTION_LEVELS: FilterItem[] = [
  { name: 'Satisfeito', selected: true },
  { name: 'Neutro', selected: true },
  { name: 'Insatisfeito', selected: true }
];

// Quick actions
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'fae',
    title: 'FAE',
    icon: 'assignment',
    color: 'primary',
    route: '/fae',
    description: 'Funcionário ou Agente do Estado'
  },
  {
    id: 'agente',
    title: 'Agente Económico',
    icon: 'business',
    color: 'accent',
    route: '/agente-economico',
    description: 'Formulário para Agentes Económicos'
  },
  {
    id: 'utilizador',
    title: 'Utilizador',
    icon: 'person',
    color: 'warn',
    route: '/utilizador',
    description: 'Formulário para Utilizadores'
  },
  {
    id: 'formando',
    title: 'Formando',
    icon: 'school',
    color: 'primary',
    route: '/formando',
    description: 'Formulário para Formandos'
  }
];

// Initial recent activities
export const INITIAL_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'success',
    message: 'Formulário FAE atualizado com sucesso',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: 'check_circle',
    color: 'green'
  },
  {
    id: '2',
    type: 'info',
    message: 'Novo utilizador registado no sistema',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: 'person_add',
    color: 'blue'
  },
  {
    id: '3',
    type: 'warning',
    message: 'Formulário Agente Económico precisa de revisão',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    icon: 'warning',
    color: 'orange'
  }
];

// Initial stats
export const INITIAL_STATS = {
  totalFormularios: 0,
  formulariosAtivos: 0,
  formulariosInativos: 0,
  totalRespostas: 0,
  taxaResposta: 0,
  ultimaAtualizacao: new Date()
};

export const INITIAL_ASSOCIATION_STATS = {
  totalMembros: 187,
  novosEsteMes: 15,
  crescimento: 8.7,
  membrosAtivos: 175
};

export const INITIAL_SUPPORTERS_STATS = {
  total: 24,
  ativos: 18,
  novosEsteMes: 3,
  pendentes: 2
};

export const INITIAL_SYMPATHIZERS_STATS = {
  total: 56,
  ativos: 52,
  novosEsteMes: 8,
  comunicacoes: 41
};

export const INITIAL_TREASURY_STATS = {
  saldo: 0,
  receitas: 0,
  despesas: 0,
  transacoes: 0
};

export const INITIAL_DASHBOARD_STATS = {
  service: { total: 0 },
  fae: { total: 0, breakdown: {} },
  user: { total: 0, breakdown: {} },
  economicAgent: { total: 0, breakdown: {} },
  training: { total: 0, provincias: 0, cursos: 0, generos: 0, taxaSatisfacao: 0 }
};

