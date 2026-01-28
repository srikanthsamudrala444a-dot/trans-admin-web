import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-promotion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './create-promotion-dialog.component.html',
  styleUrls: ['./create-promotion-dialog.component.scss']
})
export class CreatePromotionDialogComponent {
  promotionForm: FormGroup;
  isEdit = false;

  promotionTypes = [
    { value: 'discount-code', label: 'Discount Code' },
    { value: 'referral-bonus', label: 'Referral Bonus' },
    { value: 'offer', label: 'Offer' }
  ];

  discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePromotionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data.isEdit || false;
    const promotion = data.promotion;

    this.promotionForm = this.fb.group({
      name: [promotion?.name || '', [Validators.required, Validators.minLength(3)]],
      type: [promotion?.type || '', Validators.required],
      code: [promotion?.code || ''],
      discountType: [promotion?.discountType || 'percentage', Validators.required],
      discountValue: [promotion?.discountValue || '', [Validators.required, Validators.min(1)]],
      maxUsage: [promotion?.maxUsage || '', [Validators.required, Validators.min(1)]],
      validFrom: [promotion?.validFrom || '', Validators.required],
      validTo: [promotion?.validTo || '', Validators.required],
      description: [promotion?.description || '']
    });

    // Watch type changes to conditionally require code field
    this.promotionForm.get('type')?.valueChanges.subscribe(type => {
      const codeControl = this.promotionForm.get('code');
      if (type === 'discount-code' || type === 'offer') {
        codeControl?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        codeControl?.clearValidators();
      }
      codeControl?.updateValueAndValidity();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.promotionForm.valid) {
      const formValue = this.promotionForm.value;
      const promotion = {
        ...formValue,
        id: Date.now().toString(),
        status: 'Active',
        usage: 0
      };
      this.dialogRef.close(promotion);
    }
  }

  getDiscountLabel(): string {
    const type = this.promotionForm.get('discountType')?.value;
    return type === 'percentage' ? '%' : '₹';
  }
}
