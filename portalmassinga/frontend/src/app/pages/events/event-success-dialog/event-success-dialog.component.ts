import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-success-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './event-success-dialog.component.html',
  styleUrl: './event-success-dialog.component.scss'
})
export class EventSuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      eventoId: string; 
      nomeParticipante: string;
    }
  ) {}

  onMoreEvents() {
    this.dialogRef.close({ action: 'more' });
  }

  onFinish() {
    this.dialogRef.close({ action: 'finish' });
  }
}

