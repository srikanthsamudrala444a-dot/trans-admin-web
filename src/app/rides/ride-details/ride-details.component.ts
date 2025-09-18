import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RideService } from '../../core/services/rides.service';

// Update the import path below if your Ride model is located elsewhere
import { Ride } from '../../core/models/ride.model';

// If the file does not exist, create '../../../core/models/ride.model.ts' and define the Ride interface or class there.

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule,],
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.scss']
})
export class RideDetailsComponent implements OnInit {
  ride: Ride | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rideService: RideService
  ) {}
  rideId: Ride | null = null;
  ngOnInit(): void {
    const rideId = this.route.snapshot.paramMap.get('rideId');
    if (rideId) {
      this.rideService.getRideById(rideId).subscribe({
  next: (data: any) => {
    this.ride = data.ride; 
    this.isLoading = false;
  },
  error: (err: any) => {
    this.errorMessage = 'Failed to load ride details';
    this.isLoading = false;
    console.error(err);
  }
});

    }
  }

  backToRides() {
    this.router.navigate(['/rides']);
  }
}
