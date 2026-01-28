import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer, EMPTY } from 'rxjs';
import { map, catchError, tap, shareReplay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, LoginRequest, AuthResponse } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://dev.glaciersoft.in.net/authentication/api/v1/auth';

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private jwtHelper = new JwtHelperService();
  private refreshTokenRequest$: Observable<AuthResponse> | null = null;
  private refreshInProgress = false;
  private tokenExpirationTimer: any = null;

  public currentUser$ = this.currentUserSubject.asObservable();
  public accessToken$ = this.tokenSubject.asObservable();
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadStoredAuth();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('[AuthService] 🔐 Attempting login...');
    
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response: AuthResponse) => {
          console.log('[AuthService] ✅ Login successful');
          console.log('[AuthService] Access token received:', !!response.accessToken);
          console.log('[AuthService] Refresh token received:', !!response.refreshToken);

          this.setAuthData(response);
          this.setupTokenExpirationTimer();

          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('[AuthService] ❌ Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    console.log('[AuthService] 🚪 Logging out user...');
    
    this.clearTokenExpirationTimer();
    this.refreshInProgress = false;
    this.refreshTokenRequest$ = null;
    
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    
    console.log('[AuthService] ✅ User logged out successfully');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      if (token && this.isTokenValid(token)) {
        this.accessToken = token;
        return token;
      } else if (token) {
        console.warn('[AuthService] ⚠️ Invalid or expired token found, removing...');
        this.removeInvalidToken();
        return null;
      }
    }
    
    if (this.accessToken && this.isTokenValid(this.accessToken)) {
      return this.accessToken;
    }
    
    return null;
  }

  refreshAccessToken(): Observable<AuthResponse> {
    console.log('[AuthService] 🔄 Attempting to refresh token...');
    
    // Prevent multiple simultaneous refresh requests
    if (this.refreshInProgress && this.refreshTokenRequest$) {
      console.log('[AuthService] ⏳ Refresh already in progress, returning existing request');
      return this.refreshTokenRequest$;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('[AuthService] ❌ No refresh token found');
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    console.log('[AuthService] 🔁 Sending refresh request to API...');
    this.refreshInProgress = true;

    this.refreshTokenRequest$ = this.http
      .post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response: AuthResponse) => {
          console.log('[AuthService] ✅ Token refresh successful!');
          console.log('[AuthService] New access token received:', !!response.accessToken);
          console.log('[AuthService] New refresh token received:', !!response.refreshToken);
          
          this.setAuthData(response);
          this.setupTokenExpirationTimer();
          this.refreshInProgress = false;
          this.refreshTokenRequest$ = null;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('[AuthService] ❌ Token refresh failed:', error);
          this.refreshInProgress = false;
          this.refreshTokenRequest$ = null;
          
          // If refresh fails, logout user
          if (error.status === 401 || error.status === 403) {
            console.log('[AuthService] 🚪 Refresh token invalid, logging out...');
            this.logout();
          }
          
          return throwError(() => error);
        }),
        shareReplay(1)
      );

    return this.refreshTokenRequest$;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    try {
      const isExpired = this.jwtHelper.isTokenExpired(token);
      if (isExpired) {
        console.log('[AuthService] ⚠️ Token is expired');
        return false;
      }
      return true;
    } catch (error) {
      console.error('[AuthService] ❌ Error checking token validity:', error);
      return false;
    }
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
    this.accessToken = authResponse.accessToken;
    this.refreshToken = authResponse.refreshToken;
    
    if (this.isBrowser) {
      localStorage.setItem('accessToken', authResponse.accessToken);
      localStorage.setItem('refreshToken', authResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }

    this.currentUserSubject.next(authResponse.user);
    this.tokenSubject.next(authResponse.accessToken);
    
    console.log('[AuthService] ✅ Auth data set successfully');
  }

  private loadStoredAuth() {
    if (this.isBrowser) {
      console.log('[AuthService] 🔍 Loading stored authentication data...');
      
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      
      // Validate stored tokens
      if (this.accessToken && !this.isTokenValid(this.accessToken)) {
        console.warn('[AuthService] ⚠️ Stored access token is invalid/expired');
        this.removeInvalidToken();
        return;
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser && this.accessToken) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
          this.tokenSubject.next(this.accessToken);
          this.setupTokenExpirationTimer();
          console.log('[AuthService] ✅ Valid stored auth data loaded');
        } catch (error) {
          console.error('[AuthService] ❌ Error parsing stored user data:', error);
          this.clearStoredAuth();
        }
      } else if (!this.accessToken) {
        // For development/testing, create a mock admin user if no auth is stored
        console.log('[AuthService] 🧪 Creating mock user for development');
        const mockUser: User = {
          id: 'admin-001',
          email: 'admin@transport-admin.com',
          name: 'Admin User',
          role: 'admin',
          isActive: true,
          lastLogin: new Date(),
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
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
    }
  }

  // Enhanced JWT token validation methods
  private isTokenValid(token: string): boolean {
    if (!token) {
      return false;
    }

    try {
      // Check if token format is valid JWT
      if (!this.isValidJwt(token)) {
        console.warn('[AuthService] ⚠️ Invalid JWT format');
        return false;
      }

      // Check if token is expired
      const isExpired = this.jwtHelper.isTokenExpired(token);
      if (isExpired) {
        console.warn('[AuthService] ⚠️ Token has expired');
        return false;
      }

      return true;
    } catch (error) {
      console.error('[AuthService] ❌ Error validating token:', error);
      return false;
    }
  }

  private getRefreshToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('refreshToken');
    }
    return this.refreshToken;
  }

  private removeInvalidToken(): void {
    console.log('[AuthService] 🧹 Removing invalid tokens...');
    this.accessToken = null;
    this.refreshToken = null;
    
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    
    this.tokenSubject.next(null);
  }

  private clearStoredAuth(): void {
    console.log('[AuthService] 🧹 Clearing all stored auth data...');
    this.accessToken = null;
    this.refreshToken = null;
    
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    this.clearTokenExpirationTimer();
  }

  // Token expiration timer management
  private setupTokenExpirationTimer(): void {
    this.clearTokenExpirationTimer();
    
    const token = this.getToken();
    if (!token) {
      return;
    }

    try {
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      if (!expirationDate) {
        console.warn('[AuthService] ⚠️ Cannot determine token expiration date');
        return;
      }

      // Set timer to refresh token 5 minutes before expiration
      const now = new Date().getTime();
      const expirationTime = expirationDate.getTime();
      const refreshTime = expirationTime - (5 * 60 * 1000); // 5 minutes before expiration
      const timeUntilRefresh = refreshTime - now;

      if (timeUntilRefresh > 0) {
        console.log(`[AuthService] ⏰ Token will be refreshed in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);
        
        this.tokenExpirationTimer = timer(timeUntilRefresh).subscribe(() => {
          console.log('[AuthService] ⏰ Auto-refreshing token...');
          this.refreshAccessToken().subscribe({
            next: () => console.log('[AuthService] ✅ Token auto-refreshed successfully'),
            error: (error) => console.error('[AuthService] ❌ Auto-refresh failed:', error)
          });
        });
      } else {
        console.log('[AuthService] ⚠️ Token expires soon, triggering immediate refresh...');
        this.refreshAccessToken().subscribe();
      }
    } catch (error) {
      console.error('[AuthService] ❌ Error setting up expiration timer:', error);
    }
  }

  private clearTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
      this.tokenExpirationTimer = null;
    }
  }

  // Utility methods for token information
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      return this.jwtHelper.getTokenExpirationDate(token);
    } catch (error) {
      console.error('[AuthService] ❌ Error getting token expiration:', error);
      return null;
    }
  }

  getTokenClaims(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('[AuthService] ❌ Error decoding token:', error);
      return null;
    }
  }

  isTokenExpiringSoon(thresholdMinutes: number = 5): boolean {
    const expirationDate = this.getTokenExpiration();
    if (!expirationDate) {
      return true; // Consider it expiring if we can't determine expiration
    }

    const now = new Date().getTime();
    const expirationTime = expirationDate.getTime();
    const thresholdTime = thresholdMinutes * 60 * 1000;

    return (expirationTime - now) <= thresholdTime;
  }
}
