import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  isLoading = false;
  
  // Estados de foco dos campos
  emailFocused = false;
  passwordFocused = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      senha: [''],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  login(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.isLoading = true;
    
    // Simular delay de autenticação
    setTimeout(() => {
      console.log('Login simulado (sem backend):', this.form.value);
      this.isLoading = false;
      window.location.href = window.location.origin + window.location.pathname.replace(/\/login.*$/, '') + '/#/dashboard';
    }, 1200);
  }
}
