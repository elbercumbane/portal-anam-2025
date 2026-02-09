import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiClientService } from '../../../services/api-client.service';

@Component({
  selector: 'app-become-supporter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './become-supporter.component.html',
  styleUrl: './become-supporter.component.scss'
})
export class BecomeSupporterComponent implements OnInit {
  supporterForm!: FormGroup;
  showSuccess = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiClient: ApiClientService
  ) {}

  ngOnInit(): void {
    this.supporterForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contacto: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      tipoApoio: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      anonimato: ['', [Validators.required]]
    });
  }

  onContactoKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir apenas números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onContactoPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    // Remover todos os caracteres não numéricos
    const numbersOnly = pastedText.replace(/\D/g, '');
    const contactoControl = this.supporterForm.get('contacto');
    if (contactoControl) {
      contactoControl.setValue(numbersOnly);
    }
  }

  onSubmit(): void {
    if (this.supporterForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const v = this.supporterForm.value;
      const payload = {
        fullName: v.nome,
        email: v.email,
        phone: v.contacto,
        supportType: v.tipoApoio,
        description: v.descricao,
        anonymous: v.anonimato === 'sim'
      };

      this.apiClient.createSupporterRegistration(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccess = true;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || 'Erro ao registar. Tente novamente.';
        }
      });
    } else {
      Object.keys(this.supporterForm.controls).forEach(key => {
        this.supporterForm.get(key)?.markAsTouched();
      });
    }
  }

  goToSupporterArea(): void {
    this.router.navigate(['/apoio/area-apoiante']);
  }

  closeSuccessModal(): void {
    this.showSuccess = false;
  }

}

