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
import { PassengersService } from '../../core/services/passengers.service';
//import { selctedPassenger } from '../../core/models/passenger.model';
import { RouterModule } from '@angular/router';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
    RouterModule,
    FormsModule
  ],
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'totalRides', 'rating', 'status', 'joinDate', 'actions'];
  passenger: any[] = [];
  loading = false;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10

  selectPassenger: any = null;
  error: string | null = null;

  constructor(private passengersService: PassengersService) {}
  ngOnInit(): void {
    this.loadPassengers();
    this.getAllPassengers();
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
        
        this.passenger = res.passenger || res.data ||res;
        this.loading = false;
        this.totalItems = this.passenger.length;
        this.totalPages = Math.ceil(this.totalItems / 10);
        console.log(this.passenger);
      },
      error: (err) => {
        this.error = 'Failed to load passengers';
        console.error(err);
        this.loading = false;
      }
    });
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
  // Pagination for passengers
  loadPassengers(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;
    const filters: any = {
      pageNumber: page,
      itemsPerPage: this.itemsPerPage
    };
    this.passengersService.queryPassengers(filters).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.passenger)) {
          this.passenger = res.passenger;
          this.totalItems = res.totalCount || res.passenger.length;
          this.totalPages = Math.ceil((res.totalCount || res.passenger.length) / this.itemsPerPage);
        } else if (Array.isArray(res)) {
          this.passenger = res;
          this.totalItems = res.length;
          this.totalPages = Math.ceil(res.length / this.itemsPerPage);
        } else {
          this.passenger = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching passengers:', err);
        this.passenger = [];
        this.totalItems = 0;
        this.totalPages = 1;
        this.loading = false;
      }
    });
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.loadPassengers(page);
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
}
