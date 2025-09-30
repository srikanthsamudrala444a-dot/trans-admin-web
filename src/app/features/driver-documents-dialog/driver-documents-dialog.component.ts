import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../core/services/driver.service';
import { DocumentRejectDialogComponent } from '../document-reject-dialog/document-reject-dialog.component';

export interface DriverDocumentsDialogData {
  driverId: string;
  driverName: string;
}

@Component({
  selector: 'app-driver-documents-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: './driver-documents-dialog.component.html',
  styleUrl: './driver-documents-dialog.component.scss',
})
export class DriverDocumentsDialogComponent implements OnInit {
  documents: any[] = [];
  loading = false;
  error: string | null = null;
  processingDocumentId: string | null = null;
  showDebug = true; // Set to false to hide debug info

  constructor(
    public dialogRef: MatDialogRef<DriverDocumentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DriverDocumentsDialogData,
    private driverService: DriverService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDriverDocuments();
  }

  loadDriverDocuments(): void {
    this.loading = true;
    this.error = null;

    console.log('Loading documents for driver ID:', this.data.driverId);
    console.log('Driver name:', this.data.driverName);

    this.driverService
      .getDocuementVerificationList(this.data.driverId)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          console.log('=== DOCUMENT RESPONSE DEBUG ===');
          console.log('Raw response:', response);
          console.log('Response type:', typeof response);
          console.log('Is array:', Array.isArray(response));
          console.log(
            'Response keys:',
            response ? Object.keys(response) : 'No keys'
          );

          // Try to extract documents from various possible response structures
          let extractedDocuments: any[] = [];

          if (response) {
            // Try different possible nested structures
            if (response.documents && Array.isArray(response.documents)) {
              extractedDocuments = response.documents;
              console.log('✅ Found documents in response.documents');
            } else if (response.data && Array.isArray(response.data)) {
              extractedDocuments = response.data;
              console.log('✅ Found documents in response.data');
            } else if (
              response.data &&
              response.data.documents &&
              Array.isArray(response.data.documents)
            ) {
              extractedDocuments = response.data.documents;
              console.log('✅ Found documents in response.data.documents');
            } else if (response.result && Array.isArray(response.result)) {
              extractedDocuments = response.result;
              console.log('✅ Found documents in response.result');
            } else if (response.items && Array.isArray(response.items)) {
              extractedDocuments = response.items;
              console.log('✅ Found documents in response.items');
            } else if (Array.isArray(response)) {
              extractedDocuments = response;
              console.log('✅ Response is directly an array');
            } else {
              // If response is an object but not an array, try to find any array property
              console.log('🔍 Searching for arrays in response object...');
              for (const [key, value] of Object.entries(response)) {
                console.log(
                  `Checking ${key}:`,
                  Array.isArray(value),
                  typeof value
                );
                if (Array.isArray(value)) {
                  extractedDocuments = value;
                  console.log(`✅ Found documents array in response.${key}`);
                  break;
                }
              }
            }
          }

          this.documents = extractedDocuments;
          console.log('Final documents array:', this.documents);
          console.log('Documents count:', this.documents.length);

          // Log first document structure for debugging
          if (this.documents.length > 0) {
            console.log('First document structure:', this.documents[0]);
            console.log('First document keys:', Object.keys(this.documents[0]));
          } else {
            console.log('❌ No documents found in response');

            // Create test documents for debugging UI
            console.log('🧪 Creating test documents for UI testing...');
            this.documents = [
              {
                id: 'test-1',
                documentType: 'Driver License',
                status: 'approved',
                documentNumber: 'DL123456',
                uploadDate: new Date().toISOString(),
                documentUrl: '#',
              },
              {
                id: 'test-2',
                documentType: 'Aadhaar Card',
                status: 'pending',
                documentNumber: 'AADHAAR789',
                uploadDate: new Date().toISOString(),
                documentUrl: '#',
              },
            ];
            console.log('Test documents created:', this.documents);
          }

          console.log('=== END DOCUMENT DEBUG ===');
        },
        error: (error: any) => {
          this.loading = false;
          this.error = 'Failed to load driver documents. Please try again.';
          console.error('Error loading driver documents:', error);
          console.error('Error details:', error.status, error.message);
        },
      });
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    return `status-${status.toLowerCase()}`;
  }

  viewDocument(documentUrl: string): void {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }

  approveDocument(document: any): void {
    const documentId = document.id || document._id || document.documentId;
    if (!documentId) {
      this.snackBar.open('Document ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.processingDocumentId = documentId;

    this.driverService
      .approveDocument(this.data.driverId, documentId)
      .subscribe({
        next: (response: any) => {
          this.processingDocumentId = null;
          this.snackBar.open('Document approved successfully', 'Close', {
            duration: 3000,
          });

          // Update the document status in the local array
          const docIndex = this.documents.findIndex(
            (doc) => (doc.id || doc._id || doc.documentId) === documentId
          );
          if (docIndex !== -1) {
            this.documents[docIndex].status = 'approved';
            this.documents[docIndex].statusDate = new Date().toISOString();
          }
        },
        error: (error: any) => {
          this.processingDocumentId = null;
          console.error('Error approving document:', error);
          this.snackBar.open('Failed to approve document', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  openRejectDialog(document: any): void {
    const rejectDialogRef = this.dialog.open(DocumentRejectDialogComponent, {
      width: '400px',
      data: {
        documentType: document.documentType || document.type || 'Document',
        driverName: this.data.driverName,
      },
    });

    rejectDialogRef.afterClosed().subscribe((reason: string) => {
      if (reason !== undefined) {
        // User didn't cancel
        this.rejectDocument(document, reason);
      }
    });
  }

  rejectDocument(document: any, reason: string): void {
    const documentId = document.id || document._id || document.documentId;
    if (!documentId) {
      this.snackBar.open('Document ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.processingDocumentId = documentId;

    this.driverService
      .rejectDocument(this.data.driverId, documentId, reason)
      .subscribe({
        next: (response: any) => {
          this.processingDocumentId = null;
          this.snackBar.open('Document rejected successfully', 'Close', {
            duration: 3000,
          });

          // Update the document status in the local array
          const docIndex = this.documents.findIndex(
            (doc) => (doc.id || doc._id || doc.documentId) === documentId
          );
          if (docIndex !== -1) {
            this.documents[docIndex].status = 'rejected';
            this.documents[docIndex].statusDate = new Date().toISOString();
            this.documents[docIndex].rejectionReason = reason;
          }
        },
        error: (error: any) => {
          this.processingDocumentId = null;
          console.error('Error rejecting document:', error);
          this.snackBar.open('Failed to reject document', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  downloadDocument(documentUrl: string, documentType: string): void {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${documentType || 'document'}_${this.data.driverName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
