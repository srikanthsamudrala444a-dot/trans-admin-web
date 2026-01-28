import { Component, OnInit, Injectable, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Inline interfaces to avoid module import issues
export enum TimePeriodsEnum {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_QUARTER = 'this_quarter',
  LAST_QUARTER = 'last_quarter',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year'
}

export interface RatingDistribution {
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

export interface RouteStats {
  routeName: string;
  rideCount: number;
  percentage: number;
}

export interface HourlyRideVolume {
  hour: number;
  rideCount: number;
}

export interface ConversionFunnelData {
  appVisits: number;
  rideRequests: number;
  completedRides: number;
  visitToRequestRate: number;
  requestToCompletionRate: number;
  overallConversionRate: number;
}

// Additional interfaces for detailed data tables
export interface DriverPerformanceDetail {
  id: string;
  name: string;
  totalRides: number;
  averageRating: number;
  totalRevenue: number;
  averageRideTime: number;
  completionRate: number;
  status: string;
}

export interface RoutePerformanceDetail {
  id: string;
  routeName: string;
  totalRides: number;
  averageDistance: number;
  averageRevenue: number;
  popularityScore: number;
  peakHours: string;
  averageRating: number;
}

export interface DailyPerformanceDetail {
  date: string;
  totalRides: number;
  totalRevenue: number;
  averageRating: number;
  uniqueDrivers: number;
  completionRate: number;
  averageWaitTime: number;
}

export interface PerformanceData {
  averageDriverRating: number;
  busiestRoute: string;
  peakHours: string;
  conversionRate: number;
  ratingDistribution: RatingDistribution;
  topRoutes: RouteStats[];
  hourlyRideVolume: HourlyRideVolume[];
  conversionFunnel: ConversionFunnelData;
  totalDrivers: number;
  totalRides: number;
  totalRevenue: number;
  averageRideDistance: number;
  averageRideDuration: number;
  timePeriod: TimePeriodsEnum;
  startDate: string;
  endDate: string;
  // New detailed data for tables
  driverPerformanceDetails: DriverPerformanceDetail[];
  routePerformanceDetails: RoutePerformanceDetail[];
  dailyPerformanceDetails: DailyPerformanceDetail[];
}

// Inline service to avoid module import issues
@Injectable({
  providedIn: 'root'
})
export class PerformanceReportsService {
  getPerformanceData(timePeriod: TimePeriodsEnum): Observable<PerformanceData> {
    const mockData = this.generateMockData(timePeriod);
    return of(mockData).pipe(delay(500));
  }

  private generateMockData(timePeriod: TimePeriodsEnum): PerformanceData {
    const multipliers: Record<TimePeriodsEnum, number> = {
      [TimePeriodsEnum.TODAY]: 0.1,
      [TimePeriodsEnum.YESTERDAY]: 0.1,
      [TimePeriodsEnum.LAST_7_DAYS]: 0.7,
      [TimePeriodsEnum.LAST_30_DAYS]: 3,
      [TimePeriodsEnum.THIS_MONTH]: 3,
      [TimePeriodsEnum.LAST_MONTH]: 3,
      [TimePeriodsEnum.THIS_QUARTER]: 9,
      [TimePeriodsEnum.LAST_QUARTER]: 9,
      [TimePeriodsEnum.THIS_YEAR]: 36,
      [TimePeriodsEnum.LAST_YEAR]: 36
    };

    const multiplier = multipliers[timePeriod] || 1;
    const ratingDistribution: RatingDistribution = {
      oneStar: Math.floor(50 * multiplier),
      twoStars: Math.floor(80 * multiplier),
      threeStars: Math.floor(120 * multiplier),
      fourStars: Math.floor(300 * multiplier),
      fiveStars: Math.floor(450 * multiplier)
    };

    const totalDrivers = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);
    const weightedSum = (
      ratingDistribution.oneStar * 1 +
      ratingDistribution.twoStars * 2 +
      ratingDistribution.threeStars * 3 +
      ratingDistribution.fourStars * 4 +
      ratingDistribution.fiveStars * 5
    );
    const averageRating = totalDrivers > 0 ? weightedSum / totalDrivers : 0;

    const routes = [
      'Airport → Downtown',
      'Downtown → Uptown',
      'Airport → Suburbs',
      'Suburbs → Downtown',
      'University → Mall'
    ];

    const topRoutes: RouteStats[] = routes.map((routeName, index) => {
      const baseCount = Math.floor((500 - index * 80) * multiplier);
      const rideCount = baseCount + Math.floor(Math.random() * 50);
      return { routeName, rideCount, percentage: 0 };
    });

    const hourlyRideVolume: HourlyRideVolume[] = [];
    for (let hour = 0; hour < 24; hour++) {
      let baseVolume = 20;
      if (hour >= 7 && hour <= 9) baseVolume = 120;
      else if (hour >= 17 && hour <= 19) baseVolume = 150;
      else if (hour >= 10 && hour <= 16) baseVolume = 60;
      else if (hour >= 20 && hour <= 23) baseVolume = 80;
      else if (hour >= 0 && hour <= 6) baseVolume = 15;

      hourlyRideVolume.push({
        hour,
        rideCount: Math.floor(baseVolume * multiplier) + Math.floor(Math.random() * 20)
      });
    }

    const appVisits = Math.floor(10000 * multiplier);
    const rideRequests = Math.floor(appVisits * 0.35);
    const completedRides = Math.floor(rideRequests * 0.85);

    const conversionFunnel: ConversionFunnelData = {
      appVisits,
      rideRequests,
      completedRides,
      visitToRequestRate: appVisits > 0 ? (rideRequests / appVisits) * 100 : 0,
      requestToCompletionRate: rideRequests > 0 ? (completedRides / rideRequests) * 100 : 0,
      overallConversionRate: appVisits > 0 ? (completedRides / appVisits) * 100 : 0
    };

    // Generate detailed data for tables
    const driverPerformanceDetails = this.generateDriverPerformanceDetails(multiplier);
    const routePerformanceDetails = this.generateRoutePerformanceDetails(multiplier);
    const dailyPerformanceDetails = this.generateDailyPerformanceDetails(timePeriod);

    return {
      averageDriverRating: Number(averageRating.toFixed(1)),
      busiestRoute: topRoutes[0]?.routeName || 'Airport → Downtown',
      peakHours: '6 PM - 9 PM',
      conversionRate: Number(conversionFunnel.overallConversionRate.toFixed(1)),
      ratingDistribution,
      topRoutes,
      hourlyRideVolume,
      conversionFunnel,
      totalDrivers,
      totalRides: completedRides,
      totalRevenue: completedRides * 15.50,
      averageRideDistance: 8.5,
      averageRideDuration: 18,
      timePeriod,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      driverPerformanceDetails,
      routePerformanceDetails,
      dailyPerformanceDetails
    };
  }

  private generateDriverPerformanceDetails(multiplier: number): DriverPerformanceDetail[] {
    const drivers: DriverPerformanceDetail[] = [];
    const driverCount = Math.floor(50 * multiplier);
    
    for (let i = 1; i <= driverCount; i++) {
      const totalRides = Math.floor(Math.random() * 200 * multiplier) + 10;
      const averageRating = Number((3.5 + Math.random() * 1.5).toFixed(1));
      const totalRevenue = totalRides * (10 + Math.random() * 20);
      
      drivers.push({
        id: `driver_${i}`,
        name: `Driver ${i}`,
        totalRides,
        averageRating,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageRideTime: Number((15 + Math.random() * 20).toFixed(1)),
        completionRate: Number((85 + Math.random() * 15).toFixed(1)),
        status: Math.random() > 0.2 ? 'Active' : 'Inactive'
      });
    }
    
    return drivers.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  private generateRoutePerformanceDetails(multiplier: number): RoutePerformanceDetail[] {
    const routes = [
      'Airport → Downtown', 'Central Station → Mall', 'University → City Center',
      'Hospital → Residential Area', 'Business District → Suburbs', 'Shopping Center → Airport',
      'Train Station → Hotel District', 'Port → Industrial Area', 'Beach → City Center',
      'Stadium → Metro Station', 'Convention Center → Airport', 'Museum → Downtown'
    ];

    return routes.map((route, index) => ({
      id: `route_${index + 1}`,
      routeName: route,
      totalRides: Math.floor((100 + Math.random() * 500) * multiplier),
      averageDistance: Number((5 + Math.random() * 15).toFixed(1)),
      averageRevenue: Number((12 + Math.random() * 25).toFixed(2)),
      popularityScore: Number((Math.random() * 100).toFixed(1)),
      peakHours: Math.random() > 0.5 ? '8-10 AM' : '6-9 PM',
      averageRating: Number((3.8 + Math.random() * 1.2).toFixed(1))
    })).sort((a, b) => b.totalRides - a.totalRides);
  }

  private generateDailyPerformanceDetails(timePeriod: TimePeriodsEnum): DailyPerformanceDetail[] {
    const days = this.getDaysForPeriod(timePeriod);
    const details: DailyPerformanceDetail[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const totalRides = Math.floor(200 + Math.random() * 300);
      const totalRevenue = totalRides * (12 + Math.random() * 8);
      
      details.push({
        date: date.toISOString().split('T')[0],
        totalRides,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageRating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
        uniqueDrivers: Math.floor(20 + Math.random() * 30),
        completionRate: Number((88 + Math.random() * 10).toFixed(1)),
        averageWaitTime: Number((3 + Math.random() * 7).toFixed(1))
      });
    }

    return details.reverse(); // Show oldest first
  }

  private getDaysForPeriod(timePeriod: TimePeriodsEnum): number {
    switch (timePeriod) {
      case TimePeriodsEnum.TODAY:
      case TimePeriodsEnum.YESTERDAY:
        return 1;
      case TimePeriodsEnum.LAST_7_DAYS:
        return 7;
      case TimePeriodsEnum.LAST_30_DAYS:
      case TimePeriodsEnum.THIS_MONTH:
      case TimePeriodsEnum.LAST_MONTH:
        return 30;
      default:
        return 30;
    }    }
  }

// Custom Paginator Factory Function
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
  selector: 'app-performance-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatChipsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './performance-reports.component.html',
  styleUrls: ['./performance-reports.component.scss']
})
export class PerformanceReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('driverPaginator') driverPaginator!: MatPaginator;
  @ViewChild('routePaginator') routePaginator!: MatPaginator;
  @ViewChild('dailyPaginator') dailyPaginator!: MatPaginator;
  @ViewChild('driverSort') driverSort!: MatSort;
  @ViewChild('routeSort') routeSort!: MatSort;
  @ViewChild('dailySort') dailySort!: MatSort;

  // Time period control
  timePeriodControl = new FormControl('last_7_days');
  timePeriodsEnum = TimePeriodsEnum;
  
  // Loading states
  loading = false;
  
  // Performance data
  performanceData: PerformanceData | null = null;

  // Table data sources
  driverDataSource = new MatTableDataSource<DriverPerformanceDetail>([]);
  routeDataSource = new MatTableDataSource<RoutePerformanceDetail>([]);
  dailyDataSource = new MatTableDataSource<DailyPerformanceDetail>([]);

  // Table columns
  driverColumns = ['name', 'totalRides', 'averageRating', 'totalRevenue', 'completionRate', 'status'];
  routeColumns = ['routeName', 'totalRides', 'averageDistance', 'averageRevenue', 'popularityScore', 'averageRating'];
  dailyColumns = ['date', 'totalRides', 'totalRevenue', 'averageRating', 'uniqueDrivers', 'completionRate'];

  // Pagination properties for jump functionality
  driverPageJumpValue: number | null = null;
  routePageJumpValue: number | null = null;
  dailyPageJumpValue: number | null = null;

  constructor(private performanceService: PerformanceReportsService) {}

  ngOnInit(): void {
    this.loadPerformanceData();
    
    // Listen for time period changes
    this.timePeriodControl.valueChanges.subscribe(() => {
      this.loadPerformanceData();
    });
  }

  ngAfterViewInit(): void {
    // Set up data sources with pagination and sorting
    this.driverDataSource.paginator = this.driverPaginator;
    this.driverDataSource.sort = this.driverSort;
    
    this.routeDataSource.paginator = this.routePaginator;
    this.routeDataSource.sort = this.routeSort;
    
    this.dailyDataSource.paginator = this.dailyPaginator;
    this.dailyDataSource.sort = this.dailySort;
  }

  loadPerformanceData(): void {
    this.loading = true;
    const timePeriod = this.timePeriodControl.value || 'last_7_days';
    
    this.performanceService.getPerformanceData(timePeriod as TimePeriodsEnum).subscribe({
      next: (data: PerformanceData) => {
        this.performanceData = data;
        
        // Update table data sources
        this.driverDataSource.data = data.driverPerformanceDetails;
        this.routeDataSource.data = data.routePerformanceDetails;
        this.dailyDataSource.data = data.dailyPerformanceDetails;
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading performance data:', error);
        this.loading = false;
      }
    });
  }

  // Jump to specific page methods
  jumpToDriverPage(): void {
    if (this.driverPageJumpValue && this.driverPaginator) {
      const maxPages = Math.ceil(this.driverDataSource.data.length / this.driverPaginator.pageSize);
      if (this.driverPageJumpValue >= 1 && this.driverPageJumpValue <= maxPages) {
        this.driverPaginator.pageIndex = this.driverPageJumpValue - 1;
        this.driverPageJumpValue = null;
      }
    }
  }

  jumpToRoutePage(): void {
    if (this.routePageJumpValue && this.routePaginator) {
      const maxPages = Math.ceil(this.routeDataSource.data.length / this.routePaginator.pageSize);
      if (this.routePageJumpValue >= 1 && this.routePageJumpValue <= maxPages) {
        this.routePaginator.pageIndex = this.routePageJumpValue - 1;
        this.routePageJumpValue = null;
      }
    }
  }

  jumpToDailyPage(): void {
    if (this.dailyPageJumpValue && this.dailyPaginator) {
      const maxPages = Math.ceil(this.dailyDataSource.data.length / this.dailyPaginator.pageSize);
      if (this.dailyPageJumpValue >= 1 && this.dailyPageJumpValue <= maxPages) {
        this.dailyPaginator.pageIndex = this.dailyPageJumpValue - 1;
        this.dailyPageJumpValue = null;
      }
    }
  }

  // Helper methods for pagination
  getDriverMaxPages(): number {
    if (!this.driverPaginator) return 1;
    return Math.ceil(this.driverDataSource.data.length / this.driverPaginator.pageSize);
  }

  getRouteMaxPages(): number {
    if (!this.routePaginator) return 1;
    return Math.ceil(this.routeDataSource.data.length / this.routePaginator.pageSize);
  }

  getDailyMaxPages(): number {
    if (!this.dailyPaginator) return 1;
    return Math.ceil(this.dailyDataSource.data.length / this.dailyPaginator.pageSize);
  }



  getTimePeriodLabel(period: string): string {
    switch (period) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'last_7_days': return 'Last 7 Days';
      case 'last_30_days': return 'Last 30 Days';
      case 'this_month': return 'This Month';
      case 'last_month': return 'Last Month';
      case 'this_quarter': return 'This Quarter';
      case 'last_quarter': return 'Last Quarter';
      case 'this_year': return 'This Year';
      case 'last_year': return 'Last Year';
      default: return 'Last 7 Days';
    }
  }

  exportReport(): void {
    if (!this.performanceData) return;
    
    // Create CSV content
    const csvContent = this.generateCSVReport();
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `performance-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private generateCSVReport(): string {
    if (!this.performanceData) return '';

    const lines = [];
    lines.push('Performance Report');
    lines.push(`Generated on: ${new Date().toLocaleString()}`);
    lines.push(`Time Period: ${this.getTimePeriodLabel(this.timePeriodControl.value || 'last_7_days')}`);
    lines.push('');
    
    // Key metrics
    lines.push('Key Metrics');
    lines.push(`Average Driver Rating,${this.performanceData.averageDriverRating}/5`);
    lines.push(`Busiest Route,${this.performanceData.busiestRoute}`);
    lines.push(`Peak Hours,${this.performanceData.peakHours}`);
    lines.push(`Conversion Rate,${this.performanceData.conversionRate}%`);
    lines.push('');
    
    // Top routes
    lines.push('Top 5 Routes');
    lines.push('Route,Ride Count');
    this.performanceData.topRoutes.forEach((route: RouteStats) => {
      lines.push(`${route.routeName},${route.rideCount}`);
    });
    lines.push('');
    
    // Rating distribution
    lines.push('Rating Distribution');
    lines.push('Rating,Driver Count');
    const dist = this.performanceData.ratingDistribution;
    lines.push(`1 Star,${dist.oneStar}`);
    lines.push(`2 Stars,${dist.twoStars}`);
    lines.push(`3 Stars,${dist.threeStars}`);
    lines.push(`4 Stars,${dist.fourStars}`);
    lines.push(`5 Stars,${dist.fiveStars}`);
    
    return lines.join('\n');
  }

  refreshData(): void {
    this.loadPerformanceData();
  }

  // Helper methods for template
  get averageRatingStars(): number[] {
    const rating = this.performanceData?.averageDriverRating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return Array(5).fill(0).map((_, index) => {
      if (index < fullStars) return 1; // full star
      if (index === fullStars && hasHalfStar) return 0.5; // half star
      return 0; // empty star
    });
  }

  getRoutePercentage(route: RouteStats): number {
    if (!this.performanceData?.topRoutes) return 0;
    
    const maxRides = Math.max(...this.performanceData.topRoutes.map((r: RouteStats) => r.rideCount));
    return maxRides > 0 ? (route.rideCount / maxRides) * 100 : 0;
  }

  // Helper methods for HTML template
  getRatingPercentage(rating: number): number {
    if (!this.performanceData?.ratingDistribution) return 0;
    
    const distribution = this.performanceData.ratingDistribution;
    const totalDrivers = distribution.oneStar + distribution.twoStars + 
                        distribution.threeStars + distribution.fourStars + distribution.fiveStars;
    
    let count = 0;
    switch (rating) {
      case 5: count = distribution.fiveStars; break;
      case 4: count = distribution.fourStars; break;
      case 3: count = distribution.threeStars; break;
      case 2: count = distribution.twoStars; break;
      case 1: count = distribution.oneStar; break;
    }
    
    return totalDrivers > 0 ? (count / totalDrivers) * 100 : 0;
  }

  getRatingCount(rating: number): number {
    if (!this.performanceData?.ratingDistribution) return 0;
    
    const distribution = this.performanceData.ratingDistribution;
    switch (rating) {
      case 5: return distribution.fiveStars;
      case 4: return distribution.fourStars;
      case 3: return distribution.threeStars;
      case 2: return distribution.twoStars;
      case 1: return distribution.oneStar;
      default: return 0;
    }
  }

  getRatingColor(rating: number): string {
    switch (rating) {
      case 5: return 'primary';
      case 4: return 'accent';
      case 3: return 'warn';
      case 2: return 'warn';
      case 1: return 'warn';
      default: return 'primary';
    }
  }

  getVolumePercentage(rideCount: number): number {
    if (!this.performanceData?.hourlyRideVolume) return 0;
    
    const maxRides = Math.max(...this.performanceData.hourlyRideVolume.map((v: HourlyRideVolume) => v.rideCount));
    return maxRides > 0 ? (rideCount / maxRides) * 100 : 0;
  }

  formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  isPeakHour(hour: number): boolean {
    return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  }

  getFunnelSteps(): any[] {
    if (!this.performanceData?.conversionFunnel) return [];
    
    const funnel = this.performanceData.conversionFunnel;
    const maxValue = funnel.appVisits;
    
    return [
      {
        label: 'App Visits',
        value: funnel.appVisits,
        percentage: 100,
        rate: null
      },
      {
        label: 'Ride Requests',
        value: funnel.rideRequests,
        percentage: maxValue > 0 ? (funnel.rideRequests / maxValue) * 100 : 0,
        rate: funnel.visitToRequestRate.toFixed(1)
      },
      {
        label: 'Completed Rides',
        value: funnel.completedRides,
        percentage: maxValue > 0 ? (funnel.completedRides / maxValue) * 100 : 0,
        rate: funnel.requestToCompletionRate.toFixed(1)
      }
    ];
  }
}
