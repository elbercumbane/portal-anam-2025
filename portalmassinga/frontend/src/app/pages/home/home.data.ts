// Dados dos slides da página inicial
// Textos para cada slide do carrossel
export interface SlideTexto {
  titulo: string;
  subtitulo: string;
}

export const SLIDE_TEXTOS: SlideTexto[] = [
  {
    titulo: "Bem-vindo à <span class='highlight-letter-yellow'>Associação</span> de Naturais e Amigos de Massinga",
    subtitulo: "Unindo pessoas, fortalecendo comunidades, construindo o futuro de Massinga."
  },
  {
    titulo: "Nossa <span class='highlight-letter-red'>Missão</span>",
    subtitulo: "Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais."
  },
  {
    titulo: "Nossa <span class='highlight-letter-yellow'>Visão</span>",
    subtitulo: "Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos."
  },
  {
    titulo: "Nossos <span class='highlight-letter-red'>Valores</span>",
    subtitulo: "<ul class='valores-list'><li><strong class='valores-title'>Desenvolvimento de Competências:</strong> Força de trabalho qualificada e programas de capacitação.</li><li><strong class='valores-title'>Networking Empresarial:</strong> Conexão com profissionais de alto nível e tomadores de decisão.</li><li><strong class='valores-title'>Oportunidades em Tempo Real:</strong> Projetos em mineração, energia, agricultura e infraestrutura.</li></ul>"
  }
];

// Configurações do slider
export const SLIDER_CONFIG = {
  totalSlides: 4,
  duracoesPorSlideMs: [8000, 8000, 8000, 8000], // 8 segundos para cada slide
  quantidadeFlocos: 50
};