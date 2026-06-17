import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-beneficios-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './beneficios-dialog.component.html',
  styleUrls: ['./beneficios-dialog.component.scss']
})
export class BeneficiosDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BeneficiosDialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

