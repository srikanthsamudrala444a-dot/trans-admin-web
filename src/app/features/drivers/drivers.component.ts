import {
  Component,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSortModule, Sort } from '@angular/material/sort';
import { DriverService } from '../../core/services/driver.service';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AddDriverDialogComponent } from './add-driver-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Driver,
  DriverQuery,
  SortOption,
} from '../../core/models/driver.model';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatDialogModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversComponent implements OnInit {
  // Problems to be fixed:
  // 1 - Fix arrow forward + Next button conditions
  // 2 - Fix Limit
  // 3 - DESC In Sorting is not working

  displayedColumns = [
    'name',
    'phone',
    'status',
    'rating',
    'documents',
    'earnings',
    'actions',
  ];

  dataSource = new MatTableDataSource<Driver>([]);

  drivers: Driver[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  totalNumberOfRecords: number = 0;
  isLoading: WritableSignal<boolean> = signal(false);

  currentSort: SortOption[] = [];

  onlineDrivers = 0;
  offlineDrivers = 0;
  pendingApprovals = 0;

  constructor(
    private driverService: DriverService,
    private dialog: MatDialog
  ) {}

  selectedFile: File | null = null;
  selectedDocumentType: string = '';
  uploadMessage: string = '';
  uploadError: string = '';

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(page: number = 1, itemsPerPage: number = 10): void {
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    this.isLoading.set(true);

    const query: DriverQuery = {
      pageNumber: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      retrieveInactive: false,
      sort: this.currentSort,
    };

    this.driverService.getDriversByQuery(query).subscribe({
      next: (data: any) => {
        console.log("Drivers data:",data)
        if (data && Array.isArray(data.driver)) {
          this.totalNumberOfRecords = data.pagination.totalNumberOfRecords;
          this.dataSource.data = data.driver || [];
          this.totalItems = data.totalCount || data.driver.length;
          this.totalPages = Math.ceil(
            (data.totalCount || data.driver.length || data.totalItems) /
              this.itemsPerPage
          );

          this.calculateStats();
        } else {
          this.drivers = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error('Error fetching drivers', err);
        this.drivers = [];
        this.totalItems = 0;
        this.totalPages = 1;
      },
    });
  }

  announceSortChange(sortState: Sort) {
    console.log('Sort changed:', sortState);

    // Clear previous sort
    this.currentSort = [];

    if (sortState.direction) {
      const sortOption: SortOption = {
        fieldName: this.mapSortFieldName(sortState.active),
        sortDirection:
          sortState.direction === 'asc' ? 'ASCENDING' : 'DESCENDING',
      };
      this.currentSort.push(sortOption);
    }

    this.currentPage = 1;
    this.loadDrivers(this.currentPage, this.itemsPerPage);
  }

  // Map frontend column names to backend field names
  private mapSortFieldName(columnName: string): string {
    const fieldMapping: { [key: string]: string } = {
      name: 'firstName',
      phone: 'contactNumber',
      status: 'status',
      rating: 'averageRating',
      documents: 'documentsStatus',
      earnings: 'earnings',
    };
    return fieldMapping[columnName] || columnName;
  }

  goToPage(page: number): void {
    if (typeof page === 'number') {
      this.loadDrivers(page, this.itemsPerPage);
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadDrivers(this.currentPage, this.itemsPerPage);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadDocument(driverId: string): void {
    if (!this.selectedFile || !this.selectedDocumentType) {
      this.uploadError = 'Please select a file and document type.';
      return;
    }
    this.driverService
      .uploadDriverDocument(
        driverId,
        this.selectedDocumentType,
        this.selectedFile
      )
      .subscribe({
        next: () => {
          this.uploadMessage = 'Document uploaded successfully!';
          this.loadDrivers();
        },
        error: (err: { message: any }) => {
          this.uploadError = `Upload failed: ${err.message || 'Unknown error'}`;
        },
      });
  }

  getDriverDocuments(driverId: string): void {
    this.driverService.getDriverDocuments(driverId).subscribe({
      next: (documents: any) => {
        console.log('Documents for driver:', documents);
      },
      error: (err: any) => {
        console.error('Error fetching documents:', err);
      },
    });
  }

  toggleDriverStatus(driver: Driver): void {
    let newStatus: 'online' | 'offline' | 'busy';
    newStatus = driver.status === 'online' ? 'offline' : 'online';
    this.driverService.updateAvailability(driver.id, newStatus).subscribe({
      next: (updatedDriver: { id: string; status: string }) => {
        const index = this.drivers.findIndex((d) => d.id === updatedDriver.id);
        if (index !== -1) {
          this.drivers[index].status = updatedDriver.status as
            | 'online'
            | 'offline'
            | 'busy';
          this.calculateStats();
        }
      },
      error: (err: any) => {
        console.error('Error updating driver status:', err);
      },
    });
  }

  addNewDriver(newDriverData: any): void {
    this.driverService.registerDriver(newDriverData).subscribe({
      next: () => {
        alert('Driver registered successfully!');
        this.loadDrivers(this.currentPage);
        this.calculateStats();
      },
      error: (err: any) => {
        let errorMessage = 'Failed to register driver.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        alert(`Registration failed: ${errorMessage}`);
      },
    });
  }

  openAddDriverDialog(): void {
    const dialogRef = this.dialog.open(AddDriverDialogComponent, {
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addNewDriver(result);
      }
    });
  }

  // Pagination controls
  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxPagesToShow / 2)
    );
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

  private calculateStats(): void {
    this.onlineDrivers = this.drivers.filter(
      (d) => d.status === 'online'
    ).length;
    this.offlineDrivers = this.drivers.filter(
      (d) => d.status === 'offline'
    ).length;
    this.pendingApprovals = this.drivers.filter(
      (d) => d.documentsStatus === 'pending'
    ).length;
  }
}
