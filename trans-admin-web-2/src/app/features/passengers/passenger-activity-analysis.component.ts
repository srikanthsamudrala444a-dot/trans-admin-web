import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { 
  PassengerActivity, 
  TripLog, 
  WalletTransaction, 
  DriverFeedback,
  ActivityFilters,
  VehicleCategory
} from '../../core/models/ride.model';
import { PassengerActivityService } from '../../core/services/passenger-activity.service';

@Component({
  selector: 'app-passenger-activity-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './passenger-activity-analysis.component.html',
  styleUrls: ['./passenger-activity-analysis.component.scss']
})
export class PassengerActivityAnalysisComponent implements OnInit {
  @Input() passengerId!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Data properties
  passengerActivity: PassengerActivity | null = null;
  tripLogs: TripLog[] = [];
  walletTransactions: WalletTransaction[] = [];
  driverFeedbacks: DriverFeedback[] = [];
  
  // UI state
  isLoading = false;
  selectedTab = 0;
  
  // Filters
  filterForm: FormGroup;
  
  // Table configurations
  tripsColumns = ['rideId', 'status', 'pickup', 'dropoff', 'scheduledTime', 'fare', 'paymentMethod', 'driverName', 'rating'];
  walletColumns = ['type', 'amount', 'description', 'paymentMethod', 'status', 'balanceAfter', 'createdAt'];
  feedbackColumns = ['driverName', 'rating', 'feedback', 'categories', 'rideDate'];
  
  // Enum references for template
  VehicleCategory = VehicleCategory;
  
  constructor(
    private passengerActivityService: PassengerActivityService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      dateRange: this.fb.group({
        startDate: [null],
        endDate: [null]
      }),
      status: [[]],
      paymentMethod: [[]],
      vehicleType: [[]],
      ratingRange: this.fb.group({
        min: [null],
        max: [null]
      }),
      amountRange: this.fb.group({
        min: [null],
        max: [null]
      })
    });
  }

  ngOnInit(): void {
    if (this.passengerId) {
      this.loadCompleteActivity();
    }
    
    // Subscribe to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadCompleteActivity(): void {
    this.isLoading = true;
    this.passengerActivityService.getCompletePassengerActivity(this.passengerId)
      .subscribe({
        next: (activity) => {
          this.passengerActivity = activity;
          this.tripLogs = activity.recentTrips;
          this.walletTransactions = activity.recentTransactions;
          this.driverFeedbacks = activity.recentFeedbacks;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading passenger activity:', error);
          this.snackBar.open('Error loading passenger activity data', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  loadTripLogs(): void {
    const filters = this.buildFilters();
    this.passengerActivityService.getPassengerTripLogs(this.passengerId, filters)
      .subscribe({
        next: (trips) => {
          this.tripLogs = trips;
        },
        error: (error) => {
          console.error('Error loading trip logs:', error);
          this.snackBar.open('Error loading trip logs', 'Close', { duration: 3000 });
        }
      });
  }

  loadWalletTransactions(): void {
    const filters = this.buildFilters();
    this.passengerActivityService.getWalletTransactions(this.passengerId, filters)
      .subscribe({
        next: (transactions) => {
          this.walletTransactions = transactions;
        },
        error: (error) => {
          console.error('Error loading wallet transactions:', error);
          this.snackBar.open('Error loading wallet transactions', 'Close', { duration: 3000 });
        }
      });
  }

  loadDriverFeedbacks(): void {
    const filters = this.buildFilters();
    this.passengerActivityService.getDriverFeedbacks(this.passengerId, filters)
      .subscribe({
        next: (feedbacks) => {
          this.driverFeedbacks = feedbacks;
        },
        error: (error) => {
          console.error('Error loading driver feedbacks:', error);
          this.snackBar.open('Error loading driver feedbacks', 'Close', { duration: 3000 });
        }
      });
  }

  buildFilters(): ActivityFilters {
    const formValue = this.filterForm.value;
    const filters: ActivityFilters = {};

    if (formValue.dateRange.startDate && formValue.dateRange.endDate) {
      filters.dateRange = {
        startDate: formValue.dateRange.startDate,
        endDate: formValue.dateRange.endDate
      };
    }

    if (formValue.status && formValue.status.length > 0) {
      filters.status = formValue.status;
    }

    if (formValue.paymentMethod && formValue.paymentMethod.length > 0) {
      filters.paymentMethod = formValue.paymentMethod;
    }

    if (formValue.vehicleType && formValue.vehicleType.length > 0) {
      filters.vehicleType = formValue.vehicleType;
    }

    if (formValue.ratingRange.min || formValue.ratingRange.max) {
      filters.ratingRange = {
        min: formValue.ratingRange.min || 0,
        max: formValue.ratingRange.max || 5
      };
    }

    if (formValue.amountRange.min || formValue.amountRange.max) {
      filters.amountRange = {
        min: formValue.amountRange.min || 0,
        max: formValue.amountRange.max || 10000
      };
    }

    return filters;
  }

  applyFilters(): void {
    switch (this.selectedTab) {
      case 1:
        this.loadTripLogs();
        break;
      case 2:
        this.loadWalletTransactions();
        break;
      case 3:
        this.loadDriverFeedbacks();
        break;
    }
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    switch (index) {
      case 1:
        this.loadTripLogs();
        break;
      case 2:
        this.loadWalletTransactions();
        break;
      case 3:
        this.loadDriverFeedbacks();
        break;
    }
  }

  // Export functions
  exportTrips(): void {
    const filters = this.buildFilters();
    this.passengerActivityService.exportTripData(this.passengerId, filters)
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `passenger-${this.passengerId}-trips.csv`);
        },
        error: (error) => {
          console.error('Error exporting trips:', error);
          this.snackBar.open('Error exporting trip data', 'Close', { duration: 3000 });
        }
      });
  }

  exportWallet(): void {
    const filters = this.buildFilters();
    this.passengerActivityService.exportWalletData(this.passengerId, filters)
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `passenger-${this.passengerId}-wallet.csv`);
        },
        error: (error) => {
          console.error('Error exporting wallet data:', error);
          this.snackBar.open('Error exporting wallet data', 'Close', { duration: 3000 });
        }
      });
  }

  exportFeedbacks(): void {
    const filters = this.buildFilters();
    this.passengerActivityService.exportFeedbackData(this.passengerId, filters)
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `passenger-${this.passengerId}-feedbacks.csv`);
        },
        error: (error) => {
          console.error('Error exporting feedback data:', error);
          this.snackBar.open('Error exporting feedback data', 'Close', { duration: 3000 });
        }
      });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    this.snackBar.open('Export completed successfully', 'Close', { duration: 3000 });
  }

  // Utility methods
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'completed': '#4CAF50',
      'cancelled': '#F44336',
      'scheduled': '#2196F3',
      'no-show': '#FF9800'
    };
    return colors[status] || '#9E9E9E';
  }

  getPaymentStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'completed': '#4CAF50',
      'pending': '#FF9800',
      'failed': '#F44336',
      'refunded': '#9C27B0'
    };
    return colors[status] || '#9E9E9E';
  }

  getTransactionTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'credit': '#4CAF50',
      'debit': '#F44336',
      'refund': '#9C27B0',
      'topup': '#2196F3'
    };
    return colors[type] || '#9E9E9E';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDistance(km: number): string {
    return `${km.toFixed(1)} km`;
  }

  formatDuration(minutes: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  getRatingStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  getCategoryRatingColor(rating: number): string {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 3.5) return '#FF9800';
    if (rating >= 2.5) return '#FF5722';
    return '#F44336';
  }

  // Additional utility methods for template
  getRatingPercentage(rating: number): number {
    if (!this.passengerActivity?.feedbackSummary) return 0;
    const count = this.getRatingCount(rating);
    return (count / this.passengerActivity.feedbackSummary.totalFeedbacks) * 100;
  }

  getRatingCount(rating: number): number {
    if (!this.passengerActivity?.feedbackSummary) return 0;
    return this.passengerActivity.feedbackSummary.ratingDistribution[rating as keyof typeof this.passengerActivity.feedbackSummary.ratingDistribution] || 0;
  }

  getCategoryAverage(category: string): number {
    if (!this.passengerActivity?.feedbackSummary) return 0;
    return this.passengerActivity.feedbackSummary.categoryAverages[category as keyof typeof this.passengerActivity.feedbackSummary.categoryAverages] || 0;
  }
}
