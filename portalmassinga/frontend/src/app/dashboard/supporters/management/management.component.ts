import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiClientService } from '../../../services/api-client.service';

interface SupporterRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  phone2: string;
  phoneWhatsApp: boolean;
  phone2WhatsApp: boolean;
  supportType: string;
  description: string;
  anonymous: boolean;
  wantsAccount: boolean;
  fundsConfirmed: boolean;
  accountCreated: boolean;
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
  filterQuerAcesso = '';
  filterFundosConfirmados = '';
  filterContaCriada = '';
  isLoading = false;
  errorMessage = '';
  selectedSupporter: SupporterRow | null = null;
  showDetailsModal = false;

  constructor(
    private apiClient: ApiClientService,
    private snackBar: MatSnackBar
  ) {}

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
          phone2: r.phone2 ?? '',
          phoneWhatsApp: r.phoneWhatsApp === true,
          phone2WhatsApp: r.phone2WhatsApp === true,
          supportType: r.supportType ?? r.tipoApoio ?? '',
          description: r.description ?? r.descricao ?? '',
          anonymous: r.anonymous === true || r.anonimato === 'sim',
          wantsAccount: r.wantsAccount === true,
          fundsConfirmed: r.fundsConfirmed === true,
          accountCreated: r.accountCreated === true,
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
    let result = this.supporters.filter(s =>
      !term ||
      (s.fullName || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.phone || '').includes(term) ||
      (s.phone2 || '').includes(term) ||
      (s.supportType || '').toLowerCase().includes(term)
    );
    if (this.filterQuerAcesso === 'sim') result = result.filter(s => s.wantsAccount);
    if (this.filterQuerAcesso === 'nao') result = result.filter(s => !s.wantsAccount);
    if (this.filterFundosConfirmados === 'sim') result = result.filter(s => s.fundsConfirmed);
    if (this.filterFundosConfirmados === 'nao') result = result.filter(s => !s.fundsConfirmed);
    if (this.filterContaCriada === 'sim') result = result.filter(s => s.accountCreated);
    if (this.filterContaCriada === 'nao') result = result.filter(s => !s.accountCreated);
    this.filteredSupporters = result;
  }

  applyFilters(): void {
    this.filterSupporters();
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

  confirmFunds(s: SupporterRow): void {
    if (!confirm('Confirmar que os fundos/doação deste apoiante foram recebidos e canalizados?')) return;
    this.apiClient.patchSupporterRegistration(s.id, { fundsConfirmed: true }).subscribe({
      next: () => {
        this.snackBar.open('Fundos confirmados com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.loadSupporters();
        if (this.selectedSupporter?.id === s.id) this.closeDetailsModal();
      },
      error: () => this.snackBar.open('Erro ao confirmar fundos.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] })
    });
  }

  createAccount(s: SupporterRow): void {
    if (!s.fundsConfirmed) {
      this.snackBar.open('Primeiro confirme a entrega dos fundos antes de criar a conta.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] });
      return;
    }
    if (!confirm('Criar acesso à Área do Apoiante para ' + (s.anonymous ? 'este apoiante' : s.fullName) + '?')) return;
    this.apiClient.patchSupporterRegistration(s.id, { accountCreated: true }).subscribe({
      next: () => {
        this.snackBar.open('Conta criada com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        this.loadSupporters();
        if (this.selectedSupporter?.id === s.id) this.closeDetailsModal();
      },
      error: () => this.snackBar.open('Erro ao criar conta.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] })
    });
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

  truncateDesc(text: string | null | undefined, maxLen: number): string {
    if (text == null || text === '') return '-';
    const t = String(text).trim();
    if (t.length <= maxLen) return t;
    return t.slice(0, maxLen) + '…';
  }
}
