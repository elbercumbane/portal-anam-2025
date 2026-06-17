export interface ProjectosHeroSlide {
  imagem: string;
  legenda: string;
}

export const PROJECTOS_HERO_SLIDES: ProjectosHeroSlide[] = [
  {
    imagem: '/assets/projectos/projectos-hero-trator-campo.jpg',
    legenda: 'Trator no campo — desenvolvimento agrícola em Massinga'
  },
  {
    imagem: '/assets/projectos/projectos-hero-agricultura-trator.jpg',
    legenda: 'Agricultores preparando a terra com tractor'
  },
  {
    imagem: '/assets/projectos/projectos-hero-colheita-trator.jpg',
    legenda: 'Colheita e produção sustentável na região'
  }
];

export const PROJECTOS_SLIDER_INTERVAL_MS = 6000;
