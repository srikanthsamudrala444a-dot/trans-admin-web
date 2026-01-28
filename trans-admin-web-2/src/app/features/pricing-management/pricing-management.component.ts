import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PricingService } from '../../core/services/pricing.service';
import { Zone, SurgeEvent, ZoneMetrics, PricingAnalytics } from '../../core/models/pricing.model';
import { 
  SurgeActivationDialogComponent, 
  SurgeActivationData, 
  SurgeActivationResult 
} from './dialogs/surge-activation-dialog.component';
import { ZoneCardComponent } from './components/zone-card.component';

@Component({
  selector: 'app-pricing-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ZoneCardComponent
  ],
  templateUrl: './pricing-management.component.html',
  styleUrls: ['./pricing-management.component.scss']
})
export class PricingManagementComponent implements OnInit, OnDestroy {
  // Data properties
  zones: Zone[] = [];
  activeSurgeEvents: SurgeEvent[] = [];
  realTimeMetrics: ZoneMetrics[] = [];
  analytics: PricingAnalytics | null = null;
  
  // Loading states
  loading = {
    zones: false,
    surgeEvents: false,
    metrics: false,
    analytics: false
  };

  // Selected tab index
  selectedTabIndex = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private pricingService: PricingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.subscribeToRealTimeMetrics();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadInitialData(): void {
    this.loadZones();
    this.loadActiveSurgeEvents();
    this.loadAnalytics();
  }

  private loadZones(): void {
    this.loading.zones = true;
    const sub = this.pricingService.getZones().subscribe({
      next: (zones) => {
        this.zones = zones;
        this.loading.zones = false;
      },
      error: (error) => {
        console.error('Error loading zones:', error);
        this.showError('Failed to load zones');
        this.loading.zones = false;
      }
    });
    this.subscriptions.push(sub);
  }

  private loadActiveSurgeEvents(): void {
    this.loading.surgeEvents = true;
    const sub = this.pricingService.getActiveSurgeEvents().subscribe({
      next: (events) => {
        this.activeSurgeEvents = events;
        this.loading.surgeEvents = false;
      },
      error: (error) => {
        console.error('Error loading surge events:', error);
        this.showError('Failed to load surge events');
        this.loading.surgeEvents = false;
      }
    });
    this.subscriptions.push(sub);
  }

  private loadAnalytics(): void {
    this.loading.analytics = true;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    const endDate = new Date();

    const sub = this.pricingService.getPricingAnalytics(startDate, endDate).subscribe({
      next: (analytics) => {
        this.analytics = analytics;
        this.loading.analytics = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.showError('Failed to load analytics');
        this.loading.analytics = false;
      }
    });
    this.subscriptions.push(sub);
  }

  private subscribeToRealTimeMetrics(): void {
    this.loading.metrics = true;
    const sub = this.pricingService.getRealTimeMetrics().subscribe({
      next: (metrics) => {
        this.realTimeMetrics = metrics;
        this.loading.metrics = false;
      },
      error: (error) => {
        console.error('Error loading real-time metrics:', error);
        this.showError('Failed to load real-time metrics');
        this.loading.metrics = false;
      }
    });
    this.subscriptions.push(sub);
  }

  // UI Event Handlers
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onRefreshData(): void {
    this.loadInitialData();
    this.showSuccess('Data refreshed successfully');
  }

  onManualSurgeActivation(zoneId: string): void {
    const zone = this.zones.find(z => z.id === zoneId);
    const currentMetric = this.realTimeMetrics.find(m => m.zoneId === zoneId);
    
    if (!zone || !currentMetric) {
      this.showError('Zone information not found');
      return;
    }

    const dialogData: SurgeActivationData = {
      zone: zone,
      currentMultiplier: currentMetric.currentSurgeMultiplier
    };

    const dialogRef = this.dialog.open(SurgeActivationDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: SurgeActivationResult) => {
      if (result) {
        this.activateManualSurge(zoneId, result);
      }
    });
  }

  private activateManualSurge(zoneId: string, surgeData: SurgeActivationResult): void {
    const sub = this.pricingService.manuallyActivateSurge(
      zoneId, 
      surgeData.multiplier, 
      surgeData.reason
    ).subscribe({
      next: (surgeEvent) => {
        this.showSuccess(`Surge activated successfully for ${surgeEvent.zoneName}`);
        this.loadActiveSurgeEvents();
        // Update real-time metrics to reflect the change
        this.updateZoneMetric(zoneId, surgeData.multiplier);
      },
      error: (error) => {
        console.error('Error activating surge:', error);
        this.showError('Failed to activate surge');
      }
    });
    this.subscriptions.push(sub);
  }

  private updateZoneMetric(zoneId: string, newMultiplier: number): void {
    const metric = this.realTimeMetrics.find(m => m.zoneId === zoneId);
    if (metric) {
      metric.currentSurgeMultiplier = newMultiplier;
    }
  }

  // Zone Management Methods
  getZoneMetrics(zoneId: string): ZoneMetrics | undefined {
    return this.realTimeMetrics.find(m => m.zoneId === zoneId);
  }

  onEditZone(zone: Zone): void {
    this.showInfo(`Edit zone functionality for ${zone.name} would open here`);
  }

  onDeleteZone(zoneId: string): void {
    const zone = this.zones.find(z => z.id === zoneId);
    if (!zone) return;

    // In a real app, you'd show a confirmation dialog
    if (confirm(`Are you sure you want to delete zone "${zone.name}"?`)) {
      const sub = this.pricingService.deleteZone(zoneId).subscribe({
        next: (success) => {
          if (success) {
            this.showSuccess(`Zone "${zone.name}" deleted successfully`);
            this.loadZones();
          } else {
            this.showError('Failed to delete zone');
          }
        },
        error: (error) => {
          console.error('Error deleting zone:', error);
          this.showError('Failed to delete zone');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  onToggleZoneStatus(event: { zoneId: string, isActive: boolean }): void {
    const zone = this.zones.find(z => z.id === event.zoneId);
    if (!zone) return;

    const sub = this.pricingService.updateZone(event.zoneId, { isActive: event.isActive }).subscribe({
      next: (updatedZone) => {
        if (updatedZone) {
          this.showSuccess(
            `Zone "${zone.name}" ${event.isActive ? 'activated' : 'deactivated'} successfully`
          );
          this.loadZones();
        } else {
          this.showError('Failed to update zone status');
        }
      },
      error: (error) => {
        console.error('Error updating zone status:', error);
        this.showError('Failed to update zone status');
      }
    });
    this.subscriptions.push(sub);
  }

  onViewZoneMap(zone: Zone): void {
    this.showInfo(`Map view for ${zone.name} would open here`);
  }

  onViewZoneAnalytics(zoneId: string): void {
    const zone = this.zones.find(z => z.id === zoneId);
    this.showInfo(`Analytics for ${zone?.name || 'zone'} would open here`);
  }

  onDeactivateSurge(surgeId: string): void {
    const sub = this.pricingService.deactivateSurge(surgeId).subscribe({
      next: (success) => {
        if (success) {
          this.showSuccess('Surge deactivated successfully');
          this.loadActiveSurgeEvents();
        } else {
          this.showError('Failed to deactivate surge');
        }
      },
      error: (error) => {
        console.error('Error deactivating surge:', error);
        this.showError('Failed to deactivate surge');
      }
    });
    this.subscriptions.push(sub);
  }

  // Utility methods
  getSurgeStatus(multiplier: number): string {
    if (multiplier >= 2.5) return 'high';
    if (multiplier >= 1.5) return 'medium';
    if (multiplier > 1.0) return 'low';
    return 'none';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  formatDuration(startTime: Date, endTime?: Date): string {
    const end = endTime || new Date();
    const diffMs = end.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
