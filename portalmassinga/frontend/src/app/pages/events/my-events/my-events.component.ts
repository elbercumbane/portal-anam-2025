import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface InscricaoEvento {
  eventoPrincipal: string;
  outrosEventos: string[];
  dadosParticipante: {
    nome: string;
    email: string;
    telefone: string;
    tipoParticipante: string;
  };
  dataInscricao: string;
}

interface EventoCompleto {
  id: string;
  titulo: string;
  data: string;
  local: string;
  hora: string;
  descricao: string;
  imagem: string;
  nivelAcesso?: 'publico' | 'membros' | 'simpatizantes' | 'apoiantes';
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss'
})
export class MyEventsComponent implements OnInit {
  inscricoes: InscricaoEvento[] = [];
  eventosCompletos: EventoCompleto[] = [];
  eventosInscritos: EventoCompleto[] = [];

  todosEventos: EventoCompleto[] = [
    {
      id: '1',
      titulo: 'Workshop de Agricultura Sustentável',
      data: '15 de Janeiro, 2024',
      local: 'Centro Comunitário de Massinga',
      hora: '09:00 - 16:00',
      descricao: 'Aprenda técnicas modernas de agricultura sustentável.',
      imagem: '/assets/mercado-maputo.jpg',
      nivelAcesso: 'publico'
    },
    {
      id: '2',
      titulo: 'Feira de Produtos Locais',
      data: '22 de Março, 2024',
      local: 'Praça Central de Massinga',
      hora: '08:00 - 18:00',
      descricao: 'Exposição e venda de produtos artesanais e agrícolas da região.',
      imagem: '/assets/mercado-maputo.jpg',
      nivelAcesso: 'publico'
    },
    {
      id: '3',
      titulo: 'Conferência de Desenvolvimento Comunitário',
      data: '29 de Março, 2024',
      local: 'Auditório Municipal',
      hora: '14:00 - 18:00',
      descricao: 'Discussão sobre estratégias de desenvolvimento sustentável.',
      imagem: '/assets/desenvolvimento-comunitario.jpg',
      nivelAcesso: 'membros'
    },
    {
      id: '4',
      titulo: 'Seminário de Capacitação Empresarial',
      data: '5 de Abril, 2024',
      local: 'Centro de Formação Profissional',
      hora: '09:00 - 16:00',
      descricao: 'Capacitação em gestão empresarial e marketing digital.',
      imagem: '/assets/slider/slide1.jpg',
      nivelAcesso: 'simpatizantes'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadInscricoes();
  }

  loadInscricoes() {
    const inscricoesData = localStorage.getItem('minhasInscricoes');
    if (inscricoesData) {
      this.inscricoes = JSON.parse(inscricoesData);
      this.processarEventosInscritos();
    }
  }

  processarEventosInscritos() {
    const eventosIds = new Set<string>();
    
    this.inscricoes.forEach(inscricao => {
      if (inscricao.eventoPrincipal) {
        eventosIds.add(inscricao.eventoPrincipal);
      }
      inscricao.outrosEventos.forEach(id => eventosIds.add(id));
    });

    this.eventosInscritos = this.todosEventos.filter(e => eventosIds.has(e.id));
  }

  getNivelAcessoLabel(nivel?: string): string {
    switch (nivel) {
      case 'publico': return 'Público';
      case 'membros': return 'Membros';
      case 'simpatizantes': return 'Simpatizantes';
      case 'apoiantes': return 'Apoiantes';
      default: return 'Não especificado';
    }
  }

  getNivelAcessoClass(nivel?: string): string {
    switch (nivel) {
      case 'publico': return 'nivel-publico';
      case 'membros': return 'nivel-membros';
      case 'simpatizantes': return 'nivel-simpatizantes';
      case 'apoiantes': return 'nivel-apoiantes';
      default: return '';
    }
  }

  getInscricaoData(eventoId: string): InscricaoEvento | undefined {
    return this.inscricoes.find(i => 
      i.eventoPrincipal === eventoId || i.outrosEventos.includes(eventoId)
    );
  }

  getTipoParticipanteLabel(tipo?: string): string {
    switch (tipo) {
      case 'membro': return 'Membro';
      case 'simpatizante': return 'Simpatizante';
      case 'apoiante': return 'Apoiante';
      case 'publico': return 'Público Geral';
      default: return tipo || 'Não especificado';
    }
  }

  getTipoParticipante(eventoId: string): string {
    const inscricao = this.getInscricaoData(eventoId);
    return this.getTipoParticipanteLabel(inscricao?.dadosParticipante?.tipoParticipante);
  }

  getEmailInscricao(eventoId: string): string {
    const inscricao = this.getInscricaoData(eventoId);
    return inscricao?.dadosParticipante?.email || 'Não informado';
  }

  goToRegistration(eventoId: string) {
    this.router.navigate(['/eventos/inscricao', eventoId]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

