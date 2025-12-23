import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pin-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pin-confirmation-dialog.component.html',
  styleUrls: ['./pin-confirmation-dialog.component.scss']
})
export class PinConfirmationDialogComponent {
  processing = true;

  constructor(
    public dialogRef: MatDialogRef<PinConfirmationDialogComponent>
  ) {
    // Simular processamento - em produção, aguardaria confirmação da operadora
    // Por enquanto, simula confirmação após 3 segundos
    setTimeout(() => {
      this.processing = false;
      // Auto-fechar após confirmação (em produção, aguardaria callback da operadora)
      setTimeout(() => {
        this.dialogRef.close({ confirmed: true });
      }, 1000);
    }, 3000);
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false, cancelled: true });
  }
}

