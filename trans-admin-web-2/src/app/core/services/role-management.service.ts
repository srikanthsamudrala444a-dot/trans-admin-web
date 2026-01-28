import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  Role, 
  Employee, 
  RoleAssignment, 
  RoleFilter, 
  RoleAuditLog,
  RoleType,
  AccessLevel,
  Department,
  DEFAULT_PERMISSIONS
} from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {
  private apiUrl = 'http://localhost:3000/api';
  
  // Mock data for development
  private mockRoles: Role[] = [
    {
      id: '1',
      employeeId: 'emp001',
      employeeName: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Operations',
      roleType: 'Dispatcher',
      accessLevel: 'Edit',
      permissions: DEFAULT_PERMISSIONS['Dispatcher'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '2',
      employeeId: 'emp002',
      employeeName: 'Emma Harris',
      email: 'emma.harris@company.com',
      department: 'Finance',
      roleType: 'Finance Manager',
      accessLevel: 'Read',
      permissions: DEFAULT_PERMISSIONS['Finance Manager'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '3',
      employeeId: 'emp003',
      employeeName: 'David Lee',
      email: 'david.lee@company.com',
      department: 'Operations',
      roleType: 'Dispatcher',
      accessLevel: 'Full',
      permissions: DEFAULT_PERMISSIONS['Dispatcher'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '4',
      employeeId: 'emp004',
      employeeName: 'Michael Smith',
      email: 'michael.smith@company.com',
      department: 'Admin',
      roleType: 'Super Admin',
      accessLevel: 'Full',
      permissions: DEFAULT_PERMISSIONS['Super Admin'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      createdBy: 'system',
      isActive: true
    },
    {
      id: '5',
      employeeId: 'emp005',
      employeeName: 'Sophia Wilson',
      email: 'sophia.wilson@company.com',
      department: 'Finance',
      roleType: 'Finance Manager',
      accessLevel: 'Edit',
      permissions: DEFAULT_PERMISSIONS['Finance Manager'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      createdBy: 'admin',
      isActive: true
    },
    {
      id: '6',
      employeeId: 'emp006',
      employeeName: 'Emily Johnson',
      email: 'emily.johnson@company.com',
      department: 'Operations',
      roleType: 'Dispatcher',
      accessLevel: 'Read',
      permissions: DEFAULT_PERMISSIONS['Dispatcher'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      createdBy: 'admin',
      isActive: true
    }
  ];

  private mockEmployees: Employee[] = [
    { id: 'emp001', name: 'John Doe', email: 'john.doe@company.com', department: 'Operations', isActive: true },
    { id: 'emp002', name: 'Emma Harris', email: 'emma.harris@company.com', department: 'Finance', isActive: true },
    { id: 'emp003', name: 'David Lee', email: 'david.lee@company.com', department: 'Operations', isActive: true },
    { id: 'emp004', name: 'Michael Smith', email: 'michael.smith@company.com', department: 'Admin', isActive: true },
    { id: 'emp005', name: 'Sophia Wilson', email: 'sophia.wilson@company.com', department: 'Finance', isActive: true },
    { id: 'emp006', name: 'Emily Johnson', email: 'emily.johnson@company.com', department: 'Operations', isActive: true },
    { id: 'emp007', name: 'James Brown', email: 'james.brown@company.com', department: 'Customer Support', isActive: true },
    { id: 'emp008', name: 'Lisa Chen', email: 'lisa.chen@company.com', department: 'Human Resources', isActive: true }
  ];

  private rolesSubject = new BehaviorSubject<Role[]>(this.mockRoles);
  public roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all roles with optional filtering
  getRoles(filter?: RoleFilter): Observable<Role[]> {
    return of(this.mockRoles).pipe(
      map(roles => {
        if (!filter) return roles;
        
        return roles.filter(role => {
          const matchesSearch = !filter.search || 
            role.employeeName.toLowerCase().includes(filter.search.toLowerCase()) ||
            role.email.toLowerCase().includes(filter.search.toLowerCase());
          
          const matchesRole = !filter.roleType || role.roleType === filter.roleType;
          const matchesAccess = !filter.accessLevel || role.accessLevel === filter.accessLevel;
          const matchesDepartment = !filter.department || role.department === filter.department;
          
          return matchesSearch && matchesRole && matchesAccess && matchesDepartment && role.isActive;
        });
      }),
      delay(300) // Simulate API delay
    );
  }

  // Get role by ID
  getRoleById(id: string): Observable<Role | undefined> {
    return of(this.mockRoles.find(role => role.id === id)).pipe(delay(200));
  }

  // Get available employees (not assigned to roles or inactive roles)
  getAvailableEmployees(): Observable<Employee[]> {
    const assignedEmployeeIds = this.mockRoles
      .filter(role => role.isActive)
      .map(role => role.employeeId);
    
    return of(this.mockEmployees.filter(emp => 
      !assignedEmployeeIds.includes(emp.id) && emp.isActive
    )).pipe(delay(200));
  }

  // Create new role assignment
  createRole(roleAssignment: RoleAssignment): Observable<Role> {
    const employee = this.mockEmployees.find(emp => emp.id === roleAssignment.employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const newRole: Role = {
      id: Date.now().toString(),
      employeeId: roleAssignment.employeeId,
      employeeName: roleAssignment.employeeName,
      email: employee.email,
      department: employee.department,
      roleType: roleAssignment.roleType,
      accessLevel: roleAssignment.accessLevel,
      permissions: roleAssignment.permissions || DEFAULT_PERMISSIONS[roleAssignment.roleType],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user', // Should be from auth service
      isActive: true
    };

    this.mockRoles.push(newRole);
    this.rolesSubject.next([...this.mockRoles]);
    
    return of(newRole).pipe(delay(300));
  }

  // Update existing role
  updateRole(id: string, roleAssignment: RoleAssignment): Observable<Role> {
    const roleIndex = this.mockRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      throw new Error('Role not found');
    }

    const existingRole = this.mockRoles[roleIndex];
    const updatedRole: Role = {
      ...existingRole,
      roleType: roleAssignment.roleType,
      accessLevel: roleAssignment.accessLevel,
      permissions: roleAssignment.permissions || DEFAULT_PERMISSIONS[roleAssignment.roleType],
      updatedAt: new Date()
    };

    this.mockRoles[roleIndex] = updatedRole;
    this.rolesSubject.next([...this.mockRoles]);
    
    return of(updatedRole).pipe(delay(300));
  }

  // Delete role (soft delete)
  deleteRole(id: string): Observable<boolean> {
    const roleIndex = this.mockRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      throw new Error('Role not found');
    }

    this.mockRoles[roleIndex].isActive = false;
    this.mockRoles[roleIndex].updatedAt = new Date();
    this.rolesSubject.next([...this.mockRoles]);
    
    return of(true).pipe(delay(300));
  }

  // Get role types
  getRoleTypes(): RoleType[] {
    return ['Super Admin', 'Finance Manager', 'Dispatcher', 'Operations Manager', 'Support Agent', 'HR Manager', 'Analytics Manager'];
  }

  // Get access levels
  getAccessLevels(): AccessLevel[] {
    return ['Full', 'Edit', 'Read'];
  }

  // Get departments
  getDepartments(): Department[] {
    return ['Operations', 'Finance', 'Admin', 'Human Resources', 'Customer Support', 'Analytics'];
  }

  // Export roles data
  exportRoles(format: 'csv' | 'pdf'): Observable<Blob> {
    // Mock implementation - in real app, this would call API
    const csvData = this.convertToCSV(this.mockRoles.filter(role => role.isActive));
    const blob = new Blob([csvData], { type: 'text/csv' });
    return of(blob).pipe(delay(500));
  }

  // Get audit logs
  getAuditLogs(): Observable<RoleAuditLog[]> {
    // Mock audit logs
    const mockLogs: RoleAuditLog[] = [
      {
        id: '1',
        action: 'CREATE',
        employeeId: 'emp001',
        employeeName: 'John Doe',
        newRole: 'Dispatcher',
        newAccessLevel: 'Edit',
        changedBy: 'admin',
        timestamp: new Date('2024-01-15T10:30:00'),
        changes: ['Role assigned: Dispatcher', 'Access level: Edit']
      },
      {
        id: '2',
        action: 'UPDATE',
        employeeId: 'emp002',
        employeeName: 'Emma Harris',
        previousRole: 'Finance Manager',
        newRole: 'Finance Manager',
        previousAccessLevel: 'Edit',
        newAccessLevel: 'Read',
        changedBy: 'admin',
        timestamp: new Date('2024-01-16T14:20:00'),
        changes: ['Access level changed from Edit to Read']
      }
    ];
    
    return of(mockLogs).pipe(delay(300));
  }

  private convertToCSV(roles: Role[]): string {
    const headers = ['Employee Name', 'Email', 'Department', 'Role', 'Access Level', 'Created Date'];
    const rows = roles.map(role => [
      role.employeeName,
      role.email,
      role.department,
      role.roleType,
      role.accessLevel,
      role.createdAt.toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
}
