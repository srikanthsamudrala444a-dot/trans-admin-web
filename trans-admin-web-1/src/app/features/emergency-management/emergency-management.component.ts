import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';

import { EmergencyService } from '../../core/services/emergency.service';
import { EmergencyAlert, EmergencyStats } from '../../core/models/emergency.model';
import { EmergencyDetailsDialogComponent } from './emergency-details-dialog/emergency-details-dialog.component';

@Component({
  selector: 'app-emergency-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatBadgeModule
  ],
  templateUrl: './emergency-management.component.html',
  styleUrls: ['./emergency-management.component.scss']
})
export class EmergencyManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  alerts: EmergencyAlert[] = [];
  filteredAlerts: EmergencyAlert[] = [];
  stats: EmergencyStats | null = null;
  loading = true;
  
  // Filter properties
  selectedStatus: string = 'ALL';
  selectedType: string = 'ALL';
  selectedPriority: string = 'ALL';
  searchText: string = '';
  
  // Tab properties
  selectedTabIndex = 0;
  
  // Table display columns
  displayedColumns: string[] = ['priority', 'type', 'triggeredBy', 'location', 'timestamp', 'status', 'actions'];
  
  // Filter options
  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'RESPONDING', label: 'Responding' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'FALSE_ALARM', label: 'False Alarm' }
  ];
  
  typeOptions = [
    { value: 'ALL', label: 'All Types' },
    { value: 'SOS', label: 'SOS' },
    { value: 'PANIC', label: 'Panic' },
    { value: 'ACCIDENT', label: 'Accident' },
    { value: 'MEDICAL', label: 'Medical' },
    { value: 'SAFETY_CONCERN', label: 'Safety Concern' }
  ];
  
  priorityOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ];

  constructor(
    private emergencyService: EmergencyService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMockData();
    // Set up auto-refresh every 30 seconds
    setInterval(() => {
      if (!this.loading) {
        this.loadMockData();
      }
    }, 30000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMockData(): void {
    // Load mock data for development
    setTimeout(() => {
      this.alerts = this.emergencyService.getMockAlerts();
      this.stats = this.emergencyService.getMockStats();
      this.applyFilters();
      this.loading = false;
    }, 1000);
  }

  openAlertDetails(alert: EmergencyAlert): void {
    const dialogRef = this.dialog.open(EmergencyDetailsDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: alert
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle any updates from the dialog
        this.refreshData();
      }
    });
  }

  refreshData(): void {
    this.loading = true;
    this.loadMockData();
    this.snackBar.open('Data refreshed', 'Close', { duration: 2000 });
  }

  applyFilters(): void {
    this.filteredAlerts = this.alerts.filter(alert => {
      const statusMatch = this.selectedStatus === 'ALL' || alert.status === this.selectedStatus;
      const typeMatch = this.selectedType === 'ALL' || alert.type === this.selectedType;
      const priorityMatch = this.selectedPriority === 'ALL' || alert.priority === this.selectedPriority;
      const textMatch = this.searchText === '' || 
        alert.triggeredBy.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        alert.location.address.toLowerCase().includes(this.searchText.toLowerCase()) ||
        alert.description?.toLowerCase().includes(this.searchText.toLowerCase());
      
      return statusMatch && typeMatch && priorityMatch && textMatch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getAlertsByStatus(status: string): EmergencyAlert[] {
    if (status === 'ALL') return this.alerts;
    return this.alerts.filter(alert => alert.status === status);
  }

  getAlertsByPriority(priority: string): EmergencyAlert[] {
    return this.alerts.filter(alert => alert.priority === priority);
  }

  getResolvedTodayAlerts(): EmergencyAlert[] {
    return this.alerts.filter(alert => alert.status === 'RESOLVED');
  }

  // Get count for statistics display
  getAlertsCountByStatus(status: string): number {
    return this.alerts.filter(alert => alert.status === status).length;
  }

  getAlertsCountByPriority(priority: string): number {
    return this.alerts.filter(alert => alert.priority === priority).length;
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'warning';
      case 'HIGH': return 'priority_high';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'low_priority';
      default: return 'info';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'warn';
      case 'HIGH': return 'accent';
      case 'MEDIUM': return 'primary';
      case 'LOW': return '';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'emergency';
      case 'RESPONDING': return 'support_agent';
      case 'RESOLVED': return 'check_circle';
      case 'FALSE_ALARM': return 'cancel';
      default: return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'warn';
      case 'RESPONDING': return 'accent';
      case 'RESOLVED': return 'primary';
      case 'FALSE_ALARM': return '';
      default: return '';
    }
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  clearFilters(): void {
    this.selectedStatus = 'ALL';
    this.selectedType = 'ALL';
    this.selectedPriority = 'ALL';
    this.searchText = '';
    this.applyFilters();
  }

  // Helper methods for filter management
  isFiltered(): boolean {
    return this.selectedStatus !== 'ALL' || 
           this.selectedType !== 'ALL' || 
           this.selectedPriority !== 'ALL' || 
           this.searchText !== '';
  }

  clearStatusFilter(): void {
    this.selectedStatus = 'ALL';
    this.applyFilters();
  }

  clearPriorityFilter(): void {
    this.selectedPriority = 'ALL';
    this.applyFilters();
  }

  clearTypeFilter(): void {
    this.selectedType = 'ALL';
    this.applyFilters();
  }

  // Statistics card click handlers
  onCriticalAlertsClick(): void {
    this.selectedPriority = 'CRITICAL';
    this.selectedStatus = 'ALL';
    this.selectedType = 'ALL';
    this.searchText = '';
    this.selectedTabIndex = 2; // Switch to Critical tab
    this.applyFilters();
    this.snackBar.open('Filtered to show Critical alerts', 'Close', { duration: 2000 });
  }

  onActiveAlertsClick(): void {
    this.selectedStatus = 'ACTIVE';
    this.selectedPriority = 'ALL';
    this.selectedType = 'ALL';
    this.searchText = '';
    this.selectedTabIndex = 1; // Switch to Active tab
    this.applyFilters();
    this.snackBar.open('Filtered to show Active alerts', 'Close', { duration: 2000 });
  }

  onResolvedTodayClick(): void {
    this.selectedStatus = 'RESOLVED';
    this.selectedPriority = 'ALL';
    this.selectedType = 'ALL';
    this.searchText = '';
    this.selectedTabIndex = 0; // Stay on All tab
    this.applyFilters();
    this.snackBar.open('Filtered to show Resolved alerts', 'Close', { duration: 2000 });
  }

  onResponseTimeClick(): void {
    // Sort alerts by response time or show analytics
    this.selectedStatus = 'ALL';
    this.selectedPriority = 'ALL';
    this.selectedType = 'ALL';
    this.searchText = '';
    this.selectedTabIndex = 0; // Show all alerts sorted by response time
    this.applyFilters();
    this.snackBar.open('Showing response time analytics', 'Close', { duration: 2000 });
  }
}
