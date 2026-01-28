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
  contactNumber: string;
  pin: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  refreshToken: string;
}