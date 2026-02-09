import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';

interface SupporterRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  supportType: string;
  description: string;
  anonymous: boolean;
  createdAt: string;
  registrationDevice?: string;
  registrationBrowser?: string;
}

@Component({
  selector: 'app-supporters-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class SupportersManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  supporters: SupporterRow[] = [];
  filteredSupporters: SupporterRow[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  selectedSupporter: SupporterRow | null = null;
  showDetailsModal = false;

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadSupporters();
  }

  loadSupporters(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiClient.getSupporterRegistrations().subscribe({
      next: (response: any) => {
        const list = Array.isArray(response) ? response : (response?.data ?? response?.body ?? []);
        this.supporters = (list || []).map((r: any) => ({
          id: r.id,
          fullName: r.fullName ?? r.nome ?? '',
          email: r.email ?? '',
          phone: r.phone ?? r.contacto ?? '',
          supportType: r.supportType ?? r.tipoApoio ?? '',
          description: r.description ?? r.descricao ?? '',
          anonymous: r.anonymous === true || r.anonimato === 'sim',
          createdAt: r.createdAt ?? '',
          registrationDevice: r.registrationDevice,
          registrationBrowser: r.registrationBrowser
        }));
        this.filteredSupporters = [...this.supporters];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Erro ao carregar registos de apoiantes.';
        this.supporters = [];
        this.filteredSupporters = [];
        this.isLoading = false;
      }
    });
  }

  filterSupporters(): void {
    const term = (this.searchTerm || '').toLowerCase();
    this.filteredSupporters = this.supporters.filter(s =>
      !term ||
      (s.fullName || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.phone || '').includes(term) ||
      (s.supportType || '').toLowerCase().includes(term)
    );
  }

  onSearchChange(): void {
    this.filterSupporters();
  }

  viewDetails(s: SupporterRow): void {
    this.selectedSupporter = s;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSupporter = null;
  }

  getSupportTypeLabel(value: string): string {
    const map: Record<string, string> = {
      'valores-monetarios': 'Valores Monetários',
      'financiamento': 'Financiamento',
      'bens': 'Bens',
      'servicos': 'Serviços',
      'outros': 'Outros'
    };
    return map[value] || value || '-';
  }
}
