import { Category, Product } from '../models/marketplace2.models';

// Categorias: produtos locais de Massinga/Inhambane (sem vestuário)
export const MARKETPLACE_CATEGORIES: Category[] = [
  { id: 'todos', label: 'Todos os Produtos', icon: 'apps' },
  { id: 'artesanato', label: 'Artesanato', icon: 'brush' },
  { id: 'agricultura', label: 'Agricultura', icon: 'agriculture' },
  { id: 'servicos', label: 'Serviços', icon: 'build' },
  { id: 'alimentacao', label: 'Alimentação', icon: 'restaurant' },
  { id: 'outros', label: 'Outros', icon: 'category' }
];

// Produtos da província de Inhambane (Massinga, Inhambane, Maxixe, Vilanculos, etc.)
export const MARKETPLACE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Cestas de Palha de Massinga',
    description: 'Cestas tradicionais feitas à mão com palha local em Massinga. Perfeitas para uso doméstico e decoração.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
    category: 'artesanato',
    seller: 'Maria João',
    location: 'Massinga',
    datePosted: '2024-01-15',
    featured: true
  },
  {
    id: 2,
    title: 'Legumes e Frutas Orgânicas de Inhambane',
    description: 'Tomate, couve, repolho e frutas frescas cultivadas na região de Inhambane, sem pesticidas.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    category: 'agricultura',
    seller: 'Cooperativa Agrícola de Inhambane',
    location: 'Inhambane',
    datePosted: '2024-01-14',
    featured: true
  },
  {
    id: 3,
    title: 'Mel Natural da Costa de Inhambane',
    description: 'Mel puro extraído de forma sustentável nas florestas da província. Embalagem de 500g.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    category: 'alimentacao',
    seller: 'Apicultores de Massinga',
    location: 'Massinga',
    datePosted: '2024-01-13',
    featured: true
  },
  {
    id: 4,
    title: 'Oleaginosas e Amendoim de Massinga',
    description: 'Amendoim, gergelim e outras sementes locais da região. Pacotes de 1kg. Produto 100% local.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4e242c50?w=400',
    category: 'agricultura',
    seller: 'Produtores de Massinga',
    location: 'Massinga',
    datePosted: '2024-01-12'
  },
  {
    id: 5,
    title: 'Cerâmica Artesanal de Inhambane',
    description: 'Vasos e utensílios de cerâmica feitos à mão por artesãos locais. Cada peça é única.',
    price: 400,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    category: 'artesanato',
    seller: 'Artesãos de Inhambane',
    location: 'Inhambane',
    datePosted: '2024-01-11'
  },
  {
    id: 6,
    title: 'Coco e Derivados de Vilanculos',
    description: 'Coco fresco, óleo de coco e raspas de coco secas. Produzido na costa de Vilanculos.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400',
    category: 'alimentacao',
    seller: 'Cooperativa de Vilanculos',
    location: 'Vilanculos',
    datePosted: '2024-01-10'
  },
  {
    id: 7,
    title: 'Móveis em Madeira de Massinga',
    description: 'Cadeiras, mesas e bancos feitos com madeira local trabalhada por carpinteiros da região.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    category: 'artesanato',
    seller: 'Móveis Massinga',
    location: 'Massinga',
    datePosted: '2024-01-09'
  },
  {
    id: 8,
    title: 'Serviço de Transporte Agrícola',
    description: 'Transporte de produtos agrícolas entre Massinga, Inhambane e Maxixe. Caminhões e pick-ups.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
    category: 'servicos',
    seller: 'Transportes Inhambane',
    location: 'Maxixe',
    datePosted: '2024-01-08'
  },
  {
    id: 9,
    title: 'Doces e Compotas Caseiras',
    description: 'Doces de manga, goiaba e caju. Compotas tradicionais feitas com frutas da província.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    category: 'alimentacao',
    seller: 'Doçuras de Inhambane',
    location: 'Inhambane',
    datePosted: '2024-01-07'
  },
  {
    id: 10,
    title: 'Cestos e Esteiras de Fibra Natural',
    description: 'Cestos e esteiras feitos com fibras naturais da região. Artesanato tradicional de Massinga.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    category: 'artesanato',
    seller: 'Artesanato Massinga',
    location: 'Massinga',
    datePosted: '2024-01-06'
  },
  {
    id: 11,
    title: 'Serviço de Moagem de Cereais',
    description: 'Moagem de milho, mapira e outros cereais locais. Serviço disponível em Massinga.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'servicos',
    seller: 'Moinho Massinga',
    location: 'Massinga',
    datePosted: '2024-01-05'
  },
  {
    id: 12,
    title: 'Mandioca e Farinha de Mandioca',
    description: 'Mandioca fresca e farinha de mandioca produzida localmente em Inhambane. Sacos de 10kg.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400',
    category: 'agricultura',
    seller: 'Agricultores Locais',
    location: 'Inhambane',
    datePosted: '2024-01-04'
  },
  {
    id: 13,
    title: 'Pescado Seco e Camarão',
    description: 'Pescado seco e camarão da costa de Inhambane e Vilanculos. Produto fresco e de qualidade.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400',
    category: 'alimentacao',
    seller: 'Pescadores de Vilanculos',
    location: 'Vilanculos',
    datePosted: '2024-01-03',
    featured: true
  },
  {
    id: 14,
    title: 'Reparação de Equipamentos Agrícolas',
    description: 'Serviço de reparação de arados, enxadas e equipamentos agrícolas. Massinga e arredores.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400',
    category: 'servicos',
    seller: 'Oficina Massinga',
    location: 'Massinga',
    datePosted: '2024-01-02'
  },
  {
    id: 15,
    title: 'Castanha de Caju de Inhambane',
    description: 'Castanha de caju torrada e salgada. Produção local da província de Inhambane. Pacote 500g.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1585072364516-9c0683d8b38a?w=400',
    category: 'alimentacao',
    seller: 'Cooperativa de Caju',
    location: 'Inhambane',
    datePosted: '2024-01-01'
  },
  {
    id: 16,
    title: 'Esculturas em Madeira',
    description: 'Esculturas tradicionais em madeira maciça. Figuras e máscaras feitas por artesãos de Massinga.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1564932459018-4c5f0c42c35a?w=400',
    category: 'artesanato',
    seller: 'Escultores Locais',
    location: 'Massinga',
    datePosted: '2023-12-30'
  },
  {
    id: 17,
    title: 'Feijão e Grãos de Massinga',
    description: 'Feijão manteiga, feijão nhemba e outros grãos cultivados na região. Sacos de 5kg.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400',
    category: 'agricultura',
    seller: 'Grãos Massinga',
    location: 'Massinga',
    datePosted: '2023-12-28'
  },
  {
    id: 18,
    title: 'Serviço de Cerca e Arame',
    description: 'Instalação de cercas para quintais e machambas. Serviço em Massinga e distritos vizinhos.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
    category: 'servicos',
    seller: 'Cercas Inhambane',
    location: 'Massinga',
    datePosted: '2023-12-25'
  }
];
