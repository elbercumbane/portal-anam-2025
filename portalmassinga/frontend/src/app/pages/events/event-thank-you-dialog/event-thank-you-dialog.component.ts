import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-thank-you-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './event-thank-you-dialog.component.html',
  styleUrl: './event-thank-you-dialog.component.scss'
})
export class EventThankYouDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventThankYouDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { 
      nomeParticipante: string;
    }
  ) {}

  onClose() {
    this.dialogRef.close();
    // Redirecionar para a home após fechar
    this.router.navigate(['/']);
  }
}

