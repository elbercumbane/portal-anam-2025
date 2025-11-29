import { Component } from '@angular/core';

interface OrgNode {
  tag: string;
  label: string;
  name?: string;
  contact?: string;
  children?: OrgNode[];
}

@Component({
  selector: 'app-organograma',
  standalone: false,
  templateUrl: './organograma.component.html',
  styleUrl: './organograma.component.scss'
})
export class OrganogramaComponent {
  orgStructure: OrgNode = {
    tag: 'Presidência',
    label: 'Presidente',
    name: 'Dr. João Silva',
    contact: 'presidente@anam.org',
    children: [
      {
        tag: 'Direção Executiva',
        label: 'Vice-Presidente',
        name: 'Maria Santos',
        contact: 'vice@anam.org',
        children: [
          {
            tag: 'Secretaria',
            label: 'Secretário-Geral',
            name: 'Carlos Mendes',
            contact: 'secretaria@anam.org'
          },
          {
            tag: 'Finanças',
            label: 'Tesoureira',
            name: 'Ana Costa',
            contact: 'tesouraria@anam.org'
          }
        ]
      },
      {
        tag: 'Conselho Consultivo',
        label: 'Coordenação',
        name: 'Comissão de Sábios',
        contact: 'conselho@anam.org',
        children: [
          {
            tag: 'Fiscalização',
            label: 'Conselho Fiscal',
            name: 'Painel de Auditoria',
            contact: 'fiscal@anam.org'
          }
        ]
      },
      {
        tag: 'Comissões',
        label: 'Coordenações Temáticas',
        children: [
          { tag: 'Eventos', label: 'Programação & Cerimónias', contact: 'eventos@anam.org' },
          { tag: 'Projectos', label: 'Desenvolvimento Local', contact: 'projectos@anam.org' },
          { tag: 'Comunicação', label: 'Media & Conteúdo', contact: 'comunicacao@anam.org' },
          { tag: 'Desenvolvimento', label: 'Capacitação & Inovação', contact: 'desenvolvimento@anam.org' }
        ]
      }
    ]
  };
}
