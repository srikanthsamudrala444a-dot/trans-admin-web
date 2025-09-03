import { Component } from '@angular/core';
import { DriverService } from '../../core/services/driver.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-documents',
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './driver-documents.component.html',
  styleUrls: ['./driver-documents.component.scss'],
  providers: [DriverService]
})

export class DriverDocumentsComponent { 
  selectedFile: File | null = null;
  docType: string = '';
  documents: any[] = [];
  driverId: any;
  loading: boolean | undefined;
  errorMessage: string | undefined;

  constructor(private driverService: DriverService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadDocument() {
    if (!this.selectedFile) {
      alert('Please select a file!');
      return;
    }

    this.driverService.uploadDriverDocument('12345', this.docType, this.selectedFile)
      .subscribe({
        next: (res) => {
          console.log('Document uploaded:', res);
          alert('Document uploaded successfully!');
        },
        error: (err) => console.error('Error uploading document:', err)
      });
  }

  fetchDocuments() {
    this.driverService.getDriverDocuments('12345')
      .subscribe({
        next: (res) => {
          console.log('Driver documents:', res);
          this.documents = res;
        },
        error: (err) => console.error('Error fetching documents:', err)
      });
  }

  getDocuments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.driverService.getDriverDocuments(this.driverId).subscribe({
      next: (res) => {
        this.documents = res;   // assuming API returns an array of docs
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.errorMessage = 'Failed to load documents. Try again.';
        this.loading = false;
      }
    });
  }
}

