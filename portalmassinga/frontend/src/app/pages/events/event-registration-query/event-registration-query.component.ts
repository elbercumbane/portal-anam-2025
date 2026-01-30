import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventTicketService } from '../event-ticket.service';

interface InscricaoEvento {
  eventoPrincipal: string | null;
  outrosEventos: string[];
  dadosParticipante: {
    nome: string;
    email: string;
    telefone: string;
    tipoParticipante: string;
    receberWhatsApp?: boolean;
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
  status?: 'inscrito' | 'participado' | 'disponivel';
}

@Component({
  selector: 'app-event-registration-query',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-registration-query.component.html',
  styleUrl: './event-registration-query.component.scss'
})
export class EventRegistrationQueryComponent implements OnInit {
  inscricoes: InscricaoEvento[] = [];
  eventosInscritos: EventoCompleto[] = [];
  eventosParticipados: EventoCompleto[] = [];
  eventosDisponiveis: EventoCompleto[] = [];
  eventoSelecionado: EventoCompleto | null = null;
  showTicketView = false;
  showSection: 'inscritos' | 'participados' | 'disponiveis' = 'inscritos';

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

  constructor(
    private router: Router,
    private ticketService: EventTicketService
  ) {}

  ngOnInit() {
    this.loadInscricoes();
    this.processarEventos();
    
    // Definir seção inicial baseada no que tem conteúdo
    if (this.eventosInscritos.length > 0) {
      this.showSection = 'inscritos';
    } else if (this.eventosDisponiveis.length > 0) {
      this.showSection = 'disponiveis';
    } else if (this.eventosParticipados.length > 0) {
      this.showSection = 'participados';
    }
  }

  loadInscricoes() {
    const inscricoesData = localStorage.getItem('minhasInscricoes');
    if (inscricoesData) {
      this.inscricoes = JSON.parse(inscricoesData);
    }
  }

  processarEventos() {
    const eventosInscritosIds = new Set<string>();
    const eventosParticipadosIds = new Set<string>();
    
    // Processar inscrições
    this.inscricoes.forEach(inscricao => {
      if (inscricao.eventoPrincipal) {
        eventosInscritosIds.add(inscricao.eventoPrincipal);
      }
      inscricao.outrosEventos?.forEach(id => eventosInscritosIds.add(id));
    });

    // Separar eventos
    this.eventosInscritos = this.todosEventos
      .filter(e => eventosInscritosIds.has(e.id))
      .map(e => ({ ...e, status: 'inscrito' as const }));

    // Eventos disponíveis (não inscritos)
    this.eventosDisponiveis = this.todosEventos
      .filter(e => !eventosInscritosIds.has(e.id) && !eventosParticipadosIds.has(e.id))
      .map(e => ({ ...e, status: 'disponivel' as const }));
  }

  getInscricaoData(eventoId: string): InscricaoEvento | undefined {
    return this.inscricoes.find(i => 
      i.eventoPrincipal === eventoId || i.outrosEventos.includes(eventoId)
    );
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

  verTicket(evento: EventoCompleto) {
    this.eventoSelecionado = evento;
    this.showTicketView = true;
    
    // Gerar e baixar ticket
    const inscricao = this.getInscricaoData(evento.id);
    if (inscricao) {
      this.ticketService.generateTicket(inscricao, evento);
    }
  }

  fecharTicketView() {
    this.showTicketView = false;
    this.eventoSelecionado = null;
  }

  inscreverEmEvento(eventoId: string) {
    this.router.navigate(['/eventos/inscricao', eventoId]);
  }

  goToNewEvents() {
    this.router.navigate(['/eventos/inscricao']);
  }
}

