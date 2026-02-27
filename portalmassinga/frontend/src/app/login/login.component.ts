import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { CotasPendentesDialogComponent, CotasPendentesData } from '../components/modals/cotas-pendentes-dialog/cotas-pendentes-dialog.component';
import { ChooseDestinationDialogComponent, ChooseDestinationData } from '../components/modals/choose-destination-dialog/choose-destination-dialog.component';
import { ChangePasswordDialogComponent } from '../components/modals/change-password-dialog/change-password-dialog.component';
import { AdminCotasAvisoDialogComponent, AdminCotasAvisoData } from '../components/modals/admin-cotas-aviso-dialog/admin-cotas-aviso-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatDialogModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';
  
  // Estados de foco dos campos
  emailFocused = false;
  passwordFocused = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      emailOrNuit: ['', [Validators.required, this.emailOrNuitValidator]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Se já estiver autenticado, verificar primeiro login e cotas
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      const role = (user?.role || '').toLowerCase();
      const isAdmin = role === 'admin' || role === 'super-admin' || role === 'administrador';

      if (user?.mustChangePassword) {
        this.abrirModalAlterarSenha(() => this.redirectAfterLogin());
      } else if (user?.cotasEmFalta && isAdmin) {
        this.abrirModalAdminCotasAviso(user.nome, user.cotasEmFalta);
      } else if (user?.cotasEmFalta) {
        this.abrirModalCotasPendentes(user.cotasEmFalta, user.nome);
      } else {
        this.redirectAfterLogin();
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private mostrarLoginSucessoEDepois(callback: () => void): void {
    this.snackBar.open('Login efetuado com sucesso!', undefined, {
      duration: 2500,
      panelClass: ['snackbar-success']
    });
    setTimeout(callback, 600);
  }

  private emailOrNuitValidator(control: { value?: string }): { [key: string]: boolean } | null {
    const v = (control?.value || '').trim();
    if (!v) return null;
    if (/^\d+$/.test(v)) return null; // NUIT: apenas dígitos
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRe.test(v) ? null : { invalidEmailOrNuit: true };
  }

  login(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.get('emailOrNuit')?.hasError('invalidEmailOrNuit')) {
        this.errorMessage = 'Introduza um email válido ou o seu NUIT (apenas números)';
      }
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { emailOrNuit, senha } = this.form.value;
    
    this.authService.login(emailOrNuit, senha).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.mostrarLoginSucessoEDepois(() => {
            const role = (response.user!.role || '').toLowerCase();
            const isAdmin = role === 'admin' || role === 'super-admin' || role === 'administrador';
            const onContinue = () => {
              if (isAdmin) {
                if (response.user?.cotasEmFalta) {
                  this.isLoading = false;
                  this.abrirModalAdminCotasAviso(response.user.nome, response.user.cotasEmFalta);
                  return;
                }
                this.redirectAfterLogin();
              } else if (response.user?.cotasEmFalta) {
                this.isLoading = false;
                this.abrirModalCotasPendentes(response.user.cotasEmFalta, response.user.nome);
              } else {
                this.redirectAfterLogin();
              }
            };
            if (response.user?.mustChangePassword) {
              this.isLoading = false;
              this.abrirModalAlterarSenha(onContinue);
            } else {
              onContinue();
            }
          });
        } else if (response.user?.cotasEmFalta) {
          this.isLoading = false;
          this.abrirModalCotasPendentes(response.user.cotasEmFalta, response.user.nome);
        } else {
          this.errorMessage = response.message || 'Erro ao fazer login';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('❌ Erro no subscribe do login:', error);
        this.errorMessage = error.message || 'Erro ao conectar. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private abrirModalAlterarSenha(onSuccess: () => void): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      panelClass: 'change-password-dialog-panel'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        onSuccess();
      } else {
        this.authService.logout();
      }
    });
  }

  private abrirModalCotasPendentes(cotasEmFalta: { meses: number; dataVencimento: string; valorTotal: number }, nomeMembro: string): void {
    const data: CotasPendentesData = {
      meses: cotasEmFalta.meses,
      dataVencimento: cotasEmFalta.dataVencimento,
      valorTotal: cotasEmFalta.valorTotal,
      nomeMembro: nomeMembro
    };

    const dialogRef = this.dialog.open(CotasPendentesDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: data,
      disableClose: true,
      panelClass: 'cotas-pendentes-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'pagar') {
        // Usuário escolheu pagar, redirecionar para página de pagamento
        this.router.navigate(['/membros/pagar-cotas']);
      } else {
        // Usuário fechou o modal, fazer logout para mantê-lo no login
        this.authService.logout();
      }
    });
  }

  private abrirModalAdminCotasAviso(nome: string, cotasEmFalta?: { meses: number; dataVencimento: string; valorTotal: number }): void {
    const data: AdminCotasAvisoData = {
      userName: nome || 'Administrador',
      cotasEmFalta
    };

    const dialogRef = this.dialog.open(AdminCotasAvisoDialogComponent, {
      width: '520px',
      maxWidth: '90vw',
      data,
      disableClose: false,
      panelClass: 'admin-cotas-aviso-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'pagar') {
        this.router.navigate(['/membros/pagar-cotas']);
      } else {
        // 'continuar' ou fechar: prosseguir para o painel
        this.redirectAfterLogin();
      }
    });
  }

  private redirectAfterLogin(): void {
    const user = this.authService.getCurrentUser();
    const role = (user?.role || '').toLowerCase();
    const isAdmin = role === 'admin' || role === 'super-admin' || role === 'administrador';
    // Se for admin, perguntar para onde quer ir
    if (user && isAdmin) {
      this.showDestinationDialog(user.nome || 'Administrador');
    } else {
      // Se não for admin, redirecionar normalmente para área de membros
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/membros';
      this.router.navigate([returnUrl]);
    }
  }

  private showDestinationDialog(userName: string): void {
    const data: ChooseDestinationData = {
      userName: userName
    };

    const dialogRef = this.dialog.open(ChooseDestinationDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: data,
      disableClose: true,
      panelClass: 'choose-destination-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'dashboard') {
        this.router.navigate(['/dashboard']);
      } else if (result === 'members') {
        this.router.navigate(['/membros']);
      } else {
        // Se fechar sem escolher, redirecionar para dashboard por padrão
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
