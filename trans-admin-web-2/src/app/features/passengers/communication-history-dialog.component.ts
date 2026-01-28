import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { PassengersService } from '../../core/services/passengers.service';

export interface CommunicationRecord {
  id: string;
  type: string;
  subject: string;
  message: string;
  sentAt: string;
  status: string;
  channel: string; // email, sms, push notification
}

@Component({
  selector: 'app-communication-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './communication-history-dialog.component.html',
  styleUrls: ['./communication-history-dialog.component.scss']
})
export class CommunicationHistoryDialogComponent implements OnInit {
  displayedColumns = ['type', 'subject', 'channel', 'sentAt', 'status'];
  dataSource = new MatTableDataSource<CommunicationRecord>([]);
  loading = false;
  error: string | null = null;
  communications: CommunicationRecord[] = [];
  
  constructor(
    private dialogRef: MatDialogRef<CommunicationHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { passengerId: string, passengerName: string },
    private passengersService: PassengersService
  ) {}

  ngOnInit(): void {
    this.loadCommunicationHistory();
  }

  loadCommunicationHistory(): void {
    this.loading = true;
    this.error = null;

    console.log('Loading communication history for passenger:', this.data.passengerId);

    // Using the dedicated communication history method
    this.passengersService.getCommunicationHistory(this.data.passengerId).subscribe({
      next: (response) => {
        console.log('Communication history response:', response);
        
        // Parse communication history from response
        // This is a mock structure - adjust based on your actual API response
        if (response && response.communications) {
          this.communications = response.communications;
        } else {
          // Mock data for demonstration - replace with actual API response parsing
          this.communications = this.generateMockCommunications();
        }
        
        this.dataSource.data = this.communications;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load communication history:', err);
        // For now, show mock data to demonstrate the UI
        this.communications = this.generateMockCommunications();
        this.dataSource.data = this.communications;
        this.loading = false;
        // this.error = 'Failed to load communication history';
      }
    });
  }

  // Mock data generation - remove this when you have the actual API
  private generateMockCommunications(): CommunicationRecord[] {
    return [
      {
        id: '1',
        type: 'Booking Confirmation',
        subject: 'Your ride has been confirmed',
        message: 'Your ride from Downtown to Airport has been confirmed. Driver: John Doe',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Delivered',
        channel: 'Email'
      },
      {
        id: '2',
        type: 'Cancellation Alert',
        subject: 'Ride cancellation notification',
        message: 'Your ride scheduled for 10:00 AM has been cancelled by the driver',
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Delivered',
        channel: 'SMS'
      },
      {
        id: '3',
        type: 'Promo Code',
        subject: 'Special discount just for you!',
        message: 'Use code SAVE20 for 20% off your next ride. Valid until end of month.',
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Delivered',
        channel: 'Push Notification'
      },
      {
        id: '4',
        type: 'Payment Receipt',
        subject: 'Payment confirmation',
        message: 'Payment of $25.50 has been processed for your ride on 2024-10-01',
        sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Delivered',
        channel: 'Email'
      },
      {
        id: '5',
        type: 'Rating Reminder',
        subject: 'Rate your recent ride',
        message: 'How was your ride with Sarah? Please rate your experience.',
        sentAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Read',
        channel: 'Push Notification'
      }
    ];
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered': return 'primary';
      case 'read': return 'accent';
      case 'failed': return 'warn';
      default: return '';
    }
  }

  getChannelIcon(channel: string): string {
    switch (channel.toLowerCase()) {
      case 'email': return 'email';
      case 'sms': return 'sms';
      case 'push notification': return 'notifications';
      default: return 'message';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  refreshHistory(): void {
    this.loadCommunicationHistory();
  }
}
