import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PageTransitionService } from '../../services/page-transition.service';

interface Evento {
  titulo: string;
  data: string;
  descricao: string;
  local: string;
  horario: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
})
export class EventosComponent implements OnInit {
  @ViewChild('eventosContent', { static: true }) eventosContent!: ElementRef;

  eventos: Evento[] = [
    {
      titulo: 'Workshop de Agricultura Sustentável',
      data: '15 de Janeiro, 2024',
      descricao: 'Aprenda técnicas modernas de agricultura sustentável para melhorar a produtividade das suas culturas.',
      local: 'Centro Comunitário de Massinga',
      horario: '09:00 - 16:00'
    },
    {
      titulo: 'Encontro Mensal da Associação',
      data: '20 de Janeiro, 2024',
      descricao: 'Reunião mensal para discutir projetos, desafios e oportunidades da nossa comunidade.',
      local: 'Sede da Associação',
      horario: '18:00 - 20:00'
    },
    {
      titulo: 'Palestra sobre Educação',
      data: '25 de Janeiro, 2024',
      descricao: 'Como melhorar a educação das nossas crianças e jovens. Estratégias e recursos disponíveis.',
      local: 'Escola Primária de Massinga',
      horario: '14:00 - 17:00'
    },
    {
      titulo: 'Feira de Produtos Locais',
      data: '30 de Janeiro, 2024',
      descricao: 'Feira para promover e vender produtos locais da nossa comunidade. Venha apoiar os nossos produtores.',
      local: 'Praça Central de Massinga',
      horario: '08:00 - 14:00'
    }
  ];

  constructor(private pageTransitionService: PageTransitionService) {}

  ngOnInit() {
    this.pageTransitionService.pageEnter(this.eventosContent.nativeElement);
  }

  inscreverSe(evento: Evento): void {
    alert(`Inscrição para "${evento.titulo}" realizada com sucesso!`);
  }
}


