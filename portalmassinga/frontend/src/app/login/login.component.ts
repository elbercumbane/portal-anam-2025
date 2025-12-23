import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { CotasPendentesDialogComponent, CotasPendentesData } from '../components/modals/cotas-pendentes-dialog/cotas-pendentes-dialog.component';
import { ChooseDestinationDialogComponent, ChooseDestinationData } from '../components/modals/choose-destination-dialog/choose-destination-dialog.component';

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Se já estiver autenticado, verificar cotas em falta
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.cotasEmFalta) {
        // Mostrar modal de cotas pendentes
        this.abrirModalCotasPendentes(user.cotasEmFalta, user.nome);
      } else {
        // Sem cotas em falta, redirecionar
        this.redirectAfterLogin();
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  login(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { email, senha } = this.form.value;
    
    this.authService.login(email, senha).subscribe({
      next: (response) => {
        console.log('✅ Resposta do login:', response);
        if (response.success && response.user) {
          // Verificar se há cotas em falta
          if (response.user.cotasEmFalta) {
            this.isLoading = false;
            // Mostrar modal de cotas pendentes
            this.abrirModalCotasPendentes(response.user.cotasEmFalta, response.user.nome);
          } else {
            // Sem cotas em falta, redirecionar normalmente
            console.log('✅ Login bem-sucedido, redirecionando...');
            this.redirectAfterLogin();
          }
        } else {
          console.error('❌ Login falhou:', response);
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

  private redirectAfterLogin(): void {
    const user = this.authService.getCurrentUser();
    
    // Se for admin, perguntar para onde quer ir
    if (user && user.role === 'admin') {
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
