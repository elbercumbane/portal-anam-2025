import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Evento {
  id: string;
  titulo: string;
  data: string;
  local: string;
  hora: string;
  descricao: string;
  imagem: string;
  status: 'proximo' | 'realizado';
}

@Component({
  selector: 'app-lista-eventos',
  standalone: false,
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.scss'
})
export class ListaEventosComponent {
  @Input() tipo: string = 'Próximos';
  
  eventos: Evento[] = [
    {
      id: '1',
      titulo: 'Workshop de Empreendedorismo',
      data: '15 de Março, 2024',
      local: 'Centro Cultural de Massinga',
      hora: '09:00 - 17:00',
      descricao: 'Aprenda as bases do empreendedorismo e como iniciar o seu próprio negócio.',
      imagem: '/assets/workshop-empreendedorismo.jpg',
      status: 'proximo'
    },
    {
      id: '2',
      titulo: 'Feira de Produtos Locais',
      data: '22 de Março, 2024',
      local: 'Praça Central de Massinga',
      hora: '08:00 - 18:00',
      descricao: 'Exposição e venda de produtos artesanais e agrícolas da região.',
      imagem: '/assets/mercado-maputo.jpg',
      status: 'proximo'
    },
    {
      id: '3',
      titulo: 'Conferência de Desenvolvimento Comunitário',
      data: '29 de Março, 2024',
      local: 'Auditório Municipal',
      hora: '14:00 - 18:00',
      descricao: 'Discussão sobre estratégias de desenvolvimento sustentável para a comunidade.',
      imagem: '/assets/desenvolvimento-comunitario.jpg',
      status: 'proximo'
    },
    {
      id: '4',
      titulo: 'Seminário de Capacitação',
      data: '10 de Janeiro, 2024',
      local: 'Centro de Formação',
      hora: '09:00 - 16:00',
      descricao: 'Seminário realizado com sucesso sobre capacitação empresarial.',
      imagem: '/assets/slider/slide1.jpg',
      status: 'realizado'
    }
  ];
  
  get eventosFiltrados(): Evento[] {
    if (this.tipo === 'Próximos') {
      return this.eventos.filter(e => e.status === 'proximo');
    } else {
      return this.eventos.filter(e => e.status === 'realizado');
    }
  }
  
  inscreverSe(eventoId: string) {
    console.log('Inscrição no evento:', eventoId);
  }
}
