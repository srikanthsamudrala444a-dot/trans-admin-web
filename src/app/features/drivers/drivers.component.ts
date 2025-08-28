import { NgModule } from '@angular/core';
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
import { MatBadgeModule } from '@angular/material/badge';
import { Driver } from '../../core/models/ride.model';
import { DriverService } from '../../core/services/driver.service';
import { FormsModule } from '@angular/forms';


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
    FormsModule,
  ],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'status', 'rating', 'documents', 'earnings', 'actions'];
  drivers: any[] = [];
  
  onlineDrivers = 0;
  offlineDrivers = 0;
  pendingApprovals = 0;

  constructor(private driverService: DriverService) {}

  selectedFile: File | null = null;
  selectedDocumentType: string = '';
  uploadMessage: string = '';
  uploadError: string = '';

  ngOnInit(): void {
    this.loadDrivers();
  }
  
  private loadDrivers(): void {
     this.driverService.getAllDrivers().subscribe({
      next: (res: Driver[]) => {
        console.log('All drivers:', res);
        this.drivers = res;
      },
      error: (err: any) => console.error('Error fetching drivers:', err)
    });
  }

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
    this.driverService.uploadDriverDocument(driverId, this.selectedDocumentType, this.selectedFile).subscribe({
      next: (response: any) => {
        this.uploadMessage = 'Document uploaded successfully!';
        this.loadDrivers(); // Optionally refresh the driver list or document list
      },
      error: (err: { message: any; }) => {
        this.uploadError = `Upload failed: ${err.message || 'Unknown error'}`;
      }
    });
  }

  getDriverDocuments(driverId: string): void {
    this.driverService.getDocumentList(driverId).subscribe({
      next: (documents: any) => {
        console.log('Documents for driver:', documents);
        // Handle displaying documents in the UI
      },
      error: (err: any) => {
        console.error('Error fetching documents:', err);
      }
    });
  }

  toggleDriverStatus(driver: Driver): void {
    let newStatus: 'online' | 'offline' | 'busy';
    if (driver.status === 'online') {
      newStatus = 'offline';
    } else {
      newStatus = 'online';
    }
    this.driverService.updateAvailability(driver.id, newStatus).subscribe({
      next: (updatedDriver: { id: string; status: string; }) => {
        console.log('Driver status updated:', updatedDriver);
        const index = this.drivers.findIndex(d => d.id === updatedDriver.id);
        if (index !== -1) {
          this.drivers[index].status = updatedDriver.status as 'online' | 'offline' | 'busy';
          this.calculateStats(); 
        }
      },
      error: (err: any) => {
        console.error('Error updating driver status:', err);
      }
    });
  }
  addNewDriver(newDriverData: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.driverService.registerDriver(newDriverData).subscribe({
      next: (createdDriver: Driver) => {
        console.log('New driver registered:', createdDriver);
        this.drivers.push(createdDriver); 
        this.calculateStats();
      },
      error: (err: any) => {
        console.error('Error registering driver:', err);
      }
    });
  }

    private calculateStats(): void {
    this.onlineDrivers = this.drivers.filter(d => d.status === 'online').length;
    this.offlineDrivers = this.drivers.filter(d => d.status === 'offline').length;
    this.pendingApprovals = this.drivers.filter(d => d.documentsStatus === 'pending').length;
  }
}