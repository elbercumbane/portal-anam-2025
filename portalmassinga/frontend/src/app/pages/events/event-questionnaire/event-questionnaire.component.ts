import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-event-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './event-questionnaire.component.html',
  styleUrl: './event-questionnaire.component.scss'
})
export class EventQuestionnaireComponent {
  questionnaireForm: FormGroup;
  canais = [
    { id: 'facebook', label: 'Facebook', checked: false },
    { id: 'instagram', label: 'Instagram', checked: false },
    { id: 'radio', label: 'Rádio', checked: false },
    { id: 'televisao', label: 'Televisão', checked: false },
    { id: 'portal-anam', label: 'Portal da ANAM', checked: false },
    { id: 'outro', label: 'Outro', checked: false }
  ];
  outroCanal: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventQuestionnaireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eventoId: string; nomeParticipante: string }
  ) {
    this.questionnaireForm = this.fb.group({
      canais: [[], [Validators.required, this.validateCanais.bind(this)]],
      outroCanal: ['']
    });
  }

  validateCanais(control: any) {
    const canais = control.value;
    if (!canais || canais.length === 0) {
      return { required: true };
    }
    return null;
  }

  toggleCanal(canalId: string) {
    const canal = this.canais.find(c => c.id === canalId);
    if (canal) {
      canal.checked = !canal.checked;
      this.updateFormValue();
    }
  }

  updateFormValue() {
    const canaisSelecionados = this.canais
      .filter(c => c.checked)
      .map(c => c.id);
    
    this.questionnaireForm.patchValue({
      canais: canaisSelecionados
    });
  }

  onSubmit() {
    if (this.questionnaireForm.valid) {
      const formData = {
        eventoId: this.data.eventoId,
        nomeParticipante: this.data.nomeParticipante,
        canais: this.canais.filter(c => c.checked).map(c => ({
          id: c.id,
          label: c.label
        })),
        outroCanal: this.questionnaireForm.value.outroCanal
      };

      // Salvar no localStorage (simulado)
      const questionarios = JSON.parse(localStorage.getItem('questionariosEventos') || '[]');
      questionarios.push(formData);
      localStorage.setItem('questionariosEventos', JSON.stringify(questionarios));

      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  isOutroCanalChecked(): boolean {
    const outroCanal = this.canais.find(c => c.id === 'outro');
    return outroCanal ? outroCanal.checked : false;
  }
}

