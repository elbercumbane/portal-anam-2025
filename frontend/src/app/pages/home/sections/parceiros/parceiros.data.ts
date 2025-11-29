export type PartnerLogo = { 
  id: string; 
  nome: string; 
  src: string; 
  alt: string;
  categoria: string;
  cor: string;
  icon: string;
};

export const PARCEIROS: PartnerLogo[] = [
  { 
    id: 'mireme', 
    nome: 'MIREME', 
    src: '', 
    alt: 'Logotipo MIREME',
    categoria: 'Ministério',
    cor: '#1B4332',
    icon: 'government'
  },
  { 
    id: 'cta', 
    nome: 'CTA', 
    src: '', 
    alt: 'Logotipo CTA - Confederação das Associações Económicas',
    categoria: 'Confederação',
    cor: '#2563EB',
    icon: 'business'
  },
  { 
    id: 'twf', 
    nome: 'TWF', 
    src: '', 
    alt: 'Logotipo TWF',
    categoria: 'Fundação',
    cor: '#059669',
    icon: 'foundation'
  },
  { 
    id: 'aneme', 
    nome: 'ANEME', 
    src: '', 
    alt: 'Logotipo ANEME',
    categoria: 'Associação',
    cor: '#DC2626',
    icon: 'association'
  },
  { 
    id: 'unido', 
    nome: 'UNIDO', 
    src: '', 
    alt: 'Logotipo UNIDO - United Nations Industrial Development',
    categoria: 'ONU',
    cor: '#0891B2',
    icon: 'united-nations'
  },
  { 
    id: 'evolen', 
    nome: 'EVOLEN', 
    src: '', 
    alt: 'Logotipo EVOLEN',
    categoria: 'Empresa',
    cor: '#EA580C',
    icon: 'company'
  },
  { 
    id: 'xhub', 
    nome: 'XHUB', 
    src: '', 
    alt: 'Logotipo XHUB - Hub de Inovação',
    categoria: 'Inovação',
    cor: '#7C3AED',
    icon: 'innovation'
  },
  { 
    id: 'indico', 
    nome: 'ÍNDICO', 
    src: '', 
    alt: 'Logotipo ÍNDICO',
    categoria: 'Banco',
    cor: '#0369A1',
    icon: 'bank'
  },
  { 
    id: 'em', 
    nome: 'E&M', 
    src: '', 
    alt: 'Logotipo E&M',
    categoria: 'Consultoria',
    cor: '#16A34A',
    icon: 'consulting'
  },
  { 
    id: 'oe', 
    nome: 'O.E', 
    src: '', 
    alt: 'Logotipo O.E',
    categoria: 'Organização',
    cor: '#B8860B',
    icon: 'organization'
  },
];
