import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-associar',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <h2>Associe-se</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>Nome completo</mat-label>
        <input matInput formControlName="nome" required />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" required />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Telefone</mat-label>
        <input matInput formControlName="telefone" />
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Enviar</button>
    </form>
  `,
  styles: [
    `.form { display: grid; gap: 12px; max-width: 520px; }`
  ]
})
export class AssociarComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
    });
  }

  submit(): void {
    if (this.form.valid) {
      alert('Solicitação enviada!');
      this.form.reset();
    }
  }
}


