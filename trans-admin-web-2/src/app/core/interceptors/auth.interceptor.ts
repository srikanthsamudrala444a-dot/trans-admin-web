import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, finalize, retry, delay, timer } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth header for login and refresh endpoints
  if (isAuthEndpoint(req.url)) {
    console.log('[AuthInterceptor] 📤 Skipping auth header for auth endpoint');
    return next(req);
  }

  const token = authService.getToken();
  console.log('[AuthInterceptor] 🔍 Token available:', !!token);

  let authReq = req;
  if (token) {
    authReq = addAuthHeader(req, token);
    console.log('[AuthInterceptor] 🔐 Added Authorization header');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[AuthInterceptor] ❌ HTTP Error:', error.status, error.message);
      
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.status === 401 && !isAuthEndpoint(req.url)) {
        console.warn('[AuthInterceptor] ⚠️ 401 Unauthorized - Attempting token refresh...');

        return authService.refreshAccessToken().pipe(
          switchMap((response) => {
            console.log('[AuthInterceptor] ✅ Token refreshed successfully, retrying request');
            
            // Retry the original request with new token
            const newReq = addAuthHeader(req, response.accessToken);
            return next(newReq);
          }),
          catchError((refreshError) => {
            console.error('[AuthInterceptor] ❌ Token refresh failed:', refreshError);
            console.log('[AuthInterceptor] 🚪 Logging out user due to refresh failure');
            
            // Only logout if it's not already an auth endpoint
            if (!isAuthEndpoint(req.url)) {
              authService.logout();
            }
            
            return throwError(() => refreshError);
          })
        );
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.status === 403) {
        console.warn('[AuthInterceptor] ⚠️ 403 Forbidden - Insufficient permissions');
      }

      // Handle network errors with retry
      if (error.status === 0 || error.status >= 500) {
        console.warn('[AuthInterceptor] 🌐 Network or server error, retrying...');
        
        return timer(1000).pipe(
          switchMap(() => {
            console.log('[AuthInterceptor] 🔄 Retrying request after delay...');
            return next(authReq);
          }),
          retry(1),
          catchError((retryError) => {
            console.error('[AuthInterceptor] ❌ Retry attempt failed');
            return throwError(() => retryError);
          })
        );
      }

      return throwError(() => error);
    }),
    finalize(() => {
      // Optional: Log request completion
      console.log('[AuthInterceptor] 🏁 Request completed for:', req.url);
    })
  );
};

// Helper functions
function isAuthEndpoint(url: string): boolean {
  const authEndpoints = ['/login', '/refresh', '/register', '/forgot-password'];
  return authEndpoints.some(endpoint => url.includes(endpoint));
}

function addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
