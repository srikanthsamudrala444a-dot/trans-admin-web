import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

import {
  FinancialIncentive,
  IncentiveType,
  IncentiveStatus,
  TriggerEvent,
  IncentiveFrequency,
  RewardType
} from '../../../core/models/incentive.model';

import { FinancialIncentivesService } from '../../../core/services/financial-incentives.service';

@Component({
  selector: 'app-create-incentive-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSliderModule,
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './create-incentive-dialog.component.html',
  styleUrls: ['./create-incentive-dialog.component.scss']
})
export class CreateIncentiveDialogComponent implements OnInit {
  incentiveForm: FormGroup;
  isEditMode: boolean;
  isLoading = false;

  // Dropdown options
  incentiveTypes: { value: IncentiveType; label: string; description: string }[] = [
    { 
      value: 'loyalty_points', 
      label: 'Loyalty Points', 
      description: 'Award points that can be redeemed later' 
    },
    { 
      value: 'cashback', 
      label: 'Cashback', 
      description: 'Return a percentage of ride cost as cash' 
    },
    { 
      value: 'referral_bonus', 
      label: 'Referral Bonus', 
      description: 'Reward for successful referrals' 
    },
    { 
      value: 'ride_discount', 
      label: 'Ride Discount', 
      description: 'Percentage or fixed amount discount on rides' 
    },
    { 
      value: 'signup_bonus', 
      label: 'Signup Bonus', 
      description: 'Welcome bonus for new users' 
    },
    { 
      value: 'milestone_reward', 
      label: 'Milestone Reward', 
      description: 'Reward for reaching specific milestones' 
    },
    { 
      value: 'seasonal_offer', 
      label: 'Seasonal Offer', 
      description: 'Time-limited seasonal promotions' 
    },
    { 
      value: 'tier_benefit', 
      label: 'Tier Benefit', 
      description: 'Benefits based on user tier status' 
    }
  ];

  triggerEvents: { value: TriggerEvent; label: string }[] = [
    { value: 'ride_completion', label: 'Ride Completion' },
    { value: 'user_registration', label: 'User Registration' },
    { value: 'referral_success', label: 'Successful Referral' },
    { value: 'spending_milestone', label: 'Spending Milestone' },
    { value: 'ride_frequency', label: 'Ride Frequency' },
    { value: 'time_based', label: 'Time Based' }
  ];

  frequencyOptions: { value: IncentiveFrequency; label: string }[] = [
    { value: 'one_time', label: 'One Time Only' },
    { value: 'per_ride', label: 'Per Ride' },
    { value: 'daily', label: 'Once Per Day' },
    { value: 'weekly', label: 'Once Per Week' },
    { value: 'monthly', label: 'Once Per Month' },
    { value: 'milestone_based', label: 'Milestone Based' }
  ];

  rewardTypes: { value: RewardType; label: string }[] = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed_amount', label: 'Fixed Amount' },
    { value: 'points', label: 'Points' },
    { value: 'free_rides', label: 'Free Rides' },
    { value: 'upgrade', label: 'Service Upgrade' },
    { value: 'custom', label: 'Custom Reward' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateIncentiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { incentive?: FinancialIncentive },
    private incentivesService: FinancialIncentivesService,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data?.incentive;
    this.incentiveForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.incentive) {
      this.populateForm(this.data.incentive);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Basic Information
      basicInfo: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        type: ['', Validators.required],
        status: ['draft', Validators.required]
      }),

      // Rules Configuration
      rules: this.fb.group({
        triggerEvent: ['', Validators.required],
        frequency: ['', Validators.required],
        conditions: this.fb.array([])
      }),

      // Reward Configuration
      rewards: this.fb.group({
        type: ['', Validators.required],
        value: ['', [Validators.required, Validators.min(0)]],
        maxValue: [''],
        currency: ['USD']
      }),

      // Eligibility Criteria
      eligibility: this.fb.group({
        userTypes: this.fb.array([]),
        minRides: [''],
        minSpending: [''],
        cityRestrictions: this.fb.array([]),
        excludeExistingPromotions: [false]
      }),

      // Budget & Limitations
      budget: this.fb.group({
        totalBudget: ['', [Validators.required, Validators.min(1)]],
        maxRedemptionsPerUser: [''],
        maxTotalRedemptions: [''],
        dailyLimit: [''],
        monthlyLimit: ['']
      }),

      // Validity Period
      validity: this.fb.group({
        validFrom: ['', Validators.required],
        validTo: ['', Validators.required]
      })
    });
  }

  private populateForm(incentive: FinancialIncentive): void {
    this.incentiveForm.patchValue({
      basicInfo: {
        name: incentive.name,
        description: incentive.description,
        type: incentive.type,
        status: incentive.status
      },
      rules: {
        triggerEvent: incentive.rules.triggerEvent,
        frequency: incentive.rules.frequency
      },
      rewards: {
        type: incentive.rewards.rewardType,
        value: incentive.rewards.value,
        maxValue: 0, // Default value since it doesn't exist in model
        currency: incentive.rewards.currency || 'USD'
      },
      eligibility: {
        minRides: incentive.eligibility.minRideCount || 0,
        minSpending: incentive.eligibility.minSpendAmount || 0,
        excludeExistingPromotions: false // Default value since it doesn't exist in model
      },
      budget: {
        totalBudget: incentive.budget.totalBudget,
        maxRedemptionsPerUser: incentive.rules.limitations.maxRedemptionsPerUser || 0,
        maxTotalRedemptions: incentive.rules.limitations.maxRedemptionsTotal || 0,
        dailyLimit: 0, // Default value since it doesn't exist in model
        monthlyLimit: 0 // Default value since it doesn't exist in model
      },
      validity: {
        validFrom: new Date(incentive.validFrom),
        validTo: new Date(incentive.validTo)
      }
    });

    // Populate conditions array
    if (incentive.rules.conditions?.length) {
      const conditionsArray = this.incentiveForm.get('rules.conditions') as FormArray;
      incentive.rules.conditions.forEach(condition => {
        conditionsArray.push(this.fb.group({
          field: [condition.field],
          operator: [condition.operator],
          value: [condition.value],
          description: [condition.description]
        }));
      });
    }
  }

  // Condition management
  get conditionsArray(): FormArray {
    return this.incentiveForm.get('rules.conditions') as FormArray;
  }

  addCondition(): void {
    const conditionGroup = this.fb.group({
      field: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required],
      description: ['']
    });
    this.conditionsArray.push(conditionGroup);
  }

  removeCondition(index: number): void {
    this.conditionsArray.removeAt(index);
  }

  // Form validation helpers
  isStepValid(stepIndex: number): boolean {
    const stepNames = ['basicInfo', 'rules', 'rewards', 'eligibility', 'budget', 'validity'];
    const stepName = stepNames[stepIndex];
    const stepGroup = this.incentiveForm.get(stepName);
    return stepGroup ? stepGroup.valid : false;
  }

  getStepErrors(stepIndex: number): string[] {
    const stepNames = ['basicInfo', 'rules', 'rewards', 'eligibility', 'budget', 'validity'];
    const stepName = stepNames[stepIndex];
    const stepGroup = this.incentiveForm.get(stepName);
    const errors: string[] = [];

    if (stepGroup && stepGroup.errors) {
      Object.keys(stepGroup.errors).forEach(key => {
        errors.push(`${key}: ${stepGroup.errors![key]}`);
      });
    }

    return errors;
  }

  // Preview calculations
  calculateEstimatedCost(): number {
    const formValue = this.incentiveForm.value;
    const budget = formValue.budget?.totalBudget || 0;
    const maxRedemptions = formValue.budget?.maxTotalRedemptions || 100;
    const rewardValue = formValue.rewards?.value || 0;
    
    return Math.min(budget, maxRedemptions * rewardValue);
  }

  calculatePotentialReach(): number {
    const formValue = this.incentiveForm.value;
    return formValue.budget?.maxTotalRedemptions || 0;
  }

  // Form submission
  onSubmit(): void {
    if (this.incentiveForm.valid) {
      this.isLoading = true;
      const incentiveData = this.buildIncentiveData();

      const operation = this.isEditMode 
        ? this.incentivesService.updateIncentive(this.data.incentive!.id, incentiveData)
        : this.incentivesService.createIncentive(incentiveData);

      operation.subscribe({
        next: (result) => {
          this.isLoading = false;
          this.snackBar.open(
            `Incentive ${this.isEditMode ? 'updated' : 'created'} successfully!`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} incentive: ${error.message}`,
            'Close',
            { duration: 5000 }
          );
        }
      });
    } else {
      this.markFormGroupTouched(this.incentiveForm);
    }
  }

  private buildIncentiveData(): Omit<FinancialIncentive, "id" | "createdAt" | "updatedAt"> {
    const formValue = this.incentiveForm.value;
    
    return {
      name: formValue.basicInfo.name || '',
      description: formValue.basicInfo.description || '',
      type: formValue.basicInfo.type || 'loyalty_points',
      status: formValue.basicInfo.status || 'draft',
      rules: {
        triggerEvent: formValue.rules.triggerEvent,
        frequency: formValue.rules.frequency,
        conditions: formValue.rules.conditions || [],
        limitations: {
          maxRedemptionsPerUser: formValue.budget.maxRedemptionsPerUser || undefined,
          maxRedemptionsTotal: formValue.budget.maxTotalRedemptions || undefined,
          minimumRideAmount: formValue.budget.dailyLimit || undefined,
          maximumRideAmount: formValue.budget.monthlyLimit || undefined
        }
      },
      rewards: {
        rewardType: formValue.rewards.type,
        value: formValue.rewards.value,
        currency: formValue.rewards.currency || 'USD'
      },
      eligibility: {
        userTypes: formValue.eligibility.userTypes || [],
        minRideCount: formValue.eligibility.minRides || undefined,
        minSpendAmount: formValue.eligibility.minSpending || undefined,
        excludedUsers: []
      },
      budget: {
        totalBudget: formValue.budget.totalBudget || 0,
        spentAmount: 0,
        remainingBudget: formValue.budget.totalBudget || 0,
        budgetType: 'fixed' as const
      },
      performance: {
        totalRedemptions: 0,
        uniqueUsers: 0,
        totalCost: 0,
        conversionRate: 0,
        roi: 0,
        averageRewardValue: 0,
        revenueGenerated: 0
      },
      validFrom: formValue.validity.validFrom || new Date(),
      validTo: formValue.validity.validTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: 'current-user' // This should be replaced with actual user ID
    };
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Helper methods for template
  getRewardTypeLabel(): string {
    const rewardType = this.incentiveForm.get('rewards.type')?.value;
    return this.rewardTypes.find(t => t.value === rewardType)?.label || '';
  }

  getRewardValue(): any {
    return this.incentiveForm.get('rewards.value')?.value;
  }

  getRewardType(): RewardType {
    return this.incentiveForm.get('rewards.type')?.value;
  }

  getEligibilityFormGroup(): FormGroup {
    return this.incentiveForm.get('eligibility') as FormGroup;
  }

  getBudgetFormGroup(): FormGroup {
    return this.incentiveForm.get('budget') as FormGroup;
  }

  getValidityFormGroup(): FormGroup {
    return this.incentiveForm.get('validity') as FormGroup;
  }

  getBasicInfoFormGroup(): FormGroup {
    return this.incentiveForm.get('basicInfo') as FormGroup;
  }

  getRulesFormGroup(): FormGroup {
    return this.incentiveForm.get('rules') as FormGroup;
  }

  getRewardsFormGroup(): FormGroup {
    return this.incentiveForm.get('rewards') as FormGroup;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getSelectedTypeDescription(): string {
    const selectedType = this.incentiveForm.get('basicInfo.type')?.value;
    return this.incentiveTypes.find(type => type.value === selectedType)?.description || '';
  }

  isRewardTypeApplicable(rewardType: RewardType): boolean {
    const incentiveType = this.incentiveForm.get('basicInfo.type')?.value;
    
    // Logic to determine which reward types are applicable for each incentive type
    const applicableRewards: { [key in IncentiveType]: RewardType[] } = {
      'loyalty_points': ['points'],
      'cashback': ['percentage', 'fixed_amount'],
      'referral_bonus': ['fixed_amount', 'points'],
      'ride_discount': ['percentage', 'fixed_amount'],
      'signup_bonus': ['fixed_amount', 'points', 'free_rides'],
      'milestone_reward': ['fixed_amount', 'points', 'upgrade'],
      'seasonal_offer': ['percentage', 'fixed_amount', 'free_rides'],
      'tier_benefit': ['percentage', 'upgrade', 'points']
    };

    return applicableRewards[incentiveType as IncentiveType]?.includes(rewardType) || false;
  }
}
