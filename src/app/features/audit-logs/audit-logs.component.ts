import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="audit-logs-container">
      <div class="page-header">
        <h1>Audit Logs</h1>
      </div>
      
      <mat-card class="feature-card">
        <mat-card-content>
          <div class="coming-soon">
            <mat-icon class="feature-icon">history</mat-icon>
            <h2>Audit Trail</h2>
            <p>Comprehensive logging of all admin actions and system changes will be tracked here.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .audit-logs-container {
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
      color: #9c27b0;
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
export class AuditLogsComponent {}