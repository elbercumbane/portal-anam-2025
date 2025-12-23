import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-why-support',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './why-support.component.html',
  styleUrl: './why-support.component.scss'
})
export class WhySupportComponent {
  impactStats = [
    { number: '1200+', label: 'Pessoas Beneficiadas', icon: '👥' },
    { number: '18', label: 'Projectos Concluídos', icon: '✅' },
    { number: '6', label: 'Províncias Impactadas', icon: 'location_on' },
    { number: '50K+', label: 'MZN Investidos', icon: '💰' }
  ];

  stories = [
    {
      name: 'João Silva',
      age: 15,
      location: 'Massinga',
      story: 'Graças ao apoio da ANAM, consegui acesso a formação digital e hoje trabalho como assistente administrativo. A minha vida mudou completamente.',
      image: '👨‍💼',
      project: 'Formação Digital para Jovens'
    },
    {
      name: 'Maria José',
      age: 35,
      location: 'Comunidade Rural',
      story: 'O projecto de agricultura sustentável ajudou-me a aumentar a produção em 200%. Agora consigo sustentar a minha família e ainda vender o excedente.',
      image: '👩‍🌾',
      project: 'Agricultura Sustentável'
    },
    {
      name: 'Carlos Mendes',
      age: 22,
      location: 'Massinga',
      story: 'A bolsa de estudos da ANAM permitiu-me concluir o ensino superior. Sou o primeiro da minha família a ter um diploma universitário.',
      image: '🎓',
      project: 'Programa de Bolsas'
    }
  ];

  supportLevels = [
    { amount: '50 MZN', frequency: 'mensal', benefit: 'Material escolar para 1 criança', icon: 'menu_book' },
    { amount: '150 MZN', frequency: 'mensal', benefit: 'Apoio a actividade comunitária', icon: '🤝' },
    { amount: '300 MZN', frequency: 'mensal', benefit: 'Financiar curso básico completo', icon: '📖' },
    { amount: '1000 MZN', frequency: 'mensal', benefit: 'Apoiar um projecto anual completo', icon: '🎯' }
  ];

  testimonials = [
    {
      name: 'Ana Costa',
      role: 'Apoiante desde 2021',
      quote: 'Ver o impacto real dos meus 50 MZN mensais é incrível. Recebo relatórios detalhados e sei exatamente onde o meu dinheiro está a ser usado.',
      image: '👩'
    },
    {
      name: 'Pedro Santos',
      role: 'Empresário',
      quote: 'Apoiar a ANAM é investir no futuro de Massinga. A transparência e os resultados falam por si só.',
      image: '👨'
    },
    {
      name: 'Sofia Alves',
      role: 'Apoiante desde 2022',
      quote: 'Não sou natural de Massinga, mas me apaixonei pela causa. Cada contribuição faz parte de uma transformação maior.',
      image: '👩‍🦰'
    }
  ];

  constructor(private router: Router) {}

  scrollToSupport(): void {
    this.router.navigate(['/apoio/torne-se-apoiante']);
  }
}

