export interface HeroSlide {
  imagem: string;
  overlay: string;
  badge: string;
  titulo: string;
  subtitulo: string;
  accentColor: string;
  button: {
    text: string;
    link: string;
    color: string;
  };
  valores?: { icon: 'competencias' | 'networking' | 'oportunidades'; label: string; desc: string }[];
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    imagem: '/assets/hero/hero-bem-vindo.jpg',
    overlay: 'overlay-yellow-soft',
    badge: 'Bem-vindo',
    titulo: "Bem-vindo à <span class='highlight-letter-yellow'>Associação</span> de Naturais e Amigos de Massinga",
    subtitulo: 'Unindo pessoas, fortalecendo comunidades, construindo o futuro de Massinga.',
    accentColor: '#FFD700',
    button: { text: 'Torne-se Membro', link: '/associar-se', color: '#FFD700' }
  },
  {
    imagem: '/assets/hero/hero-missao.jpg',
    overlay: 'overlay-red-soft',
    badge: 'Missão',
    titulo: "Nossa <span class='highlight-letter-red'>Missão</span>",
    subtitulo: 'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga.',
    accentColor: '#EF4444',
    button: { text: 'Torne-se Simpatizante', link: '/associar-se', color: '#EF4444' }
  },
  {
    imagem: '/assets/hero/hero-visao.jpg',
    overlay: 'overlay-blue-soft',
    badge: 'Visão',
    titulo: "Nossa <span class='highlight-letter-blue'>Visão</span>",
    subtitulo: 'Estabelecer Massinga como referência nacional em desenvolvimento local, sustentável e participativo.',
    accentColor: '#60A5FA',
    button: { text: 'Torne-se Apoiante', link: '/associar-se', color: '#60A5FA' }
  },
  {
    imagem: '/assets/hero/hero-valores.jpg',
    overlay: 'overlay-green-light',
    badge: 'Valores',
    titulo: "Nossos <span class='highlight-letter-green'>Valores</span>",
    subtitulo: 'Compromisso com o crescimento inclusivo e o potencial das comunidades de Massinga.',
    accentColor: '#4CAF50',
    button: { text: 'Torne-se Parceiro', link: '/parceiros', color: '#4CAF50' },
    valores: [
      { icon: 'competencias', label: 'Competências', desc: 'Capacitação e formação profissional' },
      { icon: 'networking', label: 'Networking', desc: 'Conexão com líderes e decisores' },
      { icon: 'oportunidades', label: 'Oportunidades', desc: 'Projetos em mineração, energia e agricultura' }
    ]
  }
];

export const SLIDER_CONFIG = {
  totalSlides: HERO_SLIDES.length,
  duracaoMs: 8000
};

// Mantido para compatibilidade com animações legadas
export interface SlideTexto {
  titulo: string;
  subtitulo: string;
}

export const SLIDE_TEXTOS: SlideTexto[] = HERO_SLIDES.map(s => ({
  titulo: s.titulo,
  subtitulo: s.subtitulo
}));
