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

      <!-- Debug info (set showDebug = true to enable) -->
      <div *ngIf="!loading && showDebug" style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <h4>🐛 Debug Info:</h4>
        <p><strong>Loading:</strong> {{ loading }}</p>
        <p><strong>Documents array exists:</strong> {{ documents && documents.length >= 0 }}</p>
        <p><strong>Documents length:</strong> {{ documents.length }}</p>
        <p><strong>Documents type:</strong> Array</p>
        <details>
          <summary>Raw documents data</summary>
          <pre>{{ documents | json }}</pre>
        </details>
      </div>

      <div *ngIf="!loading && documents && documents.length > 0" class="documents-grid">
        <mat-card *ngFor="let document of documents; let i = index" class="document-card">
          <mat-card-header>
            <mat-card-title>{{ document.documentType || document.type || 'Document' }} #{{ i + 1 }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip [class]="getStatusClass(document.status || document.verificationStatus || document.state)">
                {{ (document.status || document.verificationStatus || document.state || 'Unknown') | titlecase }}
              </mat-chip>
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="document-info">
              <!-- Debug: Show all document properties (can be removed in production) -->
              <!-- <details style="margin-bottom: 10px;">
                <summary style="cursor: pointer; color: #666;">🔍 Debug: Document Properties</summary>
                <pre style="font-size: 11px; background: #f5f5f5; padding: 8px; border-radius: 4px;">{{ document | json }}</pre>
              </details> -->
              
              <p *ngIf="document.documentNumber || document.number || document.docNumber">
                <strong>Document Number:</strong> {{ document.documentNumber || document.number || document.docNumber }}
              </p>
              <p *ngIf="document.expiryDate || document.expiry || document.expirationDate">
                <strong>Expiry Date:</strong> {{ document.expiryDate || document.expiry || document.expirationDate | date }}
              </p>
              <p *ngIf="document.uploadDate || document.createdDate || document.submittedDate">
                <strong>Upload Date:</strong> {{ document.uploadDate || document.createdDate || document.submittedDate | date }}
              </p>
              <p *ngIf="document.remarks || document.notes || document.description">
                <strong>Remarks:</strong> {{ document.remarks || document.notes || document.description }}
              </p>
              <p *ngIf="(document.rejectionReason || document.rejectReason) && (document.status === 'rejected' || document.status === 'REJECTED')" class="rejection-reason">
                <strong>Rejection Reason:</strong> {{ document.rejectionReason || document.rejectReason }}
              </p>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary" *ngIf="document.documentUrl || document.url || document.fileUrl" 
                    (click)="viewDocument(document.documentUrl || document.url || document.fileUrl)">
              <mat-icon>visibility</mat-icon>
              View Document
            </button>
            <button mat-button color="accent" *ngIf="document.documentUrl || document.url || document.fileUrl" 
                    (click)="downloadDocument(document.documentUrl || document.url || document.fileUrl, document.documentType || document.type)">
              <mat-icon>download</mat-icon>
              Download
            </button>
            
            <!-- Document Status Actions -->
            <div class="document-actions" *ngIf="(document.status === 'pending' || document.status === 'PENDING' || document.verificationStatus === 'pending' || document.verificationStatus === 'PENDING')">
              <button 
                mat-raised-button 
                color="primary" 
                (click)="approveDocument(document)"
                [disabled]="processingDocumentId === (document.id || document._id || document.documentId)"
              >
                <mat-icon>check_circle</mat-icon>
                Approve
              </button>
              <button 
                mat-raised-button 
                color="warn" 
                (click)="openRejectDialog(document)"
                [disabled]="processingDocumentId === (document.id || document._id || document.documentId)"
              >
                <mat-icon>cancel</mat-icon>
                Reject
              </button>
            </div>
            
            <div class="document-status-info" *ngIf="(document.status && document.status.toLowerCase() !== 'pending') || (document.verificationStatus && document.verificationStatus.toLowerCase() !== 'pending')">
              <mat-chip [class]="getStatusClass(document.status || document.verificationStatus)">
                <mat-icon *ngIf="(document.status === 'approved' || document.status === 'APPROVED' || document.verificationStatus === 'approved' || document.verificationStatus === 'APPROVED')">check_circle</mat-icon>
                <mat-icon *ngIf="(document.status === 'rejected' || document.status === 'REJECTED' || document.verificationStatus === 'rejected' || document.verificationStatus === 'REJECTED')">cancel</mat-icon>
                {{ (document.status || document.verificationStatus) | titlecase }}
              </mat-chip>
              <span class="status-date" *ngIf="document.statusDate || document.modifiedDate">
                {{ (document.statusDate || document.modifiedDate) | date:'short' }}
              </span>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="!loading && (!documents || documents.length === 0)" class="no-documents">
        <mat-icon>description</mat-icon>
        <p>No documents found for this driver.</p>
        <p><small>Driver ID: {{ data.driverId }}</small></p>
        <p><small>Check browser console for API response details.</small></p>
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

    this.driverService.getDocuementVerificationList(this.data.driverId).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('=== DOCUMENT RESPONSE DEBUG ===');
        console.log('Raw response:', response);
        console.log('Response type:', typeof response);
        console.log('Is array:', Array.isArray(response));
        console.log('Response keys:', response ? Object.keys(response) : 'No keys');
        
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
          } else if (response.data && response.data.documents && Array.isArray(response.data.documents)) {
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
              console.log(`Checking ${key}:`, Array.isArray(value), typeof value);
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
              documentUrl: '#'
            },
            {
              id: 'test-2', 
              documentType: 'Aadhaar Card',
              status: 'pending',
              documentNumber: 'AADHAAR789',
              uploadDate: new Date().toISOString(),
              documentUrl: '#'
            }
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

  approveDocument(document: any): void {
    const documentId = document.id || document._id || document.documentId;
    if (!documentId) {
      this.snackBar.open('Document ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.processingDocumentId = documentId;
    
    this.driverService.approveDocument(this.data.driverId, documentId).subscribe({
      next: (response: any) => {
        this.processingDocumentId = null;
        this.snackBar.open('Document approved successfully', 'Close', { duration: 3000 });

        // Update the document status in the local array
        const docIndex = this.documents.findIndex(doc => 
          (doc.id || doc._id || doc.documentId) === documentId
        );
        if (docIndex !== -1) {
          this.documents[docIndex].status = 'approved';
          this.documents[docIndex].statusDate = new Date().toISOString();
        }
      },
      error: (error: any) => {
        this.processingDocumentId = null;
        console.error('Error approving document:', error);
        this.snackBar.open('Failed to approve document', 'Close', { duration: 3000 });
      }
    });
  }

  openRejectDialog(document: any): void {
    const rejectDialogRef = this.dialog.open(DocumentRejectDialogComponent, {
      width: '400px',
      data: {
        documentType: document.documentType || document.type || 'Document',
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
    const documentId = document.id || document._id || document.documentId;
    if (!documentId) {
      this.snackBar.open('Document ID not found', 'Close', { duration: 3000 });
      return;
    }

    this.processingDocumentId = documentId;
    
    this.driverService.rejectDocument(this.data.driverId, documentId, reason).subscribe({
      next: (response: any) => {
        this.processingDocumentId = null;
        this.snackBar.open('Document rejected successfully', 'Close', { duration: 3000 });
        
        // Update the document status in the local array
        const docIndex = this.documents.findIndex(doc => 
          (doc.id || doc._id || doc.documentId) === documentId
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
