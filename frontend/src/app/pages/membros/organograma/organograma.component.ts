import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrgNode {
  id: string;
  tag: string;
  label: string;
  name?: string;
  contact?: string;
  icon?: string;
  children?: OrgNode[];
}

@Component({
  selector: 'app-organograma',
  standalone: false,
  templateUrl: './organograma.component.html',
  styleUrl: './organograma.component.scss'
})
export class OrganogramaComponent implements OnInit, OnDestroy {
  activeNode: string | null = null;
  
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
