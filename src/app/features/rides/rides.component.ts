import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { 
  MatPaginator, 
  MatPaginatorModule, 
  MatPaginatorIntl 
} from '@angular/material/paginator';
import { RideService } from '../../core/services/rides.service';
import { Ride } from '../../core/models/ride.model';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ManualAssignmentDialogComponent } from './manual-assignment-dialog.component';

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
  selector: 'app-rides',
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
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.scss']
})
export class RidesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns = ['id', 'driver', 'passenger', 'pickup', 'status', 'fare'];
  rides: Ride[] = [];
  currentPage: number = 1;
  totalPages: number = 5;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private rideService: RideService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loadRides(this.currentPage, this.itemsPerPage);
  }

  ngAfterViewInit(): void {
    // Handle paginator events for client-side pagination
    this.paginator.page.subscribe((event) => {
      console.log('Paginator event:', event);
      // Update pagination properties
      this.currentPage = event.pageIndex + 1; // Paginator uses 0-based index, convert to 1-based
      this.itemsPerPage = event.pageSize;
      this.loadRides(this.currentPage, this.itemsPerPage);
    });
  }

// ... other properties and methods

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

  goToPage = (page: number | string): void => {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.loadRides(this.currentPage, this.itemsPerPage);
    }
  }
  
  gotoPage: number = 1;
  pageJumpValue: number | null = null;
  get canGoToPage(): boolean {
    return this.currentPage > 1 && this.currentPage <= this.totalPages;
  }
  ride: Ride | null = null;

  openRideDetails: { [rideId: string]: boolean } = {};

  private loadRides(page: number = 1, itemsPerPage: number = this.itemsPerPage): void {
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
    
    this.rideService.getAllRides().subscribe(
      (data) => {
        console.log('Rides API response:', data);
        let allRides: Ride[] = [];
        
        // Handle different response structures
        if (data && Array.isArray(data.rides)) {
          allRides = data.rides;
        } else if (Array.isArray(data.data)) {
          allRides = data.data;
        } else if (Array.isArray(data)) {
          allRides = data;
        } else {
          allRides = [];
        }
        
        // Apply client-side pagination
        this.totalItems = allRides.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // Get current page data
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        this.rides = allRides.slice(startIndex, endIndex);
        
        // Update paginator
        if (this.paginator) {
          this.paginator.length = this.totalItems;
        }
        
        console.log('Rides loaded:', this.rides);
      },
      (error) => {
        console.error('Error fetching rides:', error);
        this.rides = [];
      }
    );
  }
  public loadRidesBySearch(searchTerm: string): void {
    this.rideService.getRideById(searchTerm).subscribe(
      (data) => {
        this.rides = [data.ride];
      },
      (error) => {
        console.error('Error fetching rides:', error);
      }
    );
  }
  /*public loadRidesByQuery(searchTerm: string, currentPage: number): void {
  this.currentPage = currentPage;
  this.rideService.getRidesByQuery({
    pageNumber: currentPage,
    itemsPerPage: 10,
    retrieveInactive: false
  }).subscribe(
    (data) => {
      console.log("Rides API response:", data);  // 👀 log full response
      // adapt here after seeing actual API structure
      this.rides = data.rides || data;  
      this.totalItems = data.totalItems || this.rides.length;
      this.totalPages = data.totalPages || Math.ceil(this.totalItems / 10);
    },
    (error) => {
      console.error('Error fetching rides:', error);
    }
  );
}*/

  // Removed loadRidesByQuery - now using only getAllRides() via loadRides()
  /*
  public loadRidesByQuery(searchTerm: string, currentPage: number, itemsPerPage: number = this.itemsPerPage): void {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.rideService.getRidesByQuery({
      "pageNumber": currentPage,
      "itemsPerPage": itemsPerPage,
      "retrieveInactive": false,
      "sort": [
        {
          "fieldName": "string",
          "sortDirection": "ASCENDING"
        }
      ],
      "filters": {
        "city": "string",
        "state": "string",
        "postalCode": "string"
      }
    }).subscribe(
      (data) => {
        this.rides = data.rides;
        this.totalItems = data.pagination?.totalNumberOfRecords || data.totalCount || this.rides.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        
        // Update paginator length
        if (this.paginator) {
          this.paginator.length = this.totalItems;
        }
      },
      (error) => {
        console.error('Error fetching rides:', error);
      }
    );
  }
  */

  selectedRide: Ride | null = null;

  showRideDetails(ride: Ride): void {
    this.selectedRide = this.selectedRide === ride ? null : ride;
  }
  openManualAssignmentDialog(): void {
    const dialogRef = this.dialog.open(ManualAssignmentDialogComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Manual ride assignment data:', result);
        this.rideService.createRide(result).subscribe({
          next: (response: any) => {
            console.log('Ride created successfully:', response);
            alert('Ride assigned successfully!');
            this.loadRides(this.currentPage, this.itemsPerPage); // Refresh the rides list
          },
          error: (err: any) => {
            console.error('Error creating ride:', err);
            
            // Show detailed error message
            let errorMessage = 'Failed to create ride.';
            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error && typeof err.error === 'string') {
              errorMessage = err.error;
            } else if (err.message) {
              errorMessage = err.message;
            }
            
            alert(`Ride creation failed: ${errorMessage}`);
          }
        });
      }
    });
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
      this.loadRides(this.pageJumpValue, this.itemsPerPage);
      this.pageJumpValue = null; // Clear input after jump
    }
  }
  onPageSizeChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Reset to first page when changing page size
    this.loadRides(this.currentPage, this.itemsPerPage);
  }
  
}


