import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AdminCotasAvisoData {
  userName: string;
  cotasEmFalta?: {
    meses: number;
    dataVencimento: string;
    valorTotal: number;
  };
}

@Component({
  selector: 'app-admin-cotas-aviso-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-cotas-aviso-dialog.component.html',
  styleUrl: './admin-cotas-aviso-dialog.component.scss'
})
export class AdminCotasAvisoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AdminCotasAvisoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminCotasAvisoData
  ) {}

  getGreeting(): string {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Bom dia';
    if (h >= 12 && h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  onContinuar(): void {
    this.dialogRef.close('continuar');
  }

  onPagar(): void {
    this.dialogRef.close('pagar');
  }
}
