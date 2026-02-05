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
  showError = false;
  errorMessage = '';
  isLoading = false;

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
      this.showError = false;
      this.showSuccess = false;
      
      // Preparar dados no formato esperado pelo backend
      const formData = {
        nomeCompleto: this.supporterForm.value.nome,
        email: this.supporterForm.value.email,
        contacto: this.supporterForm.value.contacto,
        tipoApoio: this.supporterForm.value.tipoApoio,
        descricao: this.supporterForm.value.descricao,
        anonimato: this.supporterForm.value.anonimato === 'sim'
      };

      console.log('📤 Dados do apoiante:', formData);

      // Enviar para o backend
      this.apiClient.criarApoiante(formData).subscribe({
        next: (response) => {
          console.log('✅ Apoiante criado com sucesso:', response);
          this.isLoading = false;
          this.showSuccess = true;
          this.supporterForm.reset();
        },
        error: (error) => {
          console.error('❌ Erro ao criar apoiante:', error);
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.message || 'Erro ao cadastrar apoiante. Por favor, tente novamente.';
        }
      });
    } else {
      // Marcar todos os campos como touched para mostrar erros
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

  closeErrorModal(): void {
    this.showError = false;
    this.errorMessage = '';
  }

}

