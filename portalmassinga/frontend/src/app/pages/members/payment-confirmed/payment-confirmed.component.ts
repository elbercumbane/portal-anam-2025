import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ReceiptPdfService } from '../../../services/receipt-pdf.service';
import { PaymentReceiptData } from '../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { VALOR_COTA } from '../pay-quotas/pay-quotas.helpers';

@Component({
  selector: 'app-pagamento-confirmado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './payment-confirmed.component.html',
  styleUrls: ['./payment-confirmed.component.scss']
})
export class PaymentConfirmedComponent implements OnInit, OnDestroy {
  receiptData: PaymentReceiptData | null = null;
  receiptId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private receiptPdfService: ReceiptPdfService
  ) {}

  ngOnInit(): void {
    document.body.classList.add('navbar-solid');

    this.route.queryParams.subscribe(params => {
      this.receiptId = params['receiptId'] || null;
      if (this.receiptId) {
        this.loadReceiptData();
      } else {
        this.router.navigate(['/membros/pagar-cotas']);
      }
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('navbar-solid');
  }

  loadReceiptData(): void {
    try {
      const stored = localStorage.getItem('payment_receipts');
      if (stored) {
        const receipts: PaymentReceiptData[] = JSON.parse(stored);
        this.receiptData = receipts
          .map(r => ({ ...r, dataPagamento: new Date(r.dataPagamento) }))
          .find(r => r.id === this.receiptId) || null;

        if (!this.receiptData) {
          this.router.navigate(['/membros/pagar-cotas']);
        }
      } else {
        this.router.navigate(['/membros/pagar-cotas']);
      }
    } catch {
      this.router.navigate(['/membros/pagar-cotas']);
    }
  }

  verRecibo(): void {
    if (this.receiptData) {
      this.receiptPdfService.generateReceiptPdf(this.receiptData);
    }
  }

  get mesesLista(): string[] {
    if (!this.receiptData) return [];
    if (this.receiptData.meses.includes('Ano completo')) {
      return Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`);
    }
    return this.receiptData.meses;
  }

  get precoUnitario(): number {
    return VALOR_COTA;
  }
}
