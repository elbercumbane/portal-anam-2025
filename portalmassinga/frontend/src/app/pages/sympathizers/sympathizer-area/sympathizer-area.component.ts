import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sympathizer-area',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sympathizer-area.component.html',
  styleUrl: './sympathizer-area.component.scss'
})
export class SympathizerAreaComponent {
  programs = [
    {
      title: 'Programa de Educação',
      description: 'Apoio à educação de jovens em Massinga',
      status: 'Ativo',
      icon: 'menu_book'
    },
    {
      title: 'Programa de Agricultura',
      description: 'Desenvolvimento agrícola sustentável',
      status: 'Ativo',
      icon: '🌾'
    },
    {
      title: 'Programa de Saúde',
      description: 'Melhoria do acesso à saúde',
      status: 'Em planeamento',
      icon: '🏥'
    }
  ];

  activities = [
    {
      title: 'Visita a Projectos',
      date: '20 de Janeiro',
      description: 'Conheça de perto os projectos que você apoia',
      type: 'visita',
      available: true
    },
    {
      title: 'Webinar: Impacto Social',
      date: '10 de Fevereiro',
      description: 'Aprenda sobre desenvolvimento comunitário',
      type: 'webinar',
      available: true
    },
    {
      title: 'Jantar de Gala Anual',
      date: '15 de Dezembro',
      description: 'Evento especial para simpatizantes e membros',
      type: 'evento',
      available: false
    }
  ];

  documents = [
    {
      title: 'Protocolo de Participação',
      description: 'Regras e diretrizes para simpatizantes',
      type: 'protocolo',
      download: true
    },
    {
      title: 'Relatório Anual 2024',
      description: 'Relatório completo das atividades da associação',
      type: 'relatorio',
      download: true
    },
    {
      title: 'Guia do Simpatizante',
      description: 'Informações importantes para novos simpatizantes',
      type: 'guia',
      download: true
    }
  ];
}

