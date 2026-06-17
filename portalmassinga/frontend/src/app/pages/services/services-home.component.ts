import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServiceCardComponent } from './sections/service-card.component';

interface Servico {
  iconType: string;
  titulo: string;
  descricao: string;
  subtitulo: string;
  beneficios: string[];
  cor: string;
  imagem?: string;
}

@Component({
  selector: 'app-services-home',
  standalone: false,
  templateUrl: './services-home.component.html',
  styleUrl: './services-home.component.scss'
})
export class ServicesHomeComponent implements OnInit, OnDestroy {

  servicoSelecionado: Servico | null = null;
  modalServicoAberto = false;

  constructor(private sanitizer: DomSanitizer) {}

  openServicoModal(servico: Servico): void {
    this.servicoSelecionado = servico;
    this.modalServicoAberto = true;
    document.body.style.overflow = 'hidden';
  }

  closeServicoModal(): void {
    this.modalServicoAberto = false;
    this.servicoSelecionado = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modalServicoAberto) this.closeServicoModal();
  }

  // Método para obter o SVG do ícone
  getIconSvg(iconType: string): SafeHtml {
    const icons: { [key: string]: string } = {
      // Ícones para Quem Apoiamos
      rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
      </svg>`,
      store: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
        <path d="M2 7h20"></path>
        <path d="M22 7v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"></path>
      </svg>`,
      agriculture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20"></path>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        <path d="M8 12h8"></path>
        <path d="M6 8h12"></path>
        <path d="M6 16h12"></path>
        <circle cx="12" cy="4" r="1"></circle>
        <circle cx="12" cy="20" r="1"></circle>
      </svg>`,
      community: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`,
      // Ícones para Serviços
      book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        <path d="M8 7h8"></path>
        <path d="M8 11h8"></path>
        <path d="M8 15h6"></path>
      </svg>`,
      tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>`,
      handshake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 12h2a2 2 0 1 0 0-4h-3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1"></path>
        <path d="M13 12h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3a2 2 0 1 0 0-4h-2"></path>
        <path d="M5 15h14"></path>
        <path d="M5 9h14"></path>
      </svg>`,
      check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`,
      money: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>`,
      network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>`
    };
    const svg = icons[iconType] || '';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // Serviços principais (6 serviços - 2 seções de 3)
  servicosPrincipais: Servico[] = [
    {
      iconType: 'book',
      titulo: 'Formação Empresarial Aplicada',
      descricao: 'Formação prática adaptada à realidade local',
      subtitulo: 'Aprendizagem rápida com aplicação imediata',
      beneficios: [
        'Gestão financeira básica para pequenos negócios',
        'Marketing digital acessível',
        'Planeamento simples de negócios',
        'Introdução à transformação digital'
      ],
      cor: '#51B155',
      imagem: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80'
    },
    {
      iconType: 'tools',
      titulo: 'Workshops Práticos',
      descricao: 'Aprendizagem rápida com aplicação imediata',
      subtitulo: 'Sessões práticas focadas em resultados',
      beneficios: [
        'Vendas no comércio local',
        'Atendimento ao cliente',
        'Gestão de pequenas equipas',
        'Produtividade e organização'
      ],
      cor: '#51B155',
      imagem: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80'
    },
    {
      iconType: 'handshake',
      titulo: 'Mentoria e Acompanhamento',
      descricao: 'Apoio contínuo para crescer com segurança',
      subtitulo: 'Mentores com experiência prática',
      beneficios: [
        'Sessões individuais e em grupo',
        'Definição de metas realistas',
        'Acompanhamento no terreno',
        'Suporte personalizado para cada negócio'
      ],
      cor: '#51B155',
      imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    },
    {
      iconType: 'check',
      titulo: 'Certificação e Reconhecimento',
      descricao: 'Valorização do percurso do empreendedor',
      subtitulo: 'Certificados reconhecidos',
      beneficios: [
        'Parcerias institucionais',
        'Actualização profissional',
        'Validação de competências',
        'Reconhecimento no mercado local'
      ],
      cor: '#51B155',
      imagem: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'
    },
    {
      iconType: 'money',
      titulo: 'Acesso a Financiamento',
      descricao: 'Facilitamos o acesso a recursos financeiros para o seu negócio',
      subtitulo: 'Conectamos empreendedores a oportunidades de financiamento',
      beneficios: [
        'Orientações para candidaturas a fundos',
        'Apoio na elaboração de propostas',
        'Conexão com instituições financeiras',
        'Acompanhamento no processo de financiamento'
      ],
      cor: '#51B155',
      imagem: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
    },
    {
      iconType: 'network',
      titulo: 'Networking e Parcerias',
      descricao: 'Conecte-se com outros empreendedores e crie oportunidades',
      subtitulo: 'Rede de contactos e parcerias estratégicas',
      beneficios: [
        'Eventos de networking mensais',
        'Feiras e exposições locais',
        'Parcerias entre membros',
        'Acesso a fornecedores e clientes'
      ],
      cor: '#51B155',
      imagem: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
    }
  ];
  
  // Dividir serviços em 2 grupos de 3
  get servicosSecao1(): Servico[] {
    return this.servicosPrincipais.slice(0, 3);
  }
  
  get servicosSecao2(): Servico[] {
    return this.servicosPrincipais.slice(3, 6);
  }

  ngOnInit() {
    document.body.classList.add('navbar-solid');
  }

  ngOnDestroy() {
    document.body.classList.remove('navbar-solid');
    document.body.style.overflow = '';
  }
}
