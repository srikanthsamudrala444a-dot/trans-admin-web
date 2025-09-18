import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Passenger } from '../../core/models/ride.model';
import { PassengerService } from '../../core/services/passenger.service';
import { RideService } from '../../core/services/rides.service';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit {
  passenger: Passenger | null = null;
  isLoading = true;
  errorMessage = '';
  rideId: string = '';
  ride: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passengerService: PassengerService,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    const passengerId = this.route.snapshot.paramMap.get('passengerId');
    if (passengerId) {
      this.rideService.getRidesByPassenger(passengerId).subscribe({
        next: (data: any) => {
          // Debug: log the API response
          console.log('getRidesByPassenger response:', data);
          this.ride = Array.isArray(data.rides) ? data.rides[0] : null;
          this.isLoading = false;
          if (!this.ride) this.errorMessage = 'No rides found for this passenger.';
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load ride details for this passenger';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'No passengerId provided in the route.';
      this.isLoading = false;
    }
  }

  backToPassengers() {
    this.router.navigate(['/passengers']);
  }
}
