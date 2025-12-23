import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from './sections/service-card.component';

interface Servico {
  icon: string;
  titulo: string;
  descricao: string;
  beneficios: string[];
  cor: string;
  categoria: string;
}

interface Categoria {
  id: string;
  nome: string;
}

interface CasoSucesso {
  titulo: string;
  testemunho: string;
  autor: string;
  negocio: string;
}

interface Indicador {
  valor: string;
  descricao: string;
}

@Component({
  selector: 'app-services-home',
  standalone: false,
  templateUrl: './services-home.component.html',
  styleUrl: './services-home.component.scss'
})
export class ServicesHomeComponent implements OnInit, OnDestroy {

  // Categorias para filtro
  categorias: Categoria[] = [
    { id: 'formacao', nome: 'Formação & Desenvolvimento' },
    { id: 'conexao', nome: 'Conexão & Parcerias' },
    { id: 'consultoria', nome: 'Consultoria & Apoio Técnico' },
    { id: 'recursos', nome: 'Vantagens & Recursos' }
  ];

  categoriaAtiva: string = 'formacao';

  // Serviços com categorias (4 por categoria)
  todosServicos: Servico[] = [
    // ========== FORMAÇÃO & DESENVOLVIMENTO ==========
    {
      icon: '🎓',
      titulo: 'Capacitação Empresarial',
      descricao: 'Programas de formação especializados para desenvolvimento de competências',
      beneficios: [
        'Gestão financeira',
        'Marketing digital',
        'Liderança',
        'Transformação digital'
      ],
      cor: '#2563EB',
      categoria: 'formacao'
    },
    {
      icon: 'build',
      titulo: 'Workshops Práticos',
      descricao: 'Sessões práticas e intensivas para aprendizagem rápida de novas competências',
      beneficios: [
        'Vendas e negociação',
        'Atendimento ao cliente',
        'Gestão de equipas',
        'Produtividade'
      ],
      cor: '#0891B2',
      categoria: 'formacao'
    },
    {
      icon: 'explore',
      titulo: 'Mentoria Executiva',
      descricao: 'Acompanhamento personalizado por empresários experientes',
      beneficios: [
        'Mentores certificados',
        'Sessões individuais',
        'Plano de desenvolvimento',
        'Acompanhamento contínuo'
      ],
      cor: '#4F46E5',
      categoria: 'formacao'
    },
    {
      icon: 'verified',
      titulo: 'Certificações Profissionais',
      descricao: 'Programas de certificação reconhecidos pelo mercado',
      beneficios: [
        'Certificados válidos',
        'Parcerias institucionais',
        'Reconhecimento nacional',
        'Actualização profissional'
      ],
      cor: '#7C3AED',
      categoria: 'formacao'
    },

    // ========== CONEXÃO & PARCERIAS ==========
    {
      icon: 'handshake',
      titulo: 'Networking e Parcerias',
      descricao: 'Conecte-se com outros empresários e crie oportunidades de negócio',
      beneficios: [
        'Eventos mensais',
        'B2B matching',
        'Feiras e exposições',
        'Mentoria entre associados'
      ],
      cor: '#059669',
      categoria: 'conexao'
    },
    {
      icon: 'event',
      titulo: 'Eventos de Negócios',
      descricao: 'Conferências, seminários e encontros empresariais exclusivos',
      beneficios: [
        'Conferências anuais',
        'Pequenos-almoços empresariais',
        'Painéis de discussão',
        'Encontros temáticos'
      ],
      cor: '#10B981',
      categoria: 'conexao'
    },
    {
      icon: 'flight',
      titulo: 'Missões Empresariais',
      descricao: 'Viagens de negócios para explorar novos mercados e parcerias',
      beneficios: [
        'Visitas a empresas',
        'Feiras internacionais',
        'Contactos comerciais',
        'Estudos de mercado'
      ],
      cor: '#14B8A6',
      categoria: 'conexao'
    },
    {
      icon: 'account_balance',
      titulo: 'Clube de Investidores',
      descricao: 'Rede de investidores para apoiar projectos promissores',
      beneficios: [
        'Pitch sessions',
        'Acesso a capital',
        'Mentoria de investidores',
        'Due diligence'
      ],
      cor: '#047857',
      categoria: 'conexao'
    },

    // ========== CONSULTORIA & APOIO TÉCNICO ==========
    {
      icon: 'business_center',
      titulo: 'Consultoria Especializada',
      descricao: 'Apoio técnico personalizado para resolver desafios específicos do seu negócio',
      beneficios: [
        'Otimização de processos',
        'Planeamento estratégico',
        'Acesso a financiamento',
        'Compliance'
      ],
      cor: '#EA580C',
      categoria: 'consultoria'
    },
    {
      icon: 'gavel',
      titulo: 'Apoio Jurídico',
      descricao: 'Assessoria legal para proteger e fazer crescer o seu negócio',
      beneficios: [
        'Contratos comerciais',
        'Registo de empresas',
        'Propriedade intelectual',
        'Resolução de conflitos'
      ],
      cor: '#DC2626',
      categoria: 'consultoria'
    },
    {
      icon: 'bar_chart',
      titulo: 'Assessoria Contabilística',
      descricao: 'Serviços de contabilidade e gestão financeira para PMEs',
      beneficios: [
        'Contabilidade organizada',
        'Declarações fiscais',
        'Relatórios financeiros',
        'Planeamento fiscal'
      ],
      cor: '#F59E0B',
      categoria: 'consultoria'
    },
    {
      icon: 'assignment',
      titulo: 'Gestão de Projectos',
      descricao: 'Apoio na elaboração e gestão de projectos de investimento',
      beneficios: [
        'Elaboração de projectos',
        'Candidaturas a fundos',
        'Gestão e monitoria',
        'Relatórios de progresso'
      ],
      cor: '#D97706',
      categoria: 'consultoria'
    },

    // ========== VANTAGENS & RECURSOS ==========
    {
      icon: 'menu_book',
      titulo: 'Acesso a Recursos',
      descricao: 'Ferramentas, plataformas e benefícios exclusivos para membros',
      beneficios: [
        'Base de fornecedores',
        'Biblioteca digital',
        'Coworking',
        'Benefícios e programas'
      ],
      cor: '#8B5CF6',
      categoria: 'recursos'
    },
    {
      icon: 'local_offer',
      titulo: 'Descontos Exclusivos',
      descricao: 'Parcerias com empresas para descontos especiais aos membros',
      beneficios: [
        'Serviços bancários',
        'Seguros empresariais',
        'Software e tecnologia',
        'Viagens e alojamento'
      ],
      cor: '#A855F7',
      categoria: 'recursos'
    },
    {
      icon: 'business',
      titulo: 'Espaços de Trabalho',
      descricao: 'Acesso a espaços de coworking e salas de reunião',
      beneficios: [
        'Coworking gratuito',
        'Salas de reunião',
        'Espaços para eventos',
        'Endereço comercial'
      ],
      cor: '#6366F1',
      categoria: 'recursos'
    },
    {
      icon: 'computer',
      titulo: 'Ferramentas Digitais',
      descricao: 'Acesso a plataformas e software para gestão do negócio',
      beneficios: [
        'CRM para membros',
        'Facturação electrónica',
        'Gestão de stocks',
        'Marketing automation'
      ],
      cor: '#7C3AED',
      categoria: 'recursos'
    }
  ];

  // Serviços filtrados (inicialmente todos)
  servicos: Servico[] = [];

  // Casos de Sucesso
  casosSucesso: CasoSucesso[] = [
    {
      titulo: 'Acesso a Financiamento Mudou Meu Negócio',
      testemunho: 'Com apoio da ANAM, consegui um financiamento de 50.000MT e expandi minha loja.',
      autor: 'Maria João',
      negocio: 'Comércio Local'
    },
    {
      titulo: 'Da Formação à Aplicação Prática',
      testemunho: 'A formação em marketing digital aumentou minhas vendas online em 60% em 3 meses.',
      autor: 'Carlos Muchanga',
      negocio: 'Agro-Negócio'
    }
  ];

  // Indicadores de Impacto
  indicadores: Indicador[] = [
    { valor: '150+', descricao: 'Negócios Apoiados' },
    { valor: '50+', descricao: 'Financiamentos Concretizados' },
    { valor: '300+', descricao: 'Empreendedores Formados' },
    { valor: '95%', descricao: 'Satisfação dos Membros' }
  ];
  
  ngOnInit() {
    document.body.classList.add('navbar-solid');
    // Iniciar com a categoria Formação & Desenvolvimento
    this.filtrarPorCategoria('formacao');
  }

  ngOnDestroy() {
    document.body.classList.remove('navbar-solid');
  }

  filtrarPorCategoria(categoriaId: string): void {
    this.categoriaAtiva = categoriaId;
    this.servicos = this.todosServicos.filter(s => s.categoria === categoriaId);
  }
}
