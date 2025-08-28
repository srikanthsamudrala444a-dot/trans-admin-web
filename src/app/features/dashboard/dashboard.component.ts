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

  constructor(private driverService: DriverService) {}

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
    this.driverService.getDriverLocation(driverId).subscribe({
      next: (data: any) => {
        this.loadDriverLocation = data;
        console.log('Driver Location:', data);
      },
      error: (err: any) => console.error('Error fetching driver location', err)
    });
  }

    loadNearbyDrivers(lat: number, lng: number, radius?: number): void {
    this.driverService.getNearbyDrivers(lat, lng, radius ?? 0).subscribe({
      next: (drivers: Driver[]) => {
        this.nearbyDrivers = drivers; 
        console.log(`Nearby drivers (${lat}, ${lng}, ${radius || 'all'}):`, drivers);
        // Display these drivers on a map or in a list
      },
      error: (err: any) => {
        console.error('Error fetching nearby drivers:', err);
        // Handle error
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