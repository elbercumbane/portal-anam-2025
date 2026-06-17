import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe, DatePipe } from '@angular/common';
import { VALOR_COTA } from '../../../pages/members/pay-quotas/pay-quotas.helpers';

export interface PaymentReceiptData {
  id: string;
  numeroMembro: string;
  nomeMembro: string;
  emailMembro?: string;
  celularMembro?: string;
  dataPagamento: Date;
  meses: string[];
  valorTotal: number;
  metodoPagamento: string;
  numeroTelefone: string;
  status: 'pago' | 'pendente';
  mesesEmDividaRestantes?: number;
  valorDividaRestante?: number;
}

@Component({
  selector: 'app-payment-receipt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './payment-receipt-dialog.component.html',
  styleUrls: ['./payment-receipt-dialog.component.scss']
})
export class PaymentReceiptDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentReceiptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentReceiptData
  ) {}

  get mesesLista(): string[] {
    if (this.data.meses.includes('Ano completo')) {
      return Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`);
    }
    return this.data.meses;
  }

  get precoUnitario(): number {
    return VALOR_COTA;
  }

  onPrint(): void {
    window.print();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

