import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { MemberConfirmationDialogComponent, MemberConfirmationData } from '../../../components/modals/member-confirmation-dialog/member-confirmation-dialog.component';
import { PinConfirmationDialogComponent } from '../../../components/modals/pin-confirmation-dialog/pin-confirmation-dialog.component';
import { PaymentReceiptDialogComponent, PaymentReceiptData } from '../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';
import { BeneficiosDialogComponent } from '../../../components/modals/beneficios-dialog/beneficios-dialog.component';

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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DecimalPipe
  ],
  templateUrl: './pagar-cotas.component.html',
  styleUrls: ['./pagar-cotas.component.scss']
})
export class PagarCotasComponent implements OnInit {
  memberForm!: FormGroup;
  paymentForm!: FormGroup;
  
  // Dados do membro
  member: { numero: string; nome: string; email: string; telefone: string } | null = null;
  memberLoading = false;
  
  valorCota = 1200; // Valor fixo da cota
  tipoPagamento: 'mensal' | 'anual' = 'mensal';
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

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.memberForm = this.fb.group({
      numeroMembro: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
    
    this.paymentForm = this.fb.group({
      metodoPagamento: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  buscarMembro(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }
    
    const numero = this.memberForm.value.numeroMembro;
    this.memberLoading = true;
    
    // Simular busca de membro (sem backend)
    setTimeout(() => {
      // Simulação: membros de exemplo
      const membrosExemplo: { [key: string]: { numero: string; nome: string; email: string; telefone: string } } = {
        '001': { numero: '001', nome: 'João Silva', email: 'joao@example.com', telefone: '841234567' },
        '002': { numero: '002', nome: 'Maria Santos', email: 'maria@example.com', telefone: '842345678' },
        '003': { numero: '003', nome: 'Pedro Costa', email: 'pedro@example.com', telefone: '843456789' }
      };
      
      this.member = membrosExemplo[numero] || null;
      this.memberLoading = false;
      
      if (!this.member) {
        this.snackBar.open('Membro não encontrado', 'Fechar', { duration: 3000 });
      }
    }, 1000);
  }

  selecionarTipoPagamento(tipo: 'mensal' | 'anual'): void {
    this.tipoPagamento = tipo;
    if (tipo === 'anual') {
      // Selecionar todos os meses
      this.meses.forEach(m => m.selected = true);
      this.atualizarMesesSelecionados();
    } else {
      // Limpar seleção
      this.meses.forEach(m => m.selected = false);
      this.mesesSelecionados = [];
    }
  }

  toggleMes(mesValue: number): void {
    if (this.tipoPagamento === 'anual') {
      this.snackBar.open('Para pagamento anual, todos os meses são selecionados automaticamente', 'Fechar', { duration: 3000 });
      return;
    }
    
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
    if (this.tipoPagamento === 'anual') {
      return 12;
    }
    return this.mesesSelecionados.length;
  }

  get valorTotal(): number {
    if (this.tipoPagamento === 'anual') {
      return this.valorCota * 12;
    }
    return this.valorCota * this.quantidadeMeses;
  }

  get mesesSelecionadosLabels(): string {
    if (this.tipoPagamento === 'anual') {
      return 'Ano completo (12 meses)';
    }
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
    
    // Limpar telefone ao mudar método
    this.paymentForm.patchValue({ telefone: '' });
    
    // Visa não precisa de telefone
    if (metodo === 'visa') {
      this.paymentForm.get('telefone')?.clearValidators();
      this.paymentForm.get('telefone')?.updateValueAndValidity();
    } else {
      // Validação específica por método
      const telefoneControl = this.paymentForm.get('telefone');
      if (metodo === 'mpesa') {
        telefoneControl?.setValidators([
          Validators.required, 
          Validators.pattern(/^[0-9]{9}$/),
          this.validateMpesaNumber.bind(this)
        ]);
      } else if (metodo === 'emola') {
        telefoneControl?.setValidators([
          Validators.required, 
          Validators.pattern(/^[0-9]{9}$/),
          this.validateEmolaNumber.bind(this)
        ]);
      }
      telefoneControl?.updateValueAndValidity();
    }
  }

  onTelefoneInput(event: any): void {
    const input = event.target;
    const cursorPosition = input.selectionStart;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    const oldValue = this.paymentForm.get('telefone')?.value || '';
    
    // Limitar a 9 dígitos
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    // Validar prefixo baseado no método
    if (this.metodoPagamento === 'mpesa') {
      // Se já tem 1 dígito, verificar se é 8
      if (value.length === 1 && value !== '8') {
        value = oldValue; // Manter valor anterior
      }
      // Se já tem 2 dígitos, verificar se é 84 ou 85
      else if (value.length === 2) {
        if (value !== '84' && value !== '85') {
          // Se não é 84 ou 85, manter apenas o 8
          value = '8';
        }
      }
      // Se já tem 3 ou mais dígitos, verificar se começa com 84 ou 85
      else if (value.length >= 3) {
        if (!value.startsWith('84') && !value.startsWith('85')) {
          // Se não começa com 84 ou 85, manter apenas os dígitos válidos
          value = oldValue;
        }
      }
    } else if (this.metodoPagamento === 'emola') {
      // Se já tem 1 dígito, verificar se é 8
      if (value.length === 1 && value !== '8') {
        value = oldValue; // Manter valor anterior
      }
      // Se já tem 2 dígitos, verificar se é 87 ou 86
      else if (value.length === 2) {
        if (value !== '87' && value !== '86') {
          // Se não é 87 ou 86, manter apenas o 8
          value = '8';
        }
      }
      // Se já tem 3 ou mais dígitos, verificar se começa com 87 ou 86
      else if (value.length >= 3) {
        if (!value.startsWith('87') && !value.startsWith('86')) {
          // Se não começa com 87 ou 86, manter apenas os dígitos válidos
          value = oldValue;
        }
      }
    }
    
    // Atualizar o valor do campo
    this.paymentForm.patchValue({ telefone: value }, { emitEvent: false });
    input.value = value;
    
    // Restaurar posição do cursor
    setTimeout(() => {
      input.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
    
    this.paymentForm.get('telefone')?.updateValueAndValidity();
  }

  validateMpesaNumber(control: any): { [key: string]: any } | null {
    if (!control.value) return null;
    const value = control.value.toString();
    if (value.length === 9 && (value.startsWith('84') || value.startsWith('85'))) {
      return null; // Válido
    }
    return { invalidMpesa: true };
  }

  validateEmolaNumber(control: any): { [key: string]: any } | null {
    if (!control.value) return null;
    const value = control.value.toString();
    if (value.length === 9 && (value.startsWith('87') || value.startsWith('86'))) {
      return null; // Válido
    }
    return { invalidEmola: true };
  }

  get telefoneValue(): string {
    return this.paymentForm.get('telefone')?.value || '';
  }


  get showMpesaInfo(): boolean {
    if (this.metodoPagamento !== 'mpesa') return false;
    const value = this.telefoneValue;
    // Mostrar informação quando o usuário começar a digitar (84 ou 85)
    return value.length > 0 && (value.startsWith('84') || value.startsWith('85')) && value.length < 9;
  }

  get showEmolaInfo(): boolean {
    if (this.metodoPagamento !== 'emola') return false;
    const value = this.telefoneValue;
    // Mostrar informação quando o usuário começar a digitar (87 ou 86)
    return value.length > 0 && (value.startsWith('87') || value.startsWith('86')) && value.length < 9;
  }

  processarPagamento(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (this.mesesSelecionados.length === 0) {
      this.snackBar.open('Por favor, selecione pelo menos um mês para pagar.', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.metodoPagamento) {
      this.snackBar.open('Por favor, selecione um método de pagamento.', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.member) {
      this.snackBar.open('Por favor, busque um membro primeiro', 'Fechar', { duration: 3000 });
      return;
    }

    // Preparar dados para o dialog
    const confirmationData: MemberConfirmationData = {
      member: this.member,
      telefone: this.paymentForm.value.telefone || '',
      tipoPagamento: this.tipoPagamento,
      meses: this.tipoPagamento === 'anual' 
        ? ['Ano completo'] 
        : this.mesesSelecionados.map(m => this.meses.find(ms => ms.value === m)?.label || ''),
      metodo: this.metodoPagamento as 'mpesa' | 'emola' | 'visa',
      valorTotal: this.valorTotal
    };

    // Abrir dialog de confirmação
    const dialogRef = this.dialog.open(MemberConfirmationDialogComponent, {
      width: '600px',
      data: confirmationData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'pay') {
        this.abrirDialogPin();
      } else if (result === 'edit') {
        // Permitir edição (já está no formulário)
        this.snackBar.open('Pode editar os dados no formulário', 'Fechar', { duration: 3000 });
      }
    });
  }

  abrirDialogPin(): void {
    const dialogRef = this.dialog.open(PinConfirmationDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.finalizarPagamento();
      } else if (result?.cancelled) {
        this.snackBar.open('Pagamento cancelado', 'Fechar', { duration: 3000 });
      }
    });
  }

  finalizarPagamento(): void {
    if (!this.member) return;
    
    // Criar recibo
    const receipt: PaymentReceiptData = {
      id: 'REC-' + Date.now(),
      numeroMembro: this.member.numero,
      nomeMembro: this.member.nome,
      emailMembro: this.member.email,
      dataPagamento: new Date(),
      meses: this.tipoPagamento === 'anual' 
        ? ['Ano completo'] 
        : this.mesesSelecionados.map(m => this.meses.find(ms => ms.value === m)?.label || ''),
      valorTotal: this.valorTotal,
      metodoPagamento: this.metodoPagamento === 'mpesa' ? 'M-Pesa' : this.metodoPagamento === 'emola' ? 'Emola' : 'Visa',
      numeroTelefone: this.paymentForm.value.telefone || '',
      status: 'pago'
    };

    // Salvar recibo no localStorage
    this.salvarRecibo(receipt);

    // Fechar todos os dialogs abertos
    this.dialog.closeAll();

    // Redirecionar para página de confirmação
    this.router.navigate(['/membros/pagamento-confirmado'], {
      queryParams: { receiptId: receipt.id }
    });
    
    // Resetar formulário após pagamento
    this.resetarFormulario();
  }

  salvarRecibo(receipt: PaymentReceiptData): void {
    try {
      const stored = localStorage.getItem('payment_receipts');
      const receipts = stored ? JSON.parse(stored) : [];
      receipts.unshift(receipt);
      localStorage.setItem('payment_receipts', JSON.stringify(receipts));
    } catch (e) {
      console.error('Erro ao salvar recibo:', e);
    }
  }

  resetarFormulario(): void {
    this.meses.forEach(m => m.selected = false);
    this.mesesSelecionados = [];
    this.metodoPagamento = '';
    this.tipoPagamento = 'mensal';
    this.paymentForm.reset();
  }

  get textoBotaoPagamento(): string {
    if (this.valorTotal > 0) {
      return `Pagar ${this.valorTotal.toLocaleString('pt-MZ')} MT`;
    }
    return 'Pagar';
  }

  abrirDialogBeneficios(): void {
    this.dialog.open(BeneficiosDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      panelClass: 'beneficios-dialog'
    });
  }
}

