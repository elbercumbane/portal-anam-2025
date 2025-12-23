import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PageTransitionService } from '../../services/page-transition.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  @ViewChild('contatoContent', { static: true }) contatoContent!: ElementRef;
  
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pageTransitionService: PageTransitionService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      assunto: ['', Validators.required],
      mensagem: ['', Validators.required],
    });
    
    this.pageTransitionService.pageEnter(this.contatoContent.nativeElement);
  }

  submit(): void {
    if (this.form.valid) {
      alert('Mensagem enviada com sucesso! Entraremos em contacto em breve.');
      this.form.reset();
    }
  }
}


