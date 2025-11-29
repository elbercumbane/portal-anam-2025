import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-membros-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './membros-home.component.html',
  styleUrl: './membros-home.component.scss'
})
export class MembrosHomeComponent {
  stats = [
                                                                                                                                       { number: '150+', label: 'Membros Activos' },
    { number: '50+', label: 'Projectos Assinados' },
    { number: '12', label: 'Províncias Representadas' }
  ];

  highlights = [
    {
      icon: '🤝',
      title: 'Rede de Apoio',
      description: 'Partilhe experiências com fundadores, empresários e líderes comunitários.'
    },
    {
      icon: '🎯',
      title: 'Impacto Direto',
      description: 'Entre em missões e iniciativas que fortalecem Massinga e a diáspora.'
    },
    {
      icon: '📢',
      title: 'Voz Coletiva',
      description: 'Ajude a definir prioridades e políticas da associação.'
    }
  ];

  benefitPillars = [
    {
      title: 'Participação Simples',
      text: 'Participe em 3 encontros-chave por ano, receba briefings e esteja sempre por dentro das prioridades.'
    },
    {
      title: 'Eventos Curados',
      text: 'A cada trimestre promovemos encontros temáticos e visitas de campo para aproximar membros.'
    },
    {
      title: 'Benefícios Essenciais',
      text: 'Mentorias, apoio institucional e acesso a recursos digitais sem excesso de burocracia.'
    }
  ];

  joinSteps = [
    { step: '01', title: 'Confirme seu interesse', text: 'Escolha se quer participar como membro individual ou institucional.' },
    { step: '02', title: 'Submeta o pedido', text: 'Envie o formulário rápido e aguarde o nosso contacto.' },
    { step: '03', title: 'Entre em campo', text: 'Escolha um grupo ou projecto e já comece a colaborar.' }
  ];

  benefitHighlights = [
    'Rede de apoio entre naturais e amigos de Massinga em todo o país',
    'Acesso a encontros trimestrais e briefings geridos pela associação',
    'Participação em projectos comunitários, missões e eventos especiais',
    'Canal aberto com a direção para propor iniciativas e representar a comunidade'
  ];

  howToJoin = [
    'Escolha a modalidade (individual ou institucional) e clique em “Associar-se”.',
    'Preencha o formulário simples com contacto e áreas de interesse.',
    'Após o contacto da equipa, formalize a adesão e comece a participar.'
  ];
}

