import { Component, OnInit, OnChanges, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentReceiptDialogComponent, PaymentReceiptData } from '../../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';

@Component({
  selector: 'app-quotas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './quotas.component.html',
  styleUrl: './quotas.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class QuotasComponent implements OnInit, OnChanges {
  @Input() quotasSummary: any;
  @Input() receipts: any[] = [];
  
  filteredReceipts: any[] = [];
  selectedYear: string = '';
  selectedMonth: string = '';
  selectedStatus: string = '';
  availableYears: number[] = [];
  
  months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filteredReceipts = [...this.receipts];
    this.extractAvailableYears();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receipts'] && this.receipts) {
      this.filteredReceipts = [...this.receipts];
      this.extractAvailableYears();
      this.applyFilters();
    }
  }

  extractAvailableYears(): void {
    const years = new Set<number>();
    this.receipts.forEach(receipt => {
      const year = new Date(receipt.dataPagamento).getFullYear();
      years.add(year);
    });
    this.availableYears = Array.from(years).sort((a, b) => b - a);
  }

  filterReceiptsByYear(): void {
    this.applyFilters();
  }

  filterReceiptsByMonth(): void {
    this.applyFilters();
  }

  filterReceiptsByStatus(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReceipts = this.receipts.filter(receipt => {
      const receiptYear = new Date(receipt.dataPagamento).getFullYear().toString();
      const receiptMonth = (new Date(receipt.dataPagamento).getMonth() + 1).toString().padStart(2, '0');
      
      const yearMatch = !this.selectedYear || receiptYear === this.selectedYear;
      const monthMatch = !this.selectedMonth || receiptMonth === this.selectedMonth;
      const statusMatch = !this.selectedStatus || receipt.status === this.selectedStatus;
      
      return yearMatch && monthMatch && statusMatch;
    });
  }

  viewReceipt(receipt: any): void {
    const receiptData: PaymentReceiptData = {
      id: receipt.id,
      numeroMembro: receipt.numeroMembro,
      nomeMembro: receipt.nomeMembro,
      emailMembro: receipt.emailMembro || '',
      dataPagamento: receipt.dataPagamento,
      meses: receipt.meses,
      valorTotal: receipt.valorTotal,
      metodoPagamento: receipt.metodoPagamento,
      numeroTelefone: receipt.numeroTelefone,
      status: receipt.status
    };

    this.dialog.open(PaymentReceiptDialogComponent, {
      width: '600px',
      data: receiptData
    });
  }

  downloadReceipt(receipt: any): void {
    this.snackBar.open('Download do recibo iniciado', 'Fechar', { duration: 3000 });
  }
}

