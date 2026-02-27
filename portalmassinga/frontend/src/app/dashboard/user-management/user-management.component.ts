import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { ApiClientService } from '../../services/api-client.service';

export interface User {
  id?: string;
  email: string;
  password?: string;
  fullName?: string;
  role: string;
  department?: string;
  province?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: false
})
export class UserManagementComponent implements OnInit, OnDestroy {
  @Output() navigationClick = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();
  
  // Form
  userForm: FormGroup;
  isEditMode = false;
  editingUserId: string | null = null;
  showUserForm = false;
  
  // Table
  displayedColumns: string[] = ['email', 'fullName', 'role', 'active', 'createdAt', 'actions'];
  users: User[] = [];
  filteredUsers: User[] = [];
  
  // Pagination
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 1;
  paginatedUsers: User[] = [];
  
  // Search and Filter
  searchTerm = '';
  roleFilter = '';
  activeFilter: boolean | null = null;
  
  // Loading
  isLoading = false;
  
  // Filters visibility
  filtrosVisiveis = false;
  
  // Roles (2 perfis: super-admin cria administradores)
  roles = ['administrador', 'super-administrador'];
  currentYear = new Date().getFullYear();
  
  constructor(
    private fb: FormBuilder,
    private apiClient: ApiClientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.userForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.loadUsers();
    this.setupFormListeners();
  }
  
  private setupFormListeners(): void {
    this.userForm.get('nuit')?.valueChanges.pipe(
      debounceTime(600),
      filter((n: string) => !!n && /^\d{9,}$/.test((n || '').trim()))
    ).subscribe((nuit: string) => {
      this.fetchMemberByNuit(nuit.trim());
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      nuit: [''],
      email: ['', [Validators.email]],
      fullName: [''],
      role: ['administrador', Validators.required],
      active: [true]
    });
  }
  
  fetchMemberByNuit(nuit: string): void {
    if (!nuit || !/^\d+$/.test(nuit)) return;
    this.apiClient.getApplicationByNuit(nuit).pipe(takeUntil(this.destroy$)).subscribe({
      next: (m: any) => {
        if (m && m.status === 'Approved') {
          this.userForm.patchValue({
            email: m.email || '',
            fullName: m.fullName || ''
          }, { emitEvent: false });
          this.snackBar.open('Dados do membro carregados. Pode editar se necessário.', 'Fechar', { duration: 2500 });
        } else {
          this.snackBar.open('Membro não encontrado ou não aprovado', 'Fechar', { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open('NUIT não encontrado', 'Fechar', { duration: 2000 });
      }
    });
  }
  
  loadUsers(): void {
    this.isLoading = true;
    this.apiClient.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const arr = Array.isArray(res) ? res : (res?.data || res || []);
          this.users = (arr || []).map((u: any) => this.mapApiUserToUi(u));
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err: unknown) => {
          console.error('Error loading users:', err);
          this.snackBar.open((err as Error)?.message || 'Erro ao carregar usuários', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  private mapApiUserToUi(u: any): User {
    return {
      id: u.id,
      email: u.email || '',
      fullName: u.fullName || '',
      role: u.role || 'tecnico',
      department: u.department || '',
      province: u.province || '',
      active: u.active !== false,
      createdAt: u.createdAt
    };
  }
  
  applyFilters(): void {
    let filtered = [...this.users];
    
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(search) ||
        user.fullName?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search)
      );
    }
    
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }
    
    // Active filter
    if (this.activeFilter !== null) {
      filtered = filtered.filter(user => user.active === this.activeFilter);
    }
    
    this.filteredUsers = filtered;
    this.paginaAtual = 1; // Resetar para primeira página ao filtrar
    this.atualizarPagina();
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  onRoleFilterChange(): void {
    this.applyFilters();
  }
  
  onActiveFilterChange(value: boolean | null): void {
    this.activeFilter = value;
    this.applyFilters();
  }
  
  toggleFiltros(): void {
    this.filtrosVisiveis = !this.filtrosVisiveis;
  }
  
  refresh(): void {
    this.loadUsers();
  }
  
  fecharExportMenu(): void {
    // Método para fechar menu de exportação se necessário no futuro
  }
  
  aplicarFiltros(): void {
    this.applyFilters();
  }
  
  limparFiltros(): void {
    this.searchTerm = '';
    this.roleFilter = '';
    this.activeFilter = null;
    this.applyFilters();
  }
  
  openCreateForm(): void {
    this.isEditMode = false;
    this.editingUserId = null;
    this.userForm.get('email')?.clearValidators();
    this.userForm.get('fullName')?.clearValidators();
    this.userForm.get('email')?.setValidators([Validators.email]);
    this.userForm.get('email')?.updateValueAndValidity();
    this.userForm.get('fullName')?.updateValueAndValidity();
    this.userForm.reset({
      nuit: '',
      email: '',
      fullName: '',
      role: 'administrador',
      active: true
    });
    this.userForm.get('nuit')?.enable({ emitEvent: false });
    this.showUserForm = true;
  }
  
  openEditForm(user: User): void {
    this.isEditMode = true;
    this.editingUserId = user.id || null;
    this.userForm.get('email')?.setValidators([Validators.required, Validators.email]);
    this.userForm.get('fullName')?.setValidators([Validators.required]);
    this.userForm.get('email')?.updateValueAndValidity();
    this.userForm.get('fullName')?.updateValueAndValidity();
    const roleForForm = (user.role === 'admin' || user.role === 'super-admin') ? 'super-administrador' : (user.role || 'administrador');
    this.userForm.patchValue({
      nuit: '',
      email: user.email,
      fullName: user.fullName || '',
      role: roleForForm,
      active: user.active !== undefined ? user.active : true
    });
    this.userForm.get('nuit')?.disable({ emitEvent: false });
    this.showUserForm = true;
  }
  
  closeForm(): void {
    this.showUserForm = false;
    this.isEditMode = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.userForm.get('nuit')?.enable({ emitEvent: false });
  }
  
  onSubmit(): void {
    const raw = this.userForm.getRawValue();
    const nuit = (raw.nuit || '').trim();
    
    if (this.isEditMode && this.editingUserId) {
      if (raw.email && raw.fullName) {
        this.updateUser(this.editingUserId, raw);
      } else {
        this.markFormGroupTouched();
        this.snackBar.open('Email e nome são obrigatórios', 'Fechar', { duration: 3000 });
      }
      return;
    }
    
    if (nuit) {
      if (!/^\d+$/.test(nuit)) {
        this.snackBar.open('NUIT deve conter apenas números', 'Fechar', { duration: 2000 });
        return;
      }
      this.createUser({ nuit });
    } else {
      if (!raw.email || !raw.fullName) {
        this.markFormGroupTouched();
        this.snackBar.open('Para administrador: preencha NUIT (membro) ou email e nome', 'Fechar', { duration: 3000 });
        return;
      }
      if (!raw.email.includes('@')) {
        this.snackBar.open('Email inválido', 'Fechar', { duration: 2000 });
        return;
      }
      this.createUser({ email: raw.email, fullName: raw.fullName, role: 'administrador' });
    }
  }
  
  createUser(payload: { nuit?: string; email?: string; fullName?: string; role?: string }): void {
    this.isLoading = true;
    this.apiClient.createUser(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
          this.closeForm();
          this.loadUsers();
          this.syncCurrentUserDetails(this.mapApiUserToUi(res));
        },
        error: (err: unknown) => {
          this.snackBar.open((err as Error)?.message || 'Erro ao criar usuário', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  updateUser(id: string, userData: any): void {
    this.isLoading = true;
    const payload: any = {
      email: userData.email,
      fullName: userData.fullName || '',
      role: this.mapRoleToBackend(userData.role)
    };
    this.apiClient.updateUser(id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.closeForm();
          this.loadUsers();
          this.syncCurrentUserDetails(this.mapApiUserToUi(res));
        },
        error: (err: unknown) => {
          this.snackBar.open((err as Error)?.message || 'Erro ao atualizar usuário', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  deleteUser(user: User): void {
    if (!user.id) return;
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.email}?`)) {
      this.isLoading = true;
      this.apiClient.deleteUser(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadUsers();
          },
          error: (err: unknown) => {
            this.snackBar.open((err as Error)?.message || 'Erro ao excluir usuário', 'Fechar', { duration: 3000 });
            this.isLoading = false;
          }
        });
    }
  }

  private mapRoleToBackend(role: string): string {
    if (role === 'super-administrador') return 'super-admin';
    if (role === 'administrador') return 'administrador';
    return role || 'administrador';
  }
  
  toggleUserActive(user: User): void {
    if (!user.id) {
      return;
    }
    
    const updatedUser = { ...user, active: !user.active };
    this.updateUser(user.id, updatedUser);
  }
  
  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'tecnico': 'accent',
      'administrador': 'primary',
      'super-administrador': 'warn',
      'admin': 'primary',
      'membro': ''
    };
    return colors[role?.toLowerCase?.() || role] || '';
  }
  
  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'tecnico': 'Técnico',
      'administrador': 'Administrador',
      'super-administrador': 'Super Administrador',
      'admin': 'Administrador',
      'membro': 'Membro'
    };
    const normalizedRole = role?.toLowerCase?.() || role;
    return labels[normalizedRole] || role?.replace(/(^|\s|-)\w/g, match => match.toUpperCase()) || '-';
  }
  
  formatDate(dateString?: string): string {
    if (!dateString) {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-MZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  atualizarPagina(): void {
    // Calcular total de páginas (mínimo 1 para evitar divisão por zero)
    const totalItens = this.filteredUsers.length;
    this.totalPaginas = totalItens > 0 ? Math.ceil(totalItens / this.itensPorPagina) : 1;
    
    // Garantir que página atual não exceda o total
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = this.totalPaginas;
    }
    
    // Se não houver dados, garantir que página atual seja 1
    if (totalItens === 0) {
      this.paginaAtual = 1;
      this.paginatedUsers = [];
      return;
    }
    
    // Calcular índices para a página atual
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    
    // Obter apenas os itens da página atual
    this.paginatedUsers = this.filteredUsers.slice(inicio, fim);
  }
  
  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPagina();
    }
  }
  
  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPagina();
    }
  }
  
  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }
  
  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  goBackToDashboard(): void {
    this.navigationClick.emit({ id: 'dashboard', label: 'Dashboard', icon: 'home', route: 'dashboard', active: true });
  }

  private syncCurrentUserDetails(user: User): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (!savedEmail || !user.email) return;
    if (savedEmail.toLowerCase().trim() !== user.email.toLowerCase().trim()) return;

    if (user.fullName?.trim()) {
      localStorage.setItem('userFullName', user.fullName.trim());
      localStorage.setItem('userName', user.fullName.trim());
    }
    if (user.role?.trim()) localStorage.setItem('userRole', user.role.trim());
  }
}

