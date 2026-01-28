import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { 
  MatPaginatorModule,
  MatPaginator
} from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

import { FinancialIncentivesService } from '../../core/services/financial-incentives.service';
import {
  FinancialIncentive,
  IncentiveType,
  IncentiveStatus,
  IncentiveFilters,
  IncentiveAnalytics,
  PaginatedIncentives,
  LoyaltyProgram,
  ReferralProgram,
  TopPerformerIncentive,
  IncentiveReward
} from '../../core/models/incentive.model';

@Component({
  selector: 'app-financial-incentives',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  templateUrl: './financial-incentives.component.html',
  styleUrls: ['./financial-incentives.component.scss']
})
export class FinancialIncentivesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Data sources
  incentivesDataSource = new MatTableDataSource<FinancialIncentive>();
  loyaltyPrograms: LoyaltyProgram[] = [];
  referralPrograms: ReferralProgram[] = [];
  
  // Analytics data
  analytics: IncentiveAnalytics | null = null;
  
  // UI state
  isLoading = false;
  selectedTabIndex = 0;
  
  // Filters
  filterForm: FormGroup;
  searchText = '';
  
  // Pagination
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  
  // Table configuration
  displayedColumns: string[] = [
    'name',
    'type',
    'status',
    'redemptions',
    'cost',
    'roi',
    'validPeriod',
    'actions'
  ];
  
  // Filter options
  incentiveTypes: { value: IncentiveType; label: string }[] = [
    { value: 'loyalty_points', label: 'Loyalty Points' },
    { value: 'cashback', label: 'Cashback' },
    { value: 'referral_bonus', label: 'Referral Bonus' },
    { value: 'ride_discount', label: 'Ride Discount' },
    { value: 'signup_bonus', label: 'Signup Bonus' },
    { value: 'milestone_reward', label: 'Milestone Reward' },
    { value: 'seasonal_offer', label: 'Seasonal Offer' },
    { value: 'tier_benefit', label: 'Tier Benefit' }
  ];
  
  incentiveStatuses: { value: IncentiveStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private incentivesService: FinancialIncentivesService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFilterSubscriptions();
  }

  ngAfterViewInit(): void {
    this.incentivesDataSource.paginator = this.paginator;
    this.incentivesDataSource.sort = this.sort;
  }

  private createFilterForm(): FormGroup {
    return this.formBuilder.group({
      status: [[]],
      type: [[]],
      dateRange: this.formBuilder.group({
        startDate: [null],
        endDate: [null]
      }),
      budgetRange: this.formBuilder.group({
        min: [null],
        max: [null]
      }),
      searchQuery: ['']
    });
  }

  private setupFilterSubscriptions(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private loadData(): void {
    this.loadIncentives();
    this.loadLoyaltyPrograms();
    this.loadReferralPrograms();
    this.loadAnalytics();
  }

  private loadIncentives(): void {
    this.isLoading = true;
    const filters = this.getActiveFilters();
    
    this.incentivesService.getIncentives(filters, this.currentPage, this.pageSize)
      .subscribe({
        next: (result: PaginatedIncentives) => {
          this.incentivesDataSource.data = result.data;
          this.totalItems = result.totalItems;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading incentives:', error);
          this.isLoading = false;
        }
      });
  }

  private loadLoyaltyPrograms(): void {
    this.incentivesService.getLoyaltyPrograms()
      .subscribe({
        next: (programs) => {
          this.loyaltyPrograms = programs;
        },
        error: (error) => {
          console.error('Error loading loyalty programs:', error);
        }
      });
  }

  private loadReferralPrograms(): void {
    this.incentivesService.getReferralPrograms()
      .subscribe({
        next: (programs) => {
          this.referralPrograms = programs;
        },
        error: (error) => {
          console.error('Error loading referral programs:', error);
        }
      });
  }

  private loadAnalytics(): void {
    this.incentivesService.getIncentiveAnalytics()
      .subscribe({
        next: (analytics) => {
          this.analytics = analytics;
        },
        error: (error) => {
          console.error('Error loading analytics:', error);
        }
      });
  }

  private getActiveFilters(): IncentiveFilters {
    const formValue = this.filterForm.value;
    const filters: IncentiveFilters = {};

    if (formValue.status?.length) {
      filters.status = formValue.status;
    }

    if (formValue.type?.length) {
      filters.type = formValue.type;
    }

    if (formValue.searchQuery) {
      filters.searchQuery = formValue.searchQuery;
    }

    if (formValue.dateRange?.startDate && formValue.dateRange?.endDate) {
      filters.dateRange = {
        startDate: formValue.dateRange.startDate,
        endDate: formValue.dateRange.endDate
      };
    }

    if (formValue.budgetRange?.min || formValue.budgetRange?.max) {
      filters.budgetRange = {
        min: formValue.budgetRange?.min || 0,
        max: formValue.budgetRange?.max || Number.MAX_SAFE_INTEGER
      };
    }

    return filters;
  }

  // Event handlers
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (index === 0) {
      this.loadIncentives();
    }
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadIncentives();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadIncentives();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.searchText = '';
    this.currentPage = 1;
    this.loadIncentives();
  }

  // Incentive actions
  createIncentive(): void {
    import('./dialogs/create-incentive-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateIncentiveDialogComponent, {
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        disableClose: true,
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadIncentives();
        }
      });
    });
  }

  editIncentive(incentive: FinancialIncentive): void {
    import('./dialogs/create-incentive-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateIncentiveDialogComponent, {
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        disableClose: true,
        data: { incentive }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadIncentives();
        }
      });
    });
  }

  duplicateIncentive(incentive: FinancialIncentive): void {
    this.incentivesService.duplicateIncentive(incentive.id)
      .subscribe({
        next: (duplicated) => {
          console.log('Incentive duplicated:', duplicated);
          this.loadIncentives();
        },
        error: (error) => {
          console.error('Error duplicating incentive:', error);
        }
      });
  }

  toggleIncentiveStatus(incentive: FinancialIncentive): void {
    const newStatus: IncentiveStatus = incentive.status === 'active' ? 'paused' : 'active';
    
    this.incentivesService.updateIncentive(incentive.id, { status: newStatus })
      .subscribe({
        next: () => {
          this.loadIncentives();
        },
        error: (error) => {
          console.error('Error updating incentive status:', error);
        }
      });
  }

  deleteIncentive(incentive: FinancialIncentive): void {
    if (confirm(`Are you sure you want to delete "${incentive.name}"?`)) {
      this.incentivesService.deleteIncentive(incentive.id)
        .subscribe({
          next: () => {
            this.loadIncentives();
          },
          error: (error) => {
            console.error('Error deleting incentive:', error);
          }
        });
    }
  }

  // Export functionality
  exportIncentivesData(): void {
    const filters = this.getActiveFilters();
    
    this.incentivesService.exportIncentivesData(filters)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `financial-incentives-${new Date().getTime()}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error exporting data:', error);
        }
      });
  }

  // Utility methods
  getStatusColor(status: IncentiveStatus): string {
    switch (status) {
      case 'active': return 'primary';
      case 'paused': return 'warn';
      case 'expired': return 'accent';
      case 'cancelled': return '';
      case 'draft': return 'accent';
      default: return '';
    }
  }

  getTypeIcon(type: IncentiveType): string {
    switch (type) {
      case 'loyalty_points': return 'stars';
      case 'cashback': return 'money';
      case 'referral_bonus': return 'people';
      case 'ride_discount': return 'local_offer';
      case 'signup_bonus': return 'card_giftcard';
      case 'milestone_reward': return 'emoji_events';
      case 'seasonal_offer': return 'celebration';
      case 'tier_benefit': return 'workspace_premium';
      default: return 'card_giftcard';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getIncentiveTypeLabel(type: IncentiveType): string {
    const typeOption = this.incentiveTypes.find(t => t.value === type);
    return typeOption ? typeOption.label : type;
  }

  getRewardValue(reward: IncentiveReward): string {
    if (reward.rewardType === 'fixed_amount') {
      return this.formatCurrency(reward.value);
    } else if (reward.rewardType === 'percentage') {
      return `${reward.value}%`;
    } else if (reward.rewardType === 'points') {
      return `${reward.value} points`;
    }
    return `${reward.value}`;
  }
}
