import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MultiRoleAccessControlComponent } from './multi-role-access-control.component';
import { RoleManagementService } from '../../core/services/role-management.service';

describe('MultiRoleAccessControlComponent', () => {
  let component: MultiRoleAccessControlComponent;
  let fixture: ComponentFixture<MultiRoleAccessControlComponent>;
  let mockRoleService: jasmine.SpyObj<RoleManagementService>;

  beforeEach(async () => {
    const roleServiceSpy = jasmine.createSpyObj('RoleManagementService', [
      'getRoles',
      'getAvailableEmployees',
      'getRoleTypes',
      'getAccessLevels',
      'getDepartments',
      'createRole',
      'updateRole',
      'deleteRole',
      'exportRoles'
    ]);

    await TestBed.configureTestingModule({
      imports: [MultiRoleAccessControlComponent, ReactiveFormsModule],
      providers: [
        { provide: RoleManagementService, useValue: roleServiceSpy }
      ]
    }).compileComponents();

    mockRoleService = TestBed.inject(RoleManagementService) as jasmine.SpyObj<RoleManagementService>;
    
    // Setup default mock returns
    mockRoleService.getRoles.and.returnValue(of([]));
    mockRoleService.getAvailableEmployees.and.returnValue(of([]));
    mockRoleService.getRoleTypes.and.returnValue(['Super Admin', 'Finance Manager', 'Dispatcher']);
    mockRoleService.getAccessLevels.and.returnValue(['Full', 'Edit', 'Read']);
    mockRoleService.getDepartments.and.returnValue(['Operations', 'Finance', 'Admin']);

    fixture = TestBed.createComponent(MultiRoleAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on component creation', () => {
    expect(component.filterForm).toBeDefined();
    expect(component.roleForm).toBeDefined();
    expect(component.filterForm.get('search')).toBeTruthy();
    expect(component.roleForm.get('employeeId')).toBeTruthy();
  });

  it('should load roles on init', () => {
    expect(mockRoleService.getRoles).toHaveBeenCalled();
  });

  it('should open add role modal', () => {
    component.openAddRoleModal();
    expect(component.showAddRoleModal).toBe(true);
    expect(component.editingRole).toBeNull();
  });

  it('should close modal and reset form', () => {
    component.showAddRoleModal = true;
    component.editingRole = {} as any;
    
    component.closeModal();
    
    expect(component.showAddRoleModal).toBe(false);
    expect(component.editingRole).toBeNull();
  });

  it('should apply filters correctly', () => {
    const mockRoles = [
      {
        id: '1',
        employeeName: 'John Doe',
        email: 'john@company.com',
        roleType: 'Dispatcher' as any,
        accessLevel: 'Edit' as any,
        department: 'Operations',
        employeeId: 'emp1',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin',
        isActive: true
      }
    ];
    
    component.roles = mockRoles;
    component['applyFilters']({ search: 'John' });
    
    expect(component.filteredRoles.length).toBe(1);
    expect(component.filteredRoles[0].employeeName).toBe('John Doe');
  });

  it('should handle pagination correctly', () => {
    component.pageSize = 5;
    component.totalItems = 20;
    
    expect(component.totalPages).toBe(4);
    
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    
    component.onPageChange(0); // Invalid page
    expect(component.currentPage).toBe(2); // Should not change
  });

  it('should handle sorting', () => {
    component.onSort('employeeName');
    expect(component.sortField).toBe('employeeName');
    expect(component.sortDirection).toBe('asc');
    
    component.onSort('employeeName'); // Click again
    expect(component.sortDirection).toBe('desc');
  });

  it('should validate role form', () => {
    expect(component.roleForm.valid).toBe(false);
    
    component.roleForm.patchValue({
      employeeId: 'emp1',
      roleType: 'Dispatcher',
      accessLevel: 'Edit'
    });
    
    expect(component.roleForm.valid).toBe(true);
  });
});
