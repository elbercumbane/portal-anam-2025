import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';
import { MatIconModule } from '@angular/material/icon';

interface SupportType {
  value: string;
  label: string;
  desc: string;
  placeholder: string;
  hint: string;
}

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
  showContacto2 = false;

  supportTypes: SupportType[] = [
    {
      value: 'valores-monetarios',
      label: 'Valores Monetários',
      desc: 'Doações em dinheiro',
      placeholder: 'Ex.: 5.000 MZN mensais ou doação única de 50.000 MZN',
      hint: 'Indique o valor, periodicidade e forma de transferência preferida'
    },
    {
      value: 'financiamento',
      label: 'Financiamento',
      desc: 'Apoio financeiro ou patrocínio',
      placeholder: 'Ex.: Patrocínio de evento ou financiamento de projecto específico',
      hint: 'Descreva o projecto ou iniciativa que pretende apoiar'
    },
    {
      value: 'bens',
      label: 'Bens',
      desc: 'Materiais, equipamentos ou produtos',
      placeholder: 'Ex.: 10 computadores portáteis ou material escolar para 50 crianças',
      hint: 'Especifique quantidade, estado e condições de entrega'
    },
    {
      value: 'servicos',
      label: 'Serviços',
      desc: 'Competências ou voluntariado',
      placeholder: 'Ex.: Aulas de informática aos sábados ou consultoria jurídica',
      hint: 'Indique a área, disponibilidade e duração do serviço'
    },
    {
      value: 'outros',
      label: 'Outros',
      desc: 'Outra forma de apoio',
      placeholder: 'Descreva como pretende contribuir para a associação',
      hint: 'Seja o mais específico possível para facilitarmos o contacto'
    }
  ];

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

  isFieldInvalid(fieldName: string): boolean {
    const control = this.supporterForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getDescriptionPlaceholder(): string {
    const tipo = this.supporterForm.get('tipoApoio')?.value;
    return this.supportTypes.find(t => t.value === tipo)?.placeholder || 'Descreva o que pretende oferecer...';
  }

  toggleContacto2(): void {
    this.showContacto2 = true;
  }

  removeContacto2(): void {
    this.showContacto2 = false;
    this.supporterForm.patchValue({ contacto2: '', contacto2WhatsApp: 'nao' });
    this.supporterForm.get('contacto2')?.markAsUntouched();
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
    const allowedChars = [43, 45, 40, 41, 32];
    if ((charCode >= 48 && charCode <= 57) || allowedChars.includes(charCode)) {
      return;
    }
    event.preventDefault();
  }

  onContactoPaste(event: ClipboardEvent, fieldName: string): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
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
          this.scrollToFirstError();
        }
      });
    } else {
      Object.keys(this.supporterForm.controls).forEach(key => {
        this.supporterForm.get(key)?.markAsTouched();
      });
      this.scrollToFirstError();
    }
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const firstError = document.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstError.querySelector('input, select, textarea') as HTMLElement;
        input?.focus();
      }
    }, 100);
  }

  closeSuccessModal(): void {
    this.showSuccess = false;
    this.showContacto2 = false;
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
