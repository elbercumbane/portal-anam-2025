import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  contributionAmounts = [
    { value: 50, label: '50 MZN' },
    { value: 100, label: '100 MZN' },
    { value: 150, label: '150 MZN' },
    { value: 300, label: '300 MZN' },
    { value: 500, label: '500 MZN' },
    { value: 1000, label: '1000 MZN' },
    { value: 'custom', label: 'Outro valor' }
  ];

  frequencies = [
    { value: 'unique', label: 'Contribuição Única' },
    { value: 'monthly', label: 'Mensal' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.supporterForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      valor: ['', [Validators.required]],
      valorCustom: [''],
      frequencia: ['monthly', [Validators.required]]
    });

    // Mostrar campo custom quando "Outro valor" for selecionado
    this.supporterForm.get('valor')?.valueChanges.subscribe(value => {
      if (value === 'custom') {
        this.supporterForm.get('valorCustom')?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        this.supporterForm.get('valorCustom')?.clearValidators();
        this.supporterForm.get('valorCustom')?.setValue('');
      }
      this.supporterForm.get('valorCustom')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.supporterForm.valid) {
      this.isLoading = true;
      
      const formData = {
        ...this.supporterForm.value,
        valorFinal: this.supporterForm.value.valor === 'custom' 
          ? this.supporterForm.value.valorCustom 
          : this.supporterForm.value.valor
      };

      console.log('📤 Dados do apoiante:', formData);

      // Simular envio (substituir por chamada real à API)
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccess = true;
        
        // Simular criação de conta e envio de email
        console.log('✅ Conta de apoiante criada');
        console.log('📧 Email enviado com recibo e link de login');
        
        // Após 5 segundos, redirecionar para área do apoiante
        setTimeout(() => {
          this.router.navigate(['/apoio/area-apoiante']);
        }, 5000);
      }, 2000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.supporterForm.controls).forEach(key => {
        this.supporterForm.get(key)?.markAsTouched();
      });
    }
  }

  getSelectedAmount(): number {
    const valor = this.supporterForm.get('valor')?.value;
    if (valor === 'custom') {
      return this.supporterForm.get('valorCustom')?.value || 0;
    }
    return valor || 0;
  }
}

