import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const WAIT_SECONDS = 15;

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
export class PinConfirmationDialogComponent implements OnDestroy {
  processing = true;
  secondsLeft = WAIT_SECONDS;
  progressPercent = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(public dialogRef: MatDialogRef<PinConfirmationDialogComponent>) {
    const start = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      this.secondsLeft = Math.max(0, WAIT_SECONDS - Math.floor(elapsed));
      this.progressPercent = Math.min(100, (elapsed / WAIT_SECONDS) * 100);
    }, 200);

    setTimeout(() => {
      this.processing = false;
      if (this.intervalId) clearInterval(this.intervalId);
      this.progressPercent = 100;
      this.secondsLeft = 0;
      this.closeTimeoutId = setTimeout(() => {
        this.dialogRef.close({ confirmed: true });
      }, 800);
    }, WAIT_SECONDS * 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.closeTimeoutId) clearTimeout(this.closeTimeoutId);
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false, cancelled: true });
  }
}
