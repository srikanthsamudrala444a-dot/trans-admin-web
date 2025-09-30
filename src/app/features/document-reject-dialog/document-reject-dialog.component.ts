import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
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
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './document-reject-dialog.component.html',
  styleUrl: './document-reject-dialog.component.scss',
})
export class DocumentRejectDialogComponent {
  rejectionReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<DocumentRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentRejectDialogData
  ) {}
}
