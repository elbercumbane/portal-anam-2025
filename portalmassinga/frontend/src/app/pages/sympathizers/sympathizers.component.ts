import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sympathizers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './sympathizers.component.html',
  styleUrl: './sympathizers.component.scss'
})
export class SympathizersComponent implements OnInit {
  quickForm!: FormGroup;
  faqExpanded: { [key: number]: boolean } = {};
  formSubmitted = false;
  
  // Áreas de interesse para o dropdown
  areasInteresse = [
    'Projectos',
    'Eventos',
    'Educação',
    'Jovens',
    'Agricultura',
    'Saúde',
    'Desenvolvimento Comunitário',
    'Outro'
  ];

  // Estatísticas de impacto
  impactStats = [
    { number: '+1.200', label: 'Jovens Beneficiados em 2024', icon: '👥' },
    { number: '50K+', label: 'MZN Arrecadados', icon: '💰' },
    { number: '25+', label: 'Projectos Apoiados', icon: '🎯' },
    { number: '3.000+', label: 'Vidas Impactadas', icon: 'favorite' }
  ];

  // Histórias reais de simpatizantes
  stories = [
    {
      name: 'Maria João',
      role: 'Simpatizante desde 2022',
      quote: 'Juntei-me como simpatizante porque acredito na transformação de Massinga. Ver os projectos transformando vidas é a maior recompensa. Não pago quotas, mas contribuo quando posso e participo nos eventos.',
      image: '👩'
    },
    {
      name: 'Carlos Mendes',
      role: 'Empresário e Simpatizante',
      quote: 'Como simpatizante, encontrei uma forma concreta de retribuir à terra que me formou. Recebo updates exclusivos e posso participar em actividades abertas. É gratuito e flexível.',
      image: '👨'
    },
    {
      name: 'Ana Silva',
      role: 'Simpatizante desde 2021',
      quote: 'Não sou natural de Massinga, mas me apaixonei pela causa. Ser simpatizante me conecta com uma comunidade incrível. Posso evoluir para membro quando quiser.',
      image: '👩‍🦰'
    }
  ];

  // Eventos futuros onde simpatizantes podem participar
  events = [
    {
      title: 'Jantar de Gala Anual',
      date: '15 de Dezembro',
      description: 'Evento especial para simpatizantes e membros. Celebre o impacto alcançado em 2024.',
      type: 'evento'
    },
    {
      title: 'Visita a Projectos',
      date: '20 de Janeiro',
      description: 'Conheça de perto os projectos que você apoia. Visita guiada para simpatizantes.',
      type: 'visita'
    },
    {
      title: 'Webinar: Impacto Social',
      date: '10 de Fevereiro',
      description: 'Aprenda sobre desenvolvimento comunitário e o impacto dos nossos projectos.',
      type: 'workshop'
    }
  ];

  // Benefícios para simpatizantes
  benefits = [
    { 
      icon: '📧', 
      title: 'Newsletter Mensal', 
      desc: 'Receba updates exclusivos com histórias e impacto dos projectos' 
    },
    { 
      icon: '🎫', 
      title: 'Acesso Antecipado', 
      desc: 'Acesso antecipado a eventos e campanhas da associação' 
    },
    { 
      icon: 'visibility', 
      title: 'Participação em Actividades', 
      desc: 'Participe em actividades abertas da associação' 
    },
    { 
      icon: '📊', 
      title: 'Relatórios Públicos', 
      desc: 'Acesso a relatórios públicos e transparência da associação' 
    },
    { 
      icon: '🎓', 
      title: 'Webinars e Formações', 
      desc: 'Convite para Webinars, cursos e formações exclusivas' 
    },
    { 
      icon: '🚀', 
      title: 'Evolução para Membro', 
      desc: 'Possibilidade de se tornar Membro ou Voluntário quando quiser' 
    }
  ];

  // FAQ conforme especificação
  faqs = [
    {
      question: 'Ser simpatizante é gratuito?',
      answer: 'Sim! Ser simpatizante é completamente gratuito. Não há quotas ou compromissos financeiros obrigatórios. Você pode contribuir quando e como quiser.'
    },
    {
      question: 'Posso me tornar membro depois?',
      answer: 'Sim! Simpatizantes podem evoluir para membros quando desejarem. Ser simpatizante é uma excelente forma de conhecer a associação antes de se tornar membro oficial.'
    },
    {
      question: 'Como recebo informações?',
      answer: 'Simpatizantes recebem newsletters mensais exclusivas com histórias, impactos e atualizações sobre projectos. Também receberá convites para eventos e actividades abertas.'
    },
    {
      question: 'Como posso ajudar a associação?',
      answer: 'Você pode ajudar de várias formas: fazendo doações (quando quiser), participando em eventos, divulgando a causa nas redes sociais, oferecendo expertise profissional ou participando como voluntário eventual.'
    },
    {
      question: 'Quais actividades posso participar?',
      answer: 'Simpatizantes podem participar em eventos abertos, visitas a projectos, webinars, workshops, formações e outras actividades públicas da associação. Alguns eventos são exclusivos para simpatizantes e membros.'
    },
    {
      question: 'Qual a diferença entre membro e simpatizante?',
      answer: 'Membros são naturais ou amigos de Massinga que se associam formalmente, pagam quotas e têm direito a voto nas assembleias. Simpatizantes são apoiadores que contribuem para a causa sem necessidade de associação formal ou pagamento de quotas.'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.quickForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      areaInteresse: ['', [Validators.required]],
      consentimento: [false, [Validators.requiredTrue]]
    });
  }

  toggleFaq(index: number): void {
    this.faqExpanded[index] = !this.faqExpanded[index];
  }

  onSubmitQuickForm(): void {
    if (this.quickForm.valid) {
      console.log('Formulário de simpatizante enviado:', this.quickForm.value);
      this.formSubmitted = true;
      // Aqui você integraria com o backend para salvar o simpatizante
      // e enviar email automático de boas-vindas
      setTimeout(() => {
        this.quickForm.reset();
        this.formSubmitted = false;
      }, 5000);
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.quickForm.controls).forEach(key => {
        this.quickForm.get(key)?.markAsTouched();
      });
    }
  }

  scrollToForm(): void {
    const formElement = document.getElementById('quick-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToDonate(): void {
    // Navegar para página de doações ou abrir modal
    window.location.href = '/apoio';
  }

  scrollToEvents(): void {
    // Navegar para eventos ou scroll para seção de eventos
    window.location.href = '/eventos';
  }
}

