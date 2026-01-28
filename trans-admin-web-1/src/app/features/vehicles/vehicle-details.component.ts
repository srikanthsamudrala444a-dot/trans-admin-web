import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatDialogModule,
    MatTooltipModule,
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
    private vehicleService: VehicleService,
    private dialog: MatDialog
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

  openDocumentsDialog(vehicle: any): void {
    console.log('Opening documents dialog for vehicle:', vehicle);

    const vehicleId = vehicle.id || vehicle.vehicleId;
    console.log('Using vehicle ID:', vehicleId);

    // For now, show a simple alert - we'll implement the actual dialog later
    alert(`Opening documents for vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})\nVehicle ID: ${vehicleId}`);
    
    // TODO: Implement actual vehicle documents dialog
    // const dialogRef = this.dialog.open(VehicleDocumentsDialogComponent, {
    //   width: '800px',
    //   maxWidth: '90vw',
    //   maxHeight: '90vh',
    //   data: {
    //     vehicleId: vehicleId,
    //     vehicleName: `${vehicle.make} ${vehicle.model}`,
    //   },
    // });

    // dialogRef.afterClosed().subscribe(() => {
    //   console.log('Documents dialog closed');
    // });
  }
}
