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
  //vehicles = new MatTableDataSource <any>([]); // ✅ instead of plain array

  loading = false;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10

  // ✅ Filters
  type: string = 'all';
  status: string = 'all';
  search: string = '';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  //loadVehicles(): void {
   // this.loading = true;
    //const filters: any = {};

 loadVehicles(page: number = 1): void {
    this.loading = true;
    
    this.currentPage = page;
    const filters: any = {
      pageNumber: page,
      itemsPerPage: this.itemsPerPage
    };
    if (this.type !== 'all') filters.type = this.type;
    if (this.status !== 'all') filters.status = this.status;
    if (this.search.trim()) filters.search = this.search.trim();

    this.vehicleService.queryVehicles(filters).subscribe({
      next: (res: any) => {
        // Adjust according to your API response structure
        if (res && Array.isArray(res.data)) {
          this.vehicles = res.data;
          this.totalItems = res.totalCount || res.data.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        } else if (Array.isArray(res)) {
          this.vehicles = res;
          this.totalItems = res.length;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        } else {
          this.vehicles = []; // ✅ instead of plain array
          this.totalItems = 0;
          this.totalPages = 1;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching vehicles:', err);
        this.vehicles = [];
      }
    });
 }
 
  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.loadVehicles(page);
     }
  }
 

  
  
  // Pagination controls for template
  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }
      pages.push(this.totalPages);
    }
    return pages;
  }

}

