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
    MatFormFieldModule
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
    this.loadRidesByQuery("", this.currentPage);
  }

  private loadRides(): void {
    this.rideService.getAllRides().subscribe(
      (data) => {
        this.rides = data.rides;
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


