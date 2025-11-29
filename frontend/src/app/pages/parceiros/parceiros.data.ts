export type Partner = {
  id: string;
  nome: string;
  categoria: 'Tecnologia' | 'Serviços' | 'Comércio';
  descricao: string;
  membroDesde: string;   // "desde 2020" ou "2019"
  initials: string;      // "EA", "EB", "EC"...
  logoUrl?: string;      // URL do logo da empresa
  perfilUrl?: string;    // link externo opcional
};

export const PARTNERS: Partner[] = [
  { id:'ea', nome:'Empresa Alfa', categoria:'Tecnologia', initials:'EA',
    descricao:'Especializada em soluções digitais para empresas, com transformação digital e consultoria de software.',
    membroDesde:'2020', logoUrl:'https://via.placeholder.com/48x48/2563EB/FFFFFF?text=EA', perfilUrl:'#' },
  { id:'eb', nome:'Empresa Beta', categoria:'Serviços', initials:'EB',
    descricao:'Consultoria empresarial focada em gestão financeira e planeamento estratégico.',
    membroDesde:'2019', logoUrl:'https://via.placeholder.com/48x48/059669/FFFFFF?text=EB', perfilUrl:'#' },
  { id:'ec', nome:'Empresa Gama', categoria:'Comércio', initials:'EC',
    descricao:'Distribuidora de produtos locais, conectando produtores rurais com mercados urbanos da região.',
    membroDesde:'2021', logoUrl:'https://via.placeholder.com/48x48/DC2626/FFFFFF?text=EC', perfilUrl:'#' },
  { id:'ed', nome:'Empresa Delta', categoria:'Tecnologia', initials:'ED',
    descricao:'IoT para agricultura, ajudando produtores a otimizar colheitas.',
    membroDesde:'2022', logoUrl:'https://via.placeholder.com/48x48/7C3AED/FFFFFF?text=ED', perfilUrl:'#' },
  { id:'ee', nome:'Empresa Épsilon', categoria:'Serviços', initials:'EE',
    descricao:'Agência de marketing digital para PMEs (redes sociais e e-commerce).',
    membroDesde:'2020', logoUrl:'https://via.placeholder.com/48x48/EA580C/FFFFFF?text=EE', perfilUrl:'#' },
  { id:'ez', nome:'Empresa Zeta', categoria:'Comércio', initials:'EZ',
    descricao:'Materiais de construção com foco sustentável; produtos ecológicos e reciclados.',
    membroDesde:'2018', logoUrl:'https://via.placeholder.com/48x48/0891B2/FFFFFF?text=EZ', perfilUrl:'#' },
];
