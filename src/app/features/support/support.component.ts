import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule
  ],
  template: `
    <div class="support-container">
      <div class="page-header">
        <h1>Support Tickets</h1>
      </div>
      
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon open">help_outline</mat-icon>
              <div>
                <h3>{{openTickets}}</h3>
                <p>Open Tickets</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon progress">pending</mat-icon>
              <div>
                <h3>{{inProgressTickets}}</h3>
                <p>In Progress</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon closed">check_circle</mat-icon>
              <div>
                <h3>{{closedTickets}}</h3>
                <p>Resolved Today</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select>
                <mat-option value="all">All Status</mat-option>
                <mat-option value="open">Open</mat-option>
                <mat-option value="in-progress">In Progress</mat-option>
                <mat-option value="closed">Closed</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select>
                <mat-option value="all">All Priority</mat-option>
                <mat-option value="high">High</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="low">Low</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Search tickets...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card>
        <mat-table [dataSource]="tickets">
          <ng-container matColumnDef="id">
            <mat-header-cell *matHeaderCellDef>Ticket ID</mat-header-cell>
            <mat-cell *matCellDef="let ticket">#{{ticket.id}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="user">
            <mat-header-cell *matHeaderCellDef>User</mat-header-cell>
            <mat-cell *matCellDef="let ticket">
              <div class="user-info">
                <div class="user-avatar">{{ticket.userName.charAt(0)}}</div>
                <div>
                  <div class="user-name">{{ticket.userName}}</div>
                  <div class="user-type">{{ticket.userType | titlecase}}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="subject">
            <mat-header-cell *matHeaderCellDef>Subject</mat-header-cell>
            <mat-cell *matCellDef="let ticket">
              <div class="ticket-subject">
                <div class="subject-line">{{ticket.subject}}</div>
                <div class="category">{{ticket.category}}</div>
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="priority">
            <mat-header-cell *matHeaderCellDef>Priority</mat-header-cell>
            <mat-cell *matCellDef="let ticket">
              <mat-chip [class]="'priority-' + ticket.priority">
                {{ticket.priority | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let ticket">
              <mat-chip [class]="'status-' + ticket.status">
                {{ticket.status | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="assignee">
            <mat-header-cell *matHeaderCellDef>Assignee</mat-header-cell>
            <mat-cell *matCellDef="let ticket">
              <span *ngIf="ticket.assignee; else unassigned">{{ticket.assignee}}</span>
              <ng-template #unassigned>
                <span class="unassigned">Unassigned</span>
              </ng-template>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="created">
            <mat-header-cell *matHeaderCellDef>Created</mat-header-cell>
            <mat-cell *matCellDef="let ticket">{{ticket.createdAt | date:'short'}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let ticket">
              <button mat-icon-button color="primary">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>person_add</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
      </mat-card>
    </div>
  `,
  styles: [`
    .support-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header h1 {
      margin: 0 0 24px 0;
      color: #333;
    }
    
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      transition: transform 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    
    .stat-icon.open {
      color: #ff5722;
    }
    
    .stat-icon.progress {
      color: #ff9800;
    }
    
    .stat-icon.closed {
      color: #4caf50;
    }
    
    .stat-content h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .filter-card {
      margin-bottom: 24px;
    }
    
    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .filters mat-form-field {
      min-width: 200px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #9c27b0;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 14px;
    }
    
    .user-name {
      font-weight: 500;
      color: #333;
    }
    
    .user-type {
      font-size: 0.75rem;
      color: #666;
    }
    
    .ticket-subject {
      max-width: 300px;
    }
    
    .subject-line {
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .category {
      font-size: 0.75rem;
      color: #666;
    }
    
    .priority-high {
      background-color: #ffebee;
      color: #c62828;
    }
    
    .priority-medium {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .priority-low {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-open {
      background-color: #ffebee;
      color: #c62828;
    }
    
    .status-in-progress {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .status-closed {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .unassigned {
      color: #999;
      font-style: italic;
    }
  `]
})
export class SupportComponent implements OnInit {
  displayedColumns = ['id', 'user', 'subject', 'priority', 'status', 'assignee', 'created', 'actions'];
  tickets: any[] = [];
  
  openTickets = 0;
  inProgressTickets = 0;
  closedTickets = 0;

  ngOnInit(): void {
    this.loadTickets();
  }

  private loadTickets(): void {
    // Mock data
    this.tickets = [
      {
        id: '001',
        userName: 'Alice Johnson',
        userType: 'passenger',
        subject: 'Driver was late and rude',
        category: 'Service Quality',
        priority: 'high',
        status: 'open',
        assignee: null,
        createdAt: new Date('2024-01-15T10:30:00')
      },
      {
        id: '002',
        userName: 'John Smith',
        userType: 'driver',
        subject: 'Payment not received for last ride',
        category: 'Payment Issue',
        priority: 'medium',
        status: 'in-progress',
        assignee: 'Support Agent 1',
        createdAt: new Date('2024-01-14T14:20:00')
      },
      {
        id: '003',
        userName: 'Bob Brown',
        userType: 'passenger',
        subject: 'Cannot cancel ride',
        category: 'Technical Issue',
        priority: 'low',
        status: 'closed',
        assignee: 'Support Agent 2',
        createdAt: new Date('2024-01-13T09:15:00')
      }
    ];

    this.calculateStats();
  }

  private calculateStats(): void {
    this.openTickets = this.tickets.filter(t => t.status === 'open').length;
    this.inProgressTickets = this.tickets.filter(t => t.status === 'in-progress').length;
    this.closedTickets = this.tickets.filter(t => t.status === 'closed').length;
  }
}