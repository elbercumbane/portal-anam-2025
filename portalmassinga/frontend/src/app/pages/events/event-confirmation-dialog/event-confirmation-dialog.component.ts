import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DadosParticipante {
  nome: string;
  email: string;
  telefone: string;
  tipoParticipante: string;
  receberWhatsApp?: boolean;
}

@Component({
  selector: 'app-event-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './event-confirmation-dialog.component.html',
  styleUrl: './event-confirmation-dialog.component.scss'
})
export class EventConfirmationDialogComponent {
  confirmationForm: FormGroup;
  isEditing = false;

  constructor(
    public dialogRef: MatDialogRef<EventConfirmationDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      dadosParticipante: DadosParticipante;
      eventos: Array<{ titulo: string; data: string; local: string }>;
    }
  ) {
    this.confirmationForm = this.fb.group({
      nome: [data.dadosParticipante.nome],
      email: [data.dadosParticipante.email],
      telefone: [data.dadosParticipante.telefone],
      tipoParticipante: [data.dadosParticipante.tipoParticipante],
      receberWhatsApp: [data.dadosParticipante.receberWhatsApp || false]
    });
  }

  onEdit() {
    this.isEditing = true;
  }

  onSave() {
    if (this.confirmationForm.valid) {
      this.isEditing = false;
    }
  }

  onCancelEdit() {
    this.confirmationForm.patchValue(this.data.dadosParticipante);
    this.isEditing = false;
  }

  onFinalize() {
    this.dialogRef.close({
      action: 'finalize',
      dadosAtualizados: this.confirmationForm.value
    });
  }

  onCancel() {
    this.dialogRef.close({ action: 'cancel' });
  }
}

