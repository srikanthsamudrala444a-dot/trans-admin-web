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
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
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