// Dados dos slides da página inicial
// Textos para cada slide do carrossel
export interface SlideTexto {
  titulo: string;
  subtitulo: string;
}

export const SLIDE_TEXTOS: SlideTexto[] = [
  {
    titulo: "Bem-vindo à Associação de Naturais e Amigos de Massinga",
    subtitulo: ""
  },
  {
    titulo: "Nossa Missão",
    subtitulo: "Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais."
  },
  {
    titulo: "Nossa Visão",
    subtitulo: "Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos."
  }
];

// Configurações do slider
export const SLIDER_CONFIG = {
  totalSlides: 3,
  duracoesPorSlideMs: [12000, 12000, 12000], // 12 segundos para cada slide
  quantidadeFlocos: 50
};

