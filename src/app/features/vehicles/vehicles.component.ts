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
import { VehicleService } from '../../core/services/vehicles.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AddVehicleDialogComponent } from './add-vehicle-dialog.component';

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
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatPaginatorModule,
    RouterModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
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

  // Add form properties
  showAddForm: boolean = false;
  vehicleForm: FormGroup;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    // Initialize the simplified vehicle form
    this.vehicleForm = this.fb.group({
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      yearOfManufacture: ['', [Validators.required]],
      type: ['', [Validators.required]],
      color: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngAfterViewInit(): void {
    // Handle paginator events for server-side pagination
    this.paginator.page.subscribe((event) => {
      console.log('Paginator event:', event);
      // Update pagination properties
      this.currentPage = event.pageIndex + 1; // Paginator uses 0-based index, convert to 1-based
      this.itemsPerPage = event.pageSize;
      this.loadVehicles(this.currentPage, this.itemsPerPage);
    });
  }

  //loadVehicles(): void {
   // this.loading = true;
    //const filters: any = {};

 loadVehicles(page: number = 1, itemsPerPage: number = this.itemsPerPage): void {
    this.loading = true;
    
    this.currentPage = page;
    this.itemsPerPage = itemsPerPage;
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
        if (res && Array.isArray(res.vehicle)) {
          this.vehicles = res.vehicle;
          this.totalItems = res.totalCount || res.vehicle.length;
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
        
        // Update paginator length
        if (this.paginator) {
          this.paginator.length = this.totalItems;
        }
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching vehicles:', err);
        this.vehicles = [];
        this.loading = false;
      }
    });
 }
 
  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.loadVehicles(page);
     }
  }
  
  openAddVehicleDialog(): void {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Vehicle data from dialog:', result);
        this.vehicleService.registerVehicle(result).subscribe({
          next: (response: any) => {
            console.log('Vehicle registered successfully:', response);
            alert('Vehicle registered successfully!');
            this.loadVehicles(); // Refresh the vehicles list
          },
          error: (err: any) => {
            console.error('Error registering vehicle:', err);
            
            // Show detailed error message
            let errorMessage = 'Failed to register vehicle.';
            if (err.error && err.error.messages && err.error.messages.length > 0) {
              const message = err.error.messages[0];
              if (message.key === 'Driver Id Not Exists') {
                const driverIdParam = message.parameters[0];
                if (driverIdParam === null || driverIdParam === 'null') {
                  errorMessage = `Driver ID cannot be null. Please ensure the driver ID field is properly filled.`;
                } else {
                  errorMessage = `Driver ID "${driverIdParam}" does not exist. Please enter a valid driver ID.`;
                }
              } else {
                errorMessage = message.key;
              }
            } else if (err.error && err.error.message) {
              errorMessage = err.error.message;
            }
            
            alert(`Registration failed: ${errorMessage}`);
          }
        });
      }
    });
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

  // New methods for inline form
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetVehicleForm();
    }
  }

  resetVehicleForm(): void {
    this.vehicleForm.reset();
    this.vehicleForm.patchValue({
      make: '',
      model: '',
      registrationNumber: '',
      yearOfManufacture: '',
      type: '',
      color: ''
    });
  }

  onSaveVehicle(): void {
    if (this.vehicleForm.valid) {
      const formData = this.vehicleForm.value;
      
      // Format the data according to the API requirements (simplified)
      const vehicleData = {
        make: formData.make,
        model: formData.model,
        registrationNumber: formData.registrationNumber,
        yearOfManufacture: parseInt(formData.yearOfManufacture),
        type: formData.type,
        color: formData.color,
        // Default values for simplified form
        fuelType: 'PETROL',
        passengerCapacity: 4,
        category: 'CAR',
        driverId: null, // Can be assigned later
        insurancePolicyNumber: '',
        insuranceExpiryDate: new Date(),
        tenant: 'default',
        createdBy: 'admin',
        modifiedBy: 'admin'
      };
      
      console.log('Attempting to add vehicle with data:', vehicleData);

      this.vehicleService.registerVehicle(vehicleData).subscribe({
        next: (response: any) => {
          console.log('New vehicle added successfully:', response);
          alert('Vehicle added successfully!');
          
          // Reset form and hide it
          this.resetVehicleForm();
          this.showAddForm = false;
          
          // Reload the vehicles list
          this.loadVehicles();
        },
        error: (err: any) => {
          console.error('Error adding vehicle:', err);
          alert('Error adding vehicle. Please try again.');
        }
      });
    }
  }

}

