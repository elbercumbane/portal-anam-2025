import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

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

  async generateTicket(inscricao: InscricaoEvento, evento: EventoCompleto) {
    // Gerar ID único não sequencial (máximo 5 dígitos)
    const ticketId = this.generateUniqueTicketId();
    
    // Gerar e baixar o PDF
    await this.generateTicketPDF(inscricao, evento, ticketId);
  }

  private async generateTicketPDF(inscricao: InscricaoEvento, evento: EventoCompleto, ticketId: string) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Cores
    const primaryColor = [76, 175, 80]; // Verde
    const secondaryColor = [96, 165, 250]; // Azul
    const textColor = [31, 41, 55]; // Cinza escuro
    const lightGray = [107, 114, 128]; // Cinza claro

    // Header - Logo e Título
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('ANAM', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(20);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Confirmação de Inscrição', margin, yPosition);
    yPosition += 8;

    // Badge de confirmação
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(margin, yPosition, 60, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ INSCRIÇÃO CONFIRMADA', margin + 3, yPosition + 5.5);
    yPosition += 15;

    // Ticket ID
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 10, 2, 2, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Ticket ID: ${ticketId}`, margin + 5, yPosition + 6.5);
    yPosition += 15;

    // QR Code Section
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketId)}`;
    
    // Carregar imagem do QR code e adicionar ao PDF
    try {
      const qrCodeImage = await this.loadImageAsBase64(qrCodeUrl);
      const qrCodeSize = 40; // tamanho em mm
      const qrCodeX = (pageWidth - qrCodeSize) / 2; // centralizar
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text('Código QR para Validação', margin, yPosition);
      yPosition += 10;
      
      // Adicionar imagem do QR code
      doc.addImage(qrCodeImage, 'PNG', qrCodeX, yPosition, qrCodeSize, qrCodeSize);
      yPosition += qrCodeSize + 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text('Apresente este código no dia do evento para validação', margin, yPosition, { align: 'center' });
      yPosition += 10;
    } catch (error) {
      // Se falhar ao carregar QR code, mostrar apenas o ID
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text('Código QR para Validação', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text(`ID do Ticket: ${ticketId}`, margin, yPosition);
      yPosition += 5;
      doc.text('Apresente este código no dia do evento para validação', margin, yPosition);
      yPosition += 10;
    }

    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Dados do Participante
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Dados do Participante', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataFormatada = new Date(inscricao.dataInscricao).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const infoItems = [
      ['Nome:', inscricao.dadosParticipante.nome],
      ['E-mail:', inscricao.dadosParticipante.email],
      ['Telefone:', inscricao.dadosParticipante.telefone],
      ['Tipo:', this.getTipoParticipanteLabel(inscricao.dadosParticipante.tipoParticipante)],
      ['Data de Inscrição:', dataFormatada]
    ];

    infoItems.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(label, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text(value, margin + 40, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Evento Inscrito
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Evento Inscrito', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(evento.titulo, margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Data: ${evento.data}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Local: ${evento.local}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Hora: ${evento.hora}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Nível de Acesso: ${this.getNivelAcessoLabel(evento.nivelAcesso)}`, margin, yPosition);
    yPosition += 15;

    // Footer
    let footerY = pageHeight - 30;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    footerY += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Associação de Naturais e Amigos de Massinga (ANAM)', margin, footerY, { align: 'center' });
    footerY += 5;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Este documento serve como confirmação da sua inscrição.', margin, footerY, { align: 'center' });
    footerY += 4;
    doc.text('Por favor, apresente este ticket no dia do evento.', margin, footerY, { align: 'center' });
    footerY += 4;
    doc.text(`Documento gerado em ${new Date().toLocaleString('pt-MZ')}`, margin, footerY, { align: 'center' });

    // Abrir PDF no navegador
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    // Limpar a URL do objeto após um tempo
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 100);
  }

  private generateUniqueTicketId(): string {
    // Gerar ID único de no máximo 5 dígitos
    // Usar timestamp + random para garantir unicidade
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    
    // Combinar timestamp e random, depois pegar últimos 5 dígitos
    const combined = (timestamp + random).toString();
    const id = combined.slice(-5); // Pega os últimos 5 dígitos
    
    // Garantir que sempre tenha 5 dígitos (preencher com zeros à esquerda se necessário)
    return id.padStart(5, '0');
  }

  private async loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        } else {
          reject(new Error('Não foi possível criar contexto do canvas'));
        }
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem do QR code'));
      img.src = url;
    });
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

