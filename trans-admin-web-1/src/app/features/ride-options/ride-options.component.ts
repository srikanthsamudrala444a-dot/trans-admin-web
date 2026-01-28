import { Component, inject, OnInit } from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RideService } from '../../core/services/rides.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { RideOptions, VehicleCategory } from '../../core/models/ride.model';

@Component({
  selector: 'app-ride-options',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
  templateUrl: './ride-options.component.html',
  styleUrl: './ride-options.component.scss',
})
export class RideOptionsComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _rideService = inject(RideService);
  private readonly _snackBar = inject(MatSnackBar);

  isSubmitting = false;
  vehicleCategories = [
    { value: VehicleCategory.BIKE, label: 'Bike' },
    { value: VehicleCategory.CAB, label: 'Cab' },
    { value: VehicleCategory.AUTO, label: 'Auto Rickshaw' },
    { value: VehicleCategory.BUS, label: 'Bus' },
    { value: VehicleCategory.TRACTOR, label: 'Tractor' },
    { value: VehicleCategory.TRUCK, label: 'Truck' },
  ];

  rideOptionsForm: FormGroup = this._formBuilder.group({
    rideType: ['', [Validators.required, Validators.minLength(2)]],
    vehicleCategory: ['', Validators.required],
    baseFare: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    perKm: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    perMin: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
    ],
    seatCapacity: [
      null,
      [Validators.required, Validators.min(1), Validators.max(20)],
    ],
    iconUrl: ['', [Validators.required, this.urlValidator]],
  });

  submitOptionsForm() {
    if (this.rideOptionsForm.valid) {
      this.isSubmitting = true;

      console.log('Ride Options Form Data:', this.rideOptionsForm.value);

      this._rideService
        .createRideOptions(this.rideOptionsForm.value)
        .subscribe({
          next: (res) => {
            console.log('Ride submit res:', res);
            this.isSubmitting = false;
            this._snackBar.open('Option added successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });

            // Reset form after successful submission
            this.resetForm();
          },
          error: (err) => {
            console.log('Ride error form msg:', err);
            this.isSubmitting = false;

            let errorMessage = 'Failed to save ride option. Please try again.';

            // Handle specific error cases
            if (err.status === 400) {
              errorMessage = 'Invalid data provided. Please check your inputs.';
            } else if (err.status === 500) {
              errorMessage = 'Server error occurred. Please try again later.';
            } else if (err.error?.message) {
              errorMessage = err.error.message;
            }
          },
        });
    }
  }

  // Custom URL validator
  urlValidator(control: any) {
    const url = control.value;
    if (!url) return null;

    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url) ? null : { url: true };
  }

  resetForm() {
    this.rideOptionsForm.reset();
    this.isSubmitting = false;

    // Reset form validation state
    Object.keys(this.rideOptionsForm.controls).forEach((key) => {
      this.rideOptionsForm.get(key)?.setErrors({ required: true });
      this.rideOptionsForm.get(key)?.markAsPristine();
      this.rideOptionsForm.get(key)?.markAsUntouched();
    });

    this._snackBar.open('Form has been reset', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }
}
