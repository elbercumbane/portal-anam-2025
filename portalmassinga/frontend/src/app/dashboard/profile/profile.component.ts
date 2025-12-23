import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

interface Member {
  id: string;
  nome: string;
  nomePai?: string;
  nomeMae?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  profissao?: string;
  celular?: string;
  email?: string;
  telefone?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  nomeConjuge?: string;
  dataNascimentoConjuge?: string;
  filiacaoPaiConjuge?: string;
  filiacaoMaeConjuge?: string;
  dependentes?: Array<{
    nome: string;
    parentesco: string;
    profissao?: string;
    idade?: number;
  }>;
  localTrabalho?: string;
  cargo?: string;
  enderecoTrabalho?: string;
  telefoneTrabalho?: string;
  foto?: string;
  dataCadastro?: string;
  status: string;
  aceitaTermos?: boolean;
  outrasInformacoes?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Output() navigationClick = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();
  
  memberData: Member | null = null;
  passwordForm: FormGroup;
  isLoading = false;
  isSavingPassword = false;
  
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  ngOnInit(): void {
    this.loadMemberData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) {
      return null;
    }
    
    if (newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  loadMemberData(): void {
    this.isLoading = true;
    
    // Primeiro tentar usar o método do AuthService
    const memberData = this.authService.getCurrentMemberData();
    if (memberData) {
      this.memberData = memberData;
      this.isLoading = false;
      return;
    }
    
    // Se não encontrou, tentar buscar diretamente pelo email
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.email) {
      this.snackBar.open('Usuário não autenticado. Por favor, faça login novamente.', 'Fechar', { duration: 5000 });
      this.isLoading = false;
      return;
    }
    
    const userEmail = currentUser.email.toLowerCase().trim();
    
    // Buscar dados do membro no localStorage
    const stored = localStorage.getItem('anam_applications');
    if (!stored) {
      this.snackBar.open('Dados de cadastro não encontrados.', 'Fechar', { duration: 5000 });
      this.isLoading = false;
      return;
    }
    
    try {
      const members: Member[] = JSON.parse(stored);
      const member = members.find(m => 
        m.email && m.email.toLowerCase().trim() === userEmail
      );
      
      if (member) {
        this.memberData = member;
        // Salvar no localStorage para próximas vezes
        localStorage.setItem('currentMemberData', JSON.stringify(member));
      } else {
        this.snackBar.open('Dados de cadastro não encontrados para este email.', 'Fechar', { duration: 5000 });
      }
    } catch (error) {
      console.error('Error loading member data:', error);
      this.snackBar.open('Erro ao carregar dados do membro', 'Fechar', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }
  
  getEstadoCivilLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'solteiro': 'Solteiro(a)',
      'casado': 'Casado(a)',
      'uniao_marital': 'União Marital',
      'viuvo': 'Viúvo(a)',
      'divorciado': 'Divorciado(a)'
    };
    return labels[value] || value;
  }
  
  getParentescoLabel(value: string | undefined): string {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'filho': 'Filho(a)',
      'enteado': 'Enteado(a)',
      'outro': 'Outro'
    };
    return labels[value] || value;
  }
  
  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos corretamente', 'Fechar', { duration: 3000 });
      return;
    }
    
    this.isSavingPassword = true;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    
    // Simular atualização de senha
    Promise.resolve({ success: true })
      .then(() => {
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
        this.passwordForm.reset();
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        this.snackBar.open('Erro ao alterar senha', 'Fechar', { duration: 3000 });
      })
      .finally(() => {
        this.isSavingPassword = false;
      });
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.passwordForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (this.passwordForm.hasError('passwordMismatch') && controlName === 'confirmPassword') {
      return 'As senhas não coincidem';
    }
    return '';
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Aprovado':
        return 'status-approved';
      case 'Pendente':
        return 'status-pending';
      case 'Rejeitado':
        return 'status-rejected';
      default:
        return '';
    }
  }
}
