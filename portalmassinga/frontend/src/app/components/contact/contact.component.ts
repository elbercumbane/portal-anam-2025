import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss',
})
export class ContactComponent implements OnInit {
  @ViewChild('contatoSection', { static: true }) contatoSection!: ElementRef;

  // Formulário de contacto
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.initScrollAnimations();
  }

  private initForm() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      assunto: [''],
      mensagem: ['', Validators.required],
    });
  }

  private initScrollAnimations() {
    // Configurar posição inicial da seção
    gsap.set(this.contatoSection.nativeElement, { opacity: 0, y: 50 });
    
    // Criar um observer para detectar quando a seção entra na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar a entrada da seção
          gsap.to(this.contatoSection.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.contatoSection.nativeElement);
  }

  submit(): void {
    if (this.form.valid) {
      alert('Mensagem enviada com sucesso! Entraremos em contacto em breve.');
      this.form.reset();
    }
  }
}
