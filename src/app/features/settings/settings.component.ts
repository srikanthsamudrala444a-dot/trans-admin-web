import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h1>Settings</h1>
      </div>
      
      <mat-card class="feature-card">
        <mat-card-content>
          <div class="coming-soon">
            <mat-icon class="feature-icon">settings</mat-icon>
            <h2>System Settings</h2>
            <p>Fare settings, surge pricing, and city configuration options will be available here.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .page-header h1 {
      margin: 0 0 24px 0;
      color: #333;
    }
    
    .coming-soon {
      padding: 60px 20px;
    }
    
    .feature-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ff9800;
      margin-bottom: 20px;
    }
    
    .coming-soon h2 {
      margin: 0 0 16px 0;
      color: #333;
      font-weight: 300;
    }
    
    .coming-soon p {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }
  `]
})
export class SettingsComponent {}