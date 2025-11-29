import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { PaymentReceiptData } from '../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ReceiptPdfService {

  constructor() {}

  generateReceiptPdf(receipt: PaymentReceiptData): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Cores
    const primaryColor = [27, 67, 50]; // Verde escuro
    const secondaryColor = [139, 120, 95]; // Marrom
    const textColor = [33, 23, 18]; // Preto
    const lightGray = [108, 94, 88]; // Cinza claro

    // Header - Título "RECIBO"
    doc.setFontSize(32);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO', margin, yPosition);
    yPosition += 15;

    // Informações da ANAM (lado esquerdo)
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Associação de Naturais e Amigos de Massinga', margin, yPosition);
    yPosition += 5;
    doc.text('Av. Principal, Massinga, Inhambane, Moçambique', margin, yPosition);
    yPosition += 5;
    doc.text('Telefone: +258 84 000 0000', margin, yPosition);
    yPosition += 5;
    doc.text('Email: geral@anam.org', margin, yPosition);
    yPosition += 10;

    // Informações do recibo (lado direito)
    const rightX = pageWidth - margin;
    yPosition = margin + 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBO #', rightX, yPosition, { align: 'right' });
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(receipt.id, rightX, yPosition, { align: 'right' });
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('DATA DO RECIBO', rightX, yPosition, { align: 'right' });
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const dataFormatada = this.formatDate(receipt.dataPagamento);
    doc.text(dataFormatada, rightX, yPosition, { align: 'right' });
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('DATA DE VENCIMENTO', rightX, yPosition, { align: 'right' });
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(dataFormatada, rightX, yPosition, { align: 'right' });
    yPosition += 15;

    // Linha divisória vermelha
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Informações do Membro (COBRAR A)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('COBRAR A', margin, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(receipt.nomeMembro, margin, yPosition);
    yPosition += 5;
    doc.text(`Número de Membro: ${receipt.numeroMembro}`, margin, yPosition);
    yPosition += 10;

    // Tabela de itens
    const tableTop = yPosition;
    
    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('QTD', margin, yPosition);
    doc.text('DESCRIÇÃO', margin + 30, yPosition);
    doc.text('PREÇO POR UNIDADE', margin + 100, yPosition);
    doc.text('VALOR', margin + 160, yPosition);
    yPosition += 5;
    
    // Linha divisória vermelha
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Itens da tabela
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // Calcular valor unitário
    // Se for "Ano completo", assume 12 meses, senão usa o número de meses
    const isAnoCompleto = receipt.meses.includes('Ano completo');
    const mesesCount = isAnoCompleto ? 12 : receipt.meses.length;
    const valorUnitario = mesesCount > 0 ? receipt.valorTotal / mesesCount : receipt.valorTotal;
    const mesesDescricao = receipt.meses.length > 0 ? receipt.meses.join(', ') : 'Ano completo';
    
    // Item único: Cotas
    doc.text(String(mesesCount), margin, yPosition);
    doc.text(`Cotas de Associação - ${mesesDescricao}`, margin + 30, yPosition);
    doc.text(`${valorUnitario.toFixed(2)} MT`, margin + 100, yPosition);
    doc.text(`${receipt.valorTotal.toFixed(2)} MT`, margin + 160, yPosition);
    yPosition += 10;

    // Linha divisória antes do total
    yPosition += 5;
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Total
    const totalX = margin + 100;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('TOTAL:', totalX, yPosition);
    doc.setFontSize(14);
    doc.text(`${receipt.valorTotal.toFixed(2)} MT`, margin + 160, yPosition);
    yPosition += 15;

    // Informações adicionais
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(`Método de Pagamento: ${receipt.metodoPagamento}`, margin, yPosition);
    yPosition += 5;
    if (receipt.numeroTelefone) {
      doc.text(`Número de Telefone: ${receipt.numeroTelefone}`, margin, yPosition);
      yPosition += 5;
    }
    yPosition += 10;

    // Assinatura
    const signatureY = pageHeight - 60;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Assinatura:', margin, signatureY);
    doc.setFont('helvetica', 'italic');
    doc.text('ANAM', margin, signatureY + 10);

    // Rodapé
    const footerY = pageHeight - 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Obrigado', margin, footerY);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('TERMOS E CONDIÇÕES', pageWidth - margin, footerY, { align: 'right' });
    doc.setFontSize(7);
    doc.text('Este recibo confirma o pagamento das cotas de associação.', pageWidth - margin, footerY + 5, { align: 'right' });
    doc.text('Guarde este documento para seus registos.', pageWidth - margin, footerY + 10, { align: 'right' });

    // Abrir PDF no navegador em vez de baixar diretamente
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    // Limpar a URL do objeto após um tempo para liberar memória
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 100);
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

