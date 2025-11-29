import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

export interface MemberConfirmationData {
  member: {
    numero: string;
    nome: string;
    email: string;
    telefone: string;
  };
  telefone: string;
  tipoPagamento: 'mensal' | 'anual';
  meses: string[];
  metodo: 'mpesa' | 'emola' | 'visa';
  valorTotal: number;
}

@Component({
  selector: 'app-member-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DecimalPipe
  ],
  templateUrl: './member-confirmation-dialog.component.html',
  styleUrls: ['./member-confirmation-dialog.component.scss']
})
export class MemberConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MemberConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberConfirmationData
  ) {}

  onEdit(): void {
    this.dialogRef.close('edit');
  }

  onPay(): void {
    this.dialogRef.close('pay');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  get metodoNome(): string {
    const metodos: { [key: string]: string } = {
      'mpesa': 'M-Pesa',
      'emola': 'Emola',
      'visa': 'Visa'
    };
    return metodos[this.data.metodo] || this.data.metodo;
  }
}

