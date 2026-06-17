import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { PaymentReceiptData } from '../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';
import { VALOR_COTA } from '../pages/members/pay-quotas/pay-quotas.helpers';

@Injectable({
  providedIn: 'root'
})
export class ReceiptPdfService {

  private readonly brand = {
    primary: [15, 118, 110] as [number, number, number],      // #0f766e
    primaryDark: [13, 94, 88] as [number, number, number],  // #0d5d56
    accent: [255, 215, 0] as [number, number, number],        // #FFD700
    ink: [15, 23, 42] as [number, number, number],
    muted: [100, 116, 139] as [number, number, number],
    surface: [248, 250, 252] as [number, number, number],
    border: [226, 232, 240] as [number, number, number],
    success: [5, 150, 105] as [number, number, number]
  };

  generateReceiptPdf(receipt: PaymentReceiptData): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentW = pageWidth - margin * 2;
    const dataFormatada = this.formatDate(receipt.dataPagamento);

    const isAnoCompleto = receipt.meses.includes('Ano completo');
    const valorUnitario = VALOR_COTA;
    const mesesList = isAnoCompleto
      ? Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`)
      : receipt.meses;

    let y = this.drawHeader(doc, margin, contentW, pageWidth, receipt.id, dataFormatada);
    y = this.drawMemberAndPaymentCards(doc, margin, contentW, y, receipt, dataFormatada);
    y = this.drawItemsTable(doc, margin, contentW, y, mesesList, valorUnitario, receipt.valorTotal);
    y = this.drawTotal(doc, margin, contentW, y, receipt.valorTotal);
    this.drawFooter(doc, margin, contentW, y, receipt);

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
  }

  private drawHeader(
    doc: jsPDF, margin: number, contentW: number, pageWidth: number,
    receiptId: string, dataFormatada: string
  ): number {
    const headerH = 42;
    doc.setFillColor(...this.brand.primary);
    doc.roundedRect(margin, 16, contentW, headerH, 3, 3, 'F');

    // Accent stripe
    doc.setFillColor(...this.brand.accent);
    doc.rect(margin, 16, 4, headerH, 'F');

    // ANAM brand
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text('ANAM', margin + 12, 33);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Associação de Naturais e Amigos de Massinga', margin + 12, 40);

    doc.setFontSize(7);
    doc.setTextColor(220, 252, 231);
    doc.text('Massinga · Inhambane · Moçambique', margin + 12, 45.5);

    // Right side — receipt meta
    const rightX = margin + contentW - 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('RECIBO DE COTA', rightX, 28, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nº ${receiptId}`, rightX, 34, { align: 'right' });
    doc.text(`Emitido: ${dataFormatada}`, rightX, 39.5, { align: 'right' });

    // Status badge
    const badgeW = 22;
    const badgeX = rightX - badgeW;
    doc.setFillColor(...this.brand.success);
    doc.roundedRect(badgeX, 42, badgeW, 7, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PAGO', badgeX + badgeW / 2, 47, { align: 'center' });

    return 16 + headerH + 10;
  }

  private drawMemberAndPaymentCards(
    doc: jsPDF, margin: number, contentW: number, y: number,
    receipt: PaymentReceiptData, dataFormatada: string
  ): number {
    const gap = 6;
    const cardW = (contentW - gap) / 2;
    const cardH = 38;
    const leftX = margin;
    const rightX = margin + cardW + gap;

    this.drawCard(doc, leftX, y, cardW, cardH, 'MEMBRO');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.brand.ink);
    doc.text(receipt.nomeMembro, leftX + 6, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.brand.muted);
    doc.setFontSize(8);
    doc.text(`NUIT: ${receipt.numeroMembro}`, leftX + 6, y + 22);
    if (receipt.emailMembro) {
      doc.text(receipt.emailMembro, leftX + 6, y + 28);
    }

    this.drawCard(doc, rightX, y, cardW, cardH, 'PAGAMENTO');
    doc.setFontSize(8);
    doc.setTextColor(...this.brand.muted);
    doc.text('Data do recibo', rightX + 6, y + 14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.brand.ink);
    doc.setFontSize(9);
    doc.text(dataFormatada, rightX + 6, y + 19);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...this.brand.muted);
    doc.text('Método', rightX + 6, y + 26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.brand.ink);
    doc.text(receipt.metodoPagamento, rightX + 6, y + 31);
    if (receipt.numeroTelefone) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...this.brand.muted);
      doc.text(`+258 ${receipt.numeroTelefone}`, rightX + 6, y + 36);
    }

    return y + cardH + 10;
  }

  private drawItemsTable(
    doc: jsPDF, margin: number, contentW: number, y: number,
    meses: string[], valorUnitario: number, valorTotal: number
  ): number {
    const pageHeight = doc.internal.pageSize.getHeight();
    const tableX = margin;
    const colNum = 12;
    const colPrice = 34;
    const colTotal = 34;
    const colDesc = contentW - colNum - colPrice - colTotal;
    const rowH = 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...this.brand.primary);
    doc.text('DETALHES DAS COTAS', margin, y);
    y += 5;

    y = this.drawTableHeaderRow(doc, tableX, contentW, y, colNum, colDesc, colPrice, colTotal);

    const list = meses.length > 0 ? meses : ['Ano completo'];
    const unitStr = this.formatCurrency(valorUnitario);

    list.forEach((mes, index) => {
      if (y + rowH > pageHeight - 55) {
        doc.addPage();
        y = margin;
        y = this.drawTableHeaderRow(doc, tableX, contentW, y, colNum, colDesc, colPrice, colTotal);
      }

      if (index % 2 === 0) {
        doc.setFillColor(...this.brand.surface);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.setDrawColor(...this.brand.border);
      doc.rect(tableX, y, contentW, rowH, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...this.brand.muted);
      doc.text(String(index + 1), tableX + 3, y + 4.8);

      doc.setTextColor(...this.brand.ink);
      doc.text(`Cota — ${mes}`, tableX + colNum + 3, y + 4.8);

      doc.text(unitStr, tableX + colNum + colDesc + 3, y + 4.8);
      doc.setFont('helvetica', 'bold');
      doc.text(unitStr, tableX + colNum + colDesc + colPrice + 3, y + 4.8);

      y += rowH;
    });

    // Linha resumo
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(...this.brand.border);
    doc.rect(tableX, y, contentW, rowH + 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...this.brand.primaryDark);
    doc.text(`Total (${list.length} cotas)`, tableX + colNum + 3, y + 5.2);
    doc.text(this.formatCurrency(valorTotal), tableX + colNum + colDesc + colPrice + 3, y + 5.2);

    return y + rowH + 9;
  }

  private drawTableHeaderRow(
    doc: jsPDF, tableX: number, contentW: number, y: number,
    colNum: number, colDesc: number, colPrice: number, colTotal: number
  ): number {
    doc.setFillColor(...this.brand.primaryDark);
    doc.roundedRect(tableX, y, contentW, 9, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('#', tableX + 3, y + 6);
    doc.text('DESCRIÇÃO', tableX + colNum + 3, y + 6);
    doc.text('PREÇO UNIT.', tableX + colNum + colDesc + 3, y + 6);
    doc.text('VALOR', tableX + colNum + colDesc + colPrice + 3, y + 6);
    return y + 11;
  }

  private drawTotal(doc: jsPDF, margin: number, contentW: number, y: number, valorTotal: number): number {
    const boxH = 18;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(110, 231, 183);
    doc.roundedRect(margin, y, contentW, boxH, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...this.brand.primaryDark);
    doc.text('TOTAL PAGO', margin + 8, y + 11);

    doc.setFontSize(16);
    doc.setTextColor(...this.brand.primary);
    doc.text(this.formatCurrency(valorTotal), margin + contentW - 8, y + 12, { align: 'right' });

    return y + boxH + 10;
  }

  private drawFooter(
    doc: jsPDF, margin: number, contentW: number, startY: number,
    receipt: PaymentReceiptData
  ): void {
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = startY + 8;
    if (y + 38 > pageHeight - 10) {
      doc.addPage();
      y = margin;
    }

    doc.setDrawColor(...this.brand.border);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.brand.primary);
    doc.text('ANAM — Associação de Naturais e Amigos de Massinga', margin, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...this.brand.muted);
    doc.text('Av. Principal, Massinga, Inhambane, Moçambique', margin, y + 12);
    doc.text('Tel: +258 84 000 0000  ·  geral@anam.org', margin, y + 17);

    doc.setFontSize(7);
    doc.text(
      'Este documento confirma o pagamento das cotas de associação. Guarde-o para seus registos.',
      margin, y + 25
    );
    doc.text(
      `Documento gerado electronicamente em ${this.formatDate(receipt.dataPagamento)}`,
      margin + contentW, y + 25, { align: 'right' }
    );

    doc.setFontSize(8);
    doc.setTextColor(...this.brand.ink);
    doc.text('Tesouraria ANAM', margin, y + 34);
    doc.setDrawColor(...this.brand.border);
    doc.line(margin + 32, y + 35, margin + 80, y + 35);
  }

  private drawCard(doc: jsPDF, x: number, y: number, w: number, h: number, label: string): void {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...this.brand.border);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');

    doc.setFillColor(...this.brand.primary);
    doc.rect(x, y + 3, w, 0.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...this.brand.primary);
    doc.text(label, x + 6, y + 9);
  }

  private formatCurrency(value: number): string {
    return `${value.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT`;
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
