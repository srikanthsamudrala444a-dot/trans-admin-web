import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RideService } from '../../core/services/rides.service';

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.scss']
})
export class RideDetailsComponent implements OnInit {
  ride: any = null;
  isLoading = true;
  errorMessage = '';

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
}
