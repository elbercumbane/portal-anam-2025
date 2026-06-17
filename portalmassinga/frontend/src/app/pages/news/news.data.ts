export interface Noticia {
  id: number;
  titulo: string;
  data: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  imagem: string;
}

/** Imagens locais em public/assets — paths com espaços codificados */
export const NOTICIAS: Noticia[] = [
  {
    id: 1,
    titulo: 'Nova Parceria com Organização Internacional',
    data: '15 de Janeiro, 2025',
    categoria: 'Parcerias',
    resumo: 'A nossa associação estabeleceu uma parceria importante com uma organização internacional para apoiar projetos de desenvolvimento comunitário.',
    conteudo: 'Esta parceria trará recursos adicionais para apoiar os nossos projetos de educação, saúde e desenvolvimento económico na comunidade de Massinga. A colaboração incluirá programas de capacitação, apoio técnico e financiamento para iniciativas locais que visam melhorar a qualidade de vida dos residentes.',
    imagem: '/assets/FOTO1%20ANAM.jpeg'
  },
  {
    id: 2,
    titulo: 'Campanha de Limpeza Comunitária',
    data: '12 de Janeiro, 2025',
    categoria: 'Meio Ambiente',
    resumo: 'Mais de 200 pessoas participaram na campanha de limpeza que organizámos no centro da vila. Um sucesso total!',
    conteudo: 'A campanha resultou na recolha de mais de 2 toneladas de lixo e sensibilizou a comunidade para a importância de manter o ambiente limpo. O evento contou com a participação de voluntários de todas as idades e foi apoiado pela administração local.',
    imagem: '/assets/Massinga-Beach-001-Accommodation.jpg'
  },
  {
    id: 3,
    titulo: 'Workshop de Capacitação para Jovens',
    data: '10 de Janeiro, 2025',
    categoria: 'Educação',
    resumo: 'Iniciámos um programa de capacitação para jovens da comunidade, focado em competências digitais e empreendedorismo.',
    conteudo: 'O programa tem duração de 3 meses e inclui formação em informática básica, gestão de negócios e marketing digital. Os participantes receberão certificados e terão acesso a mentoria contínua para desenvolver os seus projetos empresariais.',
    imagem: '/assets/workshop-empreendedorismo.jpg'
  },
  {
    id: 4,
    titulo: 'Relatório Anual 2024',
    data: '8 de Janeiro, 2025',
    categoria: 'Relatórios',
    resumo: 'Publicámos o nosso relatório anual com os resultados alcançados em 2024 e os planos para 2025.',
    conteudo: 'O relatório mostra um crescimento de 40% no número de membros e a implementação de 15 novos projetos comunitários. Para 2025, planeamos expandir os nossos programas de educação e criar novas oportunidades de emprego na região.',
    imagem: '/assets/slider/slide3.jpg'
  },
  {
    id: 5,
    titulo: 'Inauguração do Novo Centro Comunitário',
    data: '5 de Janeiro, 2025',
    categoria: 'Infraestrutura',
    resumo: 'Foi inaugurado o novo centro comunitário que servirá como espaço para reuniões, eventos e atividades educativas.',
    conteudo: 'O centro comunitário, construído com o apoio de parceiros locais e internacionais, possui salas de reunião, espaço para eventos, biblioteca e área de informática. Este espaço permitirá expandir significativamente as atividades da associação.',
    imagem: '/assets/servicos-hero.jpg'
  },
  {
    id: 6,
    titulo: 'Programa de Apoio à Saúde Materno-Infantil',
    data: '3 de Janeiro, 2025',
    categoria: 'Saúde',
    resumo: 'Lançámos um novo programa focado na saúde materno-infantil, oferecendo consultas e acompanhamento gratuito.',
    conteudo: 'O programa visa melhorar os indicadores de saúde materno-infantil na região, oferecendo consultas pré-natais, acompanhamento pós-parto e educação sobre cuidados com recém-nascidos.',
    imagem: '/assets/FOTO%204%20ANAM.jpeg'
  },
  {
    id: 7,
    titulo: 'Festival Cultural de Massinga',
    data: '28 de Dezembro, 2024',
    categoria: 'Cultura',
    resumo: 'Realizámos o primeiro festival cultural da comunidade, celebrando a diversidade e tradições locais.',
    conteudo: 'O festival contou com apresentações de música tradicional, dança, artesanato e gastronomia local. Mais de 500 pessoas participaram no evento, que teve como objetivo promover a cultura local e fortalecer os laços comunitários.',
    imagem: '/assets/FOTO%203%20ANAM.jpeg'
  },
  {
    id: 8,
    titulo: 'Projeto de Agricultura Sustentável',
    data: '20 de Dezembro, 2024',
    categoria: 'Desenvolvimento',
    resumo: 'Iniciámos um projeto de agricultura sustentável que ensina técnicas modernas de cultivo a agricultores locais.',
    conteudo: 'O projeto visa melhorar a produtividade agrícola através de técnicas sustentáveis e adaptadas ao clima local. Os agricultores participantes recebem formação em compostagem, irrigação eficiente e gestão de culturas.',
    imagem: '/assets/desenvolvimento-comunitario.jpg'
  },
  {
    id: 9,
    titulo: 'Assembleia Geral Anual da ANAM',
    data: '15 de Dezembro, 2024',
    categoria: 'Relatórios',
    resumo: 'Realizámos a assembleia geral anual com a participação activa de membros, simpatizantes e parceiros da associação.',
    conteudo: 'Durante a assembleia foram apresentados os balanços financeiros, os resultados dos projectos em curso e as prioridades estratégicas para o próximo ano. Os participantes tiveram oportunidade de debater e contribuir com propostas para o fortalecimento da ANAM.',
    imagem: '/assets/membros-background.jpg'
  },
  {
    id: 10,
    titulo: 'Feira de Empreendedorismo e Negócios Locais',
    data: '10 de Dezembro, 2024',
    categoria: 'Desenvolvimento',
    resumo: 'A ANAM organizou uma feira que reuniu empreendedores locais para expor produtos, serviços e criar novas oportunidades de negócio.',
    conteudo: 'A feira contou com mais de 30 expositores e centenas de visitantes. O evento promoveu o networking entre empresários da região e facilitou o acesso a mentoria e apoio técnico para pequenos negócios em fase de crescimento.',
    imagem: '/assets/mercado-maputo.jpg'
  },
  {
    id: 11,
    titulo: 'Campanha de Doação de Material Escolar',
    data: '5 de Dezembro, 2024',
    categoria: 'Educação',
    resumo: 'Distribuímos material escolar a centenas de crianças de famílias carenciadas no distrito de Massinga.',
    conteudo: 'A campanha foi possível graças à generosidade de membros, parceiros e empresas locais. Foram entregues kits escolares completos, incluindo cadernos, lápis, mochilas e livros, apoiando o acesso à educação nas comunidades mais vulneráveis.',
    imagem: '/assets/slider/slide1.jpg'
  },
  {
    id: 12,
    titulo: 'Novo Protocolo com Parceiros Institucionais',
    data: '1 de Dezembro, 2024',
    categoria: 'Parcerias',
    resumo: 'Foi assinado um protocolo de cooperação com instituições públicas e privadas para ampliar o impacto dos nossos programas.',
    conteudo: 'O protocolo prevê cooperação em áreas como educação, saúde, infraestrutura e desenvolvimento económico. Esta aliança estratégica permitirá à ANAM expandir a sua actuação e alcançar mais famílias em Massinga e arredores.',
    imagem: '/assets/parceiros.png'
  },
  {
    id: 13,
    titulo: 'Jornadas de Voluntariado Comunitário',
    data: '25 de Novembro, 2024',
    categoria: 'Cultura',
    resumo: 'Voluntários da ANAM dedicaram um fim-de-semana a actividades de apoio directo às comunidades locais.',
    conteudo: 'As jornadas incluíram visitas a famílias, apoio em hortas comunitárias, actividades lúdicas com crianças e sessões de sensibilização sobre cidadania e participação comunitária. O espírito de solidariedade reforçou os laços entre membros e residentes.',
    imagem: '/assets/slider/slide2.jpg'
  },
  {
    id: 14,
    titulo: 'Programa de Mentoria para Mulheres Empreendedoras',
    data: '18 de Novembro, 2024',
    categoria: 'Desenvolvimento',
    resumo: 'Lançámos um programa de mentoria dedicado a mulheres que pretendem iniciar ou expandir os seus negócios.',
    conteudo: 'O programa oferece acompanhamento personalizado, formação em gestão financeira, marketing e acesso a redes de contactos. No primeiro ciclo, 25 mulheres foram seleccionadas para receber mentoria de empresárias experientes da região.',
    imagem: '/assets/Agostinho_PCA.jpg'
  },
  {
    id: 15,
    titulo: 'Sessão de Formação em Primeiros Socorros',
    data: '12 de Novembro, 2024',
    categoria: 'Saúde',
    resumo: 'Mais de 40 participantes foram capacitados em técnicas de primeiros socorros para actuar em situações de emergência.',
    conteudo: 'A formação foi ministrada por profissionais de saúde e incluiu práticas simuladas de reanimação, controlo de hemorragias e atendimento a vítimas de acidentes. Os participantes receberam certificados de conclusão.',
    imagem: '/assets/background-projetos.png'
  }
];

export const NOTICIA_IMAGE_FALLBACK = '/assets/anam-logo.png';
