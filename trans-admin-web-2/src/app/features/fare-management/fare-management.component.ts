import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { FareService } from '../../core/services/fare.service';
import { VehicleCategory, FareStructure, FareAnalytics } from '../../core/models/fare.model';

@Component({
  selector: 'app-fare-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './fare-management.component.html',
  styleUrls: ['./fare-management.component.scss']
})
export class FareManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  vehicleCategories: VehicleCategory[] = [];
  fareStructures: FareStructure[] = [];
  analytics: FareAnalytics | null = null;
  isLoading = true;
  selectedTabIndex = 0;

  constructor(
    private fareService: FareService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;

    combineLatest([
      this.fareService.getVehicleCategories(),
      this.fareService.getFareStructures(),
      this.fareService.getFareAnalytics()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([categories, structures, analytics]) => {
        this.vehicleCategories = categories;
        this.fareStructures = structures;
        this.analytics = analytics;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading fare management data:', error);
        alert('Error loading data');
        this.isLoading = false;
      }
    });
  }

  onAddVehicleCategory(): void {
    // TODO: Implement dialog
    alert('Add Vehicle Category dialog will be implemented');
  }

  onEditVehicleCategory(category: VehicleCategory): void {
    // TODO: Implement dialog
    alert(`Edit Vehicle Category "${category.name}" dialog will be implemented`);
  }

  onDeleteVehicleCategory(category: VehicleCategory): void {
    if (confirm(`Are you sure you want to delete the "${category.name}" vehicle category?`)) {
      this.fareService.deleteVehicleCategory(category.id).subscribe({
        next: () => {
          alert('Vehicle category deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting vehicle category:', error);
          alert('Error deleting vehicle category');
        }
      });
    }
  }

  onAddFareStructure(): void {
    // TODO: Implement dialog
    alert('Add Fare Structure dialog will be implemented');
  }

  onEditFareStructure(structure: FareStructure): void {
    // TODO: Implement dialog
    alert(`Edit Fare Structure for "${structure.vehicleCategory.name}" dialog will be implemented`);
  }

  onDeleteFareStructure(structure: FareStructure): void {
    if (confirm(`Are you sure you want to delete the fare structure for "${structure.vehicleCategory.name}"?`)) {
      this.fareService.deleteFareStructure(structure.id).subscribe({
        next: () => {
          alert('Fare structure deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting fare structure:', error);
          alert('Error deleting fare structure');
        }
      });
    }
  }

  onTabChanged(index: number): void {
    this.selectedTabIndex = index;
  }

  updateFareValue(structureId: string, field: string, event: any): void {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      this.fareService.updateFareStructure(structureId, { [field]: value }).subscribe({
        next: () => {
          console.log(`Updated ${field} to ${value}`);
        },
        error: (error) => {
          console.error('Error updating fare value:', error);
          alert('Error updating fare value');
        }
      });
    }
  }

  getActiveVehicleCategories(): VehicleCategory[] {
    return this.vehicleCategories.filter(category => category.isActive);
  }

  getActiveFareStructures(): FareStructure[] {
    return this.fareStructures.filter(structure => structure.isActive);
  }
}
