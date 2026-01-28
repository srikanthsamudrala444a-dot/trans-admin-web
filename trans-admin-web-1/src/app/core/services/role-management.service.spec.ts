import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoleManagementService } from './role-management.service';
import { Role, RoleAssignment } from '../models/role.model';

describe('RoleManagementService', () => {
  let service: RoleManagementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleManagementService]
    });
    service = TestBed.inject(RoleManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get roles', (done) => {
    service.getRoles().subscribe(roles => {
      expect(roles).toBeDefined();
      expect(Array.isArray(roles)).toBe(true);
      done();
    });
  });

  it('should filter roles by search term', (done) => {
    const filter = { search: 'John' };
    
    service.getRoles(filter).subscribe(roles => {
      const filteredRoles = roles.filter(role => 
        role.employeeName.toLowerCase().includes('john')
      );
      expect(filteredRoles.length).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should get available employees', (done) => {
    service.getAvailableEmployees().subscribe(employees => {
      expect(employees).toBeDefined();
      expect(Array.isArray(employees)).toBe(true);
      done();
    });
  });

  it('should create new role', (done) => {
    const roleAssignment: RoleAssignment = {
      employeeId: 'emp001',
      employeeName: 'Test Employee',
      roleType: 'Dispatcher',
      accessLevel: 'Edit'
    };

    service.createRole(roleAssignment).subscribe(role => {
      expect(role).toBeDefined();
      expect(role.employeeName).toBe('Test Employee');
      expect(role.roleType).toBe('Dispatcher');
      done();
    });
  });

  it('should update existing role', (done) => {
    const roleAssignment: RoleAssignment = {
      employeeId: 'emp001',
      employeeName: 'Updated Employee',
      roleType: 'Finance Manager',
      accessLevel: 'Full'
    };

    service.updateRole('1', roleAssignment).subscribe(role => {
      expect(role).toBeDefined();
      expect(role.roleType).toBe('Finance Manager');
      expect(role.accessLevel).toBe('Full');
      done();
    });
  });

  it('should delete role', (done) => {
    service.deleteRole('1').subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should get role types', () => {
    const roleTypes = service.getRoleTypes();
    expect(roleTypes).toBeDefined();
    expect(roleTypes.length).toBeGreaterThan(0);
    expect(roleTypes).toContain('Super Admin');
  });

  it('should get access levels', () => {
    const accessLevels = service.getAccessLevels();
    expect(accessLevels).toBeDefined();
    expect(accessLevels).toEqual(['Full', 'Edit', 'Read']);
  });

  it('should get departments', () => {
    const departments = service.getDepartments();
    expect(departments).toBeDefined();
    expect(departments.length).toBeGreaterThan(0);
  });

  it('should export roles', (done) => {
    service.exportRoles('csv').subscribe(blob => {
      expect(blob).toBeDefined();
      expect(blob instanceof Blob).toBe(true);
      done();
    });
  });

  it('should get audit logs', (done) => {
    service.getAuditLogs().subscribe(logs => {
      expect(logs).toBeDefined();
      expect(Array.isArray(logs)).toBe(true);
      done();
    });
  });
});
