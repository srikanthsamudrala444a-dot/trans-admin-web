import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './add-driver-dialog.component.html',
  styleUrl: './add-driver-dialog.component.scss',
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
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      photoUrl: [''], // Optional field
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
        photoUrl: formData.photoUrl || '',
      };

      console.log('Payload being sent to API:', driverData);
      console.log('Contact Number type:', typeof driverData.contactNumber);
      console.log('Date of Birth format:', driverData.dateOfBirth);

      this.dialogRef.close(driverData);
    }
  }
}
