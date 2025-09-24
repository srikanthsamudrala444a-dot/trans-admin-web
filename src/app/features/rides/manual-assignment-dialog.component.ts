import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-manual-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Manual Ride Assignment</h2>
    <mat-dialog-content>
      <form [formGroup]="rideForm" class="ride-form">
        
        <!-- Passenger and Driver Info -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Passenger ID</mat-label>
            <input matInput formControlName="passengerId" placeholder="Enter passenger ID">
            <mat-error *ngIf="rideForm.get('passengerId')?.hasError('required')">
              Passenger ID is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Driver ID</mat-label>
            <input matInput formControlName="driverId" placeholder="Enter driver ID">
            <mat-error *ngIf="rideForm.get('driverId')?.hasError('required')">
              Driver ID is required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Pickup Location -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Pickup Address</mat-label>
            <input matInput formControlName="pickupAddress" placeholder="Enter pickup address">
            <mat-error *ngIf="rideForm.get('pickupAddress')?.hasError('required')">
              Pickup address is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Pickup Coordinates</mat-label>
            <input matInput formControlName="pickupCoordinates" placeholder="lat,lng (e.g., 12.9716,77.5946)">
            <mat-error *ngIf="rideForm.get('pickupCoordinates')?.hasError('required')">
              Pickup coordinates are required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Destination -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Destination Address</mat-label>
            <input matInput formControlName="destinationAddress" placeholder="Enter destination address">
            <mat-error *ngIf="rideForm.get('destinationAddress')?.hasError('required')">
              Destination address is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Destination Coordinates</mat-label>
            <input matInput formControlName="destinationCoordinates" placeholder="lat,lng (e.g., 12.9351,77.6245)">
            <mat-error *ngIf="rideForm.get('destinationCoordinates')?.hasError('required')">
              Destination coordinates are required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Ride Details -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Ride Type</mat-label>
            <mat-select formControlName="rideType">
              <mat-option value="REGULAR">Regular</mat-option>
              <mat-option value="PREMIUM">Premium</mat-option>
              <mat-option value="SHARED">Shared</mat-option>
            </mat-select>
            <mat-error *ngIf="rideForm.get('rideType')?.hasError('required')">
              Ride type is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Fare Amount</mat-label>
            <input matInput type="number" formControlName="fareAmount" placeholder="Enter fare amount">
            <mat-error *ngIf="rideForm.get('fareAmount')?.hasError('required')">
              Fare amount is required
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Scheduled Time -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Scheduled Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="scheduledDate">
            <mat-hint>Leave empty for immediate ride</mat-hint>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Scheduled Time</mat-label>
            <input matInput type="time" formControlName="scheduledTime">
            <mat-hint>Leave empty for immediate ride</mat-hint>
          </mat-form-field>
        </div>

        <!-- Additional Info -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Special Instructions</mat-label>
          <textarea matInput formControlName="specialInstructions" rows="2" placeholder="Any special instructions for the ride"></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!rideForm.valid">
        <mat-icon>assignment</mat-icon>
        Create Ride
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .ride-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 700px;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      flex: 1;
    }
    
    mat-dialog-content {
      padding: 16px 24px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    mat-dialog-actions {
      padding: 8px 24px 16px;
    }
  `]
})
export class ManualAssignmentDialogComponent implements OnInit {
  rideForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ManualAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.rideForm = this.fb.group({
      passengerId: ['', [Validators.required]],
      driverId: ['', [Validators.required]],
      pickupAddress: ['', [Validators.required]],
      pickupCoordinates: ['', [Validators.required]],
      destinationAddress: ['', [Validators.required]],
      destinationCoordinates: ['', [Validators.required]],
      rideType: ['REGULAR', [Validators.required]],
      fareAmount: ['', [Validators.required, Validators.min(0)]],
      scheduledDate: [''],
      scheduledTime: [''],
      specialInstructions: ['']
    });
  }

  ngOnInit(): void {
    // Initialize with any passed data
    if (this.data) {
      this.rideForm.patchValue(this.data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.rideForm.valid) {
      const formData = this.rideForm.value;
      
      // Parse coordinates
      const pickupCoords = this.parseCoordinates(formData.pickupCoordinates);
      const destinationCoords = this.parseCoordinates(formData.destinationCoordinates);
      
      // Create scheduled datetime if both date and time are provided
      let scheduledDateTime = null;
      if (formData.scheduledDate && formData.scheduledTime) {
        const date = new Date(formData.scheduledDate);
        const [hours, minutes] = formData.scheduledTime.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));
        scheduledDateTime = date.toISOString();
      }
      
      // Create the ride data payload
      const rideData = {
        passengerId: formData.passengerId,
        driverId: formData.driverId,
        pickupLocation: {
          address: formData.pickupAddress,
          latitude: pickupCoords.lat,
          longitude: pickupCoords.lng
        },
        destination: {
          address: formData.destinationAddress,
          latitude: destinationCoords.lat,
          longitude: destinationCoords.lng
        },
        rideType: formData.rideType,
        fareAmount: parseFloat(formData.fareAmount),
        scheduledTime: scheduledDateTime,
        specialInstructions: formData.specialInstructions || null,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      console.log('Manual ride assignment payload:', rideData);
      
      this.dialogRef.close(rideData);
    }
  }

  private parseCoordinates(coordString: string): { lat: number, lng: number } {
    const coords = coordString.split(',').map(c => parseFloat(c.trim()));
    return {
      lat: coords[0] || 0,
      lng: coords[1] || 0
    };
  }
}
