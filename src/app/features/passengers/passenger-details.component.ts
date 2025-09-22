import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Passenger } from '../../core/models/ride.model';
import { PassengersService } from '../../core/services/passengers.service';
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
    private passengersService: PassengersService,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    const passengerId = this.route.snapshot.paramMap.get('passengerId');
    if (passengerId) {
      this.passengersService.getPassengerById(passengerId).subscribe({
        next: (data: any) => {
          this.passenger = data.passenger || data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load passenger details';
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
