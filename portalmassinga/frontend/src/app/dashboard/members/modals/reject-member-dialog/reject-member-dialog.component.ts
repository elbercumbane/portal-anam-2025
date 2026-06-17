import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface RejectMemberDialogData {
  memberName: string;
  memberEmail: string;
}

@Component({
  selector: 'app-reject-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './reject-member-dialog.component.html',
  styleUrls: ['./reject-member-dialog.component.scss']
})
export class RejectMemberDialogComponent {
  observacoes = '';

  constructor(
    public dialogRef: MatDialogRef<RejectMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RejectMemberDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(this.observacoes?.trim() || undefined);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
