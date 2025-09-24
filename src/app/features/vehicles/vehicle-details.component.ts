import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../core/services/vehicles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss'],
})
export class VehicleDetailsComponent implements OnInit {
  vehicle: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('vehicleId');
    if (vehicleId) {
      this.vehicleService.getVehicleById(vehicleId).subscribe({
        next: (data: any) => {
          this.vehicle = data.vehicle || data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Failed to load vehicle details:', err);
          this.errorMessage =
            err?.error?.message ||
            err?.message ||
            'Failed to load vehicle details';
          this.isLoading = false;
        },
      });
    }
  }

  backToVehicles() {
    this.router.navigate(['/vehicles']);
  }
}
