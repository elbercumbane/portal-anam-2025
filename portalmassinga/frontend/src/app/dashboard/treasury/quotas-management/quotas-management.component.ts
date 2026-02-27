import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiClientService } from '../../../services/api-client.service';

interface MemberQuotaStatus {
  memberApplicationId: string;
  nome: string;
  email: string;
  celular: string;
  nuit: string;
  situacaoFinanceira: string;
  mesesEmDivida: number;
  valorEmDivida: number;
  ultimoMesPago: string | null;
}

interface QuotaPayment {
  id: string;
  year: number;
  month: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  status: string;
}

@Component({
  selector: 'app-quotas-management',
  standalone: false,
  templateUrl: './quotas-management.component.html',
  styleUrls: ['./quotas-management.component.scss']
})
export class QuotasManagementComponent implements OnInit {
  @Output() navigationClick = new EventEmitter<any>();

  members: MemberQuotaStatus[] = [];
  filteredMembers: MemberQuotaStatus[] = [];
  activeTab: 'dividas' | 'em-dia' | 'todos' = 'todos';
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  selectedMemberForStatement: MemberQuotaStatus | null = null;
  statementPayments: QuotaPayment[] = [];
  showStatementModal = false;
  statementLoading = false;

  private readonly MESES = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  constructor(
    private apiClient: ApiClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const situacao = this.activeTab === 'dividas' ? 'COM_DIVIDAS' : this.activeTab === 'em-dia' ? 'EM_DIA' : undefined;
    this.apiClient.getMembersQuotaSummary(situacao, this.searchTerm.trim() || undefined).subscribe({
      next: (res: any) => {
        this.members = Array.isArray(res) ? res : (res?.data || res?.body || []);
        this.filterMembers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erro ao carregar dados';
        this.members = [];
        this.filteredMembers = [];
        this.isLoading = false;
      }
    });
  }

  filterMembers(): void {
    let list = [...this.members];

    if (this.activeTab === 'dividas') {
      list = list.filter(m => m.situacaoFinanceira === 'COM_DIVIDAS');
    } else if (this.activeTab === 'em-dia') {
      list = list.filter(m => m.situacaoFinanceira === 'EM_DIA');
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(m =>
        (m.nome || '').toLowerCase().includes(term) ||
        (m.email || '').toLowerCase().includes(term) ||
        (m.celular || '').includes(term) ||
        (m.nuit || '').includes(term)
      );
    }

    this.filteredMembers = list;
  }

  onTabChange(tab: 'dividas' | 'em-dia' | 'todos'): void {
    this.activeTab = tab;
    this.filterMembers();
  }

  onSearchChange(): void {
    this.filterMembers();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getSituacaoLabel(sit: string): string {
    return sit === 'COM_DIVIDAS' ? 'Com Dívidas' : 'Em Dia';
  }

  getSituacaoClass(sit: string): string {
    return sit === 'COM_DIVIDAS' ? 'situacao-dividas' : 'situacao-em-dia';
  }

  viewStatement(member: MemberQuotaStatus): void {
    this.selectedMemberForStatement = member;
    this.showStatementModal = true;
    this.statementLoading = true;
    this.apiClient.getMemberQuotaStatement(member.memberApplicationId).subscribe({
      next: (res: any) => {
        this.statementPayments = Array.isArray(res) ? res : (res?.data || res?.body || []);
        this.statementLoading = false;
      },
      error: () => {
        this.statementPayments = [];
        this.statementLoading = false;
      }
    });
  }

  closeStatementModal(): void {
    this.showStatementModal = false;
    this.selectedMemberForStatement = null;
    this.statementPayments = [];
  }

  getMonthName(month: number): string {
    return this.MESES[month] || '';
  }

  getCountDividas(): number {
    return this.members.filter(m => m.situacaoFinanceira === 'COM_DIVIDAS').length;
  }

  getCountEmDia(): number {
    return this.members.filter(m => m.situacaoFinanceira === 'EM_DIA').length;
  }
}
