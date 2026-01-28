import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerSupportService } from '../../core/services/customer-support.service';
import {
  SupportTicket,
  RefundRequest,
  SafetyIncident,
  CustomerSupportAnalytics,
  TicketFilters,
  RefundFilters,
  IncidentFilters
} from '../../core/models/ride.model';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatTabsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatDividerModule
  ],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  // Tab management
  selectedTabIndex = 0;
  
  // Support Tickets
  supportTickets: SupportTicket[] = [];
  ticketDisplayedColumns = ['ticketNumber', 'passenger', 'type', 'priority', 'status', 'assignee', 'created', 'actions'];
  ticketFilters: TicketFilters = {
    status: [],
    type: [],
    priority: [],
    category: [],
    searchQuery: ''
  };
  loadingTickets = false;
  
  // Refund Requests
  refundRequests: RefundRequest[] = [];
  refundDisplayedColumns = ['passenger', 'refundType', 'originalAmount', 'refundAmount', 'status', 'created', 'actions'];
  refundFilters: RefundFilters = {
    status: [],
    refundType: [],
    refundMethod: [],
    refundReason: [],
    amountRange: { min: 0, max: 0 },
    searchQuery: ''
  };
  loadingRefunds = false;
  
  // Safety Incidents
  safetyIncidents: SafetyIncident[] = [];
  incidentDisplayedColumns = ['incidentNumber', 'passenger', 'driver', 'type', 'severity', 'status', 'created', 'actions'];
  incidentFilters: IncidentFilters = {
    status: [],
    incidentType: [],
    severity: [],
    searchQuery: ''
  };
  loadingIncidents = false;
  
  // Analytics
  analytics: CustomerSupportAnalytics | null = null;
  loadingAnalytics = false;
  
  // Filter options
  ticketTypes = [
    { value: 'fare_dispute', label: 'Fare Dispute' },
    { value: 'lost_item', label: 'Lost Item' },
    { value: 'safety_incident', label: 'Safety Incident' },
    { value: 'service_complaint', label: 'Service Complaint' },
    { value: 'payment_issue', label: 'Payment Issue' },
    { value: 'other', label: 'Other' }
  ];
  
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];
  
  ticketStatuses = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];
  
  refundStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  incidentTypes = [
    { value: 'reckless_driving', label: 'Reckless Driving' },
    { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
    { value: 'vehicle_condition', label: 'Vehicle Condition' },
    { value: 'route_deviation', label: 'Route Deviation' },
    { value: 'other', label: 'Other' }
  ];
  
  severityLevels = [
    { value: 'minor', label: 'Minor' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
    { value: 'critical', label: 'Critical' }
  ];

  constructor(
    private customerSupportService: CustomerSupportService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    this.loadSupportTickets();
    this.loadRefundRequests();
    this.loadSafetyIncidents();
    this.loadAnalytics();
  }

  // Support Tickets Methods
  loadSupportTickets(): void {
    this.loadingTickets = true;
    // Using mock data for now since service needs to be properly implemented
    this.supportTickets = [
      {
        id: 'ticket-001',
        ticketNumber: 'TKT-2024-001',
        passengerId: 'pass-001',
        passengerName: 'John Smith',
        passengerEmail: 'john.smith@example.com',
        passengerPhone: '+1234567890',
        rideId: 'ride-001',
        type: 'fare_dispute',
        category: 'billing',
        priority: 'high',
        status: 'open',
        subject: 'Overcharged for ride from Airport',
        description: 'I was charged ₹850 for a ride that should have cost ₹650.',
        attachments: [],
        assignedTo: 'admin-001',
        assignedAgent: 'Sarah Johnson',
        internalNotes: [],
        statusHistory: [],
        createdAt: new Date('2024-10-25T10:15:00'),
        updatedAt: new Date('2024-10-25T14:20:00')
      },
      {
        id: 'ticket-002',
        ticketNumber: 'TKT-2024-002',
        passengerId: 'pass-002',
        passengerName: 'Maria Garcia',
        passengerEmail: 'maria.garcia@example.com',
        passengerPhone: '+1234567891',
        rideId: 'ride-002',
        type: 'lost_item',
        category: 'service',
        priority: 'medium',
        status: 'in_progress',
        subject: 'Left phone in the car',
        description: 'I accidentally left my iPhone in the car.',
        attachments: [],
        assignedTo: 'admin-002',
        assignedAgent: 'Mike Chen',
        internalNotes: [],
        statusHistory: [],
        createdAt: new Date('2024-10-24T09:20:00'),
        updatedAt: new Date('2024-10-25T11:45:00')
      },
      {
        id: 'ticket-003',
        ticketNumber: 'TKT-2024-003',
        passengerId: 'pass-003',
        passengerName: 'David Wilson',
        passengerEmail: 'david.wilson@example.com',
        passengerPhone: '+1234567892',
        rideId: 'ride-003',
        type: 'safety_incident',
        category: 'safety',
        priority: 'critical',
        status: 'escalated',
        subject: 'Driver was using phone while driving',
        description: 'The driver was continuously using his phone throughout the journey.',
        attachments: [],
        assignedTo: 'admin-003',
        assignedAgent: 'Jennifer Lee',
        internalNotes: [],
        statusHistory: [],
        createdAt: new Date('2024-10-23T16:30:00'),
        updatedAt: new Date('2024-10-25T09:15:00')
      }
    ];
    this.loadingTickets = false;
  }

  applyTicketFilters(): void {
    this.loadSupportTickets();
  }

  clearTicketFilters(): void {
    this.ticketFilters = {
      status: [],
      type: [],
      priority: [],
      category: [],
      searchQuery: ''
    };
    this.loadSupportTickets();
  }

  assignTicket(ticketId: string): void {
    // In a real app, this would open a dialog to select assignee
    const assigneeId = 'admin-001';
    const assigneeName = 'Sarah Johnson';
    
    this.customerSupportService.assignTicket(ticketId, assigneeId, assigneeName)
      .subscribe({
        next: () => {
          this.showSuccess('Ticket assigned successfully');
          this.loadSupportTickets();
        },
        error: () => this.showError('Failed to assign ticket')
      });
  }

  resolveTicket(ticketId: string): void {
    // In a real app, this would open a dialog to enter resolution
    const resolution = 'Issue resolved through investigation and corrective action';
    
    this.customerSupportService.closeTicket(ticketId, resolution)
      .subscribe({
        next: () => {
          this.showSuccess('Ticket resolved successfully');
          this.loadSupportTickets();
        },
        error: () => this.showError('Failed to resolve ticket')
      });
  }

  // Refund Requests Methods
  loadRefundRequests(): void {
    this.loadingRefunds = true;
    // Using mock data for now
    this.refundRequests = [
      {
        id: 'refund-001',
        refundNumber: 'REF-2024-001',
        passengerId: 'pass-001',
        passengerName: 'John Smith',
        rideId: 'ride-001',
        originalTransactionId: 'txn-001',
        refundType: 'partial',
        originalAmount: 850,
        refundAmount: 150,
        refundReason: 'fare_overcharge',
        refundMethod: 'original_payment',
        description: 'Overcharged due to route deviation',
        justification: 'Driver took longer route without consent',
        status: 'processing',
        processedBy: 'admin-001',
        processingNotes: 'Approved after investigation',
        paymentDetails: {
          originalPaymentMethod: 'Visa **** 4532',
          originalPaymentId: 'pay_abc123',
          refundPaymentMethod: 'original_card',
          processingFee: 0,
          netRefundAmount: 150
        },
        attachments: [],
        auditTrail: [],
        createdAt: new Date('2024-10-25T15:30:00'),
        updatedAt: new Date('2024-10-25T16:45:00')
      },
      {
        id: 'refund-002',
        refundNumber: 'REF-2024-002',
        passengerId: 'pass-004',
        passengerName: 'Lisa Brown',
        rideId: 'ride-004',
        originalTransactionId: 'txn-002',
        refundType: 'full',
        originalAmount: 420,
        refundAmount: 420,
        refundReason: 'cancellation',
        refundMethod: 'wallet',
        description: 'Driver cancelled after pickup',
        justification: 'Emergency cancellation case',
        status: 'completed',
        processedBy: 'admin-002',
        processingNotes: 'Full refund approved',
        completedAt: new Date('2024-10-24T14:20:00'),
        paymentDetails: {
          originalPaymentMethod: 'Wallet Balance',
          originalPaymentId: 'wal_def456',
          refundPaymentMethod: 'wallet',
          processingFee: 0,
          netRefundAmount: 420
        },
        attachments: [],
        auditTrail: [],
        createdAt: new Date('2024-10-24T12:15:00'),
        updatedAt: new Date('2024-10-24T14:20:00')
      }
    ];
    this.loadingRefunds = false;
  }

  applyRefundFilters(): void {
    this.loadRefundRequests();
  }

  clearRefundFilters(): void {
    this.refundFilters = {
      status: [],
      refundType: [],
      refundMethod: [],
      refundReason: [],
      amountRange: { min: 0, max: 0 },
      searchQuery: ''
    };
    this.loadRefundRequests();
  }

  processRefund(refundId: string): void {
    const processingNotes = 'Refund approved and processed to original payment method';
    
    this.customerSupportService.processRefund(refundId, processingNotes)
      .subscribe({
        next: () => {
          this.showSuccess('Refund processed successfully');
          this.loadRefundRequests();
        },
        error: () => this.showError('Failed to process refund')
      });
  }

  // Safety Incidents Methods
  loadSafetyIncidents(): void {
    this.loadingIncidents = true;
    // Using mock data for now
    this.safetyIncidents = [
      {
        id: 'incident-001',
        incidentNumber: 'INC-2024-001',
        title: 'Driver Phone Usage While Driving',
        passengerId: 'pass-003',
        passengerName: 'David Wilson',
        driverId: 'drv-003',
        driverName: 'Raj Kumar',
        rideId: 'ride-003',
        vehicleId: 'veh-003',
        incidentType: 'reckless_driving',
        severity: 'critical',
        status: 'under_investigation',
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'MG Road, Bangalore'
        },
        incidentTime: new Date('2024-10-23T16:30:00'),
        description: 'Driver was using mobile phone continuously while driving, ran red lights, and was driving above speed limit.',
        witnesses: [
          {
            id: 'witness-001',
            name: 'Traffic Police Constable Sharma',
            contactNumber: '+91-9876543210',
            statement: 'Observed the vehicle running red light at MG Road junction at 16:35.',
            contactedAt: new Date('2024-10-23T17:00:00')
          }
        ],
        evidence: [
          {
            id: 'inc-ev-001',
            type: 'video',
            filename: 'dashboard_recording.mp4',
            url: '/assets/incidents/dashboard_recording.mp4',
            description: 'Dashboard camera recording showing driver phone usage',
            collectedBy: 'admin-003',
            collectedAt: new Date('2024-10-23T18:00:00')
          }
        ],
        investigationNotes: [
          {
            id: 'note-001',
            note: 'Evidence confirms reckless driving. Driver has history of similar complaints.',
            noteType: 'investigation',
            addedBy: 'admin-003',
            addedByName: 'Jennifer Lee',
            isConfidential: true,
            createdAt: new Date('2024-10-23T18:30:00')
          }
        ],
        actions: [
          {
            id: 'action-001',
            actionType: 'suspension',
            action: 'Driver Account Suspended',
            description: 'Driver suspended for 7 days pending investigation completion',
            targetType: 'driver',
            targetId: 'drv-003',
            takenBy: 'admin-003',
            takenByName: 'Jennifer Lee',
            effectiveDate: new Date('2024-10-23T18:00:00'),
            createdAt: new Date('2024-10-23T18:15:00'),
            completedAt: new Date('2024-10-23T18:15:00')
          }
        ],
        followUpRequired: true,
        reportedBy: 'pass-003',
        reportedTime: new Date('2024-10-23T16:45:00'),
        reporterName: 'David Wilson',
        legalAction: false,
        statusHistory: [],
        createdAt: new Date('2024-10-23T16:45:00'),
        updatedAt: new Date('2024-10-25T10:30:00')
      }
    ];
    this.loadingIncidents = false;
  }

  applyIncidentFilters(): void {
    this.loadSafetyIncidents();
  }

  clearIncidentFilters(): void {
    this.incidentFilters = {
      status: [],
      incidentType: [],
      severity: [],
      searchQuery: ''
    };
    this.loadSafetyIncidents();
  }

  takeIncidentAction(incidentId: string): void {
    // In a real app, this would open a dialog to select action
    const actionData = {
      actionType: 'warning' as const,
      description: 'Driver warned about reckless driving behavior',
      targetEntity: 'driver' as const,
      targetEntityId: 'drv-003',
      completedBy: 'admin-003',
      completedByName: 'Jennifer Lee'
    };
    
    this.customerSupportService.takeIncidentAction(incidentId, actionData)
      .subscribe({
        next: () => {
          this.showSuccess('Action taken successfully');
          this.loadSafetyIncidents();
        },
        error: () => this.showError('Failed to take action')
      });
  }

  // Analytics
  loadAnalytics(): void {
    this.loadingAnalytics = true;
    // Using mock analytics data
    this.analytics = {
      ticketSummary: {
        totalTickets: 3,
        openTickets: 1,
        inProgressTickets: 1,
        resolvedTickets: 0,
        closedTickets: 0,
        escalatedTickets: 1,
        averageResolutionTime: 18.5,
        satisfactionScore: 4.2,
        ticketsByCategory: {
          billing: 1,
          service: 1,
          safety: 1,
          technical: 0,
          general: 0
        },
        ticketsByPriority: {
          low: 0,
          medium: 1,
          high: 1,
          critical: 1
        }
      },
      refundSummary: {
        totalRefunds: 2,
        pendingRefunds: 0,
        approvedRefunds: 2,
        completedRefunds: 1,
        rejectedRefunds: 0,
        totalRefundAmount: 570,
        averageRefundAmount: 285,
        averageProcessingTime: 24,
        refundsByReason: {
          fare_overcharge: 1,
          service_failure: 0,
          cancellation: 1,
          duplicate_charge: 0,
          technical_error: 0,
          other: 0
        },
        refundsByMethod: {
          original_payment: 1,
          wallet: 1,
          bank_transfer: 0,
          check: 0
        }
      },
      incidentSummary: {
        totalIncidents: 1,
        reportedIncidents: 1,
        underInvestigationIncidents: 1,
        resolvedIncidents: 0,
        escalatedIncidents: 0,
        averageResolutionTime: 0,
        incidentsByType: {
          driver_misconduct: 0,
          reckless_driving: 1,
          harassment: 0,
          accident: 0,
          theft: 0,
          violence: 0,
          other: 0
        },
        incidentsBySeverity: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 1
        }
      },
      passengerSatisfaction: {
        averageRating: 4.2,
        responseTime: 2.5,
        resolutionTime: 18.5,
        escalationRate: 15
      },
      trends: {
        ticketVolume: [
          { date: new Date('2024-10-20'), count: 5 },
          { date: new Date('2024-10-21'), count: 3 },
          { date: new Date('2024-10-22'), count: 7 }
        ],
        refundVolume: [
          { date: new Date('2024-10-20'), count: 2, amount: 400 },
          { date: new Date('2024-10-21'), count: 1, amount: 150 },
          { date: new Date('2024-10-22'), count: 3, amount: 600 }
        ],
        incidentVolume: [
          { date: new Date('2024-10-20'), count: 0 },
          { date: new Date('2024-10-21'), count: 1 },
          { date: new Date('2024-10-22'), count: 2 }
        ]
      }
    };
    this.loadingAnalytics = false;
  }

  // Export Methods
  exportTickets(): void {
    this.customerSupportService.exportTicketsToCSV()
      .subscribe({
        next: (csvData: string) => {
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `support-tickets-${new Date().getTime()}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.showSuccess('Tickets exported successfully');
        },
        error: () => this.showError('Failed to export tickets')
      });
  }

  exportRefunds(): void {
    this.customerSupportService.exportRefundsToCSV()
      .subscribe({
        next: (csvData: string) => {
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `refund-requests-${new Date().getTime()}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.showSuccess('Refunds exported successfully');
        },
        error: () => this.showError('Failed to export refunds')
      });
  }

  exportIncidents(): void {
    this.customerSupportService.exportIncidentsToCSV()
      .subscribe({
        next: (csvData: string) => {
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `safety-incidents-${new Date().getTime()}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.showSuccess('Incidents exported successfully');
        },
        error: () => this.showError('Failed to export incidents')
      });
  }

  // Utility Methods
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'open': return '#f44336';
      case 'in_progress': return '#ff9800';
      case 'escalated': return '#e91e63';
      case 'resolved': return '#4caf50';
      case 'closed': return '#9e9e9e';
      case 'pending': return '#ff9800';
      case 'processing': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'failed': return '#f44336';
      case 'cancelled': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'severe': return '#ff5722';
      case 'moderate': return '#ff9800';
      case 'minor': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}