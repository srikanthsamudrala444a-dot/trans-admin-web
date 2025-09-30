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
          console.log('Driver documents:', response);
          this.documents = response.driver;
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
