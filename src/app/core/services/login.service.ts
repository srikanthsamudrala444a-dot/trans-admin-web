import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'admin.cabservice.com',
  password: 'admin123',
  contactNumber: 'admin.cabservice.com',
  pin: 'admin123'
};

// Mock user response
const MOCK_USER_RESPONSE = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbiBVc2VyIn0.mock-token-signature',
  refreshToken: 'refresh-token-mock',
  user: {
    id: '1',
    email: 'admin.cabservice.com',
    name: 'Admin User',
    role: 'ADMIN',
    phone: '9999999999'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'https://dev.glaciersoft.in.net/authentication/api/v1/auth/login';

  constructor(private http: HttpClient) {}

  /**
   * Login with demo credentials (no API call)
   * Validates against demo credentials and returns mock response
   */
  login(credentials: { contactNumber: string; pin: string }): Observable<any> {
    // Validate against demo credentials
    if (
      credentials.contactNumber === DEMO_CREDENTIALS.contactNumber &&
      credentials.pin === DEMO_CREDENTIALS.password
    ) {
      // Simulate API delay (500ms)
      return of(MOCK_USER_RESPONSE).pipe(delay(500));
    } else {
      // Invalid credentials
      return throwError(() => ({
        error: {
          message: 'Invalid email or password. Use admin.cabservice.com / admin123'
        }
      }));
    }
  }
}
