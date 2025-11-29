import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
// ApiService removido - sem backend

interface UserProfile {
  id?: number;
  email: string;
  fullName?: string;
  department?: string;
  province?: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Output() navigationClick = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();
  
  userProfile: UserProfile | null = null;
  passwordForm: FormGroup;
  isLoading = false;
  isSavingPassword = false;
  
  constructor(
    private fb: FormBuilder,
    // ApiService removido
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  ngOnInit(): void {
    this.loadUserProfile();
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
  
  loadUserProfile(): void {
    this.isLoading = true;
    
    // Tentar obter email de diferentes fontes do localStorage
    const userEmail = localStorage.getItem('savedEmail') || 
                     localStorage.getItem('userEmail') ||
                     (() => {
                       // Tentar extrair do token ou outras fontes
                       const token = localStorage.getItem('authToken');
                       if (token) {
                         // Se o token contém informações, pode extrair aqui
                         // Por enquanto, vamos buscar de outra forma
                         return null;
                       }
                       return null;
                     })();
    
    if (!userEmail) {
      // Se não encontrou email, tentar buscar todos os usuários e usar o primeiro ativo
      // ou mostrar erro mais amigável
      Promise.resolve([]) // Sem backend - dados vazios
        .then((users: any[]) => {
          // Tentar encontrar usuário ativo
          const activeUser = users.find(u => u.active === true || u.active === 1);
          if (activeUser) {
            this.setUserProfile(activeUser);
          } else if (users.length > 0) {
            // Se não houver ativo, usar o primeiro
            this.setUserProfile(users[0]);
          } else {
            this.snackBar.open('Nenhum usuário encontrado. Por favor, faça login novamente.', 'Fechar', { duration: 5000 });
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Error loading user profile:', error);
          this.snackBar.open('Erro ao carregar perfil. Por favor, faça login novamente.', 'Fechar', { duration: 5000 });
          this.isLoading = false;
        });
      return;
    }
    
    // Sem backend - dados vazios
    Promise.resolve([]) // Sem backend - dados vazios
      .then((users: any[]) => {
        // Normalizar email para comparação (lowercase)
        const normalizedEmail = userEmail.toLowerCase().trim();
        const user = users.find(u => u.email && u.email.toLowerCase().trim() === normalizedEmail);
        
        if (user) {
          this.setUserProfile(user);
        } else {
          // Se não encontrou por email exato, tentar parcial
          const partialMatch = users.find(u => u.email && u.email.toLowerCase().includes(normalizedEmail));
          if (partialMatch) {
            this.setUserProfile(partialMatch);
          } else {
            this.snackBar.open('Usuário não encontrado. Por favor, faça login novamente.', 'Fechar', { duration: 5000 });
          }
        }
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading user profile:', error);
        this.snackBar.open('Erro ao carregar perfil do usuário', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      });
  }
  
  private setUserProfile(user: any): void {
    this.userProfile = {
      id: user.id,
      email: user.email || '',
      fullName: user.fullName || user.full_name || '',
      department: user.department || '',
      province: user.province || '',
      role: user.role || '',
      active: user.active !== undefined ? (user.active === true || user.active === 1) : true
    };
    
    // Atualizar localStorage com informações corretas
    if (this.userProfile.email) {
      localStorage.setItem('savedEmail', this.userProfile.email);
    }
    if (this.userProfile.fullName) {
      localStorage.setItem('userFullName', this.userProfile.fullName);
      localStorage.setItem('userName', this.userProfile.fullName);
    }

    if (this.userProfile.department && this.userProfile.department.trim() !== '') {
      localStorage.setItem('userDepartment', this.userProfile.department.trim());
    } else {
      localStorage.removeItem('userDepartment');
    }

    if (this.userProfile.province && this.userProfile.province.trim() !== '') {
      localStorage.setItem('userProvince', this.userProfile.province.trim());
    } else {
      localStorage.removeItem('userProvince');
    }

    if (this.userProfile.role && this.userProfile.role.trim() !== '') {
      localStorage.setItem('userRole', this.userProfile.role.trim());
    } else {
      localStorage.removeItem('userRole');
    }
  }
  
  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'tecnico': 'Técnico',
      'administrador': 'Administrador',
      'super-administrador': 'Super Administrador'
    };
    return labels[role] || role;
  }
  
  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos corretamente', 'Fechar', { duration: 3000 });
      return;
    }
    
    if (!this.userProfile?.id) {
      this.snackBar.open('Erro: ID do usuário não encontrado', 'Fechar', { duration: 3000 });
      return;
    }
    
    this.isSavingPassword = true;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    
    // Atualizar apenas a senha - manter outros campos
    const updateData = {
      email: this.userProfile.email,
      password: newPassword,
      fullName: this.userProfile.fullName,
      role: this.userProfile.role,
      department: this.userProfile.department,
      province: this.userProfile.province,
      active: this.userProfile.active
    };
    
    Promise.resolve({ ...this.userProfile, ...updateData }) // Sem backend - simulado
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
}

