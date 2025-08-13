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
import { Ride } from '../../core/models/ride.model';

@Component({
  selector: 'app-rides',
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
    <div class="rides-container">
      <div class="page-header">
        <h1>Rides Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Manual Assignment
        </button>
      </div>
      
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select>
                <mat-option value="all">All Status</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="accepted">Accepted</mat-option>
                <mat-option value="started">Started</mat-option>
                <mat-option value="completed">Completed</mat-option>
                <mat-option value="cancelled">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Search by ID, driver, or passenger">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card>
        <mat-table [dataSource]="rides">
          <ng-container matColumnDef="id">
            <mat-header-cell *matHeaderCellDef>Ride ID</mat-header-cell>
            <mat-cell *matCellDef="let ride">#{{ride.id}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="driver">
            <mat-header-cell *matHeaderCellDef>Driver</mat-header-cell>
            <mat-cell *matCellDef="let ride">{{ride.driverName}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="passenger">
            <mat-header-cell *matHeaderCellDef>Passenger</mat-header-cell>
            <mat-cell *matCellDef="let ride">{{ride.passengerName}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="pickup">
            <mat-header-cell *matHeaderCellDef>Pickup</mat-header-cell>
            <mat-cell *matCellDef="let ride">{{ride.pickupLocation.address}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let ride">
              <mat-chip [class]="'status-' + ride.status">
                {{ride.status | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="fare">
            <mat-header-cell *matHeaderCellDef>Fare</mat-header-cell>
            <mat-cell *matCellDef="let ride">\${{ride.fare}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let ride">
              <button mat-icon-button color="primary">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>edit</mat-icon>
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
    .rides-container {
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
    
    .status-pending {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .status-accepted {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-started {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .status-completed {
      background-color: #f3e5f5;
      color: #6a1b9a;
    }
    
    .status-cancelled {
      background-color: #ffebee;
      color: #c62828;
    }
    
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
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
export class RidesComponent implements OnInit {
  displayedColumns = ['id', 'driver', 'passenger', 'pickup', 'status', 'fare', 'actions'];
  rides: any[] = [];

  ngOnInit(): void {
    this.loadRides();
  }

  private loadRides(): void {
    // Mock data
    this.rides = [
      {
        id: '001',
        driverName: 'John Smith',
        passengerName: 'Alice Johnson',
        pickupLocation: { address: '123 Main St, Downtown' },
        status: 'completed',
        fare: 25.50
      },
      {
        id: '002',
        driverName: 'Mike Wilson',
        passengerName: 'Bob Brown',
        pickupLocation: { address: '456 Park Ave, Midtown' },
        status: 'started',
        fare: 18.75
      },
      {
        id: '003',
        driverName: 'Sarah Davis',
        passengerName: 'Carol White',
        pickupLocation: { address: '789 Oak Rd, Suburbs' },
        status: 'pending',
        fare: 32.00
      }
    ];
  }
}