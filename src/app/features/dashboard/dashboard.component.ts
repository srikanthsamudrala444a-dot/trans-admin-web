import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DashboardStats } from '../../core/models/dashboard.model';
import { HttpClient } from '@angular/common/http';
import { DriverService } from '../../core/services/driver.service';
import { VehicleService } from '../../core/services/vehicles.service';
import { Driver } from '../../core/models/ride.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AddDriverDialogComponent } from '../drivers/add-driver-dialog.component';
import { AddVehicleDialogComponent } from '../vehicles/add-vehicle-dialog.component';


interface DriverLocation {
  id: number;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;


  nearbyDrivers: Driver[] = [];
  driverLocations: DriverLocation[] = [];
  driver: any;


  constructor(
    private http: HttpClient, 
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private dialog: MatDialog
  ) {}

  private apiUrl = '/api/v1/drivers';

ngOnInit(): void {
  this.loadDashboardData();
  // this.loadNearbyDrivers();
  // this.loadDriverLocations();
}

loadDriverLocations(driverId: number): void {
  this.http.get<DriverLocation[]>(`${this.apiUrl}/assets/mock/driver-location/${driverId}`)
    .subscribe({
      next: (data) => {
        console.log('Driver locations:', data);
         this.driverLocations = data;
      },
      error: (err) => {
        console.error('Parsing error:', err.message);
        console.error('Full error object:', err);
      }
    });
}


loadNearbyDrivers(lat: number, lng: number, radius: number): void {
  this.http.get<Driver[]>(`${this.apiUrl}/nearby-drivers`, {
    params: { lat, lng, radius }
  }).subscribe({
    next: (data) => {
      this.nearbyDrivers = data;
      console.log('Nearby Drivers:', data);
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error fetching nearby drivers:', err);
    }
  });
}

updateDriverLocation(id: string, location: any):void {
  this.http.put<DriverLocation>(`${this.apiUrl}/location/${id}`, location).subscribe({
    next: (data) => {
      console.log('Driver Location Updated:', data);
      const index = this.driverLocations.findIndex(loc => loc.id === data.id);
      if (index !== -1) {
        this.driverLocations[index] = data;
      } else {
        this.driverLocations.push(data);
      }
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error updating driver location:', err.message);
    }
  });
}

openAddDriverDialog(): void {
  const dialogRef = this.dialog.open(AddDriverDialogComponent, {
    width: '500px',
    data: {},
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.addNewDriver(result);
    }
  });
}

addNewDriver(newDriverData: any): void {
  console.log('Attempting to register driver with data:', newDriverData);

  this.driverService.registerDriver(newDriverData).subscribe({
    next: (response: any) => {
      console.log('New driver registered successfully:', response);
      // Show success message
      alert('Driver registered successfully!');

      // Reload dashboard data to reflect new stats
      this.loadDashboardData();
    },
    error: (err: any) => {
      console.error('Error registering driver:', err);
      console.error('Full error details:', {
        status: err.status,
        statusText: err.statusText,
        error: err.error,
        message: err.message,
        url: err.url,
      });

      // Show error message to user
      alert('Error registering driver. Please try again.');
    }
  });
}

openAddVehicleDialog(): void {
  const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
    width: '800px',
    maxHeight: '90vh',
    data: {}
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.addNewVehicle(result);
    }
  });
}

addNewVehicle(vehicleData: any): void {
  console.log('Attempting to register vehicle with data:', vehicleData);
  
  this.vehicleService.registerVehicle(vehicleData).subscribe({
    next: (response: any) => {
      console.log('New vehicle registered successfully:', response);
      // Show success message
      alert('Vehicle registered successfully!');
      
      // Reload dashboard data to reflect new stats
      this.loadDashboardData();
    },
    error: (err: any) => {
      console.error('Error registering vehicle:', err);
      console.error('Full error details:', {
        status: err.status,
        statusText: err.statusText,
        error: err.error,
        message: err.message,
        url: err.url,
      });

      // Show error message to user
      alert('Error registering vehicle. Please try again.');
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
