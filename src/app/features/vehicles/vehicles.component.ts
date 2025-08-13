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
  selector: 'app-vehicles',
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
    <div class="vehicles-container">
      <div class="page-header">
        <h1>Vehicles Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add Vehicle
        </button>
      </div>
      
      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select>
                <mat-option value="all">All Types</mat-option>
                <mat-option value="sedan">Sedan</mat-option>
                <mat-option value="suv">SUV</mat-option>
                <mat-option value="hatchback">Hatchback</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select>
                <mat-option value="all">All Status</mat-option>
                <mat-option value="active">Active</mat-option>
                <mat-option value="maintenance">Maintenance</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Search by plate number or model">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card>
        <mat-table [dataSource]="vehicles">
          <ng-container matColumnDef="vehicle">
            <mat-header-cell *matHeaderCellDef>Vehicle</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <div class="vehicle-info">
                <mat-icon class="vehicle-icon">directions_car</mat-icon>
                <div>
                  <div class="vehicle-model">{{vehicle.make}} {{vehicle.model}}</div>
                  <div class="vehicle-year">{{vehicle.year}} • {{vehicle.color}}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="plateNumber">
            <mat-header-cell *matHeaderCellDef>Plate Number</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <strong>{{vehicle.plateNumber}}</strong>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="driver">
            <mat-header-cell *matHeaderCellDef>Driver</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <span *ngIf="vehicle.driverName; else noDriver">{{vehicle.driverName}}</span>
              <ng-template #noDriver>
                <span class="no-driver">Not Assigned</span>
              </ng-template>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="type">
            <mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <mat-chip class="type-chip">{{vehicle.type | titlecase}}</mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <mat-chip [class]="'status-' + vehicle.status">
                {{vehicle.status | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="documents">
            <mat-header-cell *matHeaderCellDef>Documents</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <mat-chip [class]="'docs-' + vehicle.documentsStatus">
                {{vehicle.documentsStatus | titlecase}}
              </mat-chip>
            </mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="lastService">
            <mat-header-cell *matHeaderCellDef>Last Service</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">{{vehicle.lastServiceDate | date:'shortDate'}}</mat-cell>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let vehicle">
              <button mat-icon-button color="primary">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon>build</mat-icon>
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
    .vehicles-container {
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
    
    .vehicle-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .vehicle-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3f51b5;
    }
    
    .vehicle-model {
      font-weight: 500;
      color: #333;
    }
    
    .vehicle-year {
      font-size: 0.875rem;
      color: #666;
    }
    
    .no-driver {
      color: #999;
      font-style: italic;
    }
    
    .type-chip {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .status-active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .status-maintenance {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .status-inactive {
      background-color: #f5f5f5;
      color: #666;
    }
    
    .docs-approved {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .docs-pending {
      background-color: #fff3e0;
      color: #e65100;
    }
    
    .docs-expired {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class VehiclesComponent implements OnInit {
  displayedColumns = ['vehicle', 'plateNumber', 'driver', 'type', 'status', 'documents', 'lastService', 'actions'];
  vehicles: any[] = [];

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {
    // Mock data
    this.vehicles = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'White',
        plateNumber: 'ABC-1234',
        driverName: 'John Smith',
        type: 'sedan',
        status: 'active',
        documentsStatus: 'approved',
        lastServiceDate: new Date('2023-12-15')
      },
      {
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        color: 'Silver',
        plateNumber: 'XYZ-5678',
        driverName: null,
        type: 'suv',
        status: 'inactive',
        documentsStatus: 'pending',
        lastServiceDate: new Date('2023-11-20')
      },
      {
        make: 'Hyundai',
        model: 'Elantra',
        year: 2020,
        color: 'Blue',
        plateNumber: 'DEF-9012',
        driverName: 'Mike Wilson',
        type: 'sedan',
        status: 'maintenance',
        documentsStatus: 'approved',
        lastServiceDate: new Date('2023-10-05')
      }
    ];
  }
}