import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-become-supporter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './become-supporter.component.html',
  styleUrl: './become-supporter.component.scss'
})
export class BecomeSupporterComponent implements OnInit {
  supporterForm!: FormGroup;
  showSuccess = false;
  isLoading = false;
  errorMessage = '';
  showInfoModal = false;

  constructor(
    private fb: FormBuilder,
    private apiClient: ApiClientService
  ) {}

  ngOnInit(): void {
    this.supporterForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contacto1: ['', [Validators.required, Validators.pattern(/^[0-9+\s\-()]+$/)]],
      contacto1WhatsApp: ['nao'],
      contacto2: ['', [Validators.pattern(/^[0-9+\s\-()]*$/)]],
      contacto2WhatsApp: ['nao'],
      tipoApoio: ['', [Validators.required]],
      descricao: [''],
      anonimato: ['', [Validators.required]],
      criarConta: ['nao']
    });

    // Validação condicional para descrição
    this.supporterForm.get('tipoApoio')?.valueChanges.subscribe(tipoApoio => {
      const descricaoControl = this.supporterForm.get('descricao');
      if (tipoApoio && tipoApoio !== '') {
        descricaoControl?.setValidators([Validators.required]);
      } else {
        descricaoControl?.clearValidators();
        descricaoControl?.setValue('');
      }
      descricaoControl?.updateValueAndValidity();
    });
  }

  onCriarContaChoice(val: string): void {
    if (val === 'sim') {
      this.showInfoModal = true;
    }
  }

  openInfoModal(): void {
    this.showInfoModal = true;
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
  }

  onContactoKeyPress(event: KeyboardEvent, fieldName: string): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir números, +, espaços, hífens e parênteses
    const allowedChars = [43, 45, 40, 41, 32]; // +, -, (, ), espaço
    if ((charCode >= 48 && charCode <= 57) || allowedChars.includes(charCode)) {
      return;
    }
    event.preventDefault();
  }

  onContactoPaste(event: ClipboardEvent, fieldName: string): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    // Manter apenas números, +, espaços, hífens e parênteses
    const cleaned = pastedText.replace(/[^0-9+\s\-()]/g, '');
    const contactoControl = this.supporterForm.get(fieldName);
    if (contactoControl) {
      contactoControl.setValue(cleaned);
    }
  }

  onSubmit(): void {
    if (this.supporterForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const v = this.supporterForm.value;
      
      const payload: any = {
        fullName: v.nome,
        email: v.email,
        phone: v.contacto1,
        phoneWhatsApp: v.contacto1WhatsApp === 'sim',
        supportType: v.tipoApoio,
        description: v.descricao,
        anonymous: v.anonimato === 'sim',
        wantsAccount: v.criarConta === 'sim'
      };

      if (v.contacto2 && v.contacto2.trim()) {
        payload.phone2 = v.contacto2;
        payload.phone2WhatsApp = v.contacto2WhatsApp === 'sim';
      }

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

  closeSuccessModal(): void {
    this.showSuccess = false;
    this.supporterForm.reset({
      nome: '',
      email: '',
      contacto1: '',
      contacto1WhatsApp: 'nao',
      contacto2: '',
      contacto2WhatsApp: 'nao',
      tipoApoio: '',
      descricao: '',
      anonimato: '',
      criarConta: 'nao'
    });
  }

}

