import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'protocolo' | 'relatorio' | 'guia' | 'outro';
  download: boolean;
  date?: string;
  size?: string;
  category?: string;
}

@Component({
  selector: 'app-sympathizer-area',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sympathizer-area.component.html',
  styleUrl: './sympathizer-area.component.scss'
})
export class SympathizerAreaComponent implements OnInit, OnDestroy {
  sympathizerName = 'Maria Santos'; // Simulado - viria do login
  
  activeTab: string = 'documents';
  currentTime = '';
  currentDate = '';
  private timeInterval: any;

  documents: Document[] = [
    {
      id: '1',
      title: 'Protocolo de Participação',
      description: 'Regras e diretrizes para simpatizantes da ANAM',
      type: 'protocolo',
      download: true,
      date: '15/01/2024',
      size: '2.5 MB',
      category: 'Protocolos'
    },
    {
      id: '2',
      title: 'Relatório Anual 2024',
      description: 'Relatório completo das atividades e resultados da associação no ano de 2024',
      type: 'relatorio',
      download: true,
      date: '10/01/2025',
      size: '5.8 MB',
      category: 'Relatórios'
    },
    {
      id: '3',
      title: 'Guia do Simpatizante',
      description: 'Informações importantes e orientações para novos simpatizantes',
      type: 'guia',
      download: true,
      date: '05/12/2024',
      size: '1.2 MB',
      category: 'Guias'
    },
    {
      id: '4',
      title: 'Estatutos da ANAM',
      description: 'Documento oficial com os estatutos da Associação de Naturais e Amigos de Massinga',
      type: 'outro',
      download: true,
      date: '20/11/2023',
      size: '3.1 MB',
      category: 'Documentos Oficiais'
    },
    {
      id: '5',
      title: 'Relatório Trimestral Q4 2024',
      description: 'Relatório do último trimestre de 2024 com atividades e projetos',
      type: 'relatorio',
      download: true,
      date: '15/12/2024',
      size: '4.2 MB',
      category: 'Relatórios'
    },
    {
      id: '6',
      title: 'Política de Privacidade',
      description: 'Política de privacidade e proteção de dados da associação',
      type: 'outro',
      download: true,
      date: '01/01/2024',
      size: '0.8 MB',
      category: 'Documentos Oficiais'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicializar data e hora
    this.updateDateTime();
    // Atualizar a cada segundo
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateDateTime(): void {
    const now = new Date();
    
    // Formatar hora (HH:MM:SS)
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}:${seconds}`;
    
    // Formatar data (DD de Mês de YYYY)
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    this.currentDate = `${dayName}, ${day} de ${month} de ${year}`;
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  isTabActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  logout(): void {
    // Implementar logout
    this.router.navigate(['/']);
  }

  downloadDocument(document: Document): void {
    console.log('Downloading document:', document);
    // Implementar download real
  }

  getDocumentIcon(type: string): string {
    switch(type) {
      case 'protocolo': return 'description';
      case 'relatorio': return 'assessment';
      case 'guia': return 'menu_book';
      default: return 'insert_drive_file';
    }
  }

  getDocumentTypeLabel(type: string): string {
    switch(type) {
      case 'protocolo': return 'Protocolo';
      case 'relatorio': return 'Relatório';
      case 'guia': return 'Guia';
      default: return 'Documento';
    }
  }

  getFilteredDocuments(category?: string): Document[] {
    if (!category) return this.documents;
    return this.documents.filter(doc => doc.category === category);
  }

  getCategories(): string[] {
    const categories = this.documents.map(doc => doc.category).filter((cat, index, self) => cat && self.indexOf(cat) === index);
    return categories as string[];
  }

  searchDocuments(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    // Implementar busca de documentos
    console.log('Searching for:', searchTerm);
  }
}
