import { Category, Product } from '../models/marketplace2.models';

export const MARKETPLACE_CATEGORIES: Category[] = [
  { id: 'todos', label: 'Todos os Produtos', icon: 'apps' },
  { id: 'artesanato', label: 'Artesanato', icon: 'brush' },
  { id: 'agricultura', label: 'Agricultura', icon: 'agriculture' },
  { id: 'servicos', label: 'Serviços', icon: 'build' },
  { id: 'alimentacao', label: 'Alimentação', icon: 'restaurant' },
  { id: 'vestuario', label: 'Vestuário', icon: 'checkroom' },
  { id: 'outros', label: 'Outros', icon: 'category' }
];

export const MARKETPLACE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Cestas Artesanais de Palha',
    description: 'Cestas tradicionais feitas à mão com palha local. Perfeitas para decoração e uso doméstico.',
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
    title: 'Produtos Agrícolas Orgânicos',
    description: 'Variedade de legumes e frutas frescas cultivadas localmente sem pesticidas.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    category: 'agricultura',
    seller: 'Cooperativa Agrícola',
    location: 'Inhambane',
    datePosted: '2024-01-14',
    featured: true
  },
  {
    id: 3,
    title: 'Serviços de Costura',
    description: 'Costura profissional para roupas tradicionais e modernas. Ajustes e reparos.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1515356619894-b8913e1ab8e1?w=400',
    category: 'servicos',
    seller: 'Ana Silva',
    location: 'Maputo',
    datePosted: '2024-01-13'
  },
  {
    id: 4,
    title: 'Mel Natural da Região',
    description: 'Mel puro extraído de forma sustentável. Embalagem de 500g.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    category: 'alimentacao',
    seller: 'Apicultores Locais',
    location: 'Vilanculos',
    datePosted: '2024-01-12',
    featured: true
  },
  {
    id: 5,
    title: 'Roupas Tradicionais',
    description: 'Capulanas e roupas tradicionais moçambicanas. Vários tamanhos disponíveis.',
    price: 400,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    category: 'vestuario',
    seller: 'Moda Tradicional',
    location: 'Beira',
    datePosted: '2024-01-11'
  },
  {
    id: 6,
    title: 'Oleaginosas e Sementes',
    description: 'Amendoim, gergelim e outras sementes locais. Pacotes de 1kg.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4e242c50?w=400',
    category: 'agricultura',
    seller: 'Produtores Locais',
    location: 'Chimoio',
    datePosted: '2024-01-10'
  },
  {
    id: 7,
    title: 'Cerâmica Artesanal',
    description: 'Vasos e utensílios de cerâmica feitos à mão. Cada peça é única.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    category: 'artesanato',
    seller: 'Artesãos Unidos',
    location: 'Nampula',
    datePosted: '2024-01-09'
  },
  {
    id: 8,
    title: 'Serviços de Jardinagem',
    description: 'Cuidados de jardim e paisagismo. Plantação e manutenção.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    category: 'servicos',
    seller: 'Verde Vida',
    location: 'Pemba',
    datePosted: '2024-01-08'
  },
  {
    id: 9,
    title: 'Doces Tradicionais',
    description: 'Doces caseiros feitos com receitas tradicionais. Variedade de sabores.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    category: 'alimentacao',
    seller: 'Doçuras da Terra',
    location: 'Quelimane',
    datePosted: '2024-01-07'
  },
  {
    id: 10,
    title: 'Acessórios de Tecido',
    description: 'Bolsas, carteiras e acessórios feitos com tecidos locais coloridos.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'vestuario',
    seller: 'Artesanato Textil',
    location: 'Tete',
    datePosted: '2024-01-06'
  },
  {
    id: 11,
    title: 'Serviços de Limpeza',
    description: 'Serviços profissionais de limpeza residencial e comercial.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    category: 'servicos',
    seller: 'Limpeza Express',
    location: 'Xai-Xai',
    datePosted: '2024-01-05'
  },
  {
    id: 12,
    title: 'Madeira Artesanal',
    description: 'Móveis e objetos decorativos feitos com madeira local trabalhada.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    category: 'artesanato',
    seller: 'Móveis Artesanais',
    location: 'Lichinga',
    datePosted: '2024-01-04'
  }
];

