import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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
    ReactiveFormsModule
  ],
  templateUrl: './manual-assignment-dialog.component.html',
  styleUrls: ['./manual-assignment-dialog.component.scss']
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
      destinationAddress: ['', [Validators.required]],
      rideType: ['REGULAR', [Validators.required]],
      fareAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Initialize with any passed data
    if (this.data) {
      this.rideForm.patchValue(this.data);
    }
  }

  onCancel(): void {
    // Reset the form to initial state
    this.rideForm.reset();
    this.rideForm.patchValue({
      rideType: 'REGULAR' // Set default value for ride type
    });
  }
  
  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.rideForm.valid) {
      const formData = this.rideForm.value;
      
      // Create the ride data payload with simplified structure
      const rideData = {
        passengerId: formData.passengerId,
        driverId: formData.driverId,
        pickupLocation: {
          address: formData.pickupAddress,
          latitude: 0, // Will be geocoded by backend
          longitude: 0
        },
        destination: {
          address: formData.destinationAddress,
          latitude: 0, // Will be geocoded by backend
          longitude: 0
        },
        rideType: formData.rideType,
        fareAmount: parseFloat(formData.fareAmount),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      console.log('Manual ride assignment payload:', rideData);
      
      this.dialogRef.close(rideData);
    }
  }
}
