import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { gsap } from 'gsap';
import { ApiClientService } from '../../../services/api-client.service';
import { NotMemberDialogComponent } from '../../../components/modals/not-member-dialog/not-member-dialog.component';

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

@Component({
  selector: 'app-consultar-recibos',
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DecimalPipe
  ],
  templateUrl: './view-receipts.component.html',
  styleUrls: ['./view-receipts.component.scss']
})
export class ViewReceiptsComponent implements OnInit, AfterViewInit, OnDestroy {
  consultReceiptForm!: FormGroup;
  step = 1;
  memberData: { nuit: string; nome: string; telefone: string } | null = null;
  receipts: PaymentReceipt[] = [];
  filteredReceipts: PaymentReceipt[] = [];
  consultLoading = false;
  particles = Array.from({ length: 15 }, (_, i) => i + 1);
  private animations: gsap.core.Tween[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private apiClient: ApiClientService
  ) {}

  get phoneSuffix(): string {
    if (!this.memberData?.telefone || this.memberData.telefone.length < 4) return '****';
    return this.memberData.telefone.slice(-4);
  }

  get telefoneMascarado(): string {
    const t = this.consultReceiptForm.get('telefone')?.value || '';
    if (t.length < 4) return '***';
    return t.slice(0, 2) + '***' + t.slice(-4);
  }

  ngOnInit(): void {
    this.consultReceiptForm = this.fb.group({
      nuit: ['', [Validators.required, Validators.pattern(/^[0-9]{9,21}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
    this.consultReceiptForm.get('telefone')?.clearValidators();
    this.consultReceiptForm.get('telefone')?.updateValueAndValidity();
    this.consultReceiptForm.get('otp')?.clearValidators();
    this.consultReceiptForm.get('otp')?.updateValueAndValidity();
    this.loadReceiptsFromStorage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeAnimations(), 100);
  }

  ngOnDestroy(): void {
    this.animations.forEach(anim => anim.kill());
  }

  private initializeAnimations(): void {
    const overlay = document.querySelector('.animated-overlay');
    if (overlay) {
      this.animations.push(gsap.to(overlay, {
        opacity: 0.6, scale: 1.1, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut'
      }));
    }
    document.querySelectorAll('.particle').forEach((p, i) => {
      this.animations.push(gsap.to(p, {
        y: -window.innerHeight - 100, x: `+=${(Math.random() - 0.5) * 200}`,
        rotation: 360, opacity: 0, duration: 15 + Math.random() * 10,
        delay: i * 0.3, repeat: -1, ease: 'none'
      }));
    });
    document.querySelectorAll('.element').forEach((el, i) => {
      this.animations.push(gsap.to(el, {
        rotation: 360, scale: 1.2, duration: 20 + i * 5, repeat: -1, ease: 'none'
      }));
    });
  }

  buscarPorNuit(): void {
    if (this.consultReceiptForm.get('nuit')?.invalid) {
      this.consultReceiptForm.get('nuit')?.markAsTouched();
      return;
    }
    const nuit = (this.consultReceiptForm.get('nuit')?.value || '').trim();
    this.consultLoading = true;

    this.apiClient.getApplicationByNuit(nuit).subscribe({
      next: (app: any) => {
        this.memberData = {
          nuit: app.nuit || nuit,
          nome: app.fullName || app.nome || '',
          telefone: (app.mobilePhone || app.celular || '').replace(/\D/g, '').slice(-9)
        };
        if (!this.memberData.telefone || this.memberData.telefone.length < 9) {
          this.snackBar.open('O membro não tem telefone registado. Contacte a associação.', 'Fechar', { duration: 4000 });
          this.consultLoading = false;
          return;
        }
        this.step = 2;
        this.consultReceiptForm.get('telefone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
        this.consultReceiptForm.get('telefone')?.updateValueAndValidity();
        this.consultReceiptForm.get('telefone')?.setValue('');
        this.consultLoading = false;
      },
      error: () => {
        this.consultLoading = false;
        this.dialog.open(NotMemberDialogComponent, {
          width: '440px',
          maxWidth: '95vw'
        });
      }
    });
  }

  onTelefoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').slice(0, 9);
    this.consultReceiptForm.get('telefone')?.setValue(v, { emitEvent: false });
    input.value = v;
    this.consultReceiptForm.get('telefone')?.updateValueAndValidity();
  }

  confirmarTelefone(): void {
    const telefone = (this.consultReceiptForm.get('telefone')?.value || '').replace(/\D/g, '');
    const memberPhone = (this.memberData?.telefone || '').replace(/\D/g, '').slice(-9);
    if (telefone !== memberPhone) {
      this.consultReceiptForm.get('telefone')?.setErrors({ nomatch: true });
      this.consultReceiptForm.get('telefone')?.markAsTouched();
      return;
    }
    this.step = 3;
    this.consultReceiptForm.get('otp')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
    this.consultReceiptForm.get('otp')?.updateValueAndValidity();
    this.consultReceiptForm.get('otp')?.setValue('');
    this.snackBar.open('Código enviado. Verifique o seu telemóvel.', 'Fechar', { duration: 3000 });
  }

  verificarOtp(): void {
    if (this.consultReceiptForm.get('otp')?.invalid) {
      this.consultReceiptForm.get('otp')?.markAsTouched();
      return;
    }
    this.consultLoading = true;
    setTimeout(() => {
      this.consultLoading = false;
      this.step = 4;
      this.filtrarRecibosPorMembro();
      this.snackBar.open('Código verificado com sucesso', 'Fechar', { duration: 2000 });
    }, 800);
  }

  voltar(): void {
    if (this.step === 2) {
      this.step = 1;
      this.memberData = null;
      this.consultReceiptForm.get('telefone')?.clearValidators();
      this.consultReceiptForm.get('telefone')?.setValue('');
    } else if (this.step === 3) {
      this.step = 2;
      this.consultReceiptForm.get('otp')?.clearValidators();
      this.consultReceiptForm.get('otp')?.setValue('');
    }
  }

  filtrarRecibosPorMembro(): void {
    const nuit = this.memberData?.nuit || '';
    const telefone = (this.consultReceiptForm.get('telefone')?.value || '').replace(/\D/g, '');
    this.filteredReceipts = this.receipts.filter(r =>
      r.numeroMembro === nuit || r.numeroTelefone === telefone
    );
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

  abrirDialogBeneficios(): void {
    import('../../../components/modals/beneficios-dialog/beneficios-dialog.component').then(m => {
      this.dialog.open(m.BeneficiosDialogComponent, {
        width: '700px',
        maxWidth: '90vw'
      });
    });
  }
}
