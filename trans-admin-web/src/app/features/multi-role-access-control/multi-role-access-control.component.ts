import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { RoleManagementService } from '../../core/services/role-management.service';
import { 
  Role, 
  Employee, 
  RoleAssignment, 
  RoleFilter, 
  RoleType, 
  AccessLevel, 
  Department,
  Permission,
  DEFAULT_PERMISSIONS
} from '../../core/models/role.model';

@Component({
  selector: 'app-multi-role-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multi-role-access-control.component.html',
  styleUrls: ['./multi-role-access-control.component.scss']
})
export class MultiRoleAccessControlComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  roles: Role[] = [];
  filteredRoles: Role[] = [];
  availableEmployees: Employee[] = [];
  
  // Form controls
  filterForm!: FormGroup;
  roleForm!: FormGroup;
  
  // UI state
  isLoading = false;
  showAddRoleModal = false;
  showPermissionsMatrix = false;
  editingRole: Role | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  // Filter options
  roleTypes: RoleType[] = [];
  accessLevels: AccessLevel[] = [];
  departments: Department[] = [];
  
  // Sorting
  sortField: keyof Role = 'employeeName';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Notifications
  notification: { type: 'success' | 'error' | 'warning'; message: string } | null = null;

  constructor(
    private roleService: RoleManagementService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadAvailableEmployees();
    this.loadFilterOptions();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.filterForm = this.fb.group({
      search: [''],
      roleType: [''],
      accessLevel: [''],
      department: ['']
    });

    this.roleForm = this.fb.group({
      employeeId: ['', Validators.required],
      roleType: ['', Validators.required],
      accessLevel: ['', Validators.required]
    });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(filters => {
        this.applyFilters(filters);
      });
  }

  private loadRoles(): void {
    this.isLoading = true;
    this.roleService.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles) => {
          this.roles = roles;
          this.applyFilters(this.filterForm.value);
          this.isLoading = false;
        },
        error: (error) => {
          this.showNotification('error', 'Failed to load roles');
          this.isLoading = false;
        }
      });
  }

  private loadAvailableEmployees(): void {
    this.roleService.getAvailableEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => {
          this.availableEmployees = employees;
        },
        error: (error) => {
          console.error('Failed to load available employees:', error);
        }
      });
  }

  private loadFilterOptions(): void {
    this.roleTypes = this.roleService.getRoleTypes();
    this.accessLevels = this.roleService.getAccessLevels();
    this.departments = this.roleService.getDepartments();
  }

  private applyFilters(filters: RoleFilter): void {
    let filtered = [...this.roles];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(role => 
        role.employeeName.toLowerCase().includes(searchTerm) ||
        role.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.roleType) {
      filtered = filtered.filter(role => role.roleType === filters.roleType);
    }

    if (filters.accessLevel) {
      filtered = filtered.filter(role => role.accessLevel === filters.accessLevel);
    }

    if (filters.department) {
      filtered = filtered.filter(role => role.department === filters.department);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortField] as string;
      const bValue = b[this.sortField] as string;
      const comparison = aValue.localeCompare(bValue);
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredRoles = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1; // Reset to first page when filtering
  }

  get paginatedRoles(): Role[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredRoles.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onSort(field: keyof Role): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters(this.filterForm.value);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddRoleModal(): void {
    this.editingRole = null;
    this.roleForm.reset();
    this.showAddRoleModal = true;
    this.showPermissionsMatrix = false;
  }

  openEditRoleModal(role: Role): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      employeeId: role.employeeId,
      roleType: role.roleType,
      accessLevel: role.accessLevel
    });
    this.showAddRoleModal = true;
    this.showPermissionsMatrix = false;
  }

  closeModal(): void {
    this.showAddRoleModal = false;
    this.editingRole = null;
    this.roleForm.reset();
    this.showPermissionsMatrix = false;
  }

  togglePermissionsMatrix(): void {
    this.showPermissionsMatrix = !this.showPermissionsMatrix;
  }

  getDefaultPermissions(roleType: RoleType): Permission[] {
    return DEFAULT_PERMISSIONS[roleType] || [];
  }

  onSubmitRole(): void {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      const employee = this.availableEmployees.find(emp => emp.id === formValue.employeeId) ||
                      (this.editingRole ? { name: this.editingRole.employeeName } : null);
      
      if (!employee) {
        this.showNotification('error', 'Employee not found');
        return;
      }

      const roleAssignment: RoleAssignment = {
        employeeId: formValue.employeeId,
        employeeName: employee.name,
        roleType: formValue.roleType,
        accessLevel: formValue.accessLevel,
        permissions: this.getDefaultPermissions(formValue.roleType)
      };

      if (this.editingRole) {
        this.updateRole(this.editingRole.id, roleAssignment);
      } else {
        this.createRole(roleAssignment);
      }
    }
  }

  private createRole(roleAssignment: RoleAssignment): void {
    this.isLoading = true;
    this.roleService.createRole(roleAssignment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (role) => {
          this.showNotification('success', 'New role added successfully');
          this.loadRoles();
          this.loadAvailableEmployees();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          this.showNotification('error', 'Failed to add role');
          this.isLoading = false;
        }
      });
  }

  private updateRole(roleId: string, roleAssignment: RoleAssignment): void {
    this.isLoading = true;
    this.roleService.updateRole(roleId, roleAssignment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (role) => {
          this.showNotification('success', 'Role updated successfully');
          this.loadRoles();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          this.showNotification('error', 'Failed to update role');
          this.isLoading = false;
        }
      });
  }

  onDeleteRole(role: Role): void {
    if (confirm(`Are you sure you want to remove ${role.employeeName}'s role?`)) {
      this.roleService.deleteRole(role.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showNotification('success', 'Role removed successfully');
            this.loadRoles();
            this.loadAvailableEmployees();
          },
          error: (error) => {
            this.showNotification('error', 'Failed to remove role');
          }
        });
    }
  }

  onExportRoles(format: 'csv' | 'pdf'): void {
    this.roleService.exportRoles(format)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `roles-export.${format}`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.showNotification('success', `Roles exported as ${format.toUpperCase()}`);
        },
        error: (error) => {
          this.showNotification('error', 'Failed to export roles');
        }
      });
  }

  getAccessLevelClass(level: AccessLevel): string {
    switch (level) {
      case 'Full': return 'access-full';
      case 'Edit': return 'access-edit';
      case 'Read': return 'access-read';
      default: return '';
    }
  }

  getAccessLevelIcon(level: AccessLevel): string {
    switch (level) {
      case 'Full': return '🟢';
      case 'Edit': return '🟡';
      case 'Read': return '⚪';
      default: return '';
    }
  }

  private showNotification(type: 'success' | 'error' | 'warning', message: string): void {
    this.notification = { type, message };
    setTimeout(() => {
      this.notification = null;
    }, 5000);
  }

  dismissNotification(): void {
    this.notification = null;
  }
}
