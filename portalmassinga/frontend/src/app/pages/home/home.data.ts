// Dados dos slides da página inicial
// Textos para cada slide do carrossel
export interface SlideTexto {
  titulo: string;
  subtitulo: string;
}

export const SLIDE_TEXTOS: SlideTexto[] = [
  {
    titulo: "Bem-vindo à <span class='highlight-letter-yellow'>A</span>ssociação de <span class='highlight-letter-yellow'>N</span>aturais e <span class='highlight-letter-yellow'>A</span>migos de <span class='highlight-letter-yellow'>M</span>assinga",
    subtitulo: "Unindo pessoas, fortalecendo comunidades, construindo o futuro de <span class='highlight-letter-yellow'>M</span>assinga."
  },
  {
    titulo: "<span class='highlight-letter-red'>N</span>ossa <span class='highlight-letter-red'>M</span>issão",
    subtitulo: "Promover o desenvolvimento <span class='highlight-letter-red'>s</span>ustentável e melhorar o <span class='highlight-letter-red'>b</span>em-estar <span class='highlight-letter-red'>s</span>ocioeconómico das comunidades do <span class='highlight-letter-red'>D</span>istrito de <span class='highlight-letter-red'>M</span>assinga, gerindo e capitalizando estrategicamente os recursos e potencial locais."
  },
  {
    titulo: "<span class='highlight-letter-blue'>N</span>ossa <span class='highlight-letter-blue'>V</span>isão",
    subtitulo: "Estabelecer <span class='highlight-letter-blue'>M</span>assinga como uma referência <span class='highlight-letter-blue'>n</span>acional em desenvolvimento <span class='highlight-letter-blue'>l</span>ocal, sustentável e <span class='highlight-letter-blue'>p</span>articipativo, impulsionando um crescimento <span class='highlight-letter-blue'>i</span>nclusivo para todos."
  },
  {
    titulo: "<span class='highlight-letter-green'>N</span>ossos <span class='highlight-letter-green'>V</span>alores",
    subtitulo: "<strong>Desenvolvimento de Competências:</strong> Força de trabalho qualificada e programas de capacitação.<br><br><strong>Networking Empresarial:</strong> Conexão com profissionais de alto nível e tomadores de decisão.<br><br><strong>Oportunidades em Tempo Real:</strong> Projetos em mineração, energia, agricultura e infraestrutura."
  }
];

// Configurações do slider
export const SLIDER_CONFIG = {
  totalSlides: 4,
  duracoesPorSlideMs: [8000, 8000, 8000, 8000], // 8 segundos para cada slide
  quantidadeFlocos: 50
};

