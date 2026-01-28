import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SurgePricingService } from '../../core/services/surge-pricing.service';
import { SurgeZone, SurgeRule, SurgeAnalytics } from '../../core/models/surge-pricing.model';
import { SurgeZoneDialogComponent } from './surge-zone-dialog/surge-zone-dialog.component';

@Component({
  selector: 'app-surge-pricing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatSlideToggleModule
  ],
  templateUrl: './surge-pricing.component.html',
  styleUrls: ['./surge-pricing.component.scss']
})
export class SurgePricingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Data sources
  surgeZones: SurgeZone[] = [];
  surgeRules: SurgeRule[] = [];
  analytics: SurgeAnalytics | null = null;

  // Table data sources
  zonesDataSource = new MatTableDataSource<SurgeZone>();
  rulesDataSource = new MatTableDataSource<SurgeRule>();

  // Display columns
  zoneColumns: string[] = ['name', 'status', 'currentMultiplier', 'activeRiders', 'availableDrivers', 'demandLevel', 'actions'];
  ruleColumns: string[] = ['name', 'minMultiplier', 'maxMultiplier', 'demandThreshold', 'status', 'actions'];

  // Filters
  selectedStatus = 'all';
  selectedDemandLevel = 'all';
  searchTerm = '';

  // Statistics
  totalActiveZones = 0;
  totalRevenue = 0;
  averageMultiplier = 0;
  peakHours: string[] = [];

  constructor(
    private surgePricingService: SurgePricingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.zonesDataSource.paginator = this.paginator;
    this.zonesDataSource.sort = this.sort;
  }

  loadData() {
    // Load surge zones
    this.surgePricingService.getSurgeZones().subscribe(zones => {
      this.surgeZones = zones;
      this.zonesDataSource.data = zones;
      this.applyFilters();
      this.calculateStatistics();
    });

    // Load surge rules
    this.surgePricingService.getSurgeRules().subscribe(rules => {
      this.surgeRules = rules;
      this.rulesDataSource.data = rules;
    });

    // Load analytics
    this.surgePricingService.getSurgeAnalytics().subscribe(analytics => {
      this.analytics = analytics;
      this.updateAnalyticsDisplay();
    });
  }

  applyFilters() {
    let filteredZones = [...this.surgeZones];

    // Status filter
    if (this.selectedStatus !== 'all') {
      filteredZones = filteredZones.filter(zone => zone.status === this.selectedStatus);
    }

    // Demand level filter
    if (this.selectedDemandLevel !== 'all') {
      filteredZones = filteredZones.filter(zone => zone.demandLevel === this.selectedDemandLevel);
    }

    // Search filter
    if (this.searchTerm) {
      filteredZones = filteredZones.filter(zone =>
        zone.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        zone.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.zonesDataSource.data = filteredZones;
  }

  calculateStatistics() {
    this.totalActiveZones = this.surgeZones.filter(zone => zone.status === 'active').length;
    this.averageMultiplier = this.surgeZones.reduce((sum, zone) => sum + zone.currentMultiplier, 0) / this.surgeZones.length;
  }

  updateAnalyticsDisplay() {
    if (this.analytics) {
      this.totalRevenue = this.analytics.totalRevenue;
      this.peakHours = this.analytics.peakHours;
    }
  }

  openZoneDialog(zone?: SurgeZone) {
    const dialogRef = this.dialog.open(SurgeZoneDialogComponent, {
      width: '800px',
      data: { zone: zone || null, mode: zone ? 'edit' : 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.showSnackBar(zone ? 'Zone updated successfully' : 'Zone created successfully');
      }
    });
  }

  toggleZoneStatus(zone: SurgeZone) {
    const newStatus = zone.status === 'active' ? 'inactive' : 'active';
    
    this.surgePricingService.updateZoneStatus(zone.id, newStatus).subscribe({
      next: () => {
        zone.status = newStatus;
        this.showSnackBar(`Zone ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        this.calculateStatistics();
      },
      error: (error) => {
        this.showSnackBar('Failed to update zone status', 'error');
      }
    });
  }

  toggleRuleStatus(rule: SurgeRule) {
    const newStatus = rule.status === 'active' ? 'inactive' : 'active';
    
    this.surgePricingService.updateRuleStatus(rule.id, newStatus).subscribe({
      next: () => {
        rule.status = newStatus;
        this.showSnackBar(`Rule ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      },
      error: (error) => {
        this.showSnackBar('Failed to update rule status', 'error');
      }
    });
  }

  deleteZone(zone: SurgeZone) {
    if (confirm(`Are you sure you want to delete zone "${zone.name}"?`)) {
      this.surgePricingService.deleteZone(zone.id).subscribe({
        next: () => {
          this.loadData();
          this.showSnackBar('Zone deleted successfully');
        },
        error: (error) => {
          this.showSnackBar('Failed to delete zone', 'error');
        }
      });
    }
  }

  deleteRule(rule: SurgeRule) {
    if (confirm(`Are you sure you want to delete rule "${rule.name}"?`)) {
      this.surgePricingService.deleteRule(rule.id).subscribe({
        next: () => {
          this.loadData();
          this.showSnackBar('Rule deleted successfully');
        },
        error: (error) => {
          this.showSnackBar('Failed to delete rule', 'error');
        }
      });
    }
  }

  clearFilters() {
    this.selectedStatus = 'all';
    this.selectedDemandLevel = 'all';
    this.searchTerm = '';
    this.applyFilters();
  }

  refreshData() {
    this.loadData();
    this.showSnackBar('Data refreshed successfully');
  }

  exportData() {
    // Implementation for exporting surge pricing data
    this.showSnackBar('Export functionality coming soon');
  }

  getDemandLevelColor(level: string): string {
    switch (level) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'critical': return 'purple';
      default: return 'gray';
    }
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'green' : 'gray';
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }
}
