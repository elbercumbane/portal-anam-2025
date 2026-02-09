import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../../services/api-client.service';

interface SympathizerRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  areaInterest: string;
  acceptCommunications: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-sympathizers-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class SympathizersManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  sympathizers: SympathizerRow[] = [];
  filteredSympathizers: SympathizerRow[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  selectedSympathizer: SympathizerRow | null = null;
  showDetailsModal = false;

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadSympathizers();
  }

  loadSympathizers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiClient.getSympathizerRegistrations().subscribe({
      next: (response: any) => {
        const list = Array.isArray(response) ? response : (response?.data ?? response?.body ?? []);
        this.sympathizers = (list || []).map((r: any) => ({
          id: r.id,
          fullName: r.fullName ?? r.nome ?? '',
          email: r.email ?? '',
          phone: r.phone ?? r.telefone ?? '',
          areaInterest: r.areaInterest ?? r.area_interest ?? 'Geral',
          acceptCommunications: r.acceptCommunications === true,
          createdAt: r.createdAt ?? ''
        }));
        this.filteredSympathizers = [...this.sympathizers];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Erro ao carregar registos de simpatizantes.';
        this.sympathizers = [];
        this.filteredSympathizers = [];
        this.isLoading = false;
      }
    });
  }

  filterSympathizers(): void {
    const term = (this.searchTerm || '').toLowerCase();
    this.filteredSympathizers = this.sympathizers.filter(s =>
      !term ||
      (s.fullName || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.phone || '').includes(term) ||
      (s.areaInterest || '').toLowerCase().includes(term)
    );
  }

  onSearchChange(): void {
    this.filterSympathizers();
  }

  viewDetails(s: SympathizerRow): void {
    this.selectedSympathizer = s;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedSympathizer = null;
  }
}
