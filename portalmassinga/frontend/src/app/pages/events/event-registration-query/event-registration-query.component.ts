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

@Component({
  selector: 'app-event-registration-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-registration-query.component.html',
  styleUrl: './event-registration-query.component.scss'
})
export class EventRegistrationQueryComponent implements OnInit {
  // Estados do fluxo
  step: 'phone' | 'token' | 'results' = 'phone';
  
  // Dados do formulário
  telefone: string = '';
  token: string = '';
  tokenEnviado: string = '';
  
  // Dados carregados
  inscricoes: InscricaoEvento[] = [];
  eventosInscritos: EventoCompleto[] = [];
  eventosParticipados: EventoCompleto[] = [];
  eventosDisponiveis: EventoCompleto[] = [];
  eventoSelecionado: EventoCompleto | null = null;
  showTicketView = false;
  showSection: 'inscritos' | 'participados' | 'disponiveis' = 'inscritos';
  
  // Mensagens de erro
  errorMessage: string = '';

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
    // Página inicia no passo de telefone
    this.step = 'phone';
  }

  // Gerar token de 5 dígitos
  generateToken(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  // Validar formato de telefone
  isValidPhone(phone: string): boolean {
    // Aceita formatos como: +258 XX XXX XXXX, 258 XX XXX XXXX, ou apenas números
    const phoneRegex = /^(\+?258)?[\s-]?(\d{2})[\s-]?(\d{3})[\s-]?(\d{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Enviar token (simulado)
  enviarToken() {
    if (!this.telefone || !this.isValidPhone(this.telefone)) {
      this.errorMessage = 'Por favor, insira um número de telefone válido';
      return;
    }

    // Normalizar telefone (remover espaços e caracteres especiais)
    this.telefone = this.telefone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // Gerar token de 5 dígitos
    this.tokenEnviado = this.generateToken();
    
    // Simular envio do token (em produção, seria enviado via SMS)
    console.log(`Token enviado para ${this.telefone}: ${this.tokenEnviado}`);
    
    // Avançar para o passo de token
    this.step = 'token';
    this.errorMessage = '';
  }

  // Validar token e carregar dados
  validarToken() {
    if (this.token.length !== 5) {
      this.errorMessage = 'O token deve ter 5 dígitos';
      return;
    }

    if (this.token !== this.tokenEnviado) {
      this.errorMessage = 'Token inválido. Por favor, verifique e tente novamente.';
      return;
    }

    // Token válido, carregar dados
    this.loadInscricoes();
    this.processarEventos();
    
    // Verificar se há bilhetes e se não expiraram
    if (this.eventosInscritos.length === 0) {
      this.errorMessage = 'Nenhum bilhete encontrado para este número de telefone.';
      this.step = 'phone';
      this.token = '';
      return;
    }

    // Verificar eventos expirados
    const eventosValidos = this.eventosInscritos.filter(evento => !this.isEventoExpirado(evento));
    
    if (eventosValidos.length === 0 && this.eventosInscritos.length > 0) {
      this.errorMessage = 'Todos os eventos associados a este número já expiraram.';
      this.step = 'phone';
      this.token = '';
      return;
    }

    // Filtrar apenas eventos válidos
    this.eventosInscritos = eventosValidos;
    
    // Avançar para resultados
    this.step = 'results';
    this.errorMessage = '';
    
    // Definir seção inicial
    if (this.eventosInscritos.length > 0) {
      this.showSection = 'inscritos';
    } else if (this.eventosDisponiveis.length > 0) {
      this.showSection = 'disponiveis';
    }
  }

  // Verificar se evento expirou
  isEventoExpirado(evento: EventoCompleto): boolean {
    // Extrair data do evento (formato: "15 de Janeiro, 2024")
    const dataStr = evento.data;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Converter data do evento para Date
    // Formato esperado: "15 de Janeiro, 2024"
    const meses: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };
    
    try {
      const partes = dataStr.split(' de ');
      const dia = parseInt(partes[0]);
      const mesAno = partes[1].split(', ');
      const mes = meses[mesAno[0].toLowerCase()];
      const ano = parseInt(mesAno[1]);
      
      const dataEvento = new Date(ano, mes, dia);
      dataEvento.setHours(0, 0, 0, 0);
      
      return dataEvento < hoje;
    } catch {
      // Se não conseguir parsear, assumir que não expirou
      return false;
    }
  }

  loadInscricoes() {
    const inscricoesData = localStorage.getItem('minhasInscricoes');
    if (inscricoesData) {
      const todasInscricoes = JSON.parse(inscricoesData);
      // Filtrar apenas inscrições com o telefone informado
      this.inscricoes = todasInscricoes.filter((insc: InscricaoEvento) => {
        const telefoneInscricao = insc.dadosParticipante.telefone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
        return telefoneInscricao === this.telefone;
      });
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

  // Voltar para o início
  voltarInicio() {
    this.step = 'phone';
    this.telefone = '';
    this.token = '';
    this.tokenEnviado = '';
    this.errorMessage = '';
    this.inscricoes = [];
    this.eventosInscritos = [];
    this.eventosParticipados = [];
    this.eventosDisponiveis = [];
  }

  // Reenviar token
  reenviarToken() {
    this.enviarToken();
  }

  // Formatar token (apenas números)
  onTokenInput(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    this.token = value.slice(0, 5);
    event.target.value = this.token;
  }
}

