import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { 
  AnalyticsService 
} from '../../core/services/analytics.service';
import {
  ComprehensiveAnalytics,
  AnalyticsFilters,
  TimeRange,
  AnalyticsMetric,
  AnalyticsTrend
} from '../../core/models/analytics.model';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {

  // Core data
  analytics: ComprehensiveAnalytics | null = null;
  loading = false;
  
  // Filters and time ranges
  selectedTimeRange: TimeRange = {
    label: 'Last 7 Days',
    value: '7days'
  };
  
  timeRanges: TimeRange[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 90 Days', value: '90days' },
    { label: 'Custom Range', value: 'custom' }
  ];

  // Custom date range
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;

  // Subscriptions
  private analyticsSubscription: Subscription | null = null;

  // Selected tab index
  selectedTabIndex = 0;

  // Chart display options
  showCharts = true;
  autoRefresh = true;
  refreshInterval = 30; // seconds

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {
    // Any chart initialization would go here
  }

  ngOnDestroy(): void {
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }
  }

  loadAnalytics(): void {
    this.loading = true;
    
    const filters: AnalyticsFilters = {
      timeRange: this.selectedTimeRange,
      customDateRange: this.selectedTimeRange.value === 'custom' ? {
        startDate: this.customStartDate || new Date(),
        endDate: this.customEndDate || new Date()
      } : undefined
    };

    // Unsubscribe from previous subscription if exists
    if (this.analyticsSubscription) {
      this.analyticsSubscription.unsubscribe();
    }

    if (this.autoRefresh) {
      // Subscribe to real-time updates
      this.analyticsSubscription = this.analyticsService.getRealTimeAnalytics(filters).subscribe({
        next: (data) => {
          this.analytics = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading analytics:', error);
          this.loading = false;
        }
      });
    } else {
      // Load data once
      this.analyticsService.getRealTimeAnalytics(filters).subscribe({
        next: (data) => {
          this.analytics = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading analytics:', error);
          this.loading = false;
        }
      });
    }
  }

  onTimeRangeChange(): void {
    this.loadAnalytics();
  }

  onCustomDateChange(): void {
    if (this.selectedTimeRange.value === 'custom' && this.customStartDate && this.customEndDate) {
      this.loadAnalytics();
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    this.loadAnalytics();
  }

  toggleCharts(): void {
    this.showCharts = !this.showCharts;
  }

  refreshData(): void {
    this.loadAnalytics();
  }

  exportAnalytics(): void {
    const filters: AnalyticsFilters = {
      timeRange: this.selectedTimeRange
    };

    this.analyticsService.exportAnalytics(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting analytics:', error);
      }
    });
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  formatCurrency(value: number): string {
    return '₹' + new Intl.NumberFormat('en-IN').format(value);
  }

  formatPercentage(value: number): string {
    return value.toFixed(1) + '%';
  }

  getMetricColor(metric: AnalyticsMetric): string {
    return metric.color;
  }

  getChangeIcon(changeType: 'increase' | 'decrease' | 'neutral'): string {
    switch (changeType) {
      case 'increase': return 'trending_up';
      case 'decrease': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getChangeColor(changeType: 'increase' | 'decrease' | 'neutral'): string {
    switch (changeType) {
      case 'increase': return '#4caf50';
      case 'decrease': return '#f44336';
      default: return '#757575';
    }
  }

  formatValue(value: number, format: 'number' | 'currency' | 'percentage'): string {
    switch (format) {
      case 'currency':
        return this.formatCurrency(value);
      case 'percentage':
        return this.formatPercentage(value);
      default:
        return this.formatNumber(value);
    }
  }

  getLastUpdatedTime(): string {
    if (!this.analytics?.overview.lastUpdated) return '';
    
    const now = new Date();
    const lastUpdated = new Date(this.analytics.overview.lastUpdated);
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  }

  // Chart placeholder methods (would integrate with actual charting library)
  generateChartData(trend: AnalyticsTrend): any {
    return {
      labels: trend.data.map(d => d.label),
      datasets: [{
        label: trend.title,
        data: trend.data.map(d => d.value),
        borderColor: trend.color,
        backgroundColor: trend.color + '20',
        fill: trend.type === 'area'
      }]
    };
  }

  getDisplayedDriverColumns(): string[] {
    return ['rank', 'name', 'rides', 'rating', 'earnings'];
  }

  getDriverRankIcon(index: number): string {
    switch (index) {
      case 0: return 'looks_one';
      case 1: return 'looks_two';
      case 2: return 'looks_3';
      default: return 'person';
    }
  }

  getDriverRankColor(index: number): string {
    switch (index) {
      case 0: return '#ffd700'; // Gold
      case 1: return '#c0c0c0'; // Silver
      case 2: return '#cd7f32'; // Bronze
      default: return '#757575';
    }
  }
}
