import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Milestone {
  ano: string;
  titulo: string;
  descricao: string;
  imagem: string;
  categoria: string;
}

interface Galeria {
  titulo: string;
  fotos: string[];
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit, OnDestroy {
  
  milestones: Milestone[] = [
    {
      ano: '1998',
      titulo: 'Fundação da ANAM',
      descricao: 'Um grupo de visionários naturais de Massinga reuniu-se com o sonho de criar uma associação que promovesse o desenvolvimento social, cultural e económico da região. Nascia assim a ANAM, com apenas 15 membros fundadores.',
      imagem: '/assets/slider/slide1.jpg',
      categoria: 'Fundação'
    },
    {
      ano: '2002',
      titulo: 'Primeiro Projeto Comunitário',
      descricao: 'Lançamento do primeiro grande projeto de alfabetização de adultos, beneficiando mais de 200 pessoas da comunidade. Este marco estabeleceu a ANAM como uma força ativa no desenvolvimento local.',
      imagem: '/assets/slider/slide2.jpg',
      categoria: 'Educação'
    },
    {
      ano: '2008',
      titulo: 'Expansão Regional',
      descricao: 'A ANAM expandiu suas atividades para distritos vizinhos, criando parcerias estratégicas com organizações nacionais e internacionais. O número de membros cresceu para mais de 100.',
      imagem: '/assets/slider/slide3.jpg',
      categoria: 'Crescimento'
    },
    {
      ano: '2015',
      titulo: 'Centro de Formação Profissional',
      descricao: 'Inauguração do Centro de Formação Profissional da ANAM, oferecendo cursos de capacitação em diversas áreas: agricultura, empreendedorismo, tecnologia e artes.',
      imagem: '/assets/slider/slide1.jpg',
      categoria: 'Infraestrutura'
    },
    {
      ano: '2020',
      titulo: 'Resiliência na Pandemia',
      descricao: 'Durante a pandemia COVID-19, a ANAM mobilizou recursos para apoiar famílias vulneráveis, distribuindo alimentos, máscaras e promovendo campanhas de sensibilização sobre saúde pública.',
      imagem: '/assets/slider/slide2.jpg',
      categoria: 'Solidariedade'
    },
    {
      ano: '2023',
      titulo: 'Transformação Digital',
      descricao: 'Lançamento da plataforma digital da ANAM, modernizando processos e ampliando o alcance dos serviços. Implementação de sistemas de gestão e comunicação online.',
      imagem: '/assets/slider/slide3.jpg',
      categoria: 'Inovação'
    },
    {
      ano: '2025',
      titulo: 'Presente e Futuro',
      descricao: 'Hoje, a ANAM conta com mais de 250 membros ativos, 50+ projetos realizados e uma visão clara de desenvolvimento sustentável para Massinga e região. Continuamos crescendo e impactando vidas.',
      imagem: '/assets/slider/slide1.jpg',
      categoria: 'Atualidade'
    }
  ];

  estatisticas = [
    { valor: '27+', label: 'Anos de História', icon: '📅' },
    { valor: '250+', label: 'Membros Ativos', icon: '👥' },
    { valor: '50+', label: 'Projetos Realizados', icon: '🎯' },
    { valor: '5000+', label: 'Vidas Impactadas', icon: '❤️' }
  ];

  galerias: Galeria[] = [
    {
      titulo: 'Momentos Históricos',
      fotos: ['/assets/slider/slide1.jpg', '/assets/slider/slide2.jpg', '/assets/slider/slide3.jpg']
    },
    {
      titulo: 'Eventos Marcantes',
      fotos: ['/assets/slider/slide2.jpg', '/assets/slider/slide3.jpg', '/assets/slider/slide1.jpg']
    }
  ];

  ngOnInit() {
    // Adicionar classe ao body para forçar navbar sólido
    document.body.classList.add('navbar-solid');
  }

  ngOnDestroy() {
    // Remover classe quando sair da página
    document.body.classList.remove('navbar-solid');
  }
}

