import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe, DatePipe } from '@angular/common';

export interface PaymentReceiptData {
  id: string;
  numeroMembro: string;
  nomeMembro: string;
  emailMembro?: string;
  dataPagamento: Date;
  meses: string[];
  valorTotal: number;
  metodoPagamento: string;
  numeroTelefone: string;
  status: 'pago' | 'pendente';
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

  onPrint(): void {
    window.print();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

