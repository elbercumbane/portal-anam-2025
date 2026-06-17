import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  form: FormGroup;
  hidePassword = true;
  hideConfirm = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup): { [key: string]: boolean } | null {
    const p = g.get('newPassword')?.value;
    const c = g.get('confirmPassword')?.value;
    if (!p || !c) return null;
    return p === c ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.isLoading = true;
    this.errorMessage = '';
    const newPassword = this.form.get('newPassword')?.value;
    this.authService.changePassword(newPassword).subscribe({
      next: (res) => {
        if (res.success) {
          this.dialogRef.close('success');
        } else {
          this.errorMessage = res.message || 'Erro ao alterar senha';
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        this.errorMessage = err?.message || 'Erro ao alterar senha';
        this.isLoading = false;
      }
    });
  }
}
