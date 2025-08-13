import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-card class="error-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon class="error-icon">search_off</mat-icon>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button mat-raised-button color="primary" (click)="goHome()">
              <mat-icon>home</mat-icon>
              Go Home
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .error-card {
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    
    .error-content {
      padding: 40px 20px;
    }
    
    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #9e9e9e;
      margin-bottom: 20px;
    }
    
    .error-content h1 {
      margin: 0 0 16px 0;
      color: #333;
      font-weight: 400;
    }
    
    .error-content p {
      margin: 0 0 32px 0;
      color: #666;
      font-size: 1.1rem;
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}