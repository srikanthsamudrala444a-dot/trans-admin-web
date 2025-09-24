import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-driver-dialog',
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
    <h2 mat-dialog-title>Add New Driver</h2>
    <mat-dialog-content>
      <form [formGroup]="driverForm" class="driver-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="Enter first name">
            <mat-error *ngIf="driverForm.get('firstName')?.hasError('required')">
              First name is required
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Enter last name">
            <mat-error *ngIf="driverForm.get('lastName')?.hasError('required')">
              Last name is required
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date of Birth</mat-label>
          <input matInput type="date" formControlName="dateOfBirth">
          <mat-error *ngIf="driverForm.get('dateOfBirth')?.hasError('required')">
            Date of birth is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter email address">
          <mat-error *ngIf="driverForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="driverForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contact Number</mat-label>
          <input matInput type="number" formControlName="contactNumber" placeholder="Enter contact number (numbers only)">
          <mat-error *ngIf="driverForm.get('contactNumber')?.hasError('required')">
            Contact number is required
          </mat-error>
          <mat-error *ngIf="driverForm.get('contactNumber')?.hasError('pattern')">
            Please enter a valid contact number (10-15 digits)
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Driving License Number</mat-label>
          <input matInput formControlName="drivingLicense" placeholder="Enter driving license number">
          <mat-error *ngIf="driverForm.get('drivingLicense')?.hasError('required')">
            Driving license number is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>User ID</mat-label>
          <input matInput formControlName="userId" placeholder="Enter user ID">
          <mat-error *ngIf="driverForm.get('userId')?.hasError('required')">
            User ID is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Photo URL (Optional)</mat-label>
          <input matInput formControlName="photoUrl" placeholder="Enter photo URL">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!driverForm.valid">
        <mat-icon>add</mat-icon>
        Add Driver
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .driver-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
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
    }
    
    mat-dialog-actions {
      padding: 8px 24px 16px;
    }
  `]
})
export class AddDriverDialogComponent {
  driverForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.driverForm = this.fb.group({
      userId: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      drivingLicense: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      photoUrl: [''] // Optional field
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.driverForm.valid) {
      const formData = this.driverForm.value;
      
      console.log('Form data from user:', formData);
      
      // Create payload matching the exact API format
      const driverData = {
        userId: formData.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        drivingLicense: formData.drivingLicense,
        contactNumber: Number(formData.contactNumber),
        email: formData.email,
        photoUrl: formData.photoUrl || ""
      };
      
      console.log('Payload being sent to API:', driverData);
      console.log('Contact Number type:', typeof driverData.contactNumber);
      console.log('Date of Birth format:', driverData.dateOfBirth);
      
      this.dialogRef.close(driverData);
    }
  }
}
