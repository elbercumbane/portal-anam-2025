export type Partner = {
  id: string;
  nome: string;
  categoria: 'Governo' | 'Associação' | 'ONG' | 'Empresa' | 'Internacional';
  descricao: string;
  membroDesde: string;
  initials: string;
  logoUrl?: string;
  perfilUrl?: string;
  icon: string;
  cor: string;
};

export const PARTNERS: Partner[] = [
  { 
    id: 'mireme', 
    nome: 'MIREME', 
    categoria: 'Governo', 
    initials: 'MI',
    descricao: 'Ministério dos Recursos Minerais e Energia de Moçambique, parceiro estratégico no desenvolvimento energético.',
    membroDesde: '2019',
    icon: 'government',
    cor: '#1B4332',
    perfilUrl: '#'
  },
  { 
    id: 'cta', 
    nome: 'CTA', 
    categoria: 'Associação', 
    initials: 'CT',
    descricao: 'Confederação das Associações Económicas de Moçambique, promovendo o desenvolvimento empresarial.',
    membroDesde: '2018',
    icon: 'business',
    cor: '#2563EB',
    perfilUrl: '#'
  },
  { 
    id: 'unido', 
    nome: 'UNIDO', 
    categoria: 'Internacional', 
    initials: 'UN',
    descricao: 'Organização das Nações Unidas para o Desenvolvimento Industrial, apoiando projetos de industrialização.',
    membroDesde: '2020',
    icon: 'globe',
    cor: '#0891B2',
    perfilUrl: '#'
  },
  { 
    id: 'aneme', 
    nome: 'ANEME', 
    categoria: 'Associação', 
    initials: 'AN',
    descricao: 'Associação Nacional das Empresas Metalúrgicas e Electromecânicas, fortalecendo a indústria nacional.',
    membroDesde: '2019',
    icon: 'industry',
    cor: '#DC2626',
    perfilUrl: '#'
  },
  { 
    id: 'twf', 
    nome: 'TWF', 
    categoria: 'ONG', 
    initials: 'TW',
    descricao: 'The World Foundation, fundação internacional focada em desenvolvimento sustentável e educação.',
    membroDesde: '2021',
    icon: 'heart',
    cor: '#059669',
    perfilUrl: '#'
  },
  { 
    id: 'evolen', 
    nome: 'EVOLEN', 
    categoria: 'Empresa', 
    initials: 'EV',
    descricao: 'Empresa líder em soluções energéticas e tecnológicas para o mercado moçambicano.',
    membroDesde: '2020',
    icon: 'lightning',
    cor: '#EA580C',
    perfilUrl: '#'
  },
  { 
    id: 'xhub', 
    nome: 'XHUB', 
    categoria: 'Empresa', 
    initials: 'XH',
    descricao: 'Hub de inovação e tecnologia, acelerando startups e promovendo empreendedorismo digital.',
    membroDesde: '2022',
    icon: 'rocket',
    cor: '#7C3AED',
    perfilUrl: '#'
  },
  { 
    id: 'indico', 
    nome: 'Banco Índico', 
    categoria: 'Empresa', 
    initials: 'BI',
    descricao: 'Instituição financeira comprometida com o crescimento económico e inclusão financeira.',
    membroDesde: '2019',
    icon: 'bank',
    cor: '#0369A1',
    perfilUrl: '#'
  },
];
