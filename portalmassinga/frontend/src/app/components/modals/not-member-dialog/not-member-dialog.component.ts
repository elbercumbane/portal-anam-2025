import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './not-member-dialog.component.html',
  styleUrls: ['./not-member-dialog.component.scss']
})
export class NotMemberDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotMemberDialogComponent>,
    private router: Router
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onRegister(): void {
    this.dialogRef.close();
    this.router.navigate(['/associar-se']);
  }
}
