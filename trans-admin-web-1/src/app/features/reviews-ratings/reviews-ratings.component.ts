import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Inline interfaces and enums
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  FLAGGED = 'flagged',
  REMOVED = 'removed'
}

export enum ReviewType {
  DRIVER_REVIEW = 'driver_review',
  PASSENGER_REVIEW = 'passenger_review',
  SERVICE_REVIEW = 'service_review'
}

export enum ReviewPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ReviewDetail {
  id: string;
  type: ReviewType;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerType: 'driver' | 'passenger';
  targetName: string; // Driver name or service name
  targetId: string;
  rideId: string;
  createdAt: string;
  status: ReviewStatus;
  priority: ReviewPriority;
  flagReason?: string;
  moderatorNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  helpful: number;
  reported: number;
}

export interface RatingStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    oneStar: number;
    twoStars: number;
    threeStars: number;
    fourStars: number;
    fiveStars: number;
  };
  pendingReviews: number;
  flaggedReviews: number;
  removedReviews: number;
}

export interface ReviewsData {
  reviews: ReviewDetail[];
  statistics: RatingStatistics;
  driverRatings: DriverRatingDetail[];
}

export interface DriverRatingDetail {
  driverId: string;
  driverName: string;
  totalReviews: number;
  averageRating: number;
  recentRating: number;
  ratingTrend: 'up' | 'down' | 'stable';
  flaggedReviews: number;
  status: 'active' | 'under_review' | 'suspended';
}

// Inline service
export class ReviewsService {
  getReviewsData(): Observable<ReviewsData> {
    const mockData = this.generateMockData();
    return of(mockData).pipe(delay(800));
  }

  private generateMockData(): ReviewsData {
    const reviews = this.generateReviews();
    const statistics = this.calculateStatistics(reviews);
    const driverRatings = this.generateDriverRatings();

    return { reviews, statistics, driverRatings };
  }

  private generateReviews(): ReviewDetail[] {
    const reviews: ReviewDetail[] = [];
    const reviewerNames = ['John Doe', 'Sarah Johnson', 'Mike Wilson', 'Emma Brown', 'David Lee', 'Lisa Chen'];
    const driverNames = ['Robert Smith', 'Jennifer Davis', 'Michael Johnson', 'Ashley Wilson', 'James Brown', 'Jessica Lee'];
    const comments = [
      'Excellent service! Very professional and punctual.',
      'Driver was friendly and the car was clean.',
      'Good experience overall, would recommend.',
      'Average service, nothing special but acceptable.',
      'Driver was rude and unprofessional.',
      'Late pickup and poor driving skills.',
      'Outstanding driver, very helpful and courteous.',
      'Clean vehicle and smooth ride experience.',
      'Driver took the longest route possible.',
      'Excellent communication and safe driving.'
    ];

    for (let i = 1; i <= 30; i++) {
      const rating = this.getWeightedRating();
      const status = this.getRandomStatus(rating);
      const reviewerName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
      const targetName = driverNames[Math.floor(Math.random() * driverNames.length)];
      const comment = comments[Math.floor(Math.random() * comments.length)];
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      reviews.push({
        id: `review_${i}`,
        type: Math.random() > 0.3 ? ReviewType.DRIVER_REVIEW : ReviewType.SERVICE_REVIEW,
        rating,
        comment,
        reviewerName,
        reviewerType: Math.random() > 0.6 ? 'driver' : 'passenger',
        targetName,
        targetId: `target_${i}`,
        rideId: `ride_${i}`,
        createdAt: createdAt.toISOString(),
        status,
        priority: this.getPriority(rating, status),
        flagReason: status === ReviewStatus.FLAGGED ? this.getFlagReason() : undefined,
        moderatorNotes: status !== ReviewStatus.PENDING ? 'Reviewed and processed' : undefined,
        moderatedBy: status !== ReviewStatus.PENDING ? 'Admin User' : undefined,
        moderatedAt: status !== ReviewStatus.PENDING ? new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
        helpful: Math.floor(Math.random() * 20),
        reported: Math.floor(Math.random() * 5)
      });
    }

    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private generateDriverRatings(): DriverRatingDetail[] {
    const drivers: DriverRatingDetail[] = [];
    const driverNames = ['Robert Smith', 'Jennifer Davis', 'Michael Johnson', 'Ashley Wilson', 'James Brown', 'Jessica Lee'];

    for (let i = 0; i < Math.min(driverNames.length, 6); i++) {
      const totalReviews = Math.floor(Math.random() * 100) + 20;
      const averageRating = Number((3.5 + Math.random() * 1.5).toFixed(1));
      const recentRating = Number((3.0 + Math.random() * 2.0).toFixed(1));
      const flaggedReviews = Math.floor(Math.random() * 5);
      
      drivers.push({
        driverId: `driver_${i + 1}`,
        driverName: driverNames[i],
        totalReviews,
        averageRating,
        recentRating,
        ratingTrend: this.getRatingTrend(averageRating, recentRating),
        flaggedReviews,
        status: flaggedReviews > 3 ? 'under_review' : averageRating < 3.5 ? 'under_review' : 'active'
      });
    }

    return drivers.sort((a, b) => b.averageRating - a.averageRating);
  }

  private getWeightedRating(): number {
    const weights = [0.05, 0.10, 0.15, 0.35, 0.35]; // 1-5 stars probability
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return i + 1;
      }
    }
    return 5;
  }

  private getRandomStatus(rating: number): ReviewStatus {
    if (rating <= 2 && Math.random() > 0.7) return ReviewStatus.FLAGGED;
    if (Math.random() > 0.8) return ReviewStatus.PENDING;
    if (Math.random() > 0.95) return ReviewStatus.REMOVED;
    return ReviewStatus.APPROVED;
  }

  private getPriority(rating: number, status: ReviewStatus): ReviewPriority {
    if (status === ReviewStatus.FLAGGED) return ReviewPriority.HIGH;
    if (rating <= 2) return ReviewPriority.MEDIUM;
    if (status === ReviewStatus.PENDING && Math.random() > 0.8) return ReviewPriority.URGENT;
    return ReviewPriority.LOW;
  }

  private getFlagReason(): string {
    const reasons = ['Inappropriate language', 'False information', 'Spam content', 'Personal attack', 'Discrimination'];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getRatingTrend(average: number, recent: number): 'up' | 'down' | 'stable' {
    const diff = recent - average;
    if (diff > 0.2) return 'up';
    if (diff < -0.2) return 'down';
    return 'stable';
  }

  private calculateStatistics(reviews: ReviewDetail[]): RatingStatistics {
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    const ratingDistribution = {
      oneStar: reviews.filter(r => r.rating === 1).length,
      twoStars: reviews.filter(r => r.rating === 2).length,
      threeStars: reviews.filter(r => r.rating === 3).length,
      fourStars: reviews.filter(r => r.rating === 4).length,
      fiveStars: reviews.filter(r => r.rating === 5).length
    };

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
      pendingReviews: reviews.filter(r => r.status === ReviewStatus.PENDING).length,
      flaggedReviews: reviews.filter(r => r.status === ReviewStatus.FLAGGED).length,
      removedReviews: reviews.filter(r => r.status === ReviewStatus.REMOVED).length
    };
  }
}

// Custom Paginator Factory
function customPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Items per page:';
  paginatorIntl.nextPageLabel = 'Next page';
  paginatorIntl.previousPageLabel = 'Previous page';
  paginatorIntl.firstPageLabel = 'First page';
  paginatorIntl.lastPageLabel = 'Last page';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) return `Page 1 of 1`;
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  };
  return paginatorIntl;
}

@Component({
  selector: 'app-reviews-ratings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useFactory: customPaginatorIntl },
    ReviewsService
  ],
  templateUrl: './reviews-ratings.component.html',
  styleUrls: ['./reviews-ratings.component.scss']
})
export class ReviewsRatingsComponent implements OnInit, AfterViewInit {
  @ViewChild('reviewsPaginator') reviewsPaginator!: MatPaginator;
  @ViewChild('driversPaginator') driversPaginator!: MatPaginator;
  @ViewChild('reviewsSort') reviewsSort!: MatSort;
  @ViewChild('driversSort') driversSort!: MatSort;

  // Data sources
  reviewsDataSource = new MatTableDataSource<ReviewDetail>([]);
  driversDataSource = new MatTableDataSource<DriverRatingDetail>([]);

  // Table columns
  reviewColumns = ['rating', 'comment', 'reviewer', 'target', 'date', 'status', 'actions'];
  driverColumns = ['driverName', 'totalReviews', 'averageRating', 'recentRating', 'trend', 'flaggedReviews', 'status', 'actions'];

  // Component state
  loading = false;
  reviewsData: ReviewsData | null = null;
  statistics: RatingStatistics | null = null;

  // Filters
  statusFilter = new FormControl('all');
  typeFilter = new FormControl('all');
  ratingFilter = new FormControl('all');
  searchControl = new FormControl('');

  // Pagination jump values
  reviewsPageJumpValue: number | null = null;
  driversPageJumpValue: number | null = null;

  // Enums for template
  ReviewStatus = ReviewStatus;
  ReviewType = ReviewType;
  ReviewPriority = ReviewPriority;

  constructor(
    private reviewsService: ReviewsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    this.reviewsDataSource.paginator = this.reviewsPaginator;
    this.reviewsDataSource.sort = this.reviewsSort;
    this.driversDataSource.paginator = this.driversPaginator;
    this.driversDataSource.sort = this.driversSort;
  }

  loadData(): void {
    this.loading = true;
    this.reviewsService.getReviewsData().subscribe({
      next: (data) => {
        this.reviewsData = data;
        this.statistics = data.statistics;
        this.reviewsDataSource.data = data.reviews;
        this.driversDataSource.data = data.driverRatings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews data:', error);
        this.loading = false;
        this.showSnackBar('Error loading reviews data');
      }
    });
  }

  setupFilters(): void {
    // Setup filter subscriptions
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.typeFilter.valueChanges.subscribe(() => this.applyFilters());
    this.ratingFilter.valueChanges.subscribe(() => this.applyFilters());
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    if (!this.reviewsData) return;

    let filteredData = [...this.reviewsData.reviews];

    // Status filter
    const status = this.statusFilter.value;
    if (status && status !== 'all') {
      filteredData = filteredData.filter(review => review.status === status);
    }

    // Type filter
    const type = this.typeFilter.value;
    if (type && type !== 'all') {
      filteredData = filteredData.filter(review => review.type === type);
    }

    // Rating filter
    const rating = this.ratingFilter.value;
    if (rating && rating !== 'all') {
      filteredData = filteredData.filter(review => review.rating === parseInt(rating));
    }

    // Search filter
    const search = this.searchControl.value?.toLowerCase() || '';
    if (search) {
      filteredData = filteredData.filter(review =>
        review.reviewerName.toLowerCase().includes(search) ||
        review.targetName.toLowerCase().includes(search) ||
        review.comment.toLowerCase().includes(search)
      );
    }

    this.reviewsDataSource.data = filteredData;
  }

  // Action methods
  approveReview(review: ReviewDetail): void {
    review.status = ReviewStatus.APPROVED;
    review.moderatedBy = 'Current Admin';
    review.moderatedAt = new Date().toISOString();
    this.showSnackBar(`Review approved successfully`);
  }

  flagReview(review: ReviewDetail): void {
    review.status = ReviewStatus.FLAGGED;
    review.flagReason = 'Flagged by admin';
    review.moderatedBy = 'Current Admin';
    review.moderatedAt = new Date().toISOString();
    this.showSnackBar(`Review flagged successfully`);
  }

  removeReview(review: ReviewDetail): void {
    review.status = ReviewStatus.REMOVED;
    review.moderatedBy = 'Current Admin';
    review.moderatedAt = new Date().toISOString();
    this.showSnackBar(`Review removed successfully`);
  }

  viewDriverDetails(driver: DriverRatingDetail): void {
    this.showSnackBar(`Viewing details for ${driver.driverName}`);
    // Navigate to driver details page
  }

  suspendDriver(driver: DriverRatingDetail): void {
    driver.status = 'suspended';
    this.showSnackBar(`${driver.driverName} has been suspended`);
  }

  // Pagination jump methods
  jumpToReviewsPage(): void {
    if (this.reviewsPageJumpValue && this.reviewsPaginator) {
      const maxPages = Math.ceil(this.reviewsDataSource.data.length / this.reviewsPaginator.pageSize);
      if (this.reviewsPageJumpValue >= 1 && this.reviewsPageJumpValue <= maxPages) {
        this.reviewsPaginator.pageIndex = this.reviewsPageJumpValue - 1;
        this.reviewsPageJumpValue = null;
      }
    }
  }

  jumpToDriversPage(): void {
    if (this.driversPageJumpValue && this.driversPaginator) {
      const maxPages = Math.ceil(this.driversDataSource.data.length / this.driversPaginator.pageSize);
      if (this.driversPageJumpValue >= 1 && this.driversPageJumpValue <= maxPages) {
        this.driversPaginator.pageIndex = this.driversPageJumpValue - 1;
        this.driversPageJumpValue = null;
      }
    }
  }

  // Helper methods
  getReviewsMaxPages(): number {
    if (!this.reviewsPaginator) return 1;
    return Math.ceil(this.reviewsDataSource.data.length / this.reviewsPaginator.pageSize);
  }

  getDriversMaxPages(): number {
    if (!this.driversPaginator) return 1;
    return Math.ceil(this.driversDataSource.data.length / this.driversPaginator.pageSize);
  }

  getStatusColor(status: ReviewStatus): string {
    switch (status) {
      case ReviewStatus.APPROVED: return 'primary';
      case ReviewStatus.PENDING: return 'accent';
      case ReviewStatus.FLAGGED: return 'warn';
      case ReviewStatus.REMOVED: return '';
      default: return 'primary';
    }
  }

  getPriorityColor(priority: ReviewPriority): string {
    switch (priority) {
      case ReviewPriority.URGENT: return '#d32f2f';
      case ReviewPriority.HIGH: return '#f57c00';
      case ReviewPriority.MEDIUM: return '#fbc02d';
      case ReviewPriority.LOW: return '#388e3c';
      default: return '#666';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      case 'stable': return 'trending_flat';
      default: return 'trending_flat';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return '#4caf50';
      case 'down': return '#f44336';
      case 'stable': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => {
      if (index < Math.floor(rating)) return 1; // full star
      if (index === Math.floor(rating) && rating % 1 >= 0.5) return 0.5; // half star
      return 0; // empty star
    });
  }

  refreshData(): void {
    this.loadData();
  }

  exportReviews(): void {
    if (!this.reviewsData) return;
    
    const csvData = this.generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showSnackBar('Reviews exported successfully');
  }

  private generateCSVData(): string {
    if (!this.reviewsData) return '';

    const lines = [];
    lines.push('Review Export Report');
    lines.push(`Generated on: ${new Date().toLocaleString()}`);
    lines.push('');
    
    // Reviews data
    lines.push('Reviews Data');
    lines.push('ID,Type,Rating,Comment,Reviewer,Target,Date,Status,Priority');
    
    this.reviewsDataSource.data.forEach(review => {
      lines.push([
        review.id,
        review.type,
        review.rating,
        `"${review.comment.replace(/"/g, '""')}"`,
        review.reviewerName,
        review.targetName,
        new Date(review.createdAt).toLocaleDateString(),
        review.status,
        review.priority
      ].join(','));
    });
    
    return lines.join('\n');
  }

  getRatingPercentage(rating: number): number {
    if (!this.statistics?.ratingDistribution) return 0;
    
    const distribution = this.statistics.ratingDistribution;
    const totalReviews = distribution.oneStar + distribution.twoStars + 
                        distribution.threeStars + distribution.fourStars + distribution.fiveStars;
    
    let count = 0;
    switch (rating) {
      case 5: count = distribution.fiveStars; break;
      case 4: count = distribution.fourStars; break;
      case 3: count = distribution.threeStars; break;
      case 2: count = distribution.twoStars; break;
      case 1: count = distribution.oneStar; break;
    }
    
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    if (!this.statistics?.ratingDistribution) return 0;
    
    const distribution = this.statistics.ratingDistribution;
    switch (rating) {
      case 5: return distribution.fiveStars;
      case 4: return distribution.fourStars;
      case 3: return distribution.threeStars;
      case 2: return distribution.twoStars;
      case 1: return distribution.oneStar;
      default: return 0;
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
