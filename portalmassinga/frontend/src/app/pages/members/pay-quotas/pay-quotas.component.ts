import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
import { gsap } from 'gsap';
import { MemberConfirmationDialogComponent, MemberConfirmationData } from '../../../components/modals/member-confirmation-dialog/member-confirmation-dialog.component';
import { PinConfirmationDialogComponent } from '../../../components/modals/pin-confirmation-dialog/pin-confirmation-dialog.component';
import { PaymentReceiptDialogComponent, PaymentReceiptData } from '../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';
import { BeneficiosDialogComponent } from '../../../components/modals/beneficios-dialog/beneficios-dialog.component';
import { NotMemberDialogComponent } from '../../../components/modals/not-member-dialog/not-member-dialog.component';
import { MESES, VALOR_COTA, validateMpesaNumber, validateEmolaNumber, calcularValorTotal, formatarMesesSelecionados, Mes } from './pay-quotas.helpers';
import { ApiClientService } from '../../../services/api-client.service';

@Component({
  selector: 'app-pay-quotas',
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
  templateUrl: './pay-quotas.component.html',
  styleUrls: ['./pay-quotas.component.scss']
})
export class PayQuotasComponent implements OnInit, AfterViewInit, OnDestroy {
  memberForm!: FormGroup;
  paymentForm!: FormGroup;
  
  // Dados do membro
  member: { numero: string; nome: string; email: string; telefone: string } | null = null;
  memberLoading = false;
  
  valorCota = VALOR_COTA;
  tipoPagamento: 'mensal' | 'anual' = 'mensal';
  mesesSelecionados: number[] = [];
  metodoPagamento: 'mpesa' | 'emola' | 'visa' | '' = '';
  particles = Array.from({ length: 15 }, (_, i) => i + 1);
  private animations: gsap.core.Tween[] = [];
  
  meses: Mes[] = MESES.map(m => ({ ...m }));

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router,
    private apiClient: ApiClientService
  ) {}

  ngOnInit(): void {
    this.memberForm = this.fb.group({
      nuit: ['', [Validators.required, Validators.pattern(/^[0-9]{9,21}$/)]]
    });
    
    this.paymentForm = this.fb.group({
      metodoPagamento: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  ngAfterViewInit(): void {
    // Pequeno delay para garantir que os elementos estejam renderizados
    setTimeout(() => {
      this.initializeAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    this.animations.forEach(anim => anim.kill());
  }

  private initializeAnimations(): void {
    // Animação do overlay de fundo
    const overlay = document.querySelector('.animated-overlay');
    if (overlay) {
      const anim = gsap.to(overlay, {
        opacity: 0.6,
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      this.animations.push(anim);
    }

    // Animações das partículas
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      const anim = gsap.to(particle, {
        y: -window.innerHeight - 100,
        x: `+=${(Math.random() - 0.5) * 200}`,
        rotation: 360,
        opacity: 0,
        duration: 15 + Math.random() * 10,
        delay: index * 0.3,
        repeat: -1,
        ease: 'none'
      });
      this.animations.push(anim);
    });

    // Animações dos elementos decorativos
    const elements = document.querySelectorAll('.element');
    elements.forEach((element, index) => {
      const anim = gsap.to(element, {
        rotation: 360,
        scale: 1.2,
        duration: 20 + index * 5,
        repeat: -1,
        ease: 'none'
      });
      this.animations.push(anim);
    });

    // Animação de entrada dos cards
    const cards = document.querySelectorAll('.section-card');
    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });
  }

  buscarMembro(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }
    
    const nuit = (this.memberForm.value.nuit || '').trim();
    this.memberLoading = true;
    
    this.apiClient.getApplicationByNuit(nuit).subscribe({
      next: (app: any) => {
        this.member = {
          numero: app.nuit || nuit,
          nome: app.fullName || app.nome || '',
          email: app.email || '',
          telefone: app.mobilePhone || app.celular || app.telefone || ''
        };
        this.memberLoading = false;
      },
      error: () => {
        this.memberLoading = false;
        this.member = null;
        this.dialog.open(NotMemberDialogComponent, {
          width: '440px',
          maxWidth: '95vw',
          panelClass: 'not-member-dialog-panel'
        });
      }
    });
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
    return calcularValorTotal(this.tipoPagamento, this.quantidadeMeses, this.valorCota);
  }

  get mesesSelecionadosLabels(): string {
    return formatarMesesSelecionados(this.meses, this.mesesSelecionados, this.tipoPagamento);
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
          validateMpesaNumber
        ]);
      } else if (metodo === 'emola') {
        telefoneControl?.setValidators([
          Validators.required, 
          Validators.pattern(/^[0-9]{9}$/),
          validateEmolaNumber
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

