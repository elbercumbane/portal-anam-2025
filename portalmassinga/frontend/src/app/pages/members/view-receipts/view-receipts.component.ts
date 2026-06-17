import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { gsap } from 'gsap';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ApiClientService } from '../../../services/api-client.service';
import { ReceiptPdfService } from '../../../services/receipt-pdf.service';
import { PaymentReceiptData } from '../../../components/modals/payment-receipt-dialog/payment-receipt-dialog.component';
import { NotMemberDialogComponent } from '../../../components/modals/not-member-dialog/not-member-dialog.component';
import {
  DEMO_NUITS,
  DEMO_NUIT_NAO_MEMBRO,
  DEMO_NUIT_RECIBOS,
  DEMO_RECIBOS_CELULAR,
  seedDemoReceiptsIfEmpty,
  isNonMemberDemoNuit,
  maskPhoneNumber,
  generateOtpFromPhone
} from '../quota-demo.data';

export interface PaymentReceipt {
  id: string;
  numeroMembro: string;
  nomeMembro: string;
  emailMembro?: string;
  dataPagamento: Date;
  meses: string[];
  valorTotal: number;
  metodoPagamento: string;
  numeroTelefone: string;
  status: 'pago' | 'pendente';
}

type ReceiptFlowStep = 'nuit' | 'otp' | 'results';

interface PendingMember {
  nuit: string;
  nome: string;
  telefone: string;
}

@Component({
  selector: 'app-consultar-recibos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DecimalPipe,
    NavbarComponent
  ],
  templateUrl: './view-receipts.component.html',
  styleUrls: ['./view-receipts.component.scss']
})
export class ViewReceiptsComponent implements OnInit, AfterViewInit, OnDestroy {
  consultForm!: FormGroup;
  otpForm!: FormGroup;
  flowStep: ReceiptFlowStep = 'nuit';
  memberData: { nuit: string; nome: string } | null = null;
  pendingMember: PendingMember | null = null;
  demoNaoMembro = DEMO_NUIT_NAO_MEMBRO;
  maskedPhone = '';
  otpEnviado = '';
  otpSending = false;
  otpCopied = false;
  otpError: string | null = null;
  receipts: PaymentReceipt[] = [];
  filteredReceipts: PaymentReceipt[] = [];
  consultLoading = false;
  lookupError: string | null = null;
  particles = Array.from({ length: 15 }, (_, i) => i + 1);
  private animations: gsap.core.Tween[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private apiClient: ApiClientService,
    private receiptPdfService: ReceiptPdfService
  ) {}

  get showResults(): boolean {
    return this.flowStep === 'results' && !!this.memberData && !this.consultLoading;
  }

  get showOtpStep(): boolean {
    return this.flowStep === 'otp' && !this.consultLoading;
  }

  get showNuitStep(): boolean {
    return this.flowStep === 'nuit' && !this.consultLoading;
  }

  get currentStepNum(): number {
    if (this.flowStep === 'nuit') return 1;
    if (this.flowStep === 'otp') return 2;
    return 3;
  }

  ngOnInit(): void {
    document.body.classList.add('navbar-solid');

    this.consultForm = this.fb.group({
      nuit: ['', [Validators.required, Validators.pattern(/^[0-9]{9,21}$/)]]
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]]
    });
    seedDemoReceiptsIfEmpty();
    this.loadReceiptsFromStorage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeAnimations(), 100);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('navbar-solid');
    this.animations.forEach(anim => anim.kill());
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.consultForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isOtpInvalid(): boolean {
    const ctrl = this.otpForm.get('otp');
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  usarNuitDemo(nuit: string): void {
    this.consultForm.patchValue({ nuit });
    this.buscarPorNuit();
  }

  buscarPorNuit(): void {
    if (this.consultForm.invalid) {
      this.consultForm.markAllAsTouched();
      return;
    }
    const nuit = (this.consultForm.get('nuit')?.value || '').trim();

    if (isNonMemberDemoNuit(nuit)) {
      this.dialog.open(NotMemberDialogComponent, { width: '460px', maxWidth: '95vw' });
      return;
    }

    this.consultLoading = true;
    this.lookupError = null;
    this.memberData = null;
    this.filteredReceipts = [];
    this.otpError = null;

    const demo = DEMO_NUITS.find(d => d.nuit === nuit);
    if (demo) {
      this.iniciarVerificacaoOtp({
        nuit: demo.nuit,
        nome: demo.nome,
        telefone: DEMO_RECIBOS_CELULAR
      });
      return;
    }

    this.apiClient.getApplicationByNuit(nuit).subscribe({
      next: (app: any) => {
        const telefone = app.phone || app.celular || app.mobile || '';
        if (!telefone) {
          this.consultLoading = false;
          this.lookupError = 'Membro encontrado, mas sem telefone registado. Contacte a ANAM.';
          return;
        }
        this.iniciarVerificacaoOtp({
          nuit: app.nuit || nuit,
          nome: app.fullName || app.nome || '',
          telefone
        });
      },
      error: () => {
        this.consultLoading = false;
        this.dialog.open(NotMemberDialogComponent, {
          width: '460px',
          maxWidth: '95vw'
        });
      }
    });
  }

  private iniciarVerificacaoOtp(member: PendingMember): void {
    this.pendingMember = member;
    this.maskedPhone = maskPhoneNumber(member.telefone);
    this.otpEnviado = generateOtpFromPhone(member.telefone);
    this.otpSending = true;
    this.otpForm.reset();

    setTimeout(() => {
      this.consultLoading = false;
      this.otpSending = false;
      this.flowStep = 'otp';
      this.otpCopied = false;
    }, 1200);
  }

  onOtpInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 5);
    this.otpForm.patchValue({ otp: digits });
    this.otpError = null;
  }

  async copiarOtp(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.otpEnviado);
      this.otpCopied = true;
      setTimeout(() => (this.otpCopied = false), 2500);
    } catch {
      this.otpError = 'Não foi possível copiar. Seleccione o código manualmente.';
    }
  }

  preencherOtp(): void {
    this.otpForm.patchValue({ otp: this.otpEnviado });
    this.otpError = null;
  }

  validarOtp(): void {
    const otp = (this.otpForm.get('otp')?.value || '').trim();
    if (otp.length !== 5) {
      this.otpError = 'O código deve ter exactamente 5 dígitos.';
      this.otpForm.markAllAsTouched();
      return;
    }
    if (otp !== this.otpEnviado) {
      this.otpError = 'Código incorrecto. Verifique os 5 dígitos e tente novamente.';
      return;
    }
    if (!this.pendingMember) return;

    this.memberData = { nuit: this.pendingMember.nuit, nome: this.pendingMember.nome };
    this.filteredReceipts = this.receipts.filter(r => r.numeroMembro === this.pendingMember!.nuit);
    this.flowStep = 'results';
    this.otpError = null;

    if (this.filteredReceipts.length === 0) {
      this.snackBar.open('Nenhum recibo encontrado para este NUIT.', 'Fechar', { duration: 3500 });
    }
  }

  reenviarOtp(): void {
    if (!this.pendingMember) return;
    this.otpSending = true;
    this.otpError = null;
    this.otpForm.reset();
    setTimeout(() => {
      this.otpSending = false;
      this.otpCopied = false;
      this.snackBar.open('Novo código enviado por SMS.', 'Fechar', { duration: 3000 });
    }, 800);
  }

  voltarParaNuit(): void {
    this.flowStep = 'nuit';
    this.pendingMember = null;
    this.otpError = null;
    this.otpForm.reset();
  }

  novaConsulta(): void {
    this.flowStep = 'nuit';
    this.memberData = null;
    this.pendingMember = null;
    this.filteredReceipts = [];
    this.lookupError = null;
    this.otpError = null;
    this.maskedPhone = '';
    this.otpEnviado = '';
    this.consultForm.reset();
    this.otpForm.reset();
  }

  baixarRecibo(receipt: PaymentReceipt): void {
    const data: PaymentReceiptData = {
      ...receipt,
      dataPagamento: receipt.dataPagamento
    };
    this.receiptPdfService.generateReceiptPdf(data);
  }

  loadReceiptsFromStorage(): void {
    try {
      const stored = localStorage.getItem('payment_receipts');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.receipts = parsed.map((r: any) => ({
          ...r,
          dataPagamento: new Date(r.dataPagamento)
        }));
      }
    } catch (e) {
      console.error('Erro ao carregar recibos:', e);
    }
  }

  private initializeAnimations(): void {
    const overlay = document.querySelector('.animated-overlay');
    if (overlay) {
      this.animations.push(gsap.to(overlay, {
        opacity: 0.6, scale: 1.1, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut'
      }));
    }
    document.querySelectorAll('.query-card').forEach((card, i) => {
      gsap.from(card, { opacity: 0, y: 20, duration: 0.6, delay: i * 0.08, ease: 'power3.out' });
    });
  }

  abrirDialogBeneficios(): void {
    import('../../../components/modals/beneficios-dialog/beneficios-dialog.component').then(m => {
      this.dialog.open(m.BeneficiosDialogComponent, { width: '420px', maxWidth: '90vw' });
    });
  }
}
