import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ProjetoDisponivel {
  id: string;
  titulo: string;
  descricao: string;
  area: string;
  valorDisponivel: string;
  prazoCandidatura: string;
  requisitos: string[];
  beneficios: string[];
  dataInicio: string;
  duracao: string;
  organizacao: string;
}

@Component({
  selector: 'app-candidaturas',
  standalone: false,
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {
  projetos: ProjetoDisponivel[] = [
    {
      id: '1',
      titulo: 'Programa de Desenvolvimento Rural Sustentável',
      descricao: 'Iniciativa para promover o desenvolvimento sustentável em comunidades rurais através de projetos de agricultura, energia renovável e capacitação comunitária.',
      area: 'Desenvolvimento Rural',
      valorDisponivel: '5.0M MZN',
      prazoCandidatura: '31 de Março, 2024',
      requisitos: ['ONG registrada', 'Experiência em desenvolvimento rural', 'Equipe técnica qualificada'],
      beneficios: ['Financiamento completo', 'Acompanhamento técnico', 'Rede de parceiros'],
      dataInicio: 'Abril 2024',
      duracao: '24 meses',
      organizacao: 'ANAM - Associação Nacional de Apoio ao Meio Ambiente'
    },
    {
      id: '2',
      titulo: 'Inovação Tecnológica para Educação',
      descricao: 'Projeto para implementar soluções tecnológicas inovadoras em escolas públicas, incluindo laboratórios de informática, plataformas digitais e capacitação de professores.',
      area: 'Educação e Tecnologia',
      valorDisponivel: '3.5M MZN',
      prazoCandidatura: '15 de Abril, 2024',
      requisitos: ['Instituição educacional', 'Experiência em tecnologia educacional', 'Parceria com escolas públicas'],
      beneficios: ['Equipamentos tecnológicos', 'Formação de professores', 'Suporte técnico contínuo'],
      dataInicio: 'Maio 2024',
      duracao: '18 meses',
      organizacao: 'ANAM - Associação Nacional de Apoio ao Meio Ambiente'
    },
    {
      id: '3',
      titulo: 'Saúde Comunitária e Prevenção',
      descricao: 'Programa abrangente de saúde comunitária focado em prevenção, educação sanitária, rastreamento de doenças e capacitação de agentes de saúde locais.',
      area: 'Saúde Pública',
      valorDisponivel: '4.2M MZN',
      prazoCandidatura: '20 de Abril, 2024',
      requisitos: ['Organização de saúde', 'Profissionais de saúde qualificados', 'Acesso a comunidades rurais'],
      beneficios: ['Equipamentos médicos', 'Medicamentos essenciais', 'Formação especializada'],
      dataInicio: 'Junho 2024',
      duracao: '30 meses',
      organizacao: 'ANAM - Associação Nacional de Apoio ao Meio Ambiente'
    },
    {
      id: '4',
      titulo: 'Empoderamento Feminino e Empreendedorismo',
      descricao: 'Iniciativa para capacitar mulheres em habilidades empreendedoras, liderança comunitária e criação de negócios sustentáveis, com foco em igualdade de género.',
      area: 'Género e Desenvolvimento',
      valorDisponivel: '2.8M MZN',
      prazoCandidatura: '10 de Maio, 2024',
      requisitos: ['ONG focada em género', 'Experiência em empreendedorismo feminino', 'Rede de mulheres'],
      beneficios: ['Capital semente', 'Mentoria especializada', 'Rede de apoio'],
      dataInicio: 'Julho 2024',
      duracao: '20 meses',
      organizacao: 'ANAM - Associação Nacional de Apoio ao Meio Ambiente'
    }
  ];

  constructor(private router: Router) {}

  candidatarSe(projetoId: string) {
    this.router.navigate(['/projectos/candidatura-form', projetoId]);
  }
}
