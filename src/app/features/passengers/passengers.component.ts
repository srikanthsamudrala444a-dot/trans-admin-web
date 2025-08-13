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

@Component({
  selector: 'app-passengers',
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
    MatFormFieldModule
  ],
  template: `
    <div class="passengers-container">
      <div class="page-header">
        <h1>Passengers Management</h1>
      </div>
      
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select>
                <mat-option value="all">All Status</mat-option>
                <mat-option value="active">Active</mat-option>
                <mat-option value="banned">Banned</mat-option>
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
        <mat-table [dataSource]="passengers">
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef>Passenger</mat-header-cell>
            <mat-cell *matCellDef="let passenger">
              <div class="passenger-info">
                <div class="passenger-avatar">{{passenger.name.charAt(0)}}</div>
                <div>
                  <div class="passenger-name">{{passenger.name}}</div>
                  <div class="passenger-email">{{passenger.email}}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="phone">
            <mat-header-cell *matHeaderCellDef>Phone</mat-header-cell>
            <mat-cell *matCellDef="let passenger">{{passenger.phone}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="totalRides">
            <mat-header-cell *matHeaderCellDef>Total Rides</mat-header-cell>
            <mat-cell *matCellDef="let passenger">{{passenger.totalRides}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="rating">
            <mat-header-cell *matHeaderCellDef>Rating</mat-header-cell>
            <mat-cell *matCellDef="let passenger">
              <div class="rating">
                <mat-icon class="star-icon">star</mat-icon>
                {{passenger.rating}}
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let passenger">
              <mat-chip [class]="passenger.isBanned ? 'status-banned' : 'status-active'">
                {{passenger.isBanned ? 'Banned' : 'Active'}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="joinDate">
            <mat-header-cell *matHeaderCellDef>Join Date</mat-header-cell>
            <mat-cell *matCellDef="let passenger">{{passenger.createdAt | date:'shortDate'}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let passenger">
              <button mat-icon-button color="primary">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button [color]="passenger.isBanned ? 'accent' : 'warn'">
                <mat-icon>{{passenger.isBanned ? 'check_circle' : 'block'}}</mat-icon>
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
    .passengers-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header h1 {
      margin: 0 0 24px 0;
      color: #333;
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
    
    .passenger-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .passenger-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #4caf50;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    
    .passenger-name {
      font-weight: 500;
      color: #333;
    }
    
    .passenger-email {
      font-size: 0.875rem;
      color: #666;
    }
    
    .status-active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-banned {
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
  `]
})
export class PassengersComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'totalRides', 'rating', 'status', 'joinDate', 'actions'];
  passengers: any[] = [];

  ngOnInit(): void {
    this.loadPassengers();
  }

  private loadPassengers(): void {
    // Mock data
    this.passengers = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1234567890',
        totalRides: 45,
        rating: 4.7,
        isBanned: false,
        createdAt: new Date('2023-01-15')
      },
      {
        name: 'Bob Brown',
        email: 'bob.brown@email.com',
        phone: '+1234567891',
        totalRides: 23,
        rating: 4.5,
        isBanned: false,
        createdAt: new Date('2023-03-22')
      },
      {
        name: 'Carol White',
        email: 'carol.white@email.com',
        phone: '+1234567892',
        totalRides: 12,
        rating: 3.2,
        isBanned: true,
        createdAt: new Date('2023-06-10')
      }
    ];
  }
}