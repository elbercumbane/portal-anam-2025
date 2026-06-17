import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiClientService } from '../../../services/api-client.service';

interface MemberListItem {
  id: string;
  nome: string;
  email: string;
  celular: string;
  telefone?: string;
  profissao: string;
  cidade: string;
  bairro: string;
  estadoCivil: string;
  status: string;
  foto?: string;
  dataCadastro?: string;
}

type SortOption = 'nome-asc' | 'nome-desc' | 'cidade-asc';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss'
})
export class MembersListComponent implements OnInit {
  members: MemberListItem[] = [];
  filteredMembers: MemberListItem[] = [];
  searchTerm = '';
  sortBy: SortOption = 'nome-asc';
  cityFilter = 'all';
  isLoading = false;
  errorMessage = '';
  selectedMember: MemberListItem | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  readonly avatarColors = [
    '#10B981', '#059669', '#14B8A6', '#0D9488', '#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B'
  ];

  constructor(
    private apiClient: ApiClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  get totalMembers(): number {
    return this.members.length;
  }

  get visibleCount(): number {
    return this.filteredMembers.length;
  }

  get availableCities(): string[] {
    const cities = new Set(
      this.members
        .map(m => m.cidade)
        .filter(c => c && c !== '-')
    );
    return Array.from(cities).sort((a, b) => a.localeCompare(b, 'pt'));
  }

  loadMembers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiClient.getMembers('Aprovado').subscribe({
      next: (response: any) => {
        const membros = Array.isArray(response) ? response : [];
        this.members = membros
          .map((m: any) => this.mapMember(m))
          .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erro ao carregar lista de membros.';
        this.members = [];
        this.filteredMembers = [];
        this.isLoading = false;
      }
    });
  }

  private mapMember(m: any): MemberListItem {
    return {
      id: m.id,
      nome: m.nomeCompleto || m.nome || 'Membro ANAM',
      email: m.email || '',
      celular: m.celular || '',
      telefone: m.telefone || '',
      profissao: m.profissao || 'Não informada',
      cidade: m.cidade || 'Não informada',
      bairro: m.bairro || '',
      estadoCivil: m.estadoCivil || '',
      status: m.status || 'Aprovado',
      foto: m.foto,
      dataCadastro: m.dataCadastro
    };
  }

  onFiltersChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    let result = this.members.filter(member => {
      const matchesSearch = !term ||
        member.nome.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.celular.includes(term) ||
        member.profissao.toLowerCase().includes(term) ||
        member.cidade.toLowerCase().includes(term) ||
        member.bairro.toLowerCase().includes(term);

      const matchesCity = this.cityFilter === 'all' || member.cidade === this.cityFilter;
      return matchesSearch && matchesCity;
    });

    result = this.sortMembers(result);
    this.filteredMembers = result;
  }

  private sortMembers(list: MemberListItem[]): MemberListItem[] {
    const sorted = [...list];
    switch (this.sortBy) {
      case 'nome-desc':
        return sorted.sort((a, b) => b.nome.localeCompare(a.nome, 'pt'));
      case 'cidade-asc':
        return sorted.sort((a, b) =>
          a.cidade.localeCompare(b.cidade, 'pt') || a.nome.localeCompare(b.nome, 'pt')
        );
      case 'nome-asc':
      default:
        return sorted.sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.cityFilter = 'all';
    this.sortBy = 'nome-asc';
    this.applyFilters();
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'AN';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  }

  hasValidEmail(email: string): boolean {
    return !!email && !email.includes('@anam-import.mz') && email !== '-';
  }

  hasValidPhone(phone: string): boolean {
    return !!phone && phone !== '000000000' && phone !== '-';
  }

  formatPhone(phone: string): string {
    if (!this.hasValidPhone(phone)) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 9) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    }
    return phone;
  }

  openMember(member: MemberListItem): void {
    this.selectedMember = member;
  }

  closeMember(): void {
    this.selectedMember = null;
  }

  voltar(): void {
    this.router.navigate(['/membros']);
  }
}
