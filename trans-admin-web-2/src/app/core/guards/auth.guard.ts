import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('[AuthGuard] 🔍 Checking authentication...');
    
    if (this.authService.isAuthenticated()) {
      console.log('[AuthGuard] ✅ User authenticated, access granted');
      return true;
    }
    
    console.log('[AuthGuard] ❌ User not authenticated, redirecting to login');
    this.router.navigate(['/auth/login']);
    return false;
  }
}