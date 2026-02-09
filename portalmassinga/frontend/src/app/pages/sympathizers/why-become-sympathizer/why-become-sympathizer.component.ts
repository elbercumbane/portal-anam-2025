import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';

@Component({
  selector: 'app-why-become-sympathizer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './why-become-sympathizer.component.html',
  styleUrl: './why-become-sympathizer.component.scss'
})
export class WhyBecomeSympathizerComponent implements OnInit {
  // Array para partículas do hero
  particles = Array.from({ length: 8 }, (_, i) => i + 1);
  
  form!: FormGroup;
  formSubmitted = false;
  isLoading = false;
  errorMessage = '';

  impactStats = [
    { number: '+1.200', label: 'Jovens Beneficiados em 2024', icon: '👥' },
    { number: '50K+', label: 'MZN Arrecadados', icon: '💰' },
    { number: '25+', label: 'Projectos Apoiados', icon: '🎯' },
    { number: '3.000+', label: 'Vidas Impactadas', icon: 'favorite' }
  ];

  stories = [
    {
      name: 'Maria João',
      role: 'Simpatizante desde 2022',
      quote: 'Acredito na transformação de Massinga. Ver os projectos transformando vidas é a maior recompensa. Gratuito e flexível.',
      image: '👩'
    },
    {
      name: 'Carlos Mendes',
      role: 'Empresário e Simpatizante',
      quote: 'Encontrei uma forma concreta de retribuir à terra que me formou. Recebo updates e participo em actividades. Sem compromissos.',
      image: '👨'
    },
    {
      name: 'Ana Silva',
      role: 'Simpatizante desde 2021',
      quote: 'Não sou natural de Massinga, mas me apaixonei pela causa. Ser simpatizante me conecta com uma comunidade incrível.',
      image: '👩‍🦰'
    }
  ];

  benefits = [
    { 
      iconName: 'mail', 
      title: 'Newsletter Mensal', 
      desc: 'Updates exclusivos sobre projectos e impacto' 
    },
    { 
      iconName: 'ticket', 
      title: 'Acesso a Eventos', 
      desc: 'Participação em eventos e actividades abertas' 
    },
    { 
      iconName: 'chart', 
      title: 'Transparência Total', 
      desc: 'Acesso a relatórios públicos e resultados' 
    },
    { 
      iconName: 'graduation', 
      title: 'Formações', 
      desc: 'Convites para webinars e formações exclusivas' 
    },
    { 
      iconName: 'users', 
      title: 'Comunidade', 
      desc: 'Faça parte de uma rede de apoiadores' 
    },
    { 
      iconName: 'rocket', 
      title: 'Evolua quando Quiser', 
      desc: 'Torne-se membro quando desejar' 
    }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiClient: ApiClientService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      consentimento: [false, [Validators.requiredTrue]]
    });
  }

  scrollToForm(): void {
    const formElement = document.getElementById('registration-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const v = this.form.value;
      const payload = {
        fullName: v.nome,
        email: v.email,
        phone: v.telefone || '',
        areaInterest: 'Geral',
        acceptCommunications: !!v.consentimento
      };
      this.apiClient.createSympathizerRegistration(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.formSubmitted = true;
          this.form.reset();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || 'Erro ao registar. Tente novamente.';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}

