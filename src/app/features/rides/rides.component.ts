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
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.scss']
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