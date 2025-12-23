import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-why-become-sympathizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-become-sympathizer.component.html',
  styleUrl: './why-become-sympathizer.component.scss'
})
export class WhyBecomeSympathizerComponent {
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

  constructor(private router: Router) {}

  scrollToForm(): void {
    this.router.navigate(['/simpatizantes/torne-se-simpatizante']);
  }
}

