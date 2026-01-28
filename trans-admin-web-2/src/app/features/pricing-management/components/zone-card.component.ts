import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Zone, ZoneMetrics } from '../../../core/models/pricing.model';

@Component({
  selector: 'app-zone-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <mat-card class="zone-card" [class.active]="zone.isActive">
      <mat-card-header>
        <div class="zone-header">
          <div class="zone-title">
            <h3>{{ zone.name }}</h3>
            <mat-chip [class]="zone.isActive ? 'active-chip' : 'inactive-chip'">
              {{ zone.isActive ? 'Active' : 'Inactive' }}
            </mat-chip>
          </div>
          <button mat-icon-button [matMenuTriggerFor]="zoneMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #zoneMenu="matMenu">
            <button mat-menu-item (click)="onEdit()">
              <mat-icon>edit</mat-icon>
              Edit Zone
            </button>
            <button mat-menu-item (click)="onViewMap()">
              <mat-icon>map</mat-icon>
              View on Map
            </button>
            <button mat-menu-item (click)="onToggleStatus()" 
                    [disabled]="hasActiveSurge">
              <mat-icon>{{ zone.isActive ? 'pause' : 'play_arrow' }}</mat-icon>
              {{ zone.isActive ? 'Deactivate' : 'Activate' }}
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="onDelete()" 
                    [disabled]="hasActiveSurge" 
                    class="delete-option">
              <mat-icon>delete</mat-icon>
              Delete Zone
            </button>
          </mat-menu>
        </div>
      </mat-card-header>

      <mat-card-content>
        <div class="zone-description">
          {{ zone.description || 'No description available' }}
        </div>

        <div class="zone-metrics" *ngIf="metrics">
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Active Drivers</span>
              <span class="metric-value">{{ metrics.activeDrivers }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Pending Bookings</span>
              <span class="metric-value">{{ metrics.pendingBookings }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">D/S Ratio</span>
              <span class="metric-value" 
                    [class]="getDemandSupplyClass(metrics.demandToSupplyRatio)">
                {{ metrics.demandToSupplyRatio.toFixed(2) }}
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Current Multiplier</span>
              <span class="metric-value multiplier" 
                    [class]="getSurgeClass(metrics.currentSurgeMultiplier)">
                {{ metrics.currentSurgeMultiplier.toFixed(1) }}x
              </span>
            </div>
          </div>

          <div class="surge-status" *ngIf="metrics.currentSurgeMultiplier > 1.0">
            <mat-icon class="surge-icon">flash_on</mat-icon>
            <span>Surge pricing active</span>
          </div>
        </div>

        <div class="zone-stats">
          <div class="stat-row">
            <div class="stat-item">
              <span class="label">Coordinates:</span>
              <span class="value">{{ zone.coordinates.length }} points</span>
            </div>
            <div class="stat-item">
              <span class="label">Created:</span>
              <span class="value">{{ zone.createdAt | date:'short' }}</span>
            </div>
          </div>
          <div class="stat-row">
            <div class="stat-item">
              <span class="label">Last Updated:</span>
              <span class="value">{{ zone.updatedAt | date:'short' }}</span>
            </div>
            <div class="stat-item" *ngIf="metrics">
              <span class="label">Est. Revenue:</span>
              <span class="value">{{ formatCurrency(metrics.estimatedRevenue) }}</span>
            </div>
          </div>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-stroked-button 
                color="primary" 
                (click)="onManualSurge()"
                [disabled]="!zone.isActive || hasHighSurge"
                matTooltip="Activate manual surge pricing for this zone">
          <mat-icon>flash_on</mat-icon>
          Manual Surge
        </button>
        <button mat-stroked-button 
                color="accent" 
                (click)="onViewAnalytics()"
                matTooltip="View detailed analytics for this zone">
          <mat-icon>analytics</mat-icon>
          Analytics
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./zone-card.component.scss']
})
export class ZoneCardComponent {
  @Input() zone!: Zone;
  @Input() metrics?: ZoneMetrics;
  @Output() editZone = new EventEmitter<Zone>();
  @Output() deleteZone = new EventEmitter<string>();
  @Output() toggleZoneStatus = new EventEmitter<{ zoneId: string, isActive: boolean }>();
  @Output() manualSurge = new EventEmitter<string>();
  @Output() viewMap = new EventEmitter<Zone>();
  @Output() viewAnalytics = new EventEmitter<string>();

  get hasActiveSurge(): boolean {
    return this.metrics ? this.metrics.currentSurgeMultiplier > 1.0 : false;
  }

  get hasHighSurge(): boolean {
    return this.metrics ? this.metrics.currentSurgeMultiplier >= 2.0 : false;
  }

  onEdit(): void {
    this.editZone.emit(this.zone);
  }

  onDelete(): void {
    this.deleteZone.emit(this.zone.id);
  }

  onToggleStatus(): void {
    this.toggleZoneStatus.emit({
      zoneId: this.zone.id,
      isActive: !this.zone.isActive
    });
  }

  onManualSurge(): void {
    this.manualSurge.emit(this.zone.id);
  }

  onViewMap(): void {
    this.viewMap.emit(this.zone);
  }

  onViewAnalytics(): void {
    this.viewAnalytics.emit(this.zone.id);
  }

  getDemandSupplyClass(ratio: number): string {
    if (ratio >= 2.5) return 'high';
    if (ratio >= 1.5) return 'medium';
    return 'normal';
  }

  getSurgeClass(multiplier: number): string {
    if (multiplier >= 2.5) return 'high';
    if (multiplier >= 1.5) return 'medium';
    if (multiplier > 1.0) return 'low';
    return 'normal';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
}
