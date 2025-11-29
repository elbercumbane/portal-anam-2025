import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ReceiptPdfService } from '../../../services/receipt-pdf.service';
import { PaymentReceiptData } from '../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';

@Component({
  selector: 'app-pagamento-confirmado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './pagamento-confirmado.component.html',
  styleUrls: ['./pagamento-confirmado.component.scss']
})
export class PagamentoConfirmadoComponent implements OnInit {
  receiptData: PaymentReceiptData | null = null;
  receiptId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private receiptPdfService: ReceiptPdfService
  ) {}

  ngOnInit(): void {
    // Obter dados do recibo da query string ou do localStorage
    this.route.queryParams.subscribe(params => {
      this.receiptId = params['receiptId'] || null;
      
      if (this.receiptId) {
        this.loadReceiptData();
      } else {
        // Se não houver receiptId, redirecionar para pagar-cotas
        this.router.navigate(['/membros/pagar-cotas']);
      }
    });
  }

  loadReceiptData(): void {
    try {
      const stored = localStorage.getItem('payment_receipts');
      if (stored) {
        const receipts: PaymentReceiptData[] = JSON.parse(stored);
        // Converter strings de data para Date objects
        const receiptsWithDates = receipts.map(r => ({
          ...r,
          dataPagamento: new Date(r.dataPagamento)
        }));
        
        this.receiptData = receiptsWithDates.find(r => r.id === this.receiptId) || null;
        
        if (!this.receiptData) {
          this.router.navigate(['/membros/pagar-cotas']);
        }
      } else {
        this.router.navigate(['/membros/pagar-cotas']);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do recibo:', e);
      this.router.navigate(['/membros/pagar-cotas']);
    }
  }

  verRecibo(): void {
    if (this.receiptData) {
      this.receiptPdfService.generateReceiptPdf(this.receiptData);
    }
  }
}

