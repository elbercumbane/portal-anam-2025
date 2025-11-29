import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Parceiro {
  id: string;
  nome: string;
  logo: string;
  categoria: string;
  descricao: string;
}

@Component({
  selector: 'app-parceiros-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './parceiros-preview.component.html',
  styleUrl: './parceiros-preview.component.scss'
})
export class ParceirosPreviewComponent {
  
  parceiros: Parceiro[] = [
    {
      id: '1',
      nome: 'Empresa Alfa',
      logo: '/assets/slider/logo.png',
      categoria: 'Tecnologia',
      descricao: 'Especializada em soluções digitais para empresas'
    },
    {
      id: '2',
      nome: 'Empresa Beta',
      logo: '/assets/slider/logo.png',
      categoria: 'Serviços',
      descricao: 'Consultoria empresarial focada em gestão financeira'
    },
    {
      id: '3',
      nome: 'Empresa Gama',
      logo: '/assets/slider/logo.png',
      categoria: 'Comércio',
      descricao: 'Distribuidora de produtos locais da região'
    },
    {
      id: '4',
      nome: 'Empresa Delta',
      logo: '/assets/slider/logo.png',
      categoria: 'Tecnologia',
      descricao: 'IoT para agricultura e otimização de colheitas'
    },
    {
      id: '5',
      nome: 'Empresa Épsilon',
      logo: '/assets/slider/logo.png',
      categoria: 'Serviços',
      descricao: 'Agência de marketing digital para PMEs'
    },
    {
      id: '6',
      nome: 'Empresa Zeta',
      logo: '/assets/slider/logo.png',
      categoria: 'Comércio',
      descricao: 'Materiais de construção com foco sustentável'
    }
  ];
}
