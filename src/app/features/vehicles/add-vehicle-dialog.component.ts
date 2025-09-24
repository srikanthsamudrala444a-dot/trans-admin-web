import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DriverService } from '../../core/services/driver.service';

@Component({
  selector: 'app-add-vehicle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Add New Vehicle</h2>
    <mat-dialog-content>
      <form [formGroup]="vehicleForm" class="vehicle-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Make</mat-label>
            <input matInput formControlName="make" placeholder="Enter vehicle make (e.g., Toyota)">
            <mat-error *ngIf="vehicleForm.get('make')?.hasError('required')">
              Make is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Model</mat-label>
            <input matInput formControlName="model" placeholder="Enter vehicle model (e.g., Camry)">
            <mat-error *ngIf="vehicleForm.get('model')?.hasError('required')">
              Model is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Registration Number</mat-label>
            <input matInput formControlName="registrationNumber" placeholder="Enter registration number">
            <mat-error *ngIf="vehicleForm.get('registrationNumber')?.hasError('required')">
              Registration number is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Year of Manufacture</mat-label>
            <input matInput type="number" formControlName="yearOfManufacture" placeholder="Enter year">
            <mat-error *ngIf="vehicleForm.get('yearOfManufacture')?.hasError('required')">
              Year is required
            </mat-error>
            <mat-error *ngIf="vehicleForm.get('yearOfManufacture')?.hasError('min') || vehicleForm.get('yearOfManufacture')?.hasError('max')">
              Invalid year
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Vehicle Type</mat-label>
            <input matInput formControlName="type" placeholder="Enter vehicle type">
            <mat-error *ngIf="vehicleForm.get('type')?.hasError('required')">
              Vehicle type is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Color</mat-label>
            <input matInput formControlName="color" placeholder="Enter vehicle color">
            <mat-error *ngIf="vehicleForm.get('color')?.hasError('required')">
              Color is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Fuel Type</mat-label>
            <mat-select formControlName="fuelType">
              <mat-option value="PETROL">Petrol</mat-option>
              <mat-option value="DIESEL">Diesel</mat-option>
              <mat-option value="CNG">CNG</mat-option>
              <mat-option value="ELECTRIC">Electric</mat-option>
            </mat-select>
            <mat-error *ngIf="vehicleForm.get('fuelType')?.hasError('required')">
              Fuel type is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Passenger Capacity</mat-label>
            <input matInput type="number" formControlName="passengerCapacity" placeholder="Enter capacity">
            <mat-error *ngIf="vehicleForm.get('passengerCapacity')?.hasError('required')">
              Passenger capacity is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="BIKE">Bike</mat-option>
              <mat-option value="CAR">Car</mat-option>
              <mat-option value="AUTO">Auto</mat-option>
              <mat-option value="TRUCK">Truck</mat-option>
            </mat-select>
            <mat-error *ngIf="vehicleForm.get('category')?.hasError('required')">
              Category is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Driver ID</mat-label>
            <input matInput formControlName="driverId" placeholder="Enter driver ID (e.g., 68d163ab27c1ec731c730dc8)">
            <mat-hint>Enter the unique driver ID to assign this vehicle</mat-hint>
            <mat-error *ngIf="vehicleForm.get('driverId')?.hasError('required')">
              Driver ID is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Insurance Policy Number</mat-label>
            <input matInput formControlName="insurancePolicyNumber" placeholder="Enter policy number">
            <mat-error *ngIf="vehicleForm.get('insurancePolicyNumber')?.hasError('required')">
              Insurance policy number is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Insurance Expiry Date</mat-label>
            <input matInput type="date" formControlName="insuranceExpiryDate">
            <mat-error *ngIf="vehicleForm.get('insuranceExpiryDate')?.hasError('required')">
              Insurance expiry date is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Ownership Status</mat-label>
            <mat-select formControlName="ownershipStatus">
              <mat-option value="DRIVER_OWNED">Driver Owned</mat-option>
              <mat-option value="COMPANY_OWNED">Company Owned</mat-option>
              <mat-option value="LEASED">Leased</mat-option>
            </mat-select>
            <mat-error *ngIf="vehicleForm.get('ownershipStatus')?.hasError('required')">
              Ownership status is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Owner Name</mat-label>
            <input matInput formControlName="ownerName" placeholder="Enter owner name">
            <mat-error *ngIf="vehicleForm.get('ownerName')?.hasError('required')">
              Owner name is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Owner ID</mat-label>
            <input matInput formControlName="ownerId" placeholder="Enter owner ID">
            <mat-error *ngIf="vehicleForm.get('ownerId')?.hasError('required')">
              Owner ID is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Owner Type</mat-label>
            <mat-select formControlName="ownerType">
              <mat-option value="INDIVIDUAL">Individual</mat-option>
              <mat-option value="COMPANY">Company</mat-option>
              <mat-option value="ORGANIZATION">Organization</mat-option>
            </mat-select>
            <mat-error *ngIf="vehicleForm.get('ownerType')?.hasError('required')">
              Owner type is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Created By</mat-label>
            <input matInput formControlName="createdBy" placeholder="Enter created by">
            <mat-error *ngIf="vehicleForm.get('createdBy')?.hasError('required')">
              Created by is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Modified By</mat-label>
            <input matInput formControlName="modifiedBy" placeholder="Enter modified by">
            <mat-error *ngIf="vehicleForm.get('modifiedBy')?.hasError('required')">
              Modified by is required
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Photo URLs</mat-label>
          <textarea matInput formControlName="photoUrls" rows="2" placeholder="Enter photo URLs (one per line)"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!vehicleForm.valid">
        <mat-icon>add</mat-icon>
        Add Vehicle
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .vehicle-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 600px;
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
export class AddVehicleDialogComponent implements OnInit {
  vehicleForm: FormGroup;
  availableDrivers: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private driverService: DriverService
  ) {
    this.vehicleForm = this.fb.group({
      createdBy: ['', [Validators.required]],
      modifiedBy: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      model: ['', [Validators.required]],
      make: ['', [Validators.required]],
      yearOfManufacture: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      type: ['', [Validators.required]],
      color: ['', [Validators.required]],
      fuelType: ['PETROL', [Validators.required]],
      driverId: ['', [Validators.required]], // Driver ID is important as per requirement
      passengerCapacity: ['', [Validators.required, Validators.min(1)]],
      active: [true],
      insurancePolicyNumber: ['', [Validators.required]],
      insuranceExpiryDate: ['', [Validators.required]],
      photoUrls: [''], // Photo URLs as comma separated values
      ownershipStatus: ['DRIVER_OWNED', [Validators.required]],
      ownerName: ['', [Validators.required]],
      ownerId: ['', [Validators.required]],
      ownerType: ['INDIVIDUAL', [Validators.required]],
      category: ['BIKE', [Validators.required]],
      verified: [true]
    });
  }

  ngOnInit(): void {
    this.loadAvailableDrivers();
  }

  loadAvailableDrivers(): void {
    this.driverService.getAllDrivers({ pageNumber: 1, itemsPerPage: 100 }).subscribe({
      next: (response: any) => {
        if (response && response.data && response.data.content) {
          this.availableDrivers = response.data.content;
        }
      },
      error: (err: any) => {
        console.error('Error loading drivers:', err);
        // Continue without drivers list - user can still leave field empty
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.vehicleForm.valid) {
      const formData = this.vehicleForm.value;
      
      console.log('Form data from user:', formData);
      
      // Process photo URLs - convert from textarea to array
      const photoUrlsArray = formData.photoUrls 
        ? formData.photoUrls.split('\n').filter((url: string) => url.trim() !== '')
        : [];
      
      // Create payload matching the exact API format
      const vehicleData = {
        createdBy: formData.createdBy,
        modifiedBy: formData.modifiedBy,
        registrationNumber: formData.registrationNumber,
        model: formData.model,
        make: formData.make,
        yearOfManufacture: parseInt(formData.yearOfManufacture),
        type: formData.type,
        color: formData.color,
        fuelType: formData.fuelType,
        driverId: formData.driverId,
        passengerCapacity: parseInt(formData.passengerCapacity),
        active: formData.active,
        insurancePolicyNumber: formData.insurancePolicyNumber,
        insuranceExpiryDate: formData.insuranceExpiryDate,
        registeredAt: new Date().toISOString(),
        photoUrls: photoUrlsArray,
        ownershipStatus: formData.ownershipStatus,
        owner: {
          ownerName: formData.ownerName,
          ownerId: formData.ownerId,
          ownerType: formData.ownerType
        },
        category: formData.category,
        verified: formData.verified
      };
      
      console.log('Payload being sent to API:', vehicleData);
      
      this.dialogRef.close(vehicleData);
    }
  }
}
