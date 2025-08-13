import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private jwtHelper = new JwtHelperService();

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock login - replace with actual API call
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.email === 'admin@cabservice.com' && credentials.password === 'admin123') {
          const mockResponse: AuthResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: '1',
              email: credentials.email,
              name: 'Admin User',
              role: 'admin',
              isActive: true,
              lastLogin: new Date()
            },
            refreshToken: 'mock-refresh-token'
          };
          
          this.setAuthData(mockResponse);
          observer.next(mockResponse);
          observer.complete();
        } else {
          observer.error({ message: 'Invalid credentials' });
        }
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.tokenSubject.next(authResponse.token);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr && !this.jwtHelper.isTokenExpired(token)) {
      const user: User = JSON.parse(userStr);
      this.currentUserSubject.next(user);
      this.tokenSubject.next(token);
    }
  }
}