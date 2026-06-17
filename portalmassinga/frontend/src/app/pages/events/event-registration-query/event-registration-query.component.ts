import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

type FlowStep = 'phone' | 'token' | 'results';

@Component({
  selector: 'app-event-registration-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-registration-query.component.html',
  styleUrl: './event-registration-query.component.scss'
})
export class EventRegistrationQueryComponent implements OnInit {
  step: FlowStep = 'phone';
  telefone = '';
  telefoneFormatado = '';
  token = '';
  tokenEnviado = '';
  isSending = false;
  otpCopied = false;

  inscricoes: InscricaoEvento[] = [];
  eventosInscritos: EventoCompleto[] = [];
  eventosParticipados: EventoCompleto[] = [];
  eventosDisponiveis: EventoCompleto[] = [];
  eventoSelecionado: EventoCompleto | null = null;
  showTicketView = false;
  showSection: 'inscritos' | 'participados' | 'disponiveis' = 'inscritos';
  errorMessage = '';

  todosEventos: EventoCompleto[] = [
    {
      id: '1',
      titulo: 'Workshop de Agricultura Sustentável',
      data: '20 de Junho, 2026',
      local: 'Centro Comunitário de Massinga',
      hora: '09:00 - 16:00',
      descricao: 'Aprenda técnicas modernas de agricultura sustentável adaptadas ao clima local.',
      imagem: '/assets/desenvolvimento-comunitario.jpg',
      nivelAcesso: 'publico'
    },
    {
      id: '2',
      titulo: 'Feira de Produtos Locais',
      data: '15 de Julho, 2026',
      local: 'Praça Central de Massinga',
      hora: '08:00 - 18:00',
      descricao: 'Exposição e venda de produtos artesanais e agrícolas da região.',
      imagem: '/assets/mercado-maputo.jpg',
      nivelAcesso: 'publico'
    },
    {
      id: '3',
      titulo: 'Conferência de Desenvolvimento Comunitário',
      data: '28 de Julho, 2026',
      local: 'Auditório Municipal',
      hora: '14:00 - 18:00',
      descricao: 'Discussão sobre estratégias de desenvolvimento sustentável para Massinga.',
      imagem: '/assets/FOTO%203%20ANAM.jpeg',
      nivelAcesso: 'membros'
    },
    {
      id: '4',
      titulo: 'Seminário de Capacitação Empresarial',
      data: '10 de Agosto, 2026',
      local: 'Centro de Formação Profissional',
      hora: '09:00 - 16:00',
      descricao: 'Capacitação em gestão empresarial e marketing digital para empreendedores.',
      imagem: '/assets/workshop-empreendedorismo.jpg',
      nivelAcesso: 'simpatizantes'
    }
  ];

  constructor(
    private router: Router,
    private ticketService: EventTicketService
  ) {}

  ngOnInit() {
    this.step = 'phone';
  }

  /** OTP determinístico: últimos 5 dígitos do número nacional */
  generateOtpFromPhone(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('258')) {
      digits = digits.slice(3);
    }
    return digits.slice(-5).padStart(5, '0');
  }

  normalizePhone(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('258')) {
      return digits;
    }
    if (digits.length === 9) {
      return `258${digits}`;
    }
    return digits;
  }

  formatPhoneDisplay(phone: string): string {
    const digits = this.normalizePhone(phone);
    const national = digits.startsWith('258') ? digits.slice(3) : digits;
    if (national.length === 9) {
      return `+258 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
    }
    return `+${digits}`;
  }

  isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('258')) {
      return /^2588[2-7]\d{7}$/.test(digits);
    }
    if (digits.length === 9) {
      return /^8[2-7]\d{7}$/.test(digits);
    }
    return false;
  }

  enviarToken() {
    if (!this.telefone?.trim() || !this.isValidPhone(this.telefone)) {
      this.errorMessage = 'Introduza um número moçambicano válido (ex: 84 123 4567 ou +258 84 123 4567).';
      return;
    }

    this.isSending = true;
    this.errorMessage = '';
    const normalized = this.normalizePhone(this.telefone);
    this.telefone = normalized;
    this.telefoneFormatado = this.formatPhoneDisplay(normalized);
    this.tokenEnviado = this.generateOtpFromPhone(normalized);

    setTimeout(() => {
      this.isSending = false;
      this.step = 'token';
      this.token = '';
      this.otpCopied = false;
    }, 1200);
  }

  async copiarOtp() {
    try {
      await navigator.clipboard.writeText(this.tokenEnviado);
      this.otpCopied = true;
      setTimeout(() => (this.otpCopied = false), 2500);
    } catch {
      this.errorMessage = 'Não foi possível copiar. Seleccione o código manualmente.';
    }
  }

  preencherOtp() {
    this.token = this.tokenEnviado;
    this.errorMessage = '';
  }

  validarToken() {
    if (this.token.length !== 5) {
      this.errorMessage = 'O código deve ter exactamente 5 dígitos.';
      return;
    }

    if (this.token !== this.tokenEnviado) {
      this.errorMessage = 'Código incorrecto. Verifique os 5 dígitos e tente novamente.';
      return;
    }

    this.loadInscricoes();
    this.ensureDemoInscricaoIfEmpty();
    this.processarEventos();

    const eventosValidos = this.eventosInscritos.filter(e => !this.isEventoExpirado(e));

    if (eventosValidos.length === 0) {
      this.errorMessage = 'Não encontrámos bilhetes activos para este número.';
      return;
    }

    this.eventosInscritos = eventosValidos;
    this.step = 'results';
    this.errorMessage = '';
    this.showSection = 'inscritos';
  }

  /** Dados de demonstração quando não há inscrições no armazenamento local */
  private ensureDemoInscricaoIfEmpty() {
    if (this.inscricoes.length > 0) return;

    this.inscricoes = [{
      eventoPrincipal: '1',
      outrosEventos: ['2'],
      dadosParticipante: {
        nome: 'Participante ANAM',
        email: 'participante@anam.org.mz',
        telefone: this.telefoneFormatado,
        tipoParticipante: 'publico',
        receberWhatsApp: true
      },
      dataInscricao: new Date().toISOString()
    }];
  }

  isEventoExpirado(evento: EventoCompleto): boolean {
    const meses: Record<string, number> = {
      janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
      julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
    };

    try {
      const partes = evento.data.split(' de ');
      const dia = parseInt(partes[0], 10);
      const [mesStr, anoStr] = partes[1].split(', ');
      const dataEvento = new Date(parseInt(anoStr, 10), meses[mesStr.toLowerCase()], dia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      dataEvento.setHours(0, 0, 0, 0);
      return dataEvento < hoje;
    } catch {
      return false;
    }
  }

  loadInscricoes() {
    const inscricoesData = localStorage.getItem('minhasInscricoes');
    if (!inscricoesData) {
      this.inscricoes = [];
      return;
    }

    const todasInscricoes: InscricaoEvento[] = JSON.parse(inscricoesData);
    this.inscricoes = todasInscricoes.filter(insc => {
      const tel = this.normalizePhone(insc.dadosParticipante.telefone);
      return tel === this.telefone;
    });
  }

  processarEventos() {
    const inscritosIds = new Set<string>();
    this.inscricoes.forEach(insc => {
      if (insc.eventoPrincipal) inscritosIds.add(insc.eventoPrincipal);
      insc.outrosEventos?.forEach(id => inscritosIds.add(id));
    });

    this.eventosInscritos = this.todosEventos
      .filter(e => inscritosIds.has(e.id))
      .map(e => ({ ...e, status: 'inscrito' as const }));

    this.eventosDisponiveis = this.todosEventos
      .filter(e => !inscritosIds.has(e.id))
      .map(e => ({ ...e, status: 'disponivel' as const }));
  }

  getInscricaoData(eventoId: string): InscricaoEvento | undefined {
    return this.inscricoes.find(i =>
      i.eventoPrincipal === eventoId || i.outrosEventos?.includes(eventoId)
    );
  }

  getTicketCode(eventoId: string): string {
    const seed = `${this.telefone}${eventoId}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    return String(Math.abs(hash) % 100000).padStart(5, '0');
  }

  getNivelAcessoLabel(nivel?: string): string {
    const labels: Record<string, string> = {
      publico: 'Público',
      membros: 'Membros',
      simpatizantes: 'Simpatizantes',
      apoiantes: 'Apoiantes'
    };
    return labels[nivel ?? ''] ?? 'Geral';
  }

  getNivelAcessoClass(nivel?: string): string {
    return nivel ? `nivel-${nivel}` : '';
  }

  verTicket(evento: EventoCompleto) {
    this.eventoSelecionado = evento;
    this.showTicketView = true;
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

  voltarInicio() {
    this.step = 'phone';
    this.telefone = '';
    this.telefoneFormatado = '';
    this.token = '';
    this.tokenEnviado = '';
    this.errorMessage = '';
    this.isSending = false;
    this.otpCopied = false;
    this.inscricoes = [];
    this.eventosInscritos = [];
    this.eventosParticipados = [];
    this.eventosDisponiveis = [];
  }

  voltarTelefone() {
    this.step = 'phone';
    this.token = '';
    this.errorMessage = '';
    this.otpCopied = false;
  }

  reenviarToken() {
    this.token = '';
    this.errorMessage = '';
    this.otpCopied = false;
    this.enviarToken();
  }

  onTokenInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.token = input.value.replace(/\D/g, '').slice(0, 5);
    input.value = this.token;
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.telefone = input.value.replace(/[^\d+\s-]/g, '');
  }
}
