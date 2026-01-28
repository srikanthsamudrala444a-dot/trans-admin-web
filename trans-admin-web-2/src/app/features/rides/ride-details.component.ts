import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RideService } from '../../core/services/rides.service';

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.scss']
})
export class RideDetailsComponent implements OnInit {
  ride: any = null;
  isLoading = true;
  errorMessage = '';
  trackingData: any = null;
  isLoadingTracking = false;

  constructor(private route: ActivatedRoute, private router: Router, private ridesService: RideService) {}

  ngOnInit(): void {
    const rideId = this.route.snapshot.paramMap.get('rideId');
    if (rideId) {
      this.ridesService.getRideById(rideId).subscribe({
        next: (data: any) => {
          this.ride = data.ride || data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Failed to load ride details:', err);
          this.errorMessage = err?.error?.message || err?.message || 'Failed to load ride details';
          this.isLoading = false;
        }
      });
    }
  }

  backToRides() {
    this.router.navigate(['/rides']);
  }

  viewOnMap() {
    if (!this.ride?.rideId && !this.ride?.id) {
      console.error('No ride ID available for tracking');
      return;
    }

    const rideId = this.ride.rideId || this.ride.id;
    this.isLoadingTracking = true;

    this.ridesService.getRideTracking(rideId).subscribe({
      next: (trackingData: any) => {
        console.log('Tracking data received:', trackingData);
        this.trackingData = trackingData;
        this.isLoadingTracking = false;
        
        // Here you can implement map functionality
        // For now, we'll just log the data and show an alert
        alert(`Tracking data loaded for ride ${rideId}. Check console for details.`);
      },
      error: (err: any) => {
        console.error('Failed to load tracking data:', err);
        this.isLoadingTracking = false;
        alert('Failed to load tracking data. Please try again.');
      }
    });
  }
}
