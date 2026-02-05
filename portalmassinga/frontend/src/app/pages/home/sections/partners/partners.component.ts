import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiClientService } from '../../../../services/api-client.service';

@Component({
  selector: 'home-parceiros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersSectionComponent implements OnInit {
  private apiClient = inject(ApiClientService);
  
  title = 'Nossos Parceiros';
  subtitle = 'Organizações que acreditam na nossa missão';
  partnerImages: string[] = ['/assets/parceiros.png', '/assets/parceiros2.png'];

  /**
   * Formata o título destacando a palavra "Parceiros"
   */
  getFormattedTitle(): string {
    return this.title.replace('Parceiros', '<span class="highlight">Parceiros</span>');
  }

  ngOnInit() {
    // Carregar dados de parceiros da base de dados
    this.loadPartnersFromDatabase();
  }

  /**
   * Carrega dados de parceiros da base de dados
   */
  loadPartnersFromDatabase(): void {
    this.apiClient.getHomeContent(true).subscribe({
      next: (contents: any[]) => {
        // Buscar seção de parceiros
        const partnersContent = contents.find(c => c.sectionKey === 'partners_section');
        
        if (partnersContent) {
          this.title = partnersContent.title || this.title;
          this.subtitle = partnersContent.subtitle || this.subtitle;
          
          if (partnersContent.metadata) {
            try {
              const metadata = JSON.parse(partnersContent.metadata);
              if (metadata.images && Array.isArray(metadata.images)) {
                this.partnerImages = metadata.images;
              }
            } catch (e) {
              console.warn('Erro ao parsear metadata de parceiros:', e);
            }
          }
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar parceiros da base de dados:', error);
        // Manter dados padrão em caso de erro
      }
    });
  }
}
