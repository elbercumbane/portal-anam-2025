import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pagar-cotas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    DecimalPipe
  ],
  templateUrl: './pagar-cotas.component.html',
  styleUrls: ['./pagar-cotas.component.scss']
})
export class PagarCotasComponent implements OnInit {
  paymentForm!: FormGroup;
  
  valorCota = 1200; // Valor fixo da cota
  mesesSelecionados: number[] = [];
  metodoPagamento: 'mpesa' | 'emola' | 'visa' | '' = '';
  
  meses = [
    { value: 1, label: 'Janeiro', selected: false },
    { value: 2, label: 'Fevereiro', selected: false },
    { value: 3, label: 'Março', selected: false },
    { value: 4, label: 'Abril', selected: false },
    { value: 5, label: 'Maio', selected: false },
    { value: 6, label: 'Junho', selected: false },
    { value: 7, label: 'Julho', selected: false },
    { value: 8, label: 'Agosto', selected: false },
    { value: 9, label: 'Setembro', selected: false },
    { value: 10, label: 'Outubro', selected: false },
    { value: 11, label: 'Novembro', selected: false },
    { value: 12, label: 'Dezembro', selected: false }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      metodoPagamento: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  toggleMes(mesValue: number): void {
    const mes = this.meses.find(m => m.value === mesValue);
    if (mes) {
      mes.selected = !mes.selected;
      this.atualizarMesesSelecionados();
    }
  }

  atualizarMesesSelecionados(): void {
    this.mesesSelecionados = this.meses
      .filter(m => m.selected)
      .map(m => m.value)
      .sort((a, b) => a - b);
  }

  get quantidadeMeses(): number {
    return this.mesesSelecionados.length;
  }

  get valorTotal(): number {
    return this.valorCota * this.quantidadeMeses;
  }

  get mesesSelecionadosLabels(): string {
    if (this.mesesSelecionados.length === 0) return '';
    return this.mesesSelecionados
      .map(v => this.meses.find(m => m.value === v)?.label)
      .join(', ');
  }

  get calculoDetalhado(): string {
    if (this.quantidadeMeses === 0) return '';
    if (this.quantidadeMeses === 1) {
      return `${this.valorCota.toLocaleString('pt-MZ')} MT`;
    }
    return `${this.quantidadeMeses} × ${this.valorCota.toLocaleString('pt-MZ')} MT = ${this.valorTotal.toLocaleString('pt-MZ')} MT`;
  }

  selecionarMetodoPagamento(metodo: 'mpesa' | 'emola' | 'visa'): void {
    this.metodoPagamento = metodo;
    this.paymentForm.patchValue({ metodoPagamento: metodo });
    
    // Visa não precisa de telefone
    if (metodo === 'visa') {
      this.paymentForm.get('telefone')?.clearValidators();
      this.paymentForm.get('telefone')?.updateValueAndValidity();
    } else {
      this.paymentForm.get('telefone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
      this.paymentForm.get('telefone')?.updateValueAndValidity();
    }
  }

  processarPagamento(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (this.mesesSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos um mês para pagar.');
      return;
    }

    if (!this.metodoPagamento) {
      alert('Por favor, selecione um método de pagamento.');
      return;
    }

    // Simular processamento de pagamento (sem backend)
    const dados = {
      metodo: this.metodoPagamento,
      telefone: this.paymentForm.value.telefone,
      meses: this.mesesSelecionados,
      valorTotal: this.valorTotal,
      quantidadeMeses: this.quantidadeMeses
    };

    console.log('Processando pagamento:', dados);
    const metodoNome = this.metodoPagamento === 'mpesa' ? 'M-Pesa' : this.metodoPagamento === 'emola' ? 'Emola' : 'Visa';
    alert(`Pagamento processado!\n\nMétodo: ${metodoNome}\nMeses: ${this.mesesSelecionadosLabels}\nValor Total: ${this.valorTotal.toLocaleString('pt-MZ')} MT`);
    
    // Resetar formulário após pagamento
    this.resetarFormulario();
  }

  resetarFormulario(): void {
    this.meses.forEach(m => m.selected = false);
    this.mesesSelecionados = [];
    this.metodoPagamento = '';
    this.paymentForm.reset();
  }

  get textoBotaoPagamento(): string {
    if (this.valorTotal > 0) {
      return `Pagar ${this.valorTotal.toLocaleString('pt-MZ')} MT`;
    }
    return 'Pagar';
  }
}

