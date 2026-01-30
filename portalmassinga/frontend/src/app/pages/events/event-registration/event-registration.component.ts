import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EventQuestionnaireComponent } from '../event-questionnaire/event-questionnaire.component';
import { EventSuccessDialogComponent } from '../event-success-dialog/event-success-dialog.component';
import { EventConfirmationDialogComponent } from '../event-confirmation-dialog/event-confirmation-dialog.component';
import { EventTicketService } from '../event-ticket.service';

interface Evento {
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
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-registration.component.html',
  styleUrl: './event-registration.component.scss'
})
export class EventRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  eventoAtual: Evento | null = null;
  outrosEventos: Evento[] = [];
  eventosSelecionados: string[] = [];
  step: 'registration' | 'other-events' | 'complete' = 'registration';
  isFinalizandoCompletamente = false; // Flag para controlar quando finalizar completamente

  // Lista de todos os eventos disponíveis
  todosEventos: Evento[] = [
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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ticketService: EventTicketService
  ) {
    this.registrationForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      tipoParticipante: ['', Validators.required],
      receberWhatsApp: [false]
    });
  }

  ngOnInit() {
    const eventoId = this.route.snapshot.paramMap.get('id');
    const disponiveis = this.route.snapshot.queryParamMap.get('disponiveis');
    
    // Obter eventos já inscritos
    const minhasInscricoes = JSON.parse(localStorage.getItem('minhasInscricoes') || '[]');
    const eventosInscritosIds = new Set<string>();
    minhasInscricoes.forEach((insc: any) => {
      if (insc.eventoPrincipal) eventosInscritosIds.add(insc.eventoPrincipal);
      insc.outrosEventos?.forEach((id: string) => eventosInscritosIds.add(id));
    });

    if (eventoId) {
      this.eventoAtual = this.todosEventos.find(e => e.id === eventoId) || null;
      // Filtrar outros eventos (excluir o atual e os já inscritos)
      this.outrosEventos = this.todosEventos.filter(e => 
        e.id !== eventoId && !eventosInscritosIds.has(e.id)
      );
    } else {
      // Se há query param de disponíveis, usar apenas esses
      if (disponiveis) {
        const idsDisponiveis = disponiveis.split(',');
        this.outrosEventos = this.todosEventos.filter(e => 
          idsDisponiveis.includes(e.id) && !eventosInscritosIds.has(e.id)
        );
      } else {
        // Mostrar todos os eventos não inscritos
        this.outrosEventos = this.todosEventos.filter(e => !eventosInscritosIds.has(e.id));
      }
    }
  }

  toggleEvento(eventoId: string) {
    const index = this.eventosSelecionados.indexOf(eventoId);
    if (index > -1) {
      this.eventosSelecionados.splice(index, 1);
    } else {
      this.eventosSelecionados.push(eventoId);
    }
  }

  isEventoSelecionado(eventoId: string): boolean {
    return this.eventosSelecionados.includes(eventoId);
  }

  onSubmitRegistration() {
    if (this.registrationForm.valid) {
      // Abrir popup de confirmação
      this.openConfirmationDialog();
    }
  }

  openConfirmationDialog() {
    // Preparar lista de eventos para mostrar
    const eventosParaMostrar = [];
    if (this.eventoAtual) {
      eventosParaMostrar.push({
        titulo: this.eventoAtual.titulo,
        data: this.eventoAtual.data,
        local: this.eventoAtual.local
      });
    }
    this.eventosSelecionados.forEach(id => {
      const evento = this.todosEventos.find(e => e.id === id);
      if (evento) {
        eventosParaMostrar.push({
          titulo: evento.titulo,
          data: evento.data,
          local: evento.local
        });
      }
    });

    const dialogRef = this.dialog.open(EventConfirmationDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        dadosParticipante: this.registrationForm.value,
        eventos: eventosParaMostrar
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'finalize') {
        // Atualizar dados se foram editados
        if (result.dadosAtualizados) {
          this.registrationForm.patchValue(result.dadosAtualizados);
        }
        // Processar inscrição
        this.processarInscricao();
      }
      // Se cancelar, não faz nada (fica na mesma página)
    });
  }

  processarInscricao() {
    // Validar se há pelo menos um evento selecionado
    if (!this.eventoAtual && this.eventosSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos um evento para se inscrever.');
      return;
    }

    // Salvar inscrições (simulado - apenas frontend)
    const inscricoes = {
      eventoPrincipal: this.eventoAtual?.id || null,
      outrosEventos: this.eventosSelecionados,
      dadosParticipante: this.registrationForm.value,
      dataInscricao: new Date().toISOString()
    };
    
    // Salvar no localStorage (simulado)
    const minhasInscricoes = JSON.parse(localStorage.getItem('minhasInscricoes') || '[]');
    minhasInscricoes.push(inscricoes);
    localStorage.setItem('minhasInscricoes', JSON.stringify(minhasInscricoes));

    // Gerar e baixar ticket
    const eventosInscritos = [];
    if (this.eventoAtual) {
      eventosInscritos.push(this.eventoAtual);
    }
    this.eventosSelecionados.forEach(id => {
      const evento = this.todosEventos.find(e => e.id === id);
      if (evento) eventosInscritos.push(evento);
    });

    // Gerar ticket para cada evento
    eventosInscritos.forEach(evento => {
      this.ticketService.generateTicket(inscricoes, evento);
    });

    // Abrir popup de sucesso
    this.openSuccessDialog();
  }

  onContinue() {
    // Este método agora só é usado quando está na página de "Outros Eventos"
    // e clica em "Finalizar Inscrição"
    this.openConfirmationDialog();
  }

  openSuccessDialog() {
    const dialogRef = this.dialog.open(EventSuccessDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        eventoId: this.eventoAtual?.id,
        nomeParticipante: this.registrationForm.value.nome
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'finish') {
        // Marcar que está finalizando completamente
        this.isFinalizandoCompletamente = true;
        // Abrir questionário quando clicar "Não" (apenas quando finalizar completamente)
        this.openQuestionnaire();
      } else if (result?.action === 'more') {
        // Não está finalizando completamente, apenas continuando para outros eventos
        this.isFinalizandoCompletamente = false;
        // Navegar para página de eventos disponíveis (sem os eventos já inscritos)
        const eventosInscritosIds = new Set<string>();
        if (this.eventoAtual) eventosInscritosIds.add(this.eventoAtual.id);
        this.eventosSelecionados.forEach(id => eventosInscritosIds.add(id));
        
        const eventosDisponiveis = this.todosEventos.filter(e => 
          !eventosInscritosIds.has(e.id)
        );
        
        if (eventosDisponiveis.length > 0) {
          // Limpar seleções e ir para página de outros eventos
          this.eventoAtual = null;
          this.eventosSelecionados = [];
          this.outrosEventos = eventosDisponiveis;
          this.step = 'other-events';
        } else {
          // Se não há mais eventos, marcar como finalizando completamente e abrir questionário
          this.isFinalizandoCompletamente = true;
          this.openQuestionnaire();
        }
      }
    });
  }

  openQuestionnaire() {
    const dialogRef = this.dialog.open(EventQuestionnaireComponent, {
      width: '600px',
      disableClose: true,
      data: {
        eventoId: this.eventoAtual?.id,
        nomeParticipante: this.registrationForm.value.nome
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.step = 'complete';
    });
  }

  goToMyEvents() {
    this.router.navigate(['/eventos/meus-eventos']);
  }

  goBack() {
    if (this.step === 'other-events') {
      this.step = 'registration';
    } else {
      this.router.navigate(['/']);
    }
  }
}

