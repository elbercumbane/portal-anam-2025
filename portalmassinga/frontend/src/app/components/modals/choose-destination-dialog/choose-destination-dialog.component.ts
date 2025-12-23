import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ChooseDestinationData {
  userName: string;
}

@Component({
  selector: 'app-choose-destination-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './choose-destination-dialog.component.html',
  styleUrl: './choose-destination-dialog.component.scss'
})
export class ChooseDestinationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChooseDestinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChooseDestinationData
  ) {}

  goToDashboard(): void {
    this.dialogRef.close('dashboard');
  }

  goToMembersArea(): void {
    this.dialogRef.close('members');
  }
}

