import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DeactivateMemberDialogData {
  memberName: string;
}

@Component({
  selector: 'app-deactivate-member-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './deactivate-member-dialog.component.html',
  styleUrls: ['./deactivate-member-dialog.component.scss']
})
export class DeactivateMemberDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeactivateMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeactivateMemberDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
