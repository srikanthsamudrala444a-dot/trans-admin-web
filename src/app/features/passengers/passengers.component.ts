import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { 
  MatPaginator, 
  MatPaginatorModule, 
  MatPaginatorIntl 
} from '@angular/material/paginator';
import { PassengersService } from '../../core/services/passengers.service';
//import { selctedPassenger } from '../../core/models/passenger.model';
import { RouterModule } from '@angular/router';
import { NgModel, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPassengerDialogComponent } from './add-passenger-dialog.component';

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
  selector: 'app-passengers',
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
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns = ['id', 'name', 'contactNumber', 'totalRides', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  passengers: any[] = [];
  loading = false;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  selectPassenger: any = null;
  error: string | null = null;

  // Add form properties
  showAddForm: boolean = false;
  passengerForm: FormGroup;

  gotoPage: number = 1;
  pageJumpValue: number | null = null;

  // Search and filter properties
  searchQuery: string = '';
  statusFilter: string = 'all';
  searchForm: FormGroup;
  
  constructor(
    private passengersService: PassengersService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    // Initialize the form with simplified fields
    this.passengerForm = this.fb.group({
      name: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userId: ['', [Validators.required]]
    });

    // Initialize search form
    this.searchForm = this.fb.group({
      search: [''],
      status: ['all']
    });
  }

  ngOnInit(): void {
    this.getAllPassengers();
  }

  ngAfterViewInit(): void {
    // Handle paginator events for server-side pagination
    this.paginator.page.subscribe((event) => {
      console.log('Paginator event:', event);
      // Update pagination properties
      this.currentPage = event.pageIndex + 1; // Paginator uses 0-based index, convert to 1-based
      this.itemsPerPage = event.pageSize;
      this.loadPassengers(this.currentPage, this.itemsPerPage);
    });
  }
  
  /*private loadPassengers(): void {
    this.passengersService.getAllPassengers().subscribe({
      next: (data: any) => {
        this.passengers = data.passengers || data;
        console.log('Passengers loaded:', this.passengers);
      },
      error: (err: any) => {
        console.error('Failed to load passengers:', err);
      }
    });
  }*/
 // Get all passengers
  getAllPassengers(): void {
    this.loading = true;
    this.passengersService.getAllPassengers().subscribe({
      next: (res) => {
        console.log('Passengers API response:', res);
        if (res && Array.isArray(res.passenger)) {
          this.passengers = res.passenger;
        } else if (Array.isArray(res.data)) {
          this.passengers = res.data;
        } else if (Array.isArray(res)) {
          this.passengers = res;
        } else {
          this.passengers = [];
        }
        
        // Apply initial pagination (first page)
        this.totalItems = this.passengers.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        const startIndex = 0;
        const endIndex = this.itemsPerPage;
        const paginatedData = this.passengers.slice(startIndex, endIndex);
        
        this.dataSource.data = paginatedData;
        this.loading = false;
        
        // Update paginator
        if (this.paginator) {
          this.paginator.length = this.totalItems;
        }
        
        console.log('Passengers loaded:', this.passengers);
      },
      error: (err) => {
        console.error('Failed to load passengers:', err);
        this.error = 'Failed to load passengers';
        console.error('Error loading passengers:', err);
        this.loading = false;
        this.passengers = [];
        this.dataSource.data = [];
      }
    });
  }

  // Search passengers using query API
  searchPassengers(): void {
    const searchValue = this.searchForm.get('search')?.value?.trim();
    const statusValue = this.searchForm.get('status')?.value;
    
    // If no search query and no status filter, get all passengers
    if ((!searchValue || searchValue === '') && statusValue === 'all') {
      this.getAllPassengers();
      return;
    }

    this.loading = true;
    
    // Determine search type and build appropriate queries
    this.performSmartSearch(searchValue, statusValue);
  }

  // Perform smart search across multiple fields
  performSmartSearch(searchValue: string, statusValue: string): void {
    const baseQuery = {
      pageNumber: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      retrieveInactive: statusValue === 'banned' || statusValue === 'all',
      sort: [
        {
          fieldName: "firstName",
          sortDirection: "ASCENDING"
        }
      ]
    };

    let searchQueries: any[] = [];

    if (searchValue && searchValue !== '') {
      // Check if search value is a number (for contact number search)
      const numericSearch = parseFloat(searchValue);
      
      if (!isNaN(numericSearch) && searchValue.length >= 7) {
        // If it's a number with reasonable length, search by contact number
        searchQueries.push({
          ...baseQuery,
          filters: { contactNumber: numericSearch }
        });
      } else if (searchValue.includes('@')) {
        // If it looks like an email
        searchQueries.push({
          ...baseQuery,
          filters: { email: searchValue }
        });
      } else {
        // Search by name - try both firstName and lastName
        searchQueries.push({
          ...baseQuery,
          filters: { firstName: searchValue }
        });
        searchQueries.push({
          ...baseQuery,
          filters: { lastName: searchValue }
        });
      }
    } else {
      // No search value but has status filter
      searchQueries.push({
        ...baseQuery,
        filters: {}
      });
    }

    // Execute search queries sequentially and combine results
    this.executeSearchQueries(searchQueries);
  }

  // Execute multiple search queries and combine results
  executeSearchQueries(queries: any[]): void {
    if (queries.length === 0) {
      this.loading = false;
      this.passengers = [];
      this.dataSource.data = [];
      this.totalItems = 0;
      return;
    }

    const results: any[] = [];
    let completedQueries = 0;
    let hasError = false;

    queries.forEach((query, index) => {
      console.log(`Executing search query ${index + 1}:`, query);
      
      this.passengersService.queryPassengers(query).subscribe({
        next: (res) => {
          completedQueries++;
          
          console.log(`Search API response ${index + 1}:`, res);
          
          // Handle different response formats and extract passengers
          let passengers: any[] = [];
          if (res && Array.isArray(res.passengers)) {
            passengers = res.passengers;
          } else if (res && Array.isArray(res.data)) {
            passengers = res.data;
          } else if (Array.isArray(res)) {
            passengers = res;
          }

          // Add to results if we got data
          if (passengers.length > 0) {
            results.push(...passengers);
          }

          // Check if all queries completed
          if (completedQueries === queries.length) {
            this.processSearchResults(results);
          }
        },
        error: (err) => {
          completedQueries++;
          hasError = true;
          console.error(`Search query ${index + 1} failed:`, err);

          // Check if all queries completed
          if (completedQueries === queries.length) {
            if (results.length === 0 && hasError) {
              this.error = 'Failed to search passengers';
              this.loading = false;
              this.passengers = [];
              this.dataSource.data = [];
              this.totalItems = 0;
            } else {
              this.processSearchResults(results);
            }
          }
        }
      });
    });
  }

  // Process and deduplicate search results
  processSearchResults(results: any[]): void {
    // Remove duplicates based on ID
    const uniqueResults = results.filter((passenger, index, arr) => 
      arr.findIndex(p => 
        (p.id && p.id === passenger.id) || 
        (p.passengerId && p.passengerId === passenger.passengerId) ||
        (p.userId && p.userId === passenger.userId)
      ) === index
    );

    this.passengers = uniqueResults;
    this.totalItems = uniqueResults.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Apply client-side pagination to combined results
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = this.passengers.slice(startIndex, endIndex);
    
    this.dataSource.data = paginatedData;
    this.loading = false;
    
    // Update paginator
    if (this.paginator) {
      this.paginator.length = this.totalItems;
    }
    
    console.log('Final search results:', this.passengers);
  }

  // Handle search input changes with debouncing
  private searchTimeout: any;
  
  onSearchChange(): void {
    // Clear existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Set new timeout for debouncing (300ms delay)
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1; // Reset to first page on new search
      this.searchPassengers();
    }, 300);
  }

  // Handle status filter changes
  onStatusChange(): void {
    this.currentPage = 1; // Reset to first page on filter change
    this.searchPassengers();
  }

  // Clear search and filters
  clearSearch(): void {
    this.searchForm.patchValue({
      search: '',
      status: 'all'
    });
    this.currentPage = 1;
    this.getAllPassengers();
  }

   // Get passenger by ID
  getPassenger(id: string): void {
    this.passengersService.getPassengerById(id).subscribe({
      next: (res) => {
        this.selectPassenger = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
   // Register passenger
  registerPassenger(data: any): void {
    this.passengersService.registerPassenger(data).subscribe({
      next: (res) => {
        console.log('Passenger registered:', res);
        this.getAllPassengers(); // refresh list
      },
      error: (err) => console.error(err)
    });
  }
  // Update passenger
  updatePassenger(id: string, data: any): void {
    this.passengersService.updatePassenger(id, data).subscribe({
      next: (res) => {
        console.log('Passenger updated:', res);
        this.getAllPassengers();
      },
      error: (err) => console.error(err)
    });
  }
  // Delete passenger
  deletePassenger(id: string): void {
    this.passengersService.deletePassenger(id).subscribe({
      next: () => {
        console.log('Passenger deleted');
        this.getAllPassengers();
      },
      error: (err) => console.error(err)
    });
  }
  // Unified method for loading passengers (with or without search)
  loadPassengers(page: number = 1, itemsPerPage: number = this.itemsPerPage): void {
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    
    // Check if there's an active search
    const searchValue = this.searchForm.get('search')?.value?.trim();
    
    if (searchValue && searchValue !== '') {
      // Use search method if there's a search query
      this.searchPassengers();
    } else {
      // Use regular getAllPassengers method
      this.getAllPassengers();
    }
  }

  // Pagination for passengers (legacy method - keeping for compatibility)
  loadPassengersLegacy(page: number = 1, itemsPerPage: number = this.itemsPerPage): void {
    this.loading = true;
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    
    this.passengersService.getAllPassengers().subscribe({
      next: (res: any) => {
        console.log('Passengers response:', res);
        if (res && Array.isArray(res.passenger)) {
          this.passengers = res.passenger;
        } else if (Array.isArray(res.data)) {
          this.passengers = res.data;
        } else if (Array.isArray(res)) {
          this.passengers = res;
        } else {
          this.passengers = [];
        }
        
        // Apply client-side pagination
        this.totalItems = this.passengers.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // Get the current page data
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = this.passengers.slice(startIndex, endIndex);
        
        this.dataSource.data = paginatedData;
        
        // Update paginator length
        if (this.paginator) {
          this.paginator.length = this.totalItems;
        }
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching passengers:', err);
        this.passengers = [];
        this.dataSource.data = [];
        this.totalItems = 0;
        this.totalPages = 1;
        this.loading = false;
      }
    });
  }

  goToPage = (page: number | string): void => {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.loadPassengers(this.currentPage, this.itemsPerPage);
    }
  }
  
  goToSpecificPage(): void {
    if (this.gotoPage >= 1 && this.gotoPage <= this.totalPages) {
      this.goToPage(this.gotoPage);
    }
  }

  jumpToPage(): void {
    if (
      this.pageJumpValue &&
      this.pageJumpValue >= 1 &&
      this.pageJumpValue <= this.totalPages
    ) {
      this.paginator.pageIndex = this.pageJumpValue - 1; // Convert to 0-based index
      this.loadPassengers(this.pageJumpValue, this.itemsPerPage);
      this.pageJumpValue = null; // Clear input after jump
    }
  }

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

  getStatusClass(passenger: any): string {
    if (passenger.isBanned || passenger.status === 'banned' || passenger.status === 'blocked') {
      return 'status-banned';
    } else if (passenger.status === 'active' || passenger.isActive || !passenger.isBanned) {
      return 'status-active';
    } else {
      return 'status-inactive';
    }
  }

  getStatusText(passenger: any): string {
    if (passenger.isBanned || passenger.status === 'banned' || passenger.status === 'blocked') {
      return 'Banned';
    } else if (passenger.status === 'active' || passenger.isActive || !passenger.isBanned) {
      return 'Active';
    } else {
      return passenger.status ? passenger.status.charAt(0).toUpperCase() + passenger.status.slice(1) : 'Unknown';
    }
  }

  openAddPassengerDialog(): void {
    const dialogRef = this.dialog.open(AddPassengerDialogComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addNewPassenger(result);
      }
    });
  }

  addNewPassenger(newPassengerData: any): void {
    console.log('Attempting to register passenger with data:', newPassengerData);

    this.passengersService.registerPassenger(newPassengerData).subscribe({
      next: (response: any) => {
        console.log('New passenger registered successfully:', response);
        // Show success message
        alert('Passenger registered successfully!');

        // Reload the passengers list to show the new passenger
        this.loadPassengers();
        this.getAllPassengers();
      },
      error: (err: any) => {
        console.error('Error registering passenger:', err);
        console.error('Full error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message,
          url: err.url,
        });

        // Show error message to user
        alert('Error registering passenger. Please try again.');
      }
    });
  }

  // New methods for inline form
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.passengerForm.reset();
    this.passengerForm.patchValue({
      name: '',
      contactNumber: '',
      email: '',
      userId: ''
    });
  }

  onSavePassenger(): void {
    if (this.passengerForm.valid) {
      const formData = this.passengerForm.value;
      
      // Format the data according to the API requirements (simplified)
      const passengerData = {
        name: formData.name,
        contactNumber: parseInt(formData.contactNumber),
        email: formData.email,
        userId: formData.userId,
        photoUrl: "",
        isDeleted: false,
        deleteReason: "",
        deletedAt: null,
        tenant: "default", // Default values for simplified form
        createdBy: "admin",
        modifiedBy: "admin"
      };
      
      console.log('Attempting to register passenger with data:', passengerData);

      this.passengersService.registerPassenger(passengerData).subscribe({
        next: (response: any) => {
          console.log('New passenger registered successfully:', response);
          alert('Passenger registered successfully!');
          
          // Reset form and hide it
          this.resetForm();
          this.showAddForm = false;
          
          // Reload the passengers list
          this.loadPassengers();
          this.getAllPassengers();
        },
        error: (err: any) => {
          console.error('Error registering passenger:', err);
          alert('Error registering passenger. Please try again.');
        }
      });
    }
  }

  onPageSizeChange(newPageSize: number): void {
    this.itemsPerPage = newPageSize;
    this.currentPage = 1; // Reset to first page when changing page size
    this.loadPassengers(this.currentPage, this.itemsPerPage);
  }
}
