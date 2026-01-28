import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://dev.glaciersoft.in.net/authentication/api/v1/auth';
  
  private accessToken: string | null = null;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private jwtHelper = new JwtHelperService();

  public currentUser$ = this.currentUserSubject.asObservable();
  public accessToken$ = this.tokenSubject.asObservable();
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadStoredAuth();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock login - replace with actual API call
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      map((response: AuthResponse) => {
        // Mock user object for testing
         
    
        this.setAuthData(response);
        
        return response;

      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
 
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    const accessToken = this.getToken();
    return !!accessToken; // adjust if decoding JWT
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
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.tokenSubject.next(authResponse.accessToken);
  }

  private loadStoredAuth() {
    if (isPlatformBrowser(this.platformId)) {   // ✅ only run in browser
      this.accessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      } else {
        // For development/testing, create a mock admin user if no user is stored
        const mockUser: User = {
          id: 'admin-001',
          email: 'admin@transport-admin.com',
          name: 'Admin User',
          role: 'admin',
          isActive: true,
          lastLogin: new Date()
        };
        this.currentUserSubject.next(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    }
  }

  saveToken(accessToken: string) {
    this.accessToken = accessToken;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', accessToken);
    }
  }

  clearAuth() {
    this.accessToken = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
    }
  }

  private isValidJwt(accessToken: string): boolean {
  return accessToken.split('.').length === 3;
  }

  private getLocalStorage(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
  }

  clearToken() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
    }
  }

}