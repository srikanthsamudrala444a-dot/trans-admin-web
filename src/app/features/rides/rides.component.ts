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
import { RideService } from '../../core/services/rides.service';
import { Ride } from '../../core/models/ride.model';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.scss']
})
export class RidesComponent implements OnInit {
  displayedColumns = ['id', 'driver', 'passenger', 'pickup', 'status', 'fare', 'actions'];
  rides: Ride[] = [];
  currentPage: number = 1;
  constructor(private rideService: RideService) {}
  totalPages: number = 5;
  ngOnInit(): void {
    
    this.loadRides();
    this.loadRidesByQuery("", this.currentPage);

  }
  
totalItems: number = 0;

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
      this.loadRidesByQuery("", this.currentPage);
    }
  }
  
  gotoPage: number = 1;
  get canGoToPage(): boolean {
    return this.currentPage > 1 && this.currentPage <= this.totalPages;
  }
  ride: Ride | null = null;

  openRideDetails: { [rideId: string]: boolean } = {};









  private loadRides(): void {
    this.rideService.getAllRides().subscribe(
      (data) => {
        //this.rides = data.rides;
        this.totalItems = data.rides.length;
        this.totalPages = Math.ceil(this.totalItems / 10);
        console.log(data);
      },
      (error) => {
        console.error('Error fetching rides:', error);
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

  public loadRidesByQuery(searchTerm: string, currentPage: number): void {
    this.currentPage = currentPage;
    this.rideService.getRidesByQuery({
      "pageNumber": currentPage,
      "itemsPerPage": 10,
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
      },
      (error) => {
        console.error('Error fetching rides:', error);
      }
    );
  }

  selectedRide: Ride | null = null;

  showRideDetails(ride: Ride): void {
    this.selectedRide = this.selectedRide === ride ? null : ride;
  }
  
}


