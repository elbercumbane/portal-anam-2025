import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Donation {
  date: string;
  amount: number;
  type: 'unique' | 'monthly';
  receipt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  impact: number;
  reportUrl: string;
}

@Component({
  selector: 'app-supporter-area',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supporter-area.component.html',
  styleUrl: './supporter-area.component.scss'
})
export class SupporterAreaComponent implements OnInit {
  supporterName = 'João Silva'; // Simulado - viria do login
  totalDonated = 1500;
  lastDonation = '15 de Novembro 2024';
  supporterLevel = 'Prata';
  
  increaseForm!: FormGroup;
  showIncreaseForm = false;

  moneyUsage = [
    { category: 'Programas', percentage: 40, amount: 600 },
    { category: 'Projectos', percentage: 35, amount: 525 },
    { category: 'Operações', percentage: 15, amount: 225 },
    { category: 'Formação', percentage: 7, amount: 105 },
    { category: 'Emergências', percentage: 3, amount: 45 }
  ];

  activeProjects: Project[] = [
    {
      id: '1',
      name: 'Formação Digital para Jovens',
      description: 'Curso básico de informática para jovens da região',
      progress: 75,
      impact: 120,
      reportUrl: '#'
    },
    {
      id: '2',
      name: 'Agricultura Sustentável',
      description: 'Formação em técnicas modernas de cultivo',
      progress: 60,
      impact: 85,
      reportUrl: '#'
    },
    {
      id: '3',
      name: 'Programa de Bolsas',
      description: 'Apoio financeiro para estudantes',
      progress: 90,
      impact: 45,
      reportUrl: '#'
    }
  ];

  donationHistory: Donation[] = [
    { date: '15/11/2024', amount: 150, type: 'monthly', receipt: 'recibo-001.pdf' },
    { date: '15/10/2024', amount: 150, type: 'monthly', receipt: 'recibo-002.pdf' },
    { date: '15/09/2024', amount: 150, type: 'monthly', receipt: 'recibo-003.pdf' },
    { date: '20/08/2024', amount: 500, type: 'unique', receipt: 'recibo-004.pdf' },
    { date: '15/08/2024', amount: 150, type: 'monthly', receipt: 'recibo-005.pdf' }
  ];

  exclusiveNews = [
    {
      title: 'Novo Projecto Aprovado',
      date: '10 de Dezembro 2024',
      excerpt: 'Aprovámos um novo projecto de capacitação para mulheres empreendedoras.',
      type: 'projecto'
    },
    {
      title: 'Relatório Trimestral Disponível',
      date: '5 de Dezembro 2024',
      excerpt: 'O relatório do último trimestre já está disponível na tua área.',
      type: 'relatorio'
    },
    {
      title: 'Evento Exclusivo para Apoiantes',
      date: '1 de Dezembro 2024',
      excerpt: 'Convite especial para o jantar de gala anual.',
      type: 'evento'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.increaseForm = this.fb.group({
      newAmount: ['', [Validators.required, Validators.min(1)]],
      frequency: ['monthly', [Validators.required]]
    });
  }

  getLevelColor(): string {
    switch(this.supporterLevel) {
      case 'Ouro': return '#FFD700';
      case 'Prata': return '#C0C0C0';
      case 'Bronze': return '#CD7F32';
      default: return '#4CAF50';
    }
  }

  downloadReceipt(receipt: string): void {
    console.log('Downloading receipt:', receipt);
    // Implementar download real
  }

  viewReport(reportUrl: string): void {
    console.log('Opening report:', reportUrl);
    // Implementar abertura de relatório
  }

  toggleIncreaseForm(): void {
    this.showIncreaseForm = !this.showIncreaseForm;
  }

  onSubmitIncrease(): void {
    if (this.increaseForm.valid) {
      console.log('Increasing support:', this.increaseForm.value);
      alert('Pedido de aumento de apoio enviado com sucesso!');
      this.showIncreaseForm = false;
      this.increaseForm.reset();
    }
  }

  makeExtraDonation(): void {
    // Redirecionar para página de doação extra
    console.log('Redirecting to extra donation');
  }

  getCategoryColor(index: number): string {
    const colors = ['#4CAF50', '#0B2F41', '#FFD700', '#FF9800', '#F44336'];
    return colors[index % colors.length];
  }

  getDashArray(percentage: number): string {
    const circumference = 2 * Math.PI * 80;
    const dashLength = (percentage / 100) * circumference;
    return `${dashLength} ${circumference}`;
  }

  getDashOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const circumference = 2 * Math.PI * 80;
      offset -= (this.moneyUsage[i].percentage / 100) * circumference;
    }
    return offset;
  }
}

