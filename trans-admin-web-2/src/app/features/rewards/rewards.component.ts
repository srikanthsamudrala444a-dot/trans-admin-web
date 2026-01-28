import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { 
  MatPaginatorModule,
  MatPaginator,
  MatPaginatorIntl 
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CreatePromotionDialogComponent } from './create-promotion-dialog/create-promotion-dialog.component';
import { RewardsService, Promotion, PromotionStats, PaginatedPromotions } from '../../core/services/rewards.service';

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
  selector: 'app-rewards',
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
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'type', 'code', 'discount', 'validity', 'status', 'usage'];
  
  promotions: Promotion[] = [];
  stats: PromotionStats = {
    activePromotions: 0,
    totalRedemptions: 0,
    conversionRate: '0%',
    totalRevenueImpact: '₹0'
  };
  loading = false;

  // Search and Filter
  searchText: string = '';
  selectedStatus: string = '';

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  pageJumpValue: number | null = null;

  constructor(
    private dialog: MatDialog,
    private rewardsService: RewardsService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Handle paginator events
    this.paginator.page.subscribe((event) => {
      console.log('Paginator event:', event);
      // Paginator uses 0-based index, API uses 1-based
      this.loadPromotions(event.pageIndex + 1, event.pageSize);
    });
  }

  loadPromotions(page: number = 1, itemsPerPage: number = 10): void {
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    this.loading = true;

    this.rewardsService.getPromotions(page, itemsPerPage, this.searchText, this.selectedStatus).subscribe({
      next: (response) => {
        this.promotions = response.data;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;

        // Update paginator length
        if (this.paginator) {
          this.paginator.length = this.totalItems;
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading promotions:', error);
        this.resetPagination();
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // Reset to page 1 when filters change
    this.currentPage = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadPromotions(1, this.itemsPerPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  private resetPagination(): void {
    this.promotions = [];
    this.totalItems = 0;
    this.totalPages = 1;
    this.currentPage = 1;

    if (this.paginator) {
      this.paginator.length = 0;
      this.paginator.pageIndex = 0;
    }
  }

  loadStats(): void {
    this.rewardsService.getPromotionStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  createNewPromotion(): void {
    const dialogRef = this.dialog.open(CreatePromotionDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardsService.createPromotion(result).subscribe({
          next: (promotion) => {
            console.log('New promotion created:', promotion);
            this.loadPromotions(this.currentPage, this.itemsPerPage);
            this.loadStats();
          },
          error: (error) => {
            console.error('Error creating promotion:', error);
          }
        });
      }
    });
  }

  editPromotion(promotion: Promotion): void {
    const dialogRef = this.dialog.open(CreatePromotionDialogComponent, {
      width: '600px',
      data: { promotion, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rewardsService.updatePromotion(promotion.id, result).subscribe({
          next: (updatedPromotion) => {
            console.log('Promotion updated:', updatedPromotion);
            this.loadPromotions(this.currentPage, this.itemsPerPage);
            this.loadStats();
          },
          error: (error) => {
            console.error('Error updating promotion:', error);
          }
        });
      }
    });
  }

  onRightClick(event: MouseEvent, promotion: Promotion): void {
    event.preventDefault(); // Prevent the default context menu
    event.stopPropagation(); // Prevent row click event
    
    // Create a simple context menu using browser's confirm/prompt functionality
    const status = promotion.status;
    const isActive = status === 'Active';
    const isExpired = status === 'Expired';
    
    let message = `Actions for "${promotion.name}":\n\n`;
    message += '• Click OK to DELETE this promotion\n';
    message += '• Click Cancel to go back\n\n';
    
    if (isExpired) {
      message += 'Note: This promotion has already expired.';
    } else if (isActive) {
      message += 'Warning: This promotion is currently ACTIVE and may be in use by customers.';
    } else {
      message += 'This promotion is currently inactive.';
    }
    
    const shouldDelete = confirm(message);
    
    if (shouldDelete) {
      // Double confirmation for active promotions
      if (isActive) {
        const doubleConfirm = confirm(
          `⚠️ FINAL WARNING ⚠️\n\n` +
          `You are about to delete an ACTIVE promotion "${promotion.name}".\n` +
          `This action cannot be undone and may affect customers currently using this promotion.\n\n` +
          `Are you absolutely sure you want to proceed?`
        );
        
        if (doubleConfirm) {
          this.deletePromotion(promotion);
        }
      } else {
        this.deletePromotion(promotion);
      }
    }
  }

  deletePromotion(promotion: Promotion): void {
    if (confirm(`Are you sure you want to delete the promotion "${promotion.name}"?`)) {
      this.rewardsService.deletePromotion(promotion.id).subscribe({
        next: () => {
          console.log('Promotion deleted:', promotion.id);
          // If we're on a page that becomes empty after deletion, go to previous page
          const remainingItems = this.totalItems - 1;
          const maxPage = Math.ceil(remainingItems / this.itemsPerPage);
          const targetPage = this.currentPage > maxPage ? Math.max(1, maxPage) : this.currentPage;
          
          this.loadPromotions(targetPage, this.itemsPerPage);
          this.loadStats();
        },
        error: (error) => {
          console.error('Error deleting promotion:', error);
        }
      });
    }
  }

  jumpToPage(): void {
    if (this.pageJumpValue && this.pageJumpValue >= 1 && this.pageJumpValue <= this.totalPages) {
      this.paginator.pageIndex = this.pageJumpValue - 1;
      this.loadPromotions(this.pageJumpValue, this.itemsPerPage);
      this.pageJumpValue = null;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Expired':
        return 'status-expired';
      case 'Inactive':
        return 'status-inactive';
      default:
        return '';
    }
  }

  getDisplayType(type: string): string {
    switch (type) {
      case 'discount-code':
        return 'Discount Code';
      case 'referral-bonus':
        return 'Referral Bonus';
      case 'offer':
        return 'Offer';
      default:
        return type;
    }
  }

  getDisplayDiscount(promotion: Promotion): string {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}%`;
    } else {
      return `₹${promotion.discountValue}`;
    }
  }

  getDisplayValidity(promotion: Promotion): string {
    const now = new Date();
    if (promotion.validTo < now) {
      return 'Expired';
    }
    
    const fromDate = promotion.validFrom.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
    const toDate = promotion.validTo.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
    
    return `${fromDate} - ${toDate}`;
  }
}
