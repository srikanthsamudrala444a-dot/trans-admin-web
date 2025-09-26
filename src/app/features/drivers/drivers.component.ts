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
import { firstValueFrom } from 'rxjs';
import { DriverService } from '../../core/services/driver.service';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AddDriverDialogComponent } from './add-driver-dialog.component';
import { DriverDocumentsDialogComponent } from './driver-documents-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
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

  // Filter properties
  selectedDocumentStatus: string = 'all';
  selectedDriverStatus: string = 'all';

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
    console.log('DriversComponent: ngOnInit called');
    
    // Check authentication
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token present:', !!accessToken);
    console.log('Access token length:', accessToken?.length || 0);
    
    if (!accessToken) {
      console.error('No access token found! User may not be logged in.');
      alert('Authentication Error: No access token found. Please log in again.');
      return;
    }
    
    // Test API connection first
    console.log('Testing API connection...');
    this.driverService.testConnection().subscribe({
      next: (response) => {
        console.log('API connection test successful:', response);
        console.log('Loading drivers...');
        this.loadDrivers();
      },
      error: (error) => {
        console.error('API connection test failed:', error);
        alert(`API Connection Failed: ${error.message || error.status || 'Unknown error'}`);
        // Still try to load drivers
        this.loadDrivers();
      }
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

  // Filter methods for document and driver status
  onDocumentStatusFilterChange(): void {
    console.log('Document status filter changed:', this.selectedDocumentStatus);
    this.applyFilters();
  }

  onDriverStatusFilterChange(): void {
    console.log('Driver status filter changed:', this.selectedDriverStatus);
    this.applyFilters();
  }

  private applyFilters(): void {
    this.currentPage = 1; // Reset to first page when applying filters
    this.loadDriversWithFilters();
  }

  private loadDriversWithFilters(): void {
    this.isLoading.set(true);

    const query: DriverQuery = {
      pageNumber: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      retrieveInactive: false,
      sort: this.currentSort,
    };

    // Add driver status filter if not 'all'
    if (this.selectedDriverStatus !== 'all') {
      (query as any).status = this.selectedDriverStatus;
    }

    this.driverService.getDriversByQuery(query).subscribe({
      next: async (data: any) => {
        console.log("Filtered drivers data:", data);
        
        if (data && Array.isArray(data.driver)) {
          let filteredDrivers = data.driver;
          
          // Apply driver status filter if API doesn't handle it  
          if (this.selectedDriverStatus !== 'all') {
            filteredDrivers = filteredDrivers.filter((driver: any) => 
              driver.status === this.selectedDriverStatus
            );
          }

          // Apply document status filter using getDocuementVerificationList
          if (this.selectedDocumentStatus !== 'all') {
            const driversWithDocStatus = await this.filterDriversByDocumentStatus(filteredDrivers, this.selectedDocumentStatus);
            filteredDrivers = driversWithDocStatus;
          }

          this.totalNumberOfRecords = filteredDrivers.length;
          this.dataSource.data = filteredDrivers;
          this.totalItems = filteredDrivers.length;
          this.totalPages = Math.ceil(filteredDrivers.length / this.itemsPerPage);

          this.calculateStats();
        } else {
          this.drivers = [];
          this.dataSource.data = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        console.error('Error fetching filtered drivers', err);
        this.drivers = [];
        this.dataSource.data = [];
        this.totalItems = 0;
        this.totalPages = 1;
      },
    });
  }

  private async filterDriversByDocumentStatus(drivers: any[], status: string): Promise<any[]> {
    const filteredDrivers: any[] = [];
    
    for (const driver of drivers) {
      try {
        const documents = await firstValueFrom(this.driverService.getDocuementVerificationList(driver.id));
        const documentStatus = this.evaluateDocumentStatus(documents);
        
        if (documentStatus === status) {
          filteredDrivers.push(driver);
        }
      } catch (error) {
        console.error(`Error fetching documents for driver ${driver.id}:`, error);
        // If we can't fetch documents, exclude from filtered results for document-specific filters
      }
    }
    
    return filteredDrivers;
  }

  private evaluateDocumentStatus(documents: any): string {
    if (!documents || !Array.isArray(documents)) {
      return 'pending'; // Default to pending if no documents
    }

    // Check if all documents are approved
    const allApproved = documents.every(doc => doc.status === 'approved' || doc.verificationStatus === 'approved');
    if (allApproved && documents.length > 0) {
      return 'approved';
    }

    // Check if any document is rejected
    const anyRejected = documents.some(doc => doc.status === 'rejected' || doc.verificationStatus === 'rejected');
    if (anyRejected) {
      return 'rejected';
    }

    // Default to pending
    return 'pending';
  }

  // Override the existing loadDrivers method to use filters
  loadDrivers(page: number = 1, itemsPerPage: number = 10): void {
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    
    // Use filtered loading if any filters are active
    if (this.selectedDocumentStatus !== 'all' || this.selectedDriverStatus !== 'all') {
      this.loadDriversWithFilters();
    } else {
      this.loadDriversOriginal(page, itemsPerPage);
    }
  }

  // Rename the original loadDrivers method
  private loadDriversOriginal(page: number = 1, itemsPerPage: number = 10): void {
    console.log('DriversComponent: loadDriversOriginal called');
    console.log('Page:', page, 'ItemsPerPage:', itemsPerPage);
    
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    this.isLoading.set(true);

    const query: DriverQuery = {
      pageNumber: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      retrieveInactive: false,
      sort: this.currentSort,
    };

    console.log('Query object:', query);
    console.log('Calling driverService.getDriversByQuery...');

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
        console.error('Error fetching drivers:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);
        
        // Show user-friendly error message
        alert(`Failed to load drivers. Error: ${err.status} - ${err.message || 'Unknown error'}`);
        
        this.drivers = [];
        this.dataSource.data = [];
        this.totalItems = 0;
        this.totalPages = 1;
      },
    });
  }

  openDocumentsDialog(driver: Driver): void {
    console.log('Opening documents dialog for driver:', driver);
    console.log('Driver ID:', driver.id);
    console.log('Driver User ID:', driver.userId);
    console.log('Driver Name:', `${driver.firstName} ${driver.lastName}`);
    
    const driverId = driver.id || driver.userId;
    console.log('Using driver ID:', driverId);
    
    const dialogRef = this.dialog.open(DriverDocumentsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        driverId: driverId,
        driverName: `${driver.firstName} ${driver.lastName}`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Handle any actions after dialog closes if needed
      console.log('Documents dialog closed');
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
