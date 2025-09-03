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

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRides();
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
}