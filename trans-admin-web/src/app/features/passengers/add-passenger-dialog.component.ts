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
  selector: 'app-add-passenger-dialog',
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
    <h2 mat-dialog-title>Add New Passenger</h2>
    <mat-dialog-content>
      <form [formGroup]="passengerForm" class="passenger-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter full name">
          <mat-error *ngIf="passengerForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contact Number</mat-label>
          <input matInput type="number" formControlName="contactNumber" placeholder="Enter contact number">
          <mat-error *ngIf="passengerForm.get('contactNumber')?.hasError('required')">
            Contact number is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email Address</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Enter email address">
          <mat-error *ngIf="passengerForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="passengerForm.get('email')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Photo URL</mat-label>
          <input matInput formControlName="photoUrl" placeholder="Enter photo URL (optional)">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>User ID</mat-label>
          <input matInput formControlName="userId" placeholder="Enter user ID">
          <mat-error *ngIf="passengerForm.get('userId')?.hasError('required')">
            User ID is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tenant</mat-label>
          <input matInput formControlName="tenant" placeholder="Enter tenant">
          <mat-error *ngIf="passengerForm.get('tenant')?.hasError('required')">
            Tenant is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Created By</mat-label>
          <input matInput formControlName="createdBy" placeholder="Enter created by">
          <mat-error *ngIf="passengerForm.get('createdBy')?.hasError('required')">
            Created by is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Modified By</mat-label>
          <input matInput formControlName="modifiedBy" placeholder="Enter modified by">
          <mat-error *ngIf="passengerForm.get('modifiedBy')?.hasError('required')">
            Modified by is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!passengerForm.valid">
        Add Passenger
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .passenger-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 500px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
    }
    
    .half-width {
      flex: 1;
    }
    
    .full-width {
      width: 100%;
    }
    
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 0;
    }
    
    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class AddPassengerDialogComponent {
  passengerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPassengerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.passengerForm = this.fb.group({
      name: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      photoUrl: [''],
      userId: ['', [Validators.required]],
      tenant: ['', [Validators.required]],
      createdBy: ['', [Validators.required]],
      modifiedBy: ['', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.passengerForm.valid) {
      const formData = this.passengerForm.value;
      
      // Format the data according to the API requirements
      const passengerData = {
        createdBy: formData.createdBy,
        modifiedBy: formData.modifiedBy,
        name: formData.name,
        contactNumber: parseInt(formData.contactNumber),
        photoUrl: formData.photoUrl || "",
        email: formData.email,
        isDeleted: false,
        deleteReason: "",
        deletedAt: null,
        tenant: formData.tenant,
        userId: formData.userId
      };
      
      this.dialogRef.close(passengerData);
    }
  }
}
