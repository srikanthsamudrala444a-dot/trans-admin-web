import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DriverService } from '../../core/services/driver.service';
import { VehicleService } from '../../core/services/vehicles.service';
import { Driver } from '../../core/models/driver.model';
import { Vehicle } from '../../core/models/vehicle.model';
import { DriverDocumentsDialogComponent } from '../driver-documents-dialog/driver-documents-dialog.component';

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
  driver!: Driver;
  driverVehicles: Vehicle[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const driverId = this.route.snapshot.paramMap.get('driverId');
    if (driverId) {
      this.driverService.getDriverById(driverId).subscribe({
        next: (data: any) => {
          console.log('Driver details:', data);

          this.driver = data.driver;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Failed to load driver details:', err); // Debug log
          this.errorMessage =
            err?.error?.message ||
            err?.message ||
            'Failed to load driver details';
          this.isLoading = false;
        },
      });

      this.vehicleService.getVehiclesByDriver(driverId).subscribe({
        next: (res) => {
          console.log('Driver vehicles:', res.vehicles);
          this.driverVehicles = res.vehicles;
        },
        error(err) {
          console.log(err);
        },
      });
    }
  }

  backToDrivers() {
    this.router.navigate(['/drivers']);
  }

  openDocumentsDialog(driver: Driver): void {
    console.log('Opening documents dialog for driver:', driver);

    const driverId = driver.id || driver.userId;
    console.log('Using driver ID:', driverId);

    const dialogRef = this.dialog.open(DriverDocumentsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        driverId: driverId,
        driverName: `${driver.firstName} ${driver.lastName}`,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Documents dialog closed');
    });
  }
}
