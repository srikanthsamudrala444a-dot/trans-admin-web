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
  selector: 'app-vehicles',
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
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  displayedColumns = ['vehicle', 'plateNumber', 'driver', 'type', 'status', 'documents', 'lastService', 'actions'];
  vehicles: any[] = [];

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {
    // Mock data
    this.vehicles = [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'White',
        plateNumber: 'ABC-1234',
        driverName: 'John Smith',
        type: 'sedan',
        status: 'active',
        documentsStatus: 'approved',
        lastServiceDate: new Date('2023-12-15')
      },
      {
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        color: 'Silver',
        plateNumber: 'XYZ-5678',
        driverName: null,
        type: 'suv',
        status: 'inactive',
        documentsStatus: 'pending',
        lastServiceDate: new Date('2023-11-20')
      },
      {
        make: 'Hyundai',
        model: 'Elantra',
        year: 2020,
        color: 'Blue',
        plateNumber: 'DEF-9012',
        driverName: 'Mike Wilson',
        type: 'sedan',
        status: 'maintenance',
        documentsStatus: 'approved',
        lastServiceDate: new Date('2023-10-05')
      }
    ];
  }
}