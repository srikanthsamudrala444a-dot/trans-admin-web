import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EmergencyAlert } from '../../../core/models/emergency.model';

@Component({
  selector: 'app-emergency-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './emergency-details-dialog.component.html',
  styleUrls: ['./emergency-details-dialog.component.scss']
})
export class EmergencyDetailsDialogComponent implements OnInit {
  responseForm: FormGroup;
  escalationForm: FormGroup;
  resolutionForm: FormGroup;

  responseTypes = [
    { value: 'CALL_USER', label: 'Call User' },
    { value: 'CONTACT_EMERGENCY', label: 'Contact Emergency Services' },
    { value: 'DISPATCH_SECURITY', label: 'Dispatch Security' },
    { value: 'SEND_MESSAGE', label: 'Send Message' },
    { value: 'ESCALATE', label: 'Escalate' }
  ];

  authorityTypes = [
    { value: 'POLICE', label: 'Police' },
    { value: 'AMBULANCE', label: 'Ambulance' },
    { value: 'FIRE', label: 'Fire Department' },
    { value: 'SECURITY', label: 'Security' }
  ];

  constructor(
    private dialogRef: MatDialogRef<EmergencyDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public alert: EmergencyAlert,
    private fb: FormBuilder
  ) {
    this.responseForm = this.fb.group({
      responseType: ['', Validators.required],
      notes: ['', Validators.required]
    });

    this.escalationForm = this.fb.group({
      reason: ['', Validators.required]
    });

    this.resolutionForm = this.fb.group({
      outcome: ['', Validators.required],
      notes: ['', Validators.required],
      followUpRequired: [false]
    });
  }

  ngOnInit(): void {
    // Component initialization
    if (!this.alert) {
      console.error('No alert data provided to dialog');
      this.dialogRef.close();
      return;
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return '#f44336';
      case 'HIGH': return '#ff9800';
      case 'MEDIUM': return '#2196f3';
      case 'LOW': return '#4caf50';
      default: return '#666';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return '#f44336';
      case 'RESPONDING': return '#ff9800';
      case 'RESOLVED': return '#4caf50';
      case 'FALSE_ALARM': return '#666';
      default: return '#666';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'SOS': return 'warning';
      case 'PANIC': return 'report_problem';
      case 'ACCIDENT': return 'car_crash';
      case 'MEDICAL': return 'local_hospital';
      case 'SAFETY_CONCERN': return 'security';
      default: return 'error';
    }
  }

  onRespond(): void {
    if (this.responseForm.valid) {
      const responseData = this.responseForm.value;
      this.dialogRef.close({
        type: 'respond',
        data: responseData
      });
    }
  }

  onEscalate(): void {
    if (this.escalationForm.valid) {
      const escalationData = this.escalationForm.value;
      this.dialogRef.close({
        type: 'escalate',
        data: escalationData
      });
    }
  }

  onResolve(): void {
    if (this.resolutionForm.valid) {
      const resolutionData = this.resolutionForm.value;
      this.dialogRef.close({
        type: 'resolve',
        data: resolutionData
      });
    }
  }

  onDismiss(): void {
    const reason = prompt('Please provide a reason for dismissing this alert:');
    if (reason) {
      this.dialogRef.close({
        type: 'dismiss',
        data: { reason }
      });
    }
  }

  onContactAuthority(authorityType: string): void {
    this.dialogRef.close({
      type: 'contact_authority',
      data: { authorityType }
    });
  }

  onContactEmergencyContact(contactId: string): void {
    this.dialogRef.close({
      type: 'contact_emergency',
      data: { contactId }
    });
  }

  onInitiateCall(): void {
    this.dialogRef.close({
      type: 'initiate_call',
      data: { phoneNumber: this.alert.triggeredBy.phone }
    });
  }

  onViewMap(): void {
    const { latitude, longitude } = this.alert.location;
    const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  }

  getTimeSince(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
