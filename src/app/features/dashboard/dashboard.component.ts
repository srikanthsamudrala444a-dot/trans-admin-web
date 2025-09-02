import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardStats } from '../../core/models/dashboard.model';
import { HttpClient } from '@angular/common/http';

interface Driver {
  driverId: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  distanceKm?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;

  driverLocation: Driver | null = null;
  nearbyDrivers: Driver[] = [];
  driverService: any;

  constructor(private http: HttpClient) {}

  // ngOnInit(): void {
  //   this.loadDashboardData();
  //   this.loadDriverLocation();
  //   this.loadNearbyDrivers();
  // }

  ngOnInit(): void {
    this.loadDashboardData();
    this.driverService.getMockDriverLocation().subscribe({
      next: (data: Driver | null) => {
        this.driverLocation = data;
        console.log('Driver Location:', data);
      },
      error: (err: any) => {
        console.error('Error fetching driver location:', err);
      }
    });
    
    this.driverService.getMockNearbyDrivers().subscribe({
      next: (data: Driver[]) => {
        this.nearbyDrivers = data;
        console.log('Nearby Drivers:', data);
      },
      error: (err: any) => {
        console.error('Error fetching nearby drivers:', err);
      }
    });
  }

  loadDriverLocation(): void {
    this.http.get<Driver>('assets/mock/driver-location.json')
      .subscribe({
        next: (data) => {
          this.driverLocation = data;
          console.log('Driver Location:', data);
        },
        error: (err) => {
          console.error('Error fetching driver location:', err);
        }
      });
  }

  // Fetch nearby drivers from mock JSON
  loadNearbyDrivers(): void {
    this.http.get<Driver[]>('assets/mock/nearby-drivers.json')
      .subscribe({
        next: (data) => {
          this.nearbyDrivers = data;
          console.log('Nearby Drivers:', data);
        },
        error: (err) => {
          console.error('Error fetching nearby drivers:', err);
        }
      });
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Mock data - replace with actual service call later
    setTimeout(() => {
      this.stats = {
        totalRides: { today: 45, week: 312, month: 1248 },
        activeDrivers: 28,
        totalPassengers: 1543,
        revenue: { today: 2150, week: 15780, month: 64320 },
        liveRides: 12
      };
      this.isLoading = false;
    }, 1000);
  }
}
