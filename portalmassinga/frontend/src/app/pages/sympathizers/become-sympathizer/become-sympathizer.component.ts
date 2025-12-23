import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-become-sympathizer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './become-sympathizer.component.html',
  styleUrl: './become-sympathizer.component.scss'
})
export class BecomeSympathizerComponent implements OnInit {
  form!: FormGroup;
  formSubmitted = false;

  benefits = [
    { 
      icon: 'email', 
      title: 'Newsletter Mensal', 
      desc: 'Receba updates exclusivos com histórias e impacto dos projectos' 
    },
    { 
      icon: 'event_available', 
      title: 'Acesso Antecipado', 
      desc: 'Acesso antecipado a eventos e campanhas da associação' 
    },
    { 
      icon: 'visibility', 
      title: 'Participação em Actividades', 
      desc: 'Participe em actividades abertas da associação' 
    },
    { 
      icon: 'assessment', 
      title: 'Relatórios Públicos', 
      desc: 'Acesso a relatórios públicos e transparência da associação' 
    },
    { 
      icon: 'school', 
      title: 'Webinars e Formações', 
      desc: 'Convite para Webinars, cursos e formações exclusivas' 
    },
    { 
      icon: 'trending_up', 
      title: 'Evolução para Membro', 
      desc: 'Possibilidade de se tornar Membro ou Voluntário quando quiser' 
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      consentimento: [false, [Validators.requiredTrue]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulário de simpatizante enviado:', this.form.value);
      this.formSubmitted = true;
      // Aqui você integraria com o backend para salvar o simpatizante
      setTimeout(() => {
        this.form.reset();
        this.formSubmitted = false;
      }, 5000);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }
}

