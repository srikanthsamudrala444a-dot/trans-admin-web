import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VehicleService } from '../../core/services/vehicles.service';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    
  ],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  displayedColumns = [
    'vehicle',
    'plateNumber',
    'driver',
    'type',
    'status',
    'documents',
    'lastService',
    'actions'
  ];
  vehicles: any[] = [];
  loading = false;

  // ✅ Filters
  type: string = 'all';
  status: string = 'all';
  search: string = '';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    const filters: any = {};

    if (this.type !== 'all') filters.type = this.type;
    if (this.status !== 'all') filters.status = this.status;
    if (this.search.trim()) filters.search = this.search.trim();

    this.vehicleService.queryVehicles(filters).subscribe({
      next: (res:any) => {
        this.vehicles = res.data || res; // ✅ depends on API response
        this.loading = false;
      },
      error: (err:any) => {
        console.error('Error fetching vehicles:', err);
        this.loading = false;
      }
    });
  }
}
