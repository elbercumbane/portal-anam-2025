import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface OrgNode {
  id: string;
  tag: string;
  label: string;
  name?: string;
  contact?: string;
  icon?: string;
  children?: OrgNode[];
}

interface MensagemMembro {
  nome: string;
  cargo: string;
  texto: string;
  foto?: string;
}

@Component({
  selector: 'app-org-chart',
  standalone: false,
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss'
})
export class OrgChartComponent implements OnInit, OnDestroy {
  activeNode: string | null = null;

  mensagensMembros: MensagemMembro[] = [
    {
      nome: 'Gilberto Matsenguane',
      cargo: 'Membro do Conselho',
      texto: 'Como membro do conselho da ANAM, trabalho para que a nossa estrutura reflita o compromisso com Massinga. Acreditamos numa gestão transparente e orientada ao impacto na comunidade.',
      foto: '/assets/FOTO1 ANAM.jpeg'
    },
    {
      nome: 'Carlos Muchanga',
      cargo: 'Membro do Conselho',
      texto: 'A ANAM deu-me as ferramentas para organizar o meu negócio. No conselho, contribuímos para que a associação continue a apoiar os empreendedores de Massinga.',
      foto: '/assets/FOTO 3 ANAM.jpeg'
    },
    {
      nome: 'António Machel',
      cargo: 'Membro do Conselho',
      texto: 'Ser membro do conselho da ANAM significa fazer parte de um projecto colectivo. Temos mentoria, eventos e uma comunidade que acredita no desenvolvimento do nosso distrito.',
      foto: '/assets/FOTO 4 ANAM.jpeg'
    },
    {
      nome: 'João Pedro',
      cargo: 'Membro do Conselho',
      texto: 'A ANAM valoriza o que fazemos aqui. No conselho, procuramos que as oportunidades de networking e os programas de capacitação cheguem a todos.',
      foto: '/assets/galeria/workshop1.jpg'
    }
  ];
  
  // Estrutura organizacional
  orgStructure: OrgNode = {
    id: 'president',
    tag: 'Presidência',
    label: 'Presidente',
    name: 'Dr. João Silva',
    contact: 'presidente@anam.org',
    children: [
      {
        id: 'vice',
        tag: 'Direção Executiva',
        label: 'Vice-Presidente',
        name: 'Maria Santos',
        contact: 'vice@anam.org',
        children: [
          {
            id: 'secretario',
            tag: 'Secretaria',
            label: 'Secretário-Geral',
            name: 'Carlos Mendes',
            contact: 'secretaria@anam.org'
          },
          {
            id: 'tesoureiro',
            tag: 'Finanças',
            label: 'Tesoureira',
            name: 'Ana Costa',
            contact: 'tesouraria@anam.org'
          }
        ]
      },
      {
        id: 'conselho',
        tag: 'Conselho Consultivo',
        label: 'Coordenação',
        name: 'Comissão de Sábios',
        contact: 'conselho@anam.org',
        children: [
          {
            id: 'fiscal',
            tag: 'Fiscalização',
            label: 'Conselho Fiscal',
            name: 'Painel de Auditoria',
            contact: 'fiscal@anam.org'
          }
        ]
      },
      {
        id: 'comissoes',
        tag: 'Comissões',
        label: 'Coordenações Temáticas',
        children: [
          { 
            id: 'eventos',
            tag: 'Eventos', 
            label: 'Programação & Cerimónias', 
            contact: 'eventos@anam.org' 
          },
          { 
            id: 'projectos',
            tag: 'Projectos', 
            label: 'Desenvolvimento Local', 
            contact: 'projectos@anam.org' 
          },
          { 
            id: 'comunicacao',
            tag: 'Comunicação', 
            label: 'Media & Conteúdo', 
            contact: 'comunicacao@anam.org' 
          },
          { 
            id: 'inovacao',
            tag: 'Desenvolvimento', 
            label: 'Capacitação & Inovação', 
            contact: 'desenvolvimento@anam.org' 
          }
        ]
      }
    ]
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicialização - pode adicionar animações de entrada
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    // Limpeza se necessário
  }

  /**
   * Define o nó ativo (para efeitos de hover)
   */
  setActiveNode(nodeId: string): void {
    this.activeNode = nodeId;
  }

  /**
   * Limpa o nó ativo
   */
  clearActiveNode(): void {
    this.activeNode = null;
  }

  /**
   * Verifica se um nó está ativo
   */
  isNodeActive(nodeId: string): boolean {
    return this.activeNode === nodeId;
  }

  /**
   * Inicializa animações de entrada
   */
  private initializeAnimations(): void {
    // Animação de entrada escalonada para os elementos
    setTimeout(() => {
      const nodes = document.querySelectorAll('.root-node, .branch-node, .leaf-node');
      nodes.forEach((node, index) => {
        (node as HTMLElement).style.animationDelay = `${index * 0.1}s`;
        node.classList.add('animate-in');
      });
    }, 100);
  }

  /**
   * Navega para o email do contato
   */
  contactMember(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
