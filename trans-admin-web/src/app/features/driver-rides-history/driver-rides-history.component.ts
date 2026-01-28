import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RideService } from '../../core/services/rides.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-driver-rides-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIcon,
    MatCardActions,
    MatButtonModule,
  ],
  templateUrl: './driver-rides-history.component.html',
  styleUrl: './driver-rides-history.component.scss',
})
export class DriverRidesHistoryComponent implements OnInit {
  private readonly _RideService = inject(RideService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _Location = inject(Location);

  driverId!: string;
  isLoading = true;
  rides: any[] = [];

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (res) => {
        this.driverId = res.get('driverId') ?? '';
        console.log('Driver id in component:', this.driverId);
        this.getDriverRideHistory(this.driverId);
      },
    });
  }

  getDriverRideHistory(driverId: string) {
    this._RideService.getDriverRideHistory(driverId).subscribe({
      next: (res) => {
        console.log('Driver rides history res', res);
        this.rides = res.rides;
      },
    });
  }

  goBack(): void {
    this._Location.back();
  }
}
