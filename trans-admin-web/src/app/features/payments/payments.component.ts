import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { 
  MatPaginatorModule,
  MatPaginator,
  MatPaginatorIntl 
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { 
  PaymentsService, 
  Payment, 
  PaymentStats, 
  PaginatedPayments, 
  PaymentFilters,
  PaymentStatus,
  TransactionType
} from '../../core/services/payments.service';

// Custom Paginator Factory Function
function customPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'Items per page:';
  paginatorIntl.nextPageLabel = 'Next page';
  paginatorIntl.previousPageLabel = 'Previous page';
  paginatorIntl.firstPageLabel = 'First page';
  paginatorIntl.lastPageLabel = 'Last page';
  
  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length === 0 || pageSize === 0) {
      return `0 of ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? 
      Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} of ${length}`;
  };
  
  return paginatorIntl;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: customPaginatorIntl }
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Data properties
  payments: Payment[] = [];
  stats: PaymentStats = {
    totalRevenue: 0,
    totalEarnings: 0,
    totalCommissions: 0,
    totalTaxes: 0,
    totalRefunds: 0,
    averageRideValue: 0,
    commissionRate: 0,
    refundRate: 0,
    totalTransactions: 0,
    pendingPayments: 0,
    failedPayments: 0
  };

  // Responsive design state
  isMobileView = false;

  // Table configuration
  displayedColumns: string[] = [
    'transactionId', 
    'type', 
    'driverName', 
    'amount', 
    'status', 
    'createdAt'
  ];
  
  // Mobile columns (without date)
  mobileColumns: string[] = [
    'transactionId', 
    'type', 
    'driverName', 
    'amount', 
    'status'
  ];

  get activeColumns(): string[] {
    return this.isMobileView ? this.mobileColumns : this.displayedColumns;
  }

  // Pagination
  totalItems = 0;
  totalPages = 1;
  currentPage = 1;
  itemsPerPage = 10;
  pageJumpValue: number | null = null;

  // Loading states
  loading = false;
  statsLoading = false;

  // Search and filters
  searchText = '';
  selectedStatus: PaymentStatus | '' = '';
  selectedType: TransactionType | '' = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  minAmount: number | null = null;
  maxAmount: number | null = null;

  // Expanded row for detailed breakdown
  expandedPayment: Payment | null = null;

  constructor(
    private paymentsService: PaymentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadPayments(1, this.itemsPerPage);
    this.loadStats();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        console.log('Paginator event:', event);
        // Update pagination properties
        this.currentPage = event.pageIndex + 1; // Paginator uses 0-based index, convert to 1-based
        this.itemsPerPage = event.pageSize;
        this.loadPayments(this.currentPage, this.itemsPerPage);
      });
    }
    
    // Listen for window resize
    window.addEventListener('resize', () => this.checkScreenSize());
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  loadPayments(page: number, pageSize: number): void {
    this.loading = true;
    this.currentPage = page;
    this.itemsPerPage = pageSize;

    const filters: PaymentFilters = {
      status: this.selectedStatus || undefined,
      type: this.selectedType || undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
      minAmount: this.minAmount || undefined,
      maxAmount: this.maxAmount || undefined
    };

    this.paymentsService.getPayments(page, pageSize, this.searchText, filters).subscribe({
      next: (response: PaginatedPayments) => {
        this.payments = response.payments;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.loading = false;

        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = page - 1;
          this.paginator.pageSize = pageSize;
        }
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.statsLoading = true;
    this.paymentsService.getPaymentStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.statsLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.statsLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.resetPagination();
    this.loadPayments(1, this.itemsPerPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFiltersChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.minAmount = null;
    this.maxAmount = null;
    this.applyFilters();
  }

  private resetPagination(): void {
    this.payments = [];
    this.totalItems = 0;
    this.totalPages = 1;
    this.currentPage = 1;

    if (this.paginator) {
      this.paginator.length = 0;
      this.paginator.pageIndex = 0;
    }
  }

  jumpToPage(): void {
    if (this.pageJumpValue && this.pageJumpValue >= 1 && this.pageJumpValue <= this.totalPages) {
      this.paginator.pageIndex = this.pageJumpValue - 1;
      this.loadPayments(this.pageJumpValue, this.itemsPerPage);
      this.pageJumpValue = null;
    }
  }

  togglePaymentDetails(payment: Payment): void {
    this.expandedPayment = this.expandedPayment?.id === payment.id ? null : payment;
  }

  getStatusClass(status: PaymentStatus): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Pending':
        return 'status-pending';
      case 'Failed':
        return 'status-failed';
      case 'Refunded':
        return 'status-refunded';
      case 'Processing':
        return 'status-processing';
      default:
        return '';
    }
  }

  getTypeClass(type: TransactionType): string {
    switch (type) {
      case 'Ride Payment':
        return 'type-ride-payment';
      case 'Driver Payout':
        return 'type-driver-payout';
      case 'Refund':
        return 'type-refund';
      case 'Commission':
        return 'type-commission';
      case 'Tax Deduction':
        return 'type-tax';
      case 'Bonus Payment':
        return 'type-bonus';
      default:
        return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  retryFailedPayment(payment: Payment): void {
    if (payment.status !== 'Failed') return;

    this.paymentsService.retryPayment(payment.id).subscribe({
      next: (updatedPayment) => {
        console.log('Payment retry successful:', updatedPayment);
        this.loadPayments(this.currentPage, this.itemsPerPage);
        this.loadStats();
      },
      error: (error) => {
        console.error('Error retrying payment:', error);
      }
    });
  }

  processRefund(payment: Payment): void {
    const refundAmount = payment.breakdown.totalAmount;
    const reason = 'Admin initiated refund';

    this.paymentsService.processRefund(payment.id, refundAmount, reason).subscribe({
      next: (updatedPayment) => {
        console.log('Refund processed:', updatedPayment);
        this.loadPayments(this.currentPage, this.itemsPerPage);
        this.loadStats();
      },
      error: (error) => {
        console.error('Error processing refund:', error);
      }
    });
  }

  exportPayments(): void {
    const filters: PaymentFilters = {
      status: this.selectedStatus || undefined,
      type: this.selectedType || undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
      minAmount: this.minAmount || undefined,
      maxAmount: this.maxAmount || undefined
    };

    this.paymentsService.exportPayments(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting payments:', error);
      }
    });
  }
}