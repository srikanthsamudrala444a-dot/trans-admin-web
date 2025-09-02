import { Component } from '@angular/core';
import { DriverService } from '../../core/services/driver.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';   
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({    
  selector: 'app-driver-location',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    FormsModule,
  ],
  templateUrl: './driver-location.component.html',
  styleUrls: ['./driver-location.component.scss']
})
export class DriverLocationComponent {
  driverId: string = '';
  latitude: string = '';
  longitude: string = '';
  nearbyDrivers: any[] = [];

  constructor(private driverService: DriverService, private http: HttpClient) {}

  updateLocation() {
    this.driverService.updateDriverLocation(this.driverId, { latitude: this.latitude, longitude: this.longitude })
      .subscribe({
        next: (res) => console.log('Location updated:', res),
        error: (err) => console.error('Error updating location:', err)
      });
  }

  fetchNearby() {
    this.driverService.getNearbyDrivers(17.3850, 78.4867, 5)
      .subscribe({
        next: (res) => {
          console.log('Nearby drivers:', res);
          this.nearbyDrivers = res;
        },
        error: (err) => console.error('Error fetching nearby drivers:', err)
      });
  }
}
