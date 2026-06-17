import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { gsap } from 'gsap';
import { forkJoin } from 'rxjs';
import { MemberConfirmationDialogComponent, MemberConfirmationData } from '../../../components/modals/member-confirmation-dialog/member-confirmation-dialog.component';
import { PinConfirmationDialogComponent } from '../../../components/modals/pin-confirmation-dialog/pin-confirmation-dialog.component';
import { PaymentReceiptData } from '../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';
import { BeneficiosDialogComponent } from '../../../components/modals/beneficios-dialog/beneficios-dialog.component';
import { NotMemberDialogComponent } from '../../../components/modals/not-member-dialog/not-member-dialog.component';
import {
  VALOR_COTA,
  validateMpesaNumber,
  validateEmolaNumber,
  QuotaStatus,
  QuotaMonthItem,
  buildQuotaMonthItems,
  groupSelectedByYear,
  formatYearMonthLabel,
  toggleSequentialMonth,
  selectAllUnpaidPrefix,
  clearUnpaidSelection
} from './pay-quotas.helpers';
import { DEMO_NUITS, DEMO_NUIT_NAO_MEMBRO, buildDemoQuotaStatus, isNonMemberDemoNuit } from '../quota-demo.data';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ApiClientService } from '../../../services/api-client.service';
import { AuthService } from '../../../services/auth.service';

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
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DecimalPipe,
    NavbarComponent
  ],
  templateUrl: './pay-quotas.component.html',
  styleUrls: ['./pay-quotas.component.scss']
})
export class PayQuotasComponent implements OnInit, AfterViewInit, OnDestroy {
  memberForm!: FormGroup;
  paymentForm!: FormGroup;

  quotaStatus: QuotaStatus | null = null;
  quotaMonths: QuotaMonthItem[] = [];
  memberLoading = false;
  paymentSubmitting = false;
  lookupError: string | null = null;
  autoLoaded = false;

  valorCota = VALOR_COTA;
  metodoPagamento: 'mpesa' | 'emola' | 'visa' | '' = '';
  particles = Array.from({ length: 15 }, (_, i) => i + 1);
  demoNuits = DEMO_NUITS;
  demoNaoMembro = DEMO_NUIT_NAO_MEMBRO;
  private animations: gsap.core.Tween[] = [];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router,
    private apiClient: ApiClientService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    document.body.classList.add('navbar-solid');

    this.memberForm = this.fb.group({
      nuit: ['', [Validators.required, Validators.pattern(/^[0-9]{9,21}$/)]]
    });

    this.paymentForm = this.fb.group({
      metodoPagamento: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });

    const user = this.authService.getCurrentUser();
    if (user?.memberId) {
      this.autoLoaded = true;
      this.loadQuotaStatusByMemberId(user.memberId);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeAnimations(), 100);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('navbar-solid');
    this.animations.forEach(anim => anim.kill());
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentStep(): number {
    if (!this.quotaStatus) return 1;
    if (this.quantidadeMesesSelecionados === 0) return 2;
    return 3;
  }

  get quantidadeMesesSelecionados(): number {
    return this.quotaMonths.filter(m => m.selected && !m.paid).length;
  }

  get valorTotal(): number {
    return this.valorCota * this.quantidadeMesesSelecionados;
  }

  get mesesSelecionadosLabels(): string {
    const selected = this.quotaMonths.filter(m => m.selected && !m.paid);
    if (selected.length === 0) return '';
    if (selected.length <= 3) {
      return selected.map(m => m.label).join(', ');
    }
    return `${selected.length} meses (${selected[0].label} — ${selected[selected.length - 1].label})`;
  }

  get unpaidMonths(): QuotaMonthItem[] {
    return this.quotaMonths.filter(m => !m.paid);
  }

  get paidMonths(): QuotaMonthItem[] {
    return this.quotaMonths.filter(m => m.paid);
  }

  get loginReturnUrl(): string {
    return '/membros/pagar-cotas';
  }

  private initializeAnimations(): void {
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

    document.querySelectorAll('.particle').forEach((particle, index) => {
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

    document.querySelectorAll('.element').forEach((element, index) => {
      const anim = gsap.to(element, {
        rotation: 360,
        scale: 1.2,
        duration: 20 + index * 5,
        repeat: -1,
        ease: 'none'
      });
      this.animations.push(anim);
    });

    document.querySelectorAll('.query-card').forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        delay: index * 0.08,
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
    this.loadQuotaStatusByNuit(nuit);
  }

  usarNuitDemo(nuit: string): void {
    this.memberForm.patchValue({ nuit });
    this.loadQuotaStatusByNuit(nuit);
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.memberForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  loadQuotaStatusByNuit(nuit: string): void {
    const trimmed = (nuit || '').trim();
    if (isNonMemberDemoNuit(trimmed)) {
      this.memberLoading = false;
      this.quotaStatus = null;
      this.abrirDialogNaoMembro();
      return;
    }

    this.memberLoading = true;
    this.lookupError = null;
    this.quotaStatus = null;
    this.quotaMonths = [];

    this.apiClient.getQuotaStatusByNuit(trimmed).subscribe({
      next: (status: QuotaStatus) => this.applyQuotaStatus(status),
      error: (err) => {
        const demoStatus = buildDemoQuotaStatus(trimmed);
        if (demoStatus && (err?.status === 404 || err?.status === 0)) {
          this.applyQuotaStatus(demoStatus);
          return;
        }
        this.memberLoading = false;
        this.quotaStatus = null;
        if (err?.status === 404) {
          this.abrirDialogNaoMembro();
        } else if (demoStatus) {
          this.applyQuotaStatus(demoStatus);
        } else {
          this.lookupError = err?.error?.message || 'Não foi possível consultar a situação de cotas.';
        }
      }
    });
  }

  private abrirDialogNaoMembro(): void {
    this.dialog.open(NotMemberDialogComponent, {
      width: '460px',
      maxWidth: '95vw',
      panelClass: 'not-member-dialog-panel'
    });
  }

  loadQuotaStatusByMemberId(memberId: string): void {
    this.memberLoading = true;
    this.lookupError = null;

    this.apiClient.getQuotaStatusByMemberId(memberId).subscribe({
      next: (status: QuotaStatus) => {
        this.applyQuotaStatus(status);
        if (status.nuit) {
          this.memberForm.patchValue({ nuit: status.nuit });
        }
      },
      error: (err) => {
        this.memberLoading = false;
        this.autoLoaded = false;
        this.lookupError = err?.error?.message || 'Não foi possível carregar a sua situação de cotas.';
      }
    });
  }

  private applyQuotaStatus(status: QuotaStatus): void {
    this.memberLoading = false;
    this.quotaStatus = {
      ...status,
      memberApplicationId: String(status.memberApplicationId),
      valorEmDivida: Number(status.valorEmDivida ?? 0)
    };
    this.quotaMonths = buildQuotaMonthItems(this.quotaStatus);
    if (this.unpaidMonths.length > 0) {
      this.unpaidMonths[0].selected = true;
    }
    this.lookupError = null;
  }

  toggleMonth(item: QuotaMonthItem): void {
    if (item.paid) return;
    toggleSequentialMonth(this.unpaidMonths, item);
  }

  selecionarTodosEmFalta(): void {
    selectAllUnpaidPrefix(this.unpaidMonths);
  }

  limparSelecao(): void {
    clearUnpaidSelection(this.unpaidMonths);
  }

  isMonthBlocked(item: QuotaMonthItem): boolean {
    if (item.paid || item.selected) return false;
    const unpaid = this.unpaidMonths;
    const idx = unpaid.findIndex(m => m.key === item.key);
    if (idx <= 0) return false;
    const lastSelectedIdx = unpaid.reduce((max, m, i) => (m.selected ? i : max), -1);
    return idx > lastSelectedIdx + 1;
  }

  novaConsulta(): void {
    this.quotaStatus = null;
    this.quotaMonths = [];
    this.lookupError = null;
    this.autoLoaded = false;
    this.resetarPagamento();
    if (!this.isLoggedIn) {
      this.memberForm.reset();
    }
  }

  selecionarMetodoPagamento(metodo: 'mpesa' | 'emola' | 'visa'): void {
    this.metodoPagamento = metodo;
    this.paymentForm.patchValue({ metodoPagamento: metodo });
    this.paymentForm.patchValue({ telefone: '' });

    const telefoneControl = this.paymentForm.get('telefone');
    if (metodo === 'visa') {
      telefoneControl?.clearValidators();
    } else if (metodo === 'mpesa') {
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

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart ?? 0;
    let value = input.value.replace(/\D/g, '');
    const oldValue = this.paymentForm.get('telefone')?.value || '';

    if (value.length > 9) value = value.substring(0, 9);

    if (this.metodoPagamento === 'mpesa') {
      if (value.length === 1 && value !== '8') value = oldValue;
      else if (value.length === 2 && value !== '84' && value !== '85') value = '8';
      else if (value.length >= 3 && !value.startsWith('84') && !value.startsWith('85')) value = oldValue;
    } else if (this.metodoPagamento === 'emola') {
      if (value.length === 1 && value !== '8') value = oldValue;
      else if (value.length === 2 && value !== '87' && value !== '86') value = '8';
      else if (value.length >= 3 && !value.startsWith('87') && !value.startsWith('86')) value = oldValue;
    }

    this.paymentForm.patchValue({ telefone: value }, { emitEvent: false });
    input.value = value;
    setTimeout(() => input.setSelectionRange(cursorPosition, cursorPosition), 0);
    this.paymentForm.get('telefone')?.updateValueAndValidity();
  }

  get telefoneValue(): string {
    return this.paymentForm.get('telefone')?.value || '';
  }

  get showMpesaInfo(): boolean {
    if (this.metodoPagamento !== 'mpesa') return false;
    const value = this.telefoneValue;
    return value.length > 0 && (value.startsWith('84') || value.startsWith('85')) && value.length < 9;
  }

  get showEmolaInfo(): boolean {
    if (this.metodoPagamento !== 'emola') return false;
    const value = this.telefoneValue;
    return value.length > 0 && (value.startsWith('87') || value.startsWith('86')) && value.length < 9;
  }

  processarPagamento(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    if (this.quantidadeMesesSelecionados === 0) {
      this.snackBar.open('Selecione pelo menos um mês em falta.', 'Fechar', { duration: 3000 });
      return;
    }
    if (!this.quotaStatus) return;

    const confirmationData: MemberConfirmationData = {
      member: {
        numero: this.quotaStatus.nuit,
        nome: this.quotaStatus.nome,
        email: this.quotaStatus.email,
        telefone: this.quotaStatus.celular
      },
      telefone: this.paymentForm.value.telefone || '',
      tipoPagamento: 'mensal',
      meses: this.quotaMonths.filter(m => m.selected && !m.paid).map(m => m.label),
      metodo: this.metodoPagamento as 'mpesa' | 'emola' | 'visa',
      valorTotal: this.valorTotal
    };

    const dialogRef = this.dialog.open(MemberConfirmationDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'quota-dialog-panel',
      data: confirmationData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'pay') this.abrirDialogPin();
    });
  }

  abrirDialogPin(): void {
    const dialogRef = this.dialog.open(PinConfirmationDialogComponent, {
      width: '480px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'quota-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) this.finalizarPagamento();
      else if (result?.cancelled) {
        this.snackBar.open('Pagamento cancelado', 'Fechar', { duration: 3000 });
      }
    });
  }

  private getPaymentMethodLabel(): string {
    if (this.metodoPagamento === 'mpesa') return 'M-Pesa';
    if (this.metodoPagamento === 'emola') return 'Emola';
    return 'Visa';
  }

  finalizarPagamento(): void {
    if (!this.quotaStatus || this.paymentSubmitting) return;

    const groups = groupSelectedByYear(this.quotaMonths);
    if (groups.size === 0) return;

    this.paymentSubmitting = true;
    const reference = `PAY-${Date.now()}`;
    const paymentDate = new Date().toISOString().split('T')[0];
    const paymentMethod = this.getPaymentMethodLabel();
    const memberId = this.quotaStatus.memberApplicationId;

    const calls = Array.from(groups.entries()).map(([year, months]) =>
      this.apiClient.createQuotaPayment({
        memberApplicationId: memberId,
        year,
        months,
        paymentMethod,
        reference,
        paymentDate
      })
    );

    forkJoin(calls).subscribe({
      next: () => {
        this.paymentSubmitting = false;
        const selectedLabels = this.quotaMonths
          .filter(m => m.selected && !m.paid)
          .map(m => m.label);

        const mesesPagosAgora = this.quantidadeMesesSelecionados;
        const dividaRestante = Math.max(0, (this.quotaStatus!.mesesEmDivida || 0) - mesesPagosAgora);

        const receipt: PaymentReceiptData = {
          id: reference,
          numeroMembro: this.quotaStatus!.nuit,
          nomeMembro: this.quotaStatus!.nome,
          emailMembro: this.quotaStatus!.email,
          celularMembro: this.quotaStatus!.celular,
          dataPagamento: new Date(),
          meses: selectedLabels,
          valorTotal: this.valorTotal,
          metodoPagamento: paymentMethod,
          numeroTelefone: this.paymentForm.value.telefone || '',
          status: 'pago',
          mesesEmDividaRestantes: dividaRestante,
          valorDividaRestante: dividaRestante * this.valorCota
        };

        this.salvarRecibo(receipt);
        this.dialog.closeAll();
        this.router.navigate(['/membros/pagamento-confirmado'], {
          queryParams: { receiptId: receipt.id }
        });
        this.resetarPagamento();
      },
      error: (err) => {
        this.paymentSubmitting = false;
        const msg = err?.error?.message || 'Erro ao registar pagamento. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      }
    });
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

  resetarPagamento(): void {
    this.metodoPagamento = '';
    this.paymentForm.reset();
  }

  get textoBotaoPagamento(): string {
    if (this.paymentSubmitting) return 'A processar...';
    if (this.valorTotal > 0) return `Pagar ${this.valorTotal.toLocaleString('pt-MZ')} MT`;
    return 'Pagar';
  }

  formatUltimoMes(key: string | null): string {
    if (!key) return '—';
    return formatYearMonthLabel(key);
  }

  abrirDialogBeneficios(): void {
    this.dialog.open(BeneficiosDialogComponent, {
      width: '420px',
      maxWidth: '90vw',
      panelClass: 'beneficios-dialog'
    });
  }
}
