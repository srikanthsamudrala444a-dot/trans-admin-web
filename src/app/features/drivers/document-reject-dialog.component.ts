import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export interface DocumentRejectDialogData {
  documentType: string;
  driverName: string;
}

@Component({
  selector: 'app-document-reject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Reject Document</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="reject-dialog-content">
      <p>
        You are about to reject the <strong>{{ data.documentType }}</strong> 
        for driver <strong>{{ data.driverName }}</strong>.
      </p>
      
      <mat-form-field appearance="outline">
        <mat-label>Reason for rejection</mat-label>
        <textarea 
          matInput 
          [(ngModel)]="rejectionReason" 
          placeholder="Please provide a reason for rejecting this document..."
          rows="4"
          maxlength="500">
        </textarea>
        <mat-hint>{{ rejectionReason.length || 0 }}/500 characters</mat-hint>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button 
        mat-raised-button 
        color="warn" 
        [mat-dialog-close]="rejectionReason"
        [disabled]="!rejectionReason || rejectionReason.trim().length === 0"
      >
        <mat-icon>cancel</mat-icon>
        Reject Document
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .reject-dialog-content {
      min-width: 400px;
      padding: 20px 24px;
    }

    .reject-dialog-content p {
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .reject-dialog-content mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class DocumentRejectDialogComponent {
  rejectionReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<DocumentRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentRejectDialogData
  ) {}
}
