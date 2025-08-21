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
    MatFormFieldModule
  ],
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengersComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'totalRides', 'rating', 'status', 'joinDate', 'actions'];
  passengers: any[] = [];

  ngOnInit(): void {
    this.loadPassengers();
  }

  private loadPassengers(): void {
    // Mock data
    this.passengers = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1234567890',
        totalRides: 45,
        rating: 4.7,
        isBanned: false,
        createdAt: new Date('2023-01-15')
      },
      {
        name: 'Bob Brown',
        email: 'bob.brown@email.com',
        phone: '+1234567891',
        totalRides: 23,
        rating: 4.5,
        isBanned: false,
        createdAt: new Date('2023-03-22')
      },
      {
        name: 'Carol White',
        email: 'carol.white@email.com',
        phone: '+1234567892',
        totalRides: 12,
        rating: 3.2,
        isBanned: true,
        createdAt: new Date('2023-06-10')
      }
    ];
  }
}