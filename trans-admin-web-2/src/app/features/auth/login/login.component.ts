import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
loginForm: FormGroup;
hidePassword = true;
isLoading = false;
errorMessage = '';

constructor(
  private fb: FormBuilder,
  private loginService: AuthService,
  private router: Router
) {
  this.loginForm = this.fb.group({
    email: ['admin@cabservice.com', [Validators.required]],
    password: ['admin123', Validators.required]
  });
}

ngOnInit(): void {
  console.log('[LoginComponent] 🔍 Checking existing authentication...');
  
  // Check if user is already authenticated
  if (this.loginService.isAuthenticated()) {
    console.log('[LoginComponent] ✅ User already authenticated, redirecting...');
    this.router.navigate(['/dashboard']);
    return;
  }

  // Listen to auth state changes
  this.loginService.currentUser$.subscribe(user => {
    if (user && this.router.url.includes('login')) {
      console.log('[LoginComponent] 👤 User authenticated:', user.email);
      this.router.navigate(['/dashboard']);
    }
  });
}

onSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.loginForm.value;
    const credentials = {
      contactNumber: formValue.email,
      pin: formValue.password
    };

    console.log('[LoginComponent] 🔐 Attempting login...');
    
    this.loginService.login(credentials).subscribe({
      next: (response) => {
        console.log('[LoginComponent] ✅ Login successful');
        console.log('[LoginComponent] 🎯 Navigating to dashboard...');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('[LoginComponent] ❌ Login failed:', error);
        
        // Enhanced error handling
        if (error.status === 401) {
          this.errorMessage = 'Invalid credentials. Please check your email and password.';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
        
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  } else {
    console.warn('[LoginComponent] ⚠️ Form is invalid');
    this.markFormGroupTouched();
  }
}

private markFormGroupTouched(): void {
  Object.keys(this.loginForm.controls).forEach(key => {
    const control = this.loginForm.get(key);
    control?.markAsTouched();
  });
}

// Utility method to check for form errors
getErrorMessage(fieldName: string): string {
  const control = this.loginForm.get(fieldName);
  if (control?.hasError('required')) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  }
  if (control?.hasError('email')) {
    return 'Please enter a valid email address';
  }
  return '';
}

// Method to toggle password visibility
togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
}
}