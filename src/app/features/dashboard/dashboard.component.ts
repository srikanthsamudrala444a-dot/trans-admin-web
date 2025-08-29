import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardStats, ChartData } from '../../core/models/dashboard.model';
import { Driver } from '../../core/models/ride.model';
import { HttpClientModule } from '@angular/common/http';
import { DriverService } from '../../core/services/driver.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;

  currentDriverLocation: Location | null = null;
  nearbyDrivers: Driver[] = [];
  drivers: Object | undefined;

  constructor(private driverService: DriverService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadDriverLocation('someDriverId123'); 
    this.loadNearbyDrivers(34.0522, -118.2437, 5); 
  }

  //  loadDriverLocation(driverId: string): void {
  //   this.driverService.getDriverLocation(driverId).subscribe({
  //     next: (location: Location) => {
  //       this.currentDriverLocation = location;
  //       console.log(`Location for driver ${driverId}:`, location);
  //       // You would typically display this on a map
  //     },
  //     error: (err: any) => {
  //       console.error(`Error fetching location for driver ${driverId}:`, err);
  //       // Handle error
  //     }
  //   });
  // }

  loadDriverLocation(driverId: string) {
  this.http.post('/driver/api/v1/drivers/location', { driverId }).subscribe({
    next: (data: any) => {
      this.loadDriverLocation = data;
      console.log('Driver Location:', data);
    },
    error: (err: any) => {
      console.error('Error fetching driver location', err);
    }
  });
}


loadDrivers(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        console.log('Drivers:', data);
        this.drivers = data; // save data to component variable
      },
      error: (err) => {
        console.error('Error fetching drivers', err);
      }
    });
  }


  loadNearbyDrivers(lat: number, lng: number, radius?: number): void {
    this.http.get<any[]>('http://localhost:3000/driver/all') // use correct backend port
  .subscribe({
    next: (drivers: any) => {
      console.log('Drivers:', drivers);
    },
    error: (error: any) => {
      console.error('Error fetching drivers:', error);
    }
  });
  }
  
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.stats = {
        totalRides: {
          today: 45,
          week: 312,
          month: 1248
        },
        activeDrivers: 28,
        totalPassengers: 1543,
        revenue: {
          today: 2150,
          week: 15780,
          month: 64320
        },
        liveRides: 12
      };
      this.isLoading = false;
    }, 1000);
  }
}