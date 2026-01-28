import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Zone } from '../../../core/models/pricing.model';

export interface SurgeActivationData {
  zone: Zone;
  currentMultiplier: number;
}

export interface SurgeActivationResult {
  multiplier: number;
  reason: string;
  duration: number; // in minutes
}

@Component({
  selector: 'app-surge-activation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './surge-activation-dialog.component.html',
  styleUrls: ['./surge-activation-dialog.component.scss']
})
export class SurgeActivationDialogComponent {
  surgeForm: FormGroup;
  multiplierValue = 1.5;
  
  predefinedReasons = [
    'High demand during peak hours',
    'Special event in the area',
    'Weather conditions affecting supply',
    'Airport rush hour',
    'Concert/Event traffic',
    'Public transport disruption',
    'Emergency situation',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SurgeActivationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SurgeActivationData
  ) {
    this.surgeForm = this.fb.group({
      multiplier: [1.5, [Validators.required, Validators.min(1.1), Validators.max(5.0)]],
      reason: ['', Validators.required],
      customReason: [''],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(480)]]
    });

    // Watch for reason changes
    this.surgeForm.get('reason')?.valueChanges.subscribe(value => {
      const customReasonControl = this.surgeForm.get('customReason');
      if (value === 'Other') {
        customReasonControl?.setValidators([Validators.required]);
      } else {
        customReasonControl?.clearValidators();
      }
      customReasonControl?.updateValueAndValidity();
    });
  }

  onMultiplierChange(event: any): void {
    const value = typeof event === 'number' ? event : event.value || event.target?.value;
    this.multiplierValue = Number(value);
    this.surgeForm.patchValue({ multiplier: this.multiplierValue });
  }

  formatMultiplierLabel(value: number): string {
    return `${value.toFixed(1)}x`;
  }

  getEstimatedImpact(): { revenue: number; demand: string } {
    const baseRevenue = 1000; // Mock base revenue
    const multiplier = this.surgeForm.get('multiplier')?.value || 1.5;
    const revenue = baseRevenue * multiplier;
    
    let demand = 'Low';
    if (multiplier >= 2.5) demand = 'High';
    else if (multiplier >= 1.8) demand = 'Medium';
    
    return { revenue, demand };
  }

  onSubmit(): void {
    if (this.surgeForm.valid) {
      const formValue = this.surgeForm.value;
      const reason = formValue.reason === 'Other' ? formValue.customReason : formValue.reason;
      
      const result: SurgeActivationResult = {
        multiplier: formValue.multiplier,
        reason: reason,
        duration: formValue.duration
      };
      
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
