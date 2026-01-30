import { Injectable } from '@angular/core';

interface InscricaoEvento {
  eventoPrincipal: string | null;
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

@Injectable({
  providedIn: 'root'
})
export class EventTicketService {

  generateTicket(inscricao: InscricaoEvento, evento: EventoCompleto) {
    // Gerar ID único não sequencial
    const ticketId = this.generateUniqueTicketId();
    
    // Criar conteúdo do ticket em HTML
    const ticketContent = this.createTicketHTML(inscricao, evento, ticketId);
    
    // Criar e baixar o PDF/HTML
    this.downloadTicket(ticketContent, ticketId, evento.titulo);
  }

  private createTicketHTML(inscricao: InscricaoEvento, evento: EventoCompleto, ticketId: string): string {
    const dataFormatada = new Date(inscricao.dataInscricao).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Gerar QR Code (usando API pública para gerar QR code)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}`;
    
    // Dados do evento
    const eventoHTML = `
      <div class="evento-item">
        <h3>${evento.titulo}</h3>
        <p><strong>Data:</strong> ${evento.data}</p>
        <p><strong>Local:</strong> ${evento.local}</p>
        <p><strong>Hora:</strong> ${evento.hora}</p>
        <p><strong>Nível de Acesso:</strong> ${this.getNivelAcessoLabel(evento.nivelAcesso)}</p>
      </div>
    `;

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Inscrição - ANAM</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .ticket {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #4CAF50;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1f2937;
      font-size: 2rem;
      margin-bottom: 10px;
    }
    .header .logo {
      color: #4CAF50;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .confirmation-badge {
      display: inline-block;
      background: linear-gradient(135deg, #4CAF50 0%, #60A5FA 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .participant-info {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #60A5FA;
    }
    .participant-info h2 {
      color: #1f2937;
      margin-bottom: 15px;
      font-size: 1.3rem;
    }
    .info-row {
      display: flex;
      margin-bottom: 10px;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
      width: 150px;
    }
    .info-value {
      color: #6b7280;
    }
    .eventos-section {
      margin-top: 30px;
    }
    .eventos-section h2 {
      color: #1f2937;
      margin-bottom: 20px;
      font-size: 1.3rem;
    }
    .evento-item {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      border-left: 4px solid #4CAF50;
    }
    .evento-item h3 {
      color: #1f2937;
      margin-bottom: 10px;
    }
    .evento-item p {
      color: #6b7280;
      margin-bottom: 5px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.9rem;
    }
    .ticket-number {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 20px;
      font-family: monospace;
      font-size: 1.1rem;
      color: #1f2937;
      font-weight: 600;
    }
    .qr-code-section {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .qr-code-section h3 {
      color: #1f2937;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }
    .qr-code-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .qr-code {
      width: 200px;
      height: 200px;
      border: 4px solid white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .qr-note {
      color: #6b7280;
      font-size: 0.9rem;
      margin: 0;
    }
    @media print {
      body {
        background: white;
        padding: 20px;
      }
      .ticket {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="logo">ANAM</div>
      <h1>Confirmação de Inscrição</h1>
      <div class="confirmation-badge">✓ INSCRIÇÃO CONFIRMADA</div>
    </div>

    <div class="ticket-number">
      Ticket ID: ${ticketId}
    </div>

    <div class="qr-code-section">
      <h3>Código QR para Validação</h3>
      <div class="qr-code-container">
        <img src="${qrCodeUrl}" alt="QR Code" class="qr-code">
        <p class="qr-note">Apresente este código no dia do evento para validação</p>
      </div>
    </div>

    <div class="participant-info">
      <h2>Dados do Participante</h2>
      <div class="info-row">
        <span class="info-label">Nome:</span>
        <span class="info-value">${inscricao.dadosParticipante.nome}</span>
      </div>
      <div class="info-row">
        <span class="info-label">E-mail:</span>
        <span class="info-value">${inscricao.dadosParticipante.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Telefone:</span>
        <span class="info-value">${inscricao.dadosParticipante.telefone}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tipo:</span>
        <span class="info-value">${this.getTipoParticipanteLabel(inscricao.dadosParticipante.tipoParticipante)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Data de Inscrição:</span>
        <span class="info-value">${dataFormatada}</span>
      </div>
    </div>

    <div class="eventos-section">
      <h2>Evento Inscrito</h2>
      ${eventoHTML}
    </div>

    <div class="footer">
      <p><strong>Associação de Naturais e Amigos de Massinga (ANAM)</strong></p>
      <p>Este documento serve como confirmação da sua inscrição. Por favor, apresente este ticket no dia do evento.</p>
      <p style="margin-top: 10px; font-size: 0.85rem;">Documento gerado em ${new Date().toLocaleString('pt-MZ')}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private downloadTicket(content: string, ticketId: string, eventoTitulo: string) {
    // Criar blob
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    
    // Criar link de download
    const link = document.createElement('a');
    link.href = url;
    const nomeArquivo = `ticket-${ticketId}-${eventoTitulo.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private generateUniqueTicketId(): string {
    // Gerar ID único não sequencial usando timestamp + random + hash
    const timestamp = Date.now();
    const random1 = Math.floor(Math.random() * 1000000);
    const random2 = Math.floor(Math.random() * 1000000);
    const hash = this.simpleHash(`${timestamp}-${random1}-${random2}`);
    
    // Formato: ANAM-{hash}-{timestamp}-{random}
    return `ANAM-${hash}-${timestamp.toString(36).toUpperCase()}-${random1.toString(36).toUpperCase()}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).toUpperCase().substring(0, 8);
  }

  private getNivelAcessoLabel(nivel?: string): string {
    switch (nivel) {
      case 'publico': return 'Público';
      case 'membros': return 'Membros';
      case 'simpatizantes': return 'Simpatizantes';
      case 'apoiantes': return 'Apoiantes';
      default: return 'Não especificado';
    }
  }

  private getTipoParticipanteLabel(tipo: string): string {
    switch (tipo) {
      case 'membro': return 'Membro';
      case 'simpatizante': return 'Simpatizante';
      case 'apoiante': return 'Apoiante';
      case 'publico': return 'Público Geral';
      default: return tipo;
    }
  }
}

