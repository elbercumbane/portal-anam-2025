import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ApproveMemberDialogData {
  memberName: string;
  memberEmail: string;
}

@Component({
  selector: 'app-approve-member-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './approve-member-dialog.component.html',
  styleUrls: ['./approve-member-dialog.component.scss']
})
export class ApproveMemberDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ApproveMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApproveMemberDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
