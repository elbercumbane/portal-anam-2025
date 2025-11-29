import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicoCardComponent } from './sections/servico-card.component';

interface Estatistica {
  valor: string;
  label: string;
  icon: string;
  cor: string;
  percentual: number;
}

interface Servico {
  icon: string;
  titulo: string;
  descricao: string;
  beneficios: string[];
  cor: string;
}

@Component({
  selector: 'app-servicos-home',
  standalone: false,
  templateUrl: './servicos-home.component.html',
  styleUrl: './servicos-home.component.scss'
})
export class ServicosHomeComponent implements OnInit, OnDestroy {
  
  estatisticas: Estatistica[] = [
    {
      valor: '250+',
      label: 'Empresas Apoiadas',
      icon: '🏢',
      cor: '#2563EB',
      percentual: 85
    },
    {
      valor: '180',
      label: 'Capacitações Realizadas',
      icon: '🎓',
      cor: '#059669',
      percentual: 72
    },
    {
      valor: '95%',
      label: 'Taxa de Satisfação',
      icon: '⭐',
      cor: '#EA580C',
      percentual: 95
    },
    {
      valor: '500+',
      label: 'Conexões de Negócio',
      icon: '🤝',
      cor: '#DC2626',
      percentual: 88
    }
  ];

  servicos: Servico[] = [
    {
      icon: '🎓',
      titulo: 'Capacitação Empresarial',
      descricao: 'Programas de formação especializados para desenvolvimento de competências',
      beneficios: [
        'Gestão financeira',
        'Marketing digital',
        'Liderança',
        'Transformação digital'
      ],
      cor: '#2563EB'
    },
    {
      icon: '🤝',
      titulo: 'Networking e Parcerias',
      descricao: 'Conecte-se com outros empresários e crie oportunidades de negócio',
      beneficios: [
        'Eventos mensais',
        'B2B matching',
        'Feiras e exposições',
        'Mentoria entre associados'
      ],
      cor: '#059669'
    },
    {
      icon: '💼',
      titulo: 'Consultoria Especializada',
      descricao: 'Apoio técnico personalizado para resolver desafios específicos do seu negócio',
      beneficios: [
        'Otimização de processos',
        'Planeamento estratégico',
        'Acesso a financiamento',
        'Compliance'
      ],
      cor: '#EA580C'
    },
    {
      icon: '📚',
      titulo: 'Acesso a Recursos',
      descricao: 'Ferramentas, plataformas e benefícios exclusivos para membros',
      beneficios: [
        'Base de fornecedores',
        'Biblioteca digital',
        'Coworking',
        'Benefícios e programas'
      ],
      cor: '#7C3AED'
    }
  ];
  
  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
    
    // Animar gráficos circulares após delay
    setTimeout(() => {
      this.animarGraficos();
    }, 500);
  }

  ngOnDestroy() {
    // Remover classe quando sair da página
    document.body.classList.remove('navbar-solid');
  }

  private animarGraficos(): void {
    // Animação dos gráficos circulares já está no CSS
    // Este método pode ser usado para lógica adicional se necessário
  }
}
