export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'dispatcher' | 'support';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken: string;
}