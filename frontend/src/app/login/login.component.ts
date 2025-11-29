import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sem validação - sem backend
    this.form = this.fb.group({
      email: [''],
      senha: [''],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  login(event?: Event): void {
    // Prevenir comportamento padrão do formulário
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Login simulado - sem backend
    // Sem validação, permite acesso direto
    this.isLoading = true;
    
    // Simular delay de autenticação
    setTimeout(() => {
      console.log('Login simulado (sem backend):', this.form.value);
      
      // Redirecionar para o dashboard
      // Usar window.location para garantir que funcione com hash routing
      this.isLoading = false;
      window.location.href = window.location.origin + window.location.pathname.replace(/\/login.*$/, '') + '/#/dashboard';
    }, 800);
  }
}


