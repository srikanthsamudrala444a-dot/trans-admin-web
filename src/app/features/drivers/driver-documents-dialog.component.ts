import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
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
import { DocumentRejectDialogComponent } from './document-reject-dialog.component';

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
    FormsModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Driver Documents - {{ data.driverName }}</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading driver documents...</p>
      </div>

      <div *ngIf="!loading && documents && documents.length > 0" class="documents-grid">
        <mat-card *ngFor="let document of documents" class="document-card">
          <mat-card-header>
            <mat-card-title>{{ document.documentType || 'Document' }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip [class]="getStatusClass(document.status)">
                {{ document.status | titlecase }}
              </mat-chip>
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="document-info">
              <p *ngIf="document.documentNumber">
                <strong>Document Number:</strong> {{ document.documentNumber }}
              </p>
              <p *ngIf="document.expiryDate">
                <strong>Expiry Date:</strong> {{ document.expiryDate | date }}
              </p>
              <p *ngIf="document.uploadDate">
                <strong>Upload Date:</strong> {{ document.uploadDate | date }}
              </p>
              <p *ngIf="document.remarks">
                <strong>Remarks:</strong> {{ document.remarks }}
              </p>
              <p *ngIf="document.rejectionReason && document.status === 'rejected'" class="rejection-reason">
                <strong>Rejection Reason:</strong> {{ document.rejectionReason }}
              </p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary" *ngIf="document.documentUrl" (click)="viewDocument(document.documentUrl)">
              <mat-icon>visibility</mat-icon>
              View Document
            </button>
            <button mat-button color="accent" *ngIf="document.documentUrl" (click)="downloadDocument(document.documentUrl, document.documentType)">
              <mat-icon>download</mat-icon>
              Download
            </button>
            
            <!-- Document Status Actions -->
            <div class="document-actions" *ngIf="document.status === 'pending'">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="acceptDocument(document)"
                [disabled]="processingDocumentId === document.id"
              >
                <mat-icon>check_circle</mat-icon>
                Accept
              </button>
              <button 
                mat-raised-button 
                color="warn" 
                (click)="openRejectDialog(document)"
                [disabled]="processingDocumentId === document.id"
              >
                <mat-icon>cancel</mat-icon>
                Reject
              </button>
            </div>
            
            <div class="document-status-info" *ngIf="document.status !== 'pending'">
              <mat-chip [class]="getStatusClass(document.status)">
                <mat-icon *ngIf="document.status === 'approved'">check_circle</mat-icon>
                <mat-icon *ngIf="document.status === 'rejected'">cancel</mat-icon>
                {{ document.status | titlecase }}
              </mat-chip>
              <span class="status-date" *ngIf="document.statusDate">
                {{ document.statusDate | date:'short' }}
              </span>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="!loading && (!documents || documents.length === 0)" class="no-documents">
        <mat-icon>description</mat-icon>
        <p>No documents found for this driver.</p>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .dialog-content {
      min-height: 300px;
      max-height: 600px;
      overflow-y: auto;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    .document-card {
      max-width: 100%;
    }

    .document-info p {
      margin: 8px 0;
    }

    .no-documents {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .no-documents mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #f44336;
    }

    .error-container mat-icon {
      margin-right: 8px;
    }

    .status-approved {
      background-color: #4caf50;
      color: white;
    }

    .status-pending {
      background-color: #ff9800;
      color: white;
    }

    .status-rejected {
      background-color: #f44336;
      color: white;
    }

    .status-expired {
      background-color: #9e9e9e;
      color: white;
    }

    .document-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .document-status-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .status-date {
      font-size: 0.875rem;
      color: #666;
    }

    .reject-dialog-content {
      min-width: 400px;
    }

    .reject-dialog-content mat-form-field {
      width: 100%;
      margin-top: 16px;
    }

    .rejection-reason {
      color: #f44336;
      font-style: italic;
    }
  `]
})
export class DriverDocumentsDialogComponent implements OnInit {
  documents: any[] = [];
  loading = false;
  error: string | null = null;
  processingDocumentId: string | null = null;

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

    this.driverService.getDriverDocuments(this.data.driverId).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('Driver documents response:', response);
        
        // Handle different response structures
        if (response && response.documents) {
          this.documents = response.documents;
        } else if (Array.isArray(response)) {
          this.documents = response;
        } else if (response && response.data) {
          this.documents = response.data;
        } else {
          this.documents = [];
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Failed to load driver documents. Please try again.';
        console.error('Error loading driver documents:', error);
      }
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

  acceptDocument(document: any): void {
    if (!document.id) {
      this.snackBar.open('Document ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.processingDocumentId = document.id;
    
    this.driverService.acceptDocument(this.data.driverId, document.id).subscribe({
      next: (response: any) => {
        this.processingDocumentId = null;
        this.snackBar.open('Document accepted successfully', 'Close', { duration: 3000 });
        
        // Update the document status in the local array
        const docIndex = this.documents.findIndex(doc => doc.id === document.id);
        if (docIndex !== -1) {
          this.documents[docIndex].status = 'approved';
          this.documents[docIndex].statusDate = new Date().toISOString();
        }
      },
      error: (error: any) => {
        this.processingDocumentId = null;
        console.error('Error accepting document:', error);
        this.snackBar.open('Failed to accept document', 'Close', { duration: 3000 });
      }
    });
  }

  openRejectDialog(document: any): void {
    const rejectDialogRef = this.dialog.open(DocumentRejectDialogComponent, {
      width: '400px',
      data: {
        documentType: document.documentType || 'Document',
        driverName: this.data.driverName
      }
    });

    rejectDialogRef.afterClosed().subscribe((reason: string) => {
      if (reason !== undefined) { // User didn't cancel
        this.rejectDocument(document, reason);
      }
    });
  }

  rejectDocument(document: any, reason: string): void {
    if (!document.id) {
      this.snackBar.open('Document ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.processingDocumentId = document.id;
    
    this.driverService.rejectDocument(this.data.driverId, document.id, reason).subscribe({
      next: (response: any) => {
        this.processingDocumentId = null;
        this.snackBar.open('Document rejected successfully', 'Close', { duration: 3000 });
        
        // Update the document status in the local array
        const docIndex = this.documents.findIndex(doc => doc.id === document.id);
        if (docIndex !== -1) {
          this.documents[docIndex].status = 'rejected';
          this.documents[docIndex].statusDate = new Date().toISOString();
          this.documents[docIndex].rejectionReason = reason;
        }
      },
      error: (error: any) => {
        this.processingDocumentId = null;
        console.error('Error rejecting document:', error);
        this.snackBar.open('Failed to reject document', 'Close', { duration: 3000 });
      }
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
