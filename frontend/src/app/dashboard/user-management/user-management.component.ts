import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ApiService removido - sem backend

export interface User {
  id?: number;
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
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  @Output() navigationClick = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();
  
  // Form
  userForm: FormGroup;
  isEditMode = false;
  editingUserId: number | null = null;
  showUserForm = false;
  
  // Table
  displayedColumns: string[] = ['email', 'fullName', 'department', 'province', 'role', 'active', 'createdAt', 'actions'];
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
  departmentFilter = '';
  activeFilter: boolean | null = null;
  
  // Loading
  isLoading = false;
  
  // Filters visibility
  filtrosVisiveis = false;
  
  // Roles (3 níveis de permissão)
  roles = ['tecnico', 'administrador', 'super-administrador'];
  
  // Departamentos
  departments = ['Delegados', 'DSI', 'SPII', 'Sobreloja', 'DAU'];
  
  // Províncias de Moçambique
  provinces = [
    'Maputo Cidade',
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Niassa',
    'Cabo Delgado'
  ];
  
  // Flag para mostrar campo de província
  showProvinceField = false;
  readonly centralDepartments = ['DSI', 'DAU', 'Sobreloja'];
  
  constructor(
    private fb: FormBuilder,
    // ApiService removido
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
    // Escutar mudanças no campo department
    this.userForm.get('department')?.valueChanges.subscribe((department: string) => {
      this.onDepartmentChange();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email, this.cedsifEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
      department: ['', Validators.required],
      province: [''],
      role: ['tecnico', Validators.required],
      active: [true]
    });
  }
  
  private updateFormForEdit(): void {
    // No modo de edição, senha é opcional
    // Se houver valor, valida apenas o comprimento mínimo
    // Se estiver vazia, não valida nada
    const passwordControl = this.userForm.get('password');
    if (passwordControl) {
      if (passwordControl.value && passwordControl.value.trim() !== '') {
        // Se houver senha, valida apenas comprimento mínimo
        passwordControl.setValidators([Validators.minLength(6)]);
      } else {
        // Se estiver vazia, remove todas as validações
        passwordControl.clearValidators();
      }
      passwordControl.updateValueAndValidity();
    }
  }
  
  private updateFormForCreate(): void {
    // No modo de criação, senha é obrigatória
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }
  
  private cedsifEmailValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const email = control.value.toLowerCase();
    if (!email.endsWith('@cedsif.gov.mz')) {
      return { invalidDomain: true };
    }
    return null;
  }
  
  loadUsers(): void {
    this.isLoading = true;
    Promise.resolve([]) // Sem backend - dados vazios
      .then((users: User[]) => {
        this.users = users || [];
        this.applyFilters();
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      });
  }
  
  applyFilters(): void {
    let filtered = [...this.users];
    
    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(search) ||
        user.fullName?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search) ||
        user.department?.toLowerCase().includes(search) ||
        user.province?.toLowerCase().includes(search)
      );
    }
    
    // Role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }
    
    // Department filter
    if (this.departmentFilter) {
      filtered = filtered.filter(user => user.department === this.departmentFilter);
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
  
  onDepartmentFilterChange(): void {
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
    this.departmentFilter = '';
    this.activeFilter = null;
    this.applyFilters();
  }
  
  onDepartmentChange(): void {
    const department = this.userForm.get('department')?.value;
    const provinceControl = this.userForm.get('province');
    
    if (!provinceControl) {
      return;
    }
    
    this.showProvinceField = department === 'Delegados';
    const forceCentralProvince = this.centralDepartments.includes(department);
    
    if (this.showProvinceField) {
      provinceControl.enable({ emitEvent: false });
      provinceControl.setValidators([Validators.required]);
    } else {
      provinceControl.clearValidators();
      if (forceCentralProvince) {
        provinceControl.setValue('Central', { emitEvent: false });
        provinceControl.disable({ emitEvent: false });
      } else {
        provinceControl.enable({ emitEvent: false });
        provinceControl.setValue('', { emitEvent: false });
    }
    }
    
    provinceControl.updateValueAndValidity();
  }
  
  openCreateForm(): void {
    this.isEditMode = false;
    this.editingUserId = null;
    this.showProvinceField = false;
    this.userForm.reset({
      email: '',
      password: '',
      fullName: '',
      department: '',
      province: '',
      role: 'tecnico',
      active: true
    });
    this.userForm.get('province')?.enable({ emitEvent: false });
    this.updateFormForCreate(); // Senha obrigatória no modo de criação
    this.userForm.get('province')?.clearValidators();
    this.userForm.get('province')?.updateValueAndValidity();
    this.showUserForm = true;
  }
  
  openEditForm(user: User): void {
    this.isEditMode = true;
    this.editingUserId = user.id || null;
    const department = user.department || '';
    this.showProvinceField = department === 'Delegados';
    
    const isCentralDepartment = this.centralDepartments.includes(department);
    this.userForm.patchValue({
      email: user.email,
      password: '', // Don't show password
      fullName: user.fullName || '',
      department: department,
      province: isCentralDepartment ? (user.province || 'Central') : (user.province || ''),
      role: user.role || 'tecnico',
      active: user.active !== undefined ? user.active : true
    });
    
    // Senha opcional no modo de edição
    this.updateFormForEdit();
    
    // Configure province field validators
    this.onDepartmentChange();
    
    this.showUserForm = true;
  }
  
  closeForm(): void {
    this.showUserForm = false;
    this.isEditMode = false;
    this.editingUserId = null;
    this.showProvinceField = false;
    this.userForm.reset();
    // Restore password validation for create mode
    this.updateFormForCreate();
    // Clear province validators
    this.userForm.get('province')?.clearValidators();
    this.userForm.get('province')?.enable({ emitEvent: false });
    this.userForm.get('province')?.updateValueAndValidity();
  }
  
  onSubmit(): void {
    // No modo de edição, garantir que a senha seja opcional
    if (this.isEditMode) {
      const passwordControl = this.userForm.get('password');
      if (passwordControl) {
        const passwordValue = passwordControl.value;
        if (!passwordValue || passwordValue.trim() === '') {
          // Se estiver vazia, remover todas as validações
          passwordControl.clearValidators();
          passwordControl.updateValueAndValidity();
        } else {
          // Se houver senha, validar apenas comprimento mínimo
          passwordControl.setValidators([Validators.minLength(6)]);
          passwordControl.updateValueAndValidity();
        }
      }
    }
    
    if (this.userForm.valid) {
      const userData = { ...this.userForm.getRawValue() };
      
      // Remove password if empty in edit mode
      if (this.isEditMode && (!userData.password || userData.password.trim() === '')) {
        delete userData.password;
      }
      
      if (this.isEditMode && this.editingUserId) {
        this.updateUser(this.editingUserId, userData);
      } else {
        this.createUser(userData);
      }
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
    }
  }
  
  createUser(userData: User): void {
    this.isLoading = true;
    Promise.resolve({ id: Date.now(), ...userData }) // Sem backend - simulado
      .then((user: User) => {
        this.snackBar.open('Usuário criado com sucesso!', 'Fechar', { duration: 3000 });
        this.closeForm();
        this.loadUsers();
        this.syncCurrentUserDetails(user);
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        const errorMessage = error?.error?.message || 'Erro ao criar usuário';
        this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        this.isLoading = false;
      });
  }
  
  updateUser(id: number, userData: User): void {
    this.isLoading = true;
    Promise.resolve({ id, ...userData }) // Sem backend - simulado
      .then((user: User) => {
        this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.closeForm();
        this.loadUsers();
        this.syncCurrentUserDetails(user);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        const errorMessage = error?.error?.message || 'Erro ao atualizar usuário';
        this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        this.isLoading = false;
      });
  }
  
  deleteUser(user: User): void {
    if (!user.id) {
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.email}?`)) {
      this.isLoading = true;
      Promise.resolve({}) // Sem backend - simulado
        .then(() => {
          this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.loadUsers();
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Erro ao excluir usuário', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        });
    }
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
      'super-administrador': 'warn'
    };
    return colors[role] || '';
  }
  
  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'tecnico': 'Técnico',
      'administrador': 'Administrador',
      'super-administrador': 'Super Administrador'
    };
    const normalizedRole = role?.toLowerCase?.() || role;
    return labels[normalizedRole] || role?.replace(/(^|\s|-)\w/g, match => match.toUpperCase()) || '-';
  }
  
  getDepartmentLabel(department: string | undefined): string {
    if (!department) return '';
    return department || '-';
  }
  
  getProvinceLabel(province: string): string {
    return province || '-';
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
    if (control?.hasError('invalidDomain')) {
      return 'Apenas emails do domínio @cedsif.gov.mz são permitidos';
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
    if (!savedEmail || !user.email) {
      return;
    }

    const targetEmail = savedEmail.toLowerCase().trim();
    const updatedEmail = user.email.toLowerCase().trim();
    if (targetEmail !== updatedEmail) {
      return;
    }

    if (user.fullName && user.fullName.trim() !== '') {
      localStorage.setItem('userFullName', user.fullName.trim());
      localStorage.setItem('userName', user.fullName.trim());
    }

    if (user.department && user.department.trim() !== '') {
      localStorage.setItem('userDepartment', user.department.trim());
    } else {
      localStorage.removeItem('userDepartment');
    }

    if (user.province && user.province.trim() !== '') {
      localStorage.setItem('userProvince', user.province.trim());
    } else {
      localStorage.removeItem('userProvince');
    }

    if (user.role && user.role.trim() !== '') {
      localStorage.setItem('userRole', user.role.trim());
    } else {
      localStorage.removeItem('userRole');
    }
  }
}

