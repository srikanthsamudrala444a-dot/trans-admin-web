import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginService} from '../../../core/services/login.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatLabel
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin.cabservice.com', [Validators.required]],
      password: ['admin123', Validators.required]
    });
  }

  onSubmit(email: string, password: string): void {
    this.loginForm = this.fb.group({
      email: [email, [Validators.required]],
      password: [password, Validators.required]
    });

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Use email as contactNumber for demo credentials
      const credentials = {
        contactNumber: email,
        pin: password
      };

      console.log('Attempting login with credentials:', { email, password });

      this.loginService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          
          // Store JWT token
          if (response?.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            if (response?.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            console.log('Token saved to localStorage');
          }

          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}