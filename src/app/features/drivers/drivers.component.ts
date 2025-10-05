import {
  AfterViewInit,
  Component,
  inject,
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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { DriverService } from '../../core/services/driver.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Driver,
  DriverQuery,
  SortOption,
} from '../../core/models/driver.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddDriverDialogComponent } from '../add-driver-dialog/add-driver-dialog.component';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Custom Paginator Factory Function
function customPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Items per page:';
  paginatorIntl.nextPageLabel = 'Next page';
  paginatorIntl.previousPageLabel = 'Previous page';
  paginatorIntl.firstPageLabel = 'First page';
  paginatorIntl.lastPageLabel = 'Last page';

  paginatorIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0) {
      return `Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  };

  return paginatorIntl;
}

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
    MatSlideToggleModule,
    MatPaginatorModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'phone', 'status', 'rating', 'earnings'];
  dataSource = new MatTableDataSource<Driver>([]);
  drivers: Driver[] = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  pageJumpValue: number | null = null;

  // Filters
  searchTerm: string = '';
  selectedDocumentStatus: string = '';
  selectedDriverStatus: string = '';

  // Loading & Sorting
  isLoading: WritableSignal<boolean> = signal(false);
  currentSort: SortOption[] = [];

  // Stats
  onlineDrivers = 0;
  offlineDrivers = 0;
  pendingApprovals = 0;

  // File Upload
  selectedFile: File | null = null;
  selectedDocumentType: string = '';
  uploadMessage: string = '';
  uploadError: string = '';

  // Add form properties
  showAddForm: boolean = false;
  driverForm: FormGroup;

  constructor(
    private driverService: DriverService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    // Initialize the simplified driver form
    this.driverForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadDrivers();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    // DON'T set dataSource.paginator for server-side pagination

    // Handle paginator events
    this.paginator.page.subscribe((event) => {
      console.log('Paginator event:', event);
      // Paginator uses 0-based index, API uses 1-based
      this.loadDrivers(event.pageIndex + 1, event.pageSize);
    });
  }

  loadDrivers(page: number = 1, itemsPerPage: number = 10): void {
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;

    const query: DriverQuery = {
      pageNumber: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      retrieveInactive: false,
      sort: this.currentSort,
      filters: {
        status: this.selectedDocumentStatus,
        firstName: this.searchTerm,
      },
    };

    console.log('Loading drivers with query:', query);
    this.isLoading.set(true);

    this.driverService.getDriversByQuery(query).subscribe({
      next: (data: any) => {
        console.log('API Response:', data);

        if (data && data.pagination && Array.isArray(data.driver)) {
          // Store drivers for stats calculation
          this.drivers = data.driver;
          this.dataSource.data = data.driver;

          // Update pagination values from API response
          this.totalItems = data.pagination.totalNumberOfRecords;
          this.totalPages = data.pagination.numberOfPages;

          // Update paginator length only (don't change pageIndex to avoid loop)
          if (this.paginator) {
            this.paginator.length = this.totalItems;
          }

          this.calculateStats();
        } else {
          this.resetPagination();
        }

        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching drivers:', err);
        this.resetPagination();
        this.isLoading.set(false);
      },
    });
  }

  private resetPagination(): void {
    this.drivers = [];
    this.dataSource.data = [];
    this.totalItems = 0;
    this.totalPages = 1;
    this.currentPage = 1;

    if (this.paginator) {
      this.paginator.length = 0;
      this.paginator.pageIndex = 0;
    }
  }

  loadStats() {
    this.driverService.getDriverStats().subscribe({
      next: (res) => {
        this.onlineDrivers = res.stats.onDutyDrivers;
        this.offlineDrivers = res.stats.offDutyDrivers;
        this.pendingApprovals = res.stats.pendingApprovals;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      },
    });
  }

  applyFilters() {
    // Reset to page 1 when filters change
    this.currentPage = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadDrivers(1, this.itemsPerPage);
  }

  announceSortChange(sortState: Sort): void {
    this.currentSort = [];

    if (sortState.direction) {
      const sortOption: SortOption = {
        fieldName: this.mapSortFieldName(sortState.active),
        sortDirection:
          sortState.direction === 'asc' ? 'ASCENDING' : 'DESCENDING',
      };
      this.currentSort.push(sortOption);
      this._liveAnnouncer.announce(`Sorted in ${sortState.direction} order`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }

    // Reset to page 1 when sorting changes
    this.currentPage = 1;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadDrivers(1, this.itemsPerPage);
  }

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

  // File Upload
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
          this.loadDrivers(this.currentPage, this.itemsPerPage);
        },
        error: (err: { message: any }) => {
          this.uploadError = `Upload failed: ${err.message || 'Unknown error'}`;
        },
      });
  }

  // Dialogs
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

  // Driver Actions
  toggleDriverStatus(driver: Driver): void {
    const newStatus: 'online' | 'offline' | 'busy' =
      driver.status === 'online' ? 'offline' : 'online';

    this.driverService.updateAvailability(driver.id, newStatus).subscribe({
      next: (updatedDriver: { id: string; status: string }) => {
        const index = this.drivers.findIndex((d) => d.id === updatedDriver.id);
        if (index !== -1) {
          this.drivers[index].status = updatedDriver.status as
            | 'online'
            | 'offline'
            | 'busy';
          this.dataSource.data = [...this.drivers]; // Trigger change detection
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
        this.loadDrivers(this.currentPage, this.itemsPerPage);
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

  // New methods for inline form
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetDriverForm();
    }
  }

  resetDriverForm(): void {
    this.driverForm.reset();
    this.driverForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      dateOfBirth: '',
      licenseNumber: '',
    });
  }

  onSaveDriver(): void {
    if (this.driverForm.valid) {
      const formData = this.driverForm.value;

      // Format the data according to the API requirements (simplified)
      const driverData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        dateOfBirth: formData.dateOfBirth,
        licenseNumber: formData.licenseNumber,
        // Default values for simplified form
        address: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        licenseExpiryDate: new Date(),
        photoUrl: '',
        tenant: 'default',
        createdBy: 'admin',
        modifiedBy: 'admin',
      };

      console.log('Attempting to register driver with data:', driverData);

      this.driverService.registerDriver(driverData).subscribe({
        next: (response: any) => {
          console.log('New driver registered successfully:', response);
          alert('Driver registered successfully!');

          // Reset form and hide it
          this.resetDriverForm();
          this.showAddForm = false;

          // Reload the drivers list
          this.loadDrivers();
        },
        error: (err: any) => {
          console.error('Error registering driver:', err);
          alert('Error registering driver. Please try again.');
        },
      });
    }
  }

  // Jump to specific page
  jumpToPage(): void {
    if (
      this.pageJumpValue &&
      this.pageJumpValue >= 1 &&
      this.pageJumpValue <= this.totalPages
    ) {
      this.paginator.pageIndex = this.pageJumpValue - 1; // Convert to 0-based index
      this.loadDrivers(this.pageJumpValue, this.itemsPerPage);
      this.pageJumpValue = null; // Clear input after jump
    }
  }
}
