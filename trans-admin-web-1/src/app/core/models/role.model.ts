export interface Role {
  id: string;
  employeeId: string;
  employeeName: string;
  email: string;
  department: string;
  roleType: RoleType;
  accessLevel: AccessLevel;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

export interface Permission {
  module: string;
  view: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
}

export interface RoleAssignment {
  employeeId: string;
  employeeName: string;
  roleType: RoleType;
  accessLevel: AccessLevel;
  permissions?: Permission[];
}

export interface RoleFilter {
  search?: string;
  roleType?: RoleType;
  accessLevel?: AccessLevel;
  department?: string;
}

export interface RoleAuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  employeeId: string;
  employeeName: string;
  previousRole?: RoleType;
  newRole?: RoleType;
  previousAccessLevel?: AccessLevel;
  newAccessLevel?: AccessLevel;
  changedBy: string;
  timestamp: Date;
  changes: string[];
}

export type RoleType = 
  | 'Super Admin' 
  | 'Finance Manager' 
  | 'Dispatcher' 
  | 'Operations Manager'
  | 'Support Agent'
  | 'HR Manager'
  | 'Analytics Manager';

export type AccessLevel = 'Full' | 'Edit' | 'Read';

export type Department = 
  | 'Operations' 
  | 'Finance' 
  | 'Admin' 
  | 'Human Resources'
  | 'Customer Support'
  | 'Analytics';

export const DEFAULT_PERMISSIONS: Record<RoleType, Permission[]> = {
  'Super Admin': [
    { module: 'Rides', view: true, edit: true, delete: true, approve: true },
    { module: 'Drivers', view: true, edit: true, delete: true, approve: true },
    { module: 'Passengers', view: true, edit: true, delete: true, approve: true },
    { module: 'Finance', view: true, edit: true, delete: true, approve: true },
    { module: 'Reports', view: true, edit: true, delete: true, approve: true },
    { module: 'System Settings', view: true, edit: true, delete: true, approve: true },
    { module: 'User Management', view: true, edit: true, delete: true, approve: true }
  ],
  'Finance Manager': [
    { module: 'Rides', view: true, edit: false, delete: false, approve: false },
    { module: 'Drivers', view: true, edit: false, delete: false, approve: false },
    { module: 'Passengers', view: true, edit: false, delete: false, approve: false },
    { module: 'Finance', view: true, edit: true, delete: false, approve: true },
    { module: 'Reports', view: true, edit: true, delete: false, approve: true },
    { module: 'System Settings', view: false, edit: false, delete: false, approve: false },
    { module: 'User Management', view: false, edit: false, delete: false, approve: false }
  ],
  'Dispatcher': [
    { module: 'Rides', view: true, edit: true, delete: false, approve: false },
    { module: 'Drivers', view: true, edit: true, delete: false, approve: false },
    { module: 'Passengers', view: true, edit: true, delete: false, approve: false },
    { module: 'Finance', view: false, edit: false, delete: false, approve: false },
    { module: 'Reports', view: true, edit: false, delete: false, approve: false },
    { module: 'System Settings', view: false, edit: false, delete: false, approve: false },
    { module: 'User Management', view: false, edit: false, delete: false, approve: false }
  ],
  'Operations Manager': [
    { module: 'Rides', view: true, edit: true, delete: true, approve: true },
    { module: 'Drivers', view: true, edit: true, delete: true, approve: true },
    { module: 'Passengers', view: true, edit: true, delete: false, approve: false },
    { module: 'Finance', view: true, edit: false, delete: false, approve: false },
    { module: 'Reports', view: true, edit: true, delete: false, approve: true },
    { module: 'System Settings', view: true, edit: true, delete: false, approve: false },
    { module: 'User Management', view: true, edit: false, delete: false, approve: false }
  ],
  'Support Agent': [
    { module: 'Rides', view: true, edit: true, delete: false, approve: false },
    { module: 'Drivers', view: true, edit: false, delete: false, approve: false },
    { module: 'Passengers', view: true, edit: true, delete: false, approve: false },
    { module: 'Finance', view: false, edit: false, delete: false, approve: false },
    { module: 'Reports', view: true, edit: false, delete: false, approve: false },
    { module: 'System Settings', view: false, edit: false, delete: false, approve: false },
    { module: 'User Management', view: false, edit: false, delete: false, approve: false }
  ],
  'HR Manager': [
    { module: 'Rides', view: false, edit: false, delete: false, approve: false },
    { module: 'Drivers', view: true, edit: true, delete: false, approve: true },
    { module: 'Passengers', view: false, edit: false, delete: false, approve: false },
    { module: 'Finance', view: false, edit: false, delete: false, approve: false },
    { module: 'Reports', view: true, edit: false, delete: false, approve: false },
    { module: 'System Settings', view: false, edit: false, delete: false, approve: false },
    { module: 'User Management', view: true, edit: true, delete: false, approve: true }
  ],
  'Analytics Manager': [
    { module: 'Rides', view: true, edit: false, delete: false, approve: false },
    { module: 'Drivers', view: true, edit: false, delete: false, approve: false },
    { module: 'Passengers', view: true, edit: false, delete: false, approve: false },
    { module: 'Finance', view: true, edit: false, delete: false, approve: false },
    { module: 'Reports', view: true, edit: true, delete: false, approve: true },
    { module: 'System Settings', view: false, edit: false, delete: false, approve: false },
    { module: 'User Management', view: false, edit: false, delete: false, approve: false }
  ]
};
