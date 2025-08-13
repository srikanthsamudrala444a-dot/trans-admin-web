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
import { Driver } from '../../core/models/ride.model';

@Component({
  selector: 'app-drivers',
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
    <div class="drivers-container">
      <div class="page-header">
        <h1>Drivers Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add Driver
        </button>
      </div>
      
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon online">radio_button_checked</mat-icon>
              <div>
                <h3>{{onlineDrivers}}</h3>
                <p>Online Drivers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon offline">radio_button_unchecked</mat-icon>
              <div>
                <h3>{{offlineDrivers}}</h3>
                <p>Offline Drivers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon pending">pending</mat-icon>
              <div>
                <h3>{{pendingApprovals}}</h3>
                <p>Pending Approvals</p>
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
                <mat-option value="online">Online</mat-option>
                <mat-option value="offline">Offline</mat-option>
                <mat-option value="busy">Busy</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Document Status</mat-label>
              <mat-select>
                <mat-option value="all">All Documents</mat-option>
                <mat-option value="approved">Approved</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="rejected">Rejected</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Search by name, email, or phone">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card>
        <mat-table [dataSource]="drivers">
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef>Driver</mat-header-cell>
            <mat-cell *matCellDef="let driver">
              <div class="driver-info">
                <div class="driver-avatar">{{driver.name.charAt(0)}}</div>
                <div>
                  <div class="driver-name">{{driver.name}}</div>
                  <div class="driver-email">{{driver.email}}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="phone">
            <mat-header-cell *matHeaderCellDef>Phone</mat-header-cell>
            <mat-cell *matCellDef="let driver">{{driver.phone}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let driver">
              <mat-chip [class]="'status-' + driver.status">
                <mat-icon *ngIf="driver.status === 'online'">radio_button_checked</mat-icon>
                <mat-icon *ngIf="driver.status === 'offline'">radio_button_unchecked</mat-icon>
                <mat-icon *ngIf="driver.status === 'busy'">local_taxi</mat-icon>
                {{driver.status | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="rating">
            <mat-header-cell *matHeaderCellDef>Rating</mat-header-cell>
            <mat-cell *matCellDef="let driver">
              <div class="rating">
                <mat-icon class="star-icon">star</mat-icon>
                {{driver.rating}} ({{driver.totalRides}})
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="documents">
            <mat-header-cell *matHeaderCellDef>Documents</mat-header-cell>
            <mat-cell *matCellDef="let driver">
              <mat-chip 
                [class]="'docs-' + driver.documentsStatus"
                [matBadge]="driver.documentsStatus === 'pending' ? '!' : ''"
                matBadgeColor="warn"
                [matBadgeHidden]="driver.documentsStatus !== 'pending'">
                {{driver.documentsStatus | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="earnings">
            <mat-header-cell *matHeaderCellDef>Earnings</mat-header-cell>
            <mat-cell *matCellDef="let driver">\${{driver.earnings}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let driver">
              <button mat-icon-button color="primary">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn">
                <mat-icon>block</mat-icon>
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
    .drivers-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .page-header h1 {
      margin: 0;
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
    
    .stat-icon.online {
      color: #4caf50;
    }
    
    .stat-icon.offline {
      color: #9e9e9e;
    }
    
    .stat-icon.pending {
      color: #ff9800;
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
    
    .driver-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .driver-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    
    .driver-name {
      font-weight: 500;
      color: #333;
    }
    
    .driver-email {
      font-size: 0.875rem;
      color: #666;
    }
    
    .status-online {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-offline {
      background-color: #f5f5f5;
      color: #666;
    }
    
    .status-busy {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .docs-approved {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .docs-pending {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .docs-rejected {
      background-color: #ffebee;
      color: #c62828;
    }
    
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .star-icon {
      color: #ffc107;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .stats-cards {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
      }
      
      .filters mat-form-field {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class DriversComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'status', 'rating', 'documents', 'earnings', 'actions'];
  drivers: any[] = [];
  
  onlineDrivers = 0;
  offlineDrivers = 0;
  pendingApprovals = 0;

  ngOnInit(): void {
    this.loadDrivers();
  }

  private loadDrivers(): void {
    // Mock data
    this.drivers = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1234567890',
        status: 'online',
        rating: 4.8,
        totalRides: 234,
        earnings: 2150,
        documentsStatus: 'approved'
      },
      {
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '+1234567891',
        status: 'busy',
        rating: 4.6,
        totalRides: 189,
        earnings: 1875,
        documentsStatus: 'approved'
      },
      {
        name: 'Sarah Davis',
        email: 'sarah.davis@email.com',
        phone: '+1234567892',
        status: 'offline',
        rating: 4.9,
        totalRides: 312,
        earnings: 3200,
        documentsStatus: 'pending'
      }
    ];

    this.calculateStats();
  }

  private calculateStats(): void {
    this.onlineDrivers = this.drivers.filter(d => d.status === 'online').length;
    this.offlineDrivers = this.drivers.filter(d => d.status === 'offline').length;
    this.pendingApprovals = this.drivers.filter(d => d.documentsStatus === 'pending').length;
  }
}