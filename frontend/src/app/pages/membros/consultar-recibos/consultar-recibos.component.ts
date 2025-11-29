import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

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
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    DecimalPipe
  ],
  templateUrl: './consultar-recibos.component.html',
  styleUrls: ['./consultar-recibos.component.scss']
})
export class ConsultarRecibosComponent implements OnInit {
  consultReceiptForm!: FormGroup;
  
  receipts: PaymentReceipt[] = [];
  filteredReceipts: PaymentReceipt[] = [];
  consultLoading = false;
  tokenSent = false;
  tokenVerified = false;
  searchFilter = '';
  metodoConsulta: 'contacto' | 'email' = 'contacto';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.consultReceiptForm = this.fb.group({
      referencia: [''],
      contacto: [''],
      email: [''],
      token: ['']
    });
    
    this.updateValidators();
    
    // Carregar recibos do localStorage (simulação)
    this.loadReceiptsFromStorage();
  }
  
  toggleMetodoConsulta(metodo: 'contacto' | 'email'): void {
    this.metodoConsulta = metodo;
    this.updateValidators();
  }
  
  updateValidators(): void {
    const contactoControl = this.consultReceiptForm.get('contacto');
    const emailControl = this.consultReceiptForm.get('email');
    
    if (this.metodoConsulta === 'contacto') {
      contactoControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
      emailControl?.clearValidators();
      emailControl?.setValue('');
    } else {
      emailControl?.setValidators([Validators.required, Validators.email]);
      contactoControl?.clearValidators();
      contactoControl?.setValue('');
    }
    
    contactoControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  solicitarToken(): void {
    const referenciaControl = this.consultReceiptForm.get('referencia');
    const contactoControl = this.consultReceiptForm.get('contacto');
    const emailControl = this.consultReceiptForm.get('email');
    
    if (referenciaControl?.invalid) {
      referenciaControl.markAsTouched();
      return;
    }
    
    if (this.metodoConsulta === 'contacto' && contactoControl?.invalid) {
      contactoControl.markAsTouched();
      return;
    }
    
    if (this.metodoConsulta === 'email' && emailControl?.invalid) {
      emailControl.markAsTouched();
      return;
    }
    
    this.consultLoading = true;
    const contactoOuEmail = this.metodoConsulta === 'contacto' 
      ? this.consultReceiptForm.value.contacto 
      : this.consultReceiptForm.value.email;
    
    // Simular envio de token
    setTimeout(() => {
      this.consultLoading = false;
      this.tokenSent = true;
      // Adicionar validação de token quando for enviado
      if (!this.consultReceiptForm.get('token')) {
        this.consultReceiptForm.addControl('token', this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]));
      } else {
        this.consultReceiptForm.get('token')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
        this.consultReceiptForm.get('token')?.updateValueAndValidity();
      }
      const mensagem = this.metodoConsulta === 'email'
        ? `Código de login enviado para o email ${contactoOuEmail}`
        : `Código de login enviado para o telefone ${contactoOuEmail}`;
      this.snackBar.open(mensagem, 'Fechar', { duration: 3000 });
    }, 1500);
  }

  verificarToken(): void {
    // Garantir que o campo token existe e tem validação
    if (!this.consultReceiptForm.get('token')) {
      this.consultReceiptForm.addControl('token', this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]));
    } else {
      this.consultReceiptForm.get('token')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
      this.consultReceiptForm.get('token')?.updateValueAndValidity();
    }
    
    if (this.consultReceiptForm.get('token')?.invalid) {
      this.consultReceiptForm.get('token')?.markAsTouched();
      return;
    }
    
    this.consultLoading = true;
    const token = this.consultReceiptForm.value.token;
    const contactoOuEmail = this.metodoConsulta === 'contacto' 
      ? this.consultReceiptForm.value.contacto 
      : this.consultReceiptForm.value.email;
    const referencia = this.consultReceiptForm.value.referencia;
    
    // Simular verificação de token
    setTimeout(() => {
      this.consultLoading = false;
      
      // Simulação: qualquer token de 6 dígitos é válido
      if (token && token.length === 6) {
        this.tokenVerified = true;
        this.filtrarRecibosPorContato(contactoOuEmail, referencia);
        this.snackBar.open('Código verificado com sucesso', 'Fechar', { duration: 3000 });
      } else {
        this.snackBar.open('Código inválido', 'Fechar', { duration: 3000 });
      }
    }, 1500);
  }

  filtrarRecibosPorContato(contactoOuEmail: string, referencia?: string): void {
    if (this.metodoConsulta === 'email') {
      // Buscar por email
      this.filteredReceipts = this.receipts.filter(r => 
        r.emailMembro?.toLowerCase() === contactoOuEmail.toLowerCase() &&
        (!referencia || r.id === referencia || r.numeroMembro === referencia)
      );
    } else {
      // Buscar por telefone ou número de membro
      this.filteredReceipts = this.receipts.filter(r => 
        (r.numeroTelefone === contactoOuEmail || r.numeroMembro === contactoOuEmail) &&
        (!referencia || r.id === referencia || r.numeroMembro === referencia)
      );
    }
    
    // Se não encontrou resultados, tentar buscar sem referência
    if (this.filteredReceipts.length === 0 && referencia) {
      if (this.metodoConsulta === 'email') {
        this.filteredReceipts = this.receipts.filter(r => 
          r.emailMembro?.toLowerCase() === contactoOuEmail.toLowerCase()
        );
      } else {
        this.filteredReceipts = this.receipts.filter(r => 
          r.numeroTelefone === contactoOuEmail || r.numeroMembro === contactoOuEmail
        );
      }
    }
  }

  aplicarFiltro(): void {
    if (!this.searchFilter.trim()) {
      // Manter os recibos já filtrados por contacto/email
      return;
    }
    
    const filter = this.searchFilter.toLowerCase();
    const baseReceipts = this.filteredReceipts.length > 0 ? this.filteredReceipts : this.receipts;
    this.filteredReceipts = baseReceipts.filter(r =>
      r.nomeMembro.toLowerCase().includes(filter) ||
      r.numeroMembro.includes(filter) ||
      r.id.toLowerCase().includes(filter) ||
      r.meses.some(m => m.toLowerCase().includes(filter)) ||
      r.metodoPagamento.toLowerCase().includes(filter)
    );
  }

  limparFiltro(): void {
    this.searchFilter = '';
    this.aplicarFiltro();
  }

  // LocalStorage (simulação)
  loadReceiptsFromStorage(): void {
    try {
      const stored = localStorage.getItem('payment_receipts');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.receipts = parsed.map((r: any) => ({
          ...r,
          dataPagamento: new Date(r.dataPagamento)
        }));
        this.filteredReceipts = [...this.receipts];
      }
    } catch (e) {
      console.error('Erro ao carregar recibos:', e);
    }
  }

  abrirDialogBeneficios(): void {
    import('../../../components/modals/beneficios-dialog/beneficios-dialog.component').then(m => {
      this.dialog.open(m.BeneficiosDialogComponent, {
        width: '700px',
        maxWidth: '90vw',
        panelClass: 'beneficios-dialog'
      });
    });
  }
}

