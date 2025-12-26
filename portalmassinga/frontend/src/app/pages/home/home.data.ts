// Dados dos slides da página inicial
// Textos para cada slide do carrossel
export interface SlideTexto {
  titulo: string;
  subtitulo: string;
}

export const SLIDE_TEXTOS: SlideTexto[] = [
  {
    titulo: "Bem-vindo à <span class='highlight-letter-green'>A</span>ssociação de <span class='highlight-letter'>N</span>aturais e <span class='highlight-letter-green'>A</span>migos de <span class='highlight-letter-red'>M</span>assinga",
    subtitulo: "Unindo pessoas, fortalecendo comunidades, construindo o futuro de <span class='highlight-letter-green'>M</span>assinga."
  },
  {
    titulo: "<span class='highlight-letter-green'>N</span>ossa <span class='highlight-letter'>M</span>issão",
    subtitulo: "Promover o desenvolvimento <span class='highlight-letter-green'>s</span>ustentável e melhorar o <span class='highlight-letter'>b</span>em-estar <span class='highlight-letter-green'>s</span>ocioeconómico das comunidades do <span class='highlight-letter-red'>D</span>istrito de <span class='highlight-letter-green'>M</span>assinga, gerindo e capitalizando estrategicamente os recursos e potencial locais."
  },
  {
    titulo: "<span class='highlight-letter-green'>N</span>ossa <span class='highlight-letter'>V</span>isão",
    subtitulo: "Estabelecer <span class='highlight-letter-red'>M</span>assinga como uma referência <span class='highlight-letter-green'>n</span>acional em desenvolvimento <span class='highlight-letter'>l</span>ocal, sustentável e <span class='highlight-letter-green'>p</span>articipativo, impulsionando um crescimento <span class='highlight-letter'>i</span>nclusivo para todos."
  }
];

// Configurações do slider
export const SLIDER_CONFIG = {
  totalSlides: 3,
  duracoesPorSlideMs: [12000, 12000, 12000], // 12 segundos para cada slide
  quantidadeFlocos: 50
};

