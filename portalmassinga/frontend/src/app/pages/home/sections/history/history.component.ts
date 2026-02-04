import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiClientService } from '../../../../services/api-client.service';

@Component({
  selector: 'app-history-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistorySectionComponent implements OnInit, AfterViewInit {
  
  // Injetar o serviço usando inject() para evitar problemas de injeção
  private apiClient = inject(ApiClientService);
  
  // Dados carregados da base de dados
  sobreAnam = {
    titulo: 'Sobre a ANAM',
    introducao: 'Promovemos o desenvolvimento sustentável e o bem-estar socioeconómico das comunidades do Distrito de Massinga.'
  };
  
  missao = {
    titulo: 'Missão',
    descricao: 'Promover o desenvolvimento sustentável e melhorar o bem-estar socioeconómico das comunidades do Distrito de Massinga, gerindo e capitalizando estrategicamente os recursos e potencial locais.'
  };
  
  visao = {
    titulo: 'Visão',
    descricao: 'Estabelecer Massinga como uma referência nacional em desenvolvimento local, sustentável e participativo, impulsionando um crescimento inclusivo para todos.'
  };
  
  valores = {
    titulo: 'Nossos Valores',
    valores: [
      {
        titulo: 'Desenvolvimento de Competências',
        descricao: 'Acesse uma força de trabalho qualificada, identifique programas de capacitação e gerencie necessidades de capital humano.'
      },
      {
        titulo: 'Networking Empresarial',
        descricao: 'Conecte-se com profissionais de alto nível, tomadores de decisão e agentes-chave em múltiplos setores.'
      },
      {
        titulo: 'Oportunidades em Tempo Real',
        descricao: 'Participe de projetos nos setores de mineração, energia, agricultura e infraestrutura com dados transparentes e em tempo real.'
      }
    ]
  };

  ngOnInit() {
    // Carregar conteúdo da base de dados
    this.loadContentFromDatabase();
  }

  /**
   * Carrega conteúdo da seção Sobre ANAM, Missão, Visão e Valores da base de dados
   */
  loadContentFromDatabase(): void {
    this.apiClient.getHomeContent(true).subscribe({
      next: (contents: any[]) => {
        // Carregar Sobre ANAM
        const sobreAnamContent = contents.find(c => c.sectionKey === 'sobre_anam');
        if (sobreAnamContent) {
          this.sobreAnam.titulo = sobreAnamContent.title || this.sobreAnam.titulo;
          this.sobreAnam.introducao = sobreAnamContent.content || this.sobreAnam.introducao;
        }
        
        // Carregar Missão
        const missaoContent = contents.find(c => c.sectionKey === 'missao');
        if (missaoContent) {
          this.missao.titulo = missaoContent.title || this.missao.titulo;
          this.missao.descricao = missaoContent.content || this.missao.descricao;
        }
        
        // Carregar Visão
        const visaoContent = contents.find(c => c.sectionKey === 'visao');
        if (visaoContent) {
          this.visao.titulo = visaoContent.title || this.visao.titulo;
          this.visao.descricao = visaoContent.content || this.visao.descricao;
        }
        
        // Carregar Valores
        const valoresContent = contents.find(c => c.sectionKey === 'valores');
        if (valoresContent) {
          this.valores.titulo = valoresContent.title || this.valores.titulo;
          if (valoresContent.metadata) {
            try {
              const metadata = JSON.parse(valoresContent.metadata);
              if (metadata.valores && Array.isArray(metadata.valores)) {
                this.valores.valores = metadata.valores;
              }
            } catch (e) {
              console.warn('Erro ao parsear metadata de valores:', e);
            }
          }
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar conteúdo da base de dados:', error);
        // Manter dados padrão em caso de erro
      }
    });
  }

  ngAfterViewInit() {
    // Adicionar a classe is-visible após 1 segundo para animação
    setTimeout(() => {
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        el.classList.add('is-visible');
      });
    }, 1000);
  }
}
