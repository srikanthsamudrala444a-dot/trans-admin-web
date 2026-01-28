import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  SupportTicket,
  TicketAttachment,
  TicketNote,
  RefundRequest,
  SafetyIncident,
  CustomerSupportAnalytics,
  TicketFilters,
  IncidentFilters,
  RefundFilters,
  IncidentEvidence,
  IncidentWitness,
  IncidentAction
} from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerSupportService {

  // Mock data for Support Tickets
  private mockSupportTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      ticketNumber: 'SUP-2024-001',
      passengerId: 'pass-001',
      passengerName: 'John Smith',
      passengerEmail: 'john.smith@email.com',
      passengerPhone: '+1234567890',
      rideId: 'ride-001',
      type: 'fare_dispute',
      category: 'billing',
      priority: 'high',
      status: 'open',
      subject: 'Overcharged for ride',
      description: 'I was charged $25 for a ride that should have cost $15 according to the app estimate.',
      attachments: [],
      assignedTo: 'agent-001',
      assignedAgent: 'Sarah Johnson',
      internalNotes: [],
      statusHistory: [],
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T11:00:00Z')
    },
    {
      id: 'TKT-002',
      ticketNumber: 'SUP-2024-002',
      passengerId: 'pass-002',
      passengerName: 'Emma Wilson',
      passengerEmail: 'emma.wilson@email.com',
      passengerPhone: '+1234567891',
      rideId: 'ride-002',
      type: 'service_complaint',
      category: 'service',
      priority: 'medium',
      status: 'in_progress',
      subject: 'Driver was rude and unprofessional',
      description: 'The driver was speaking loudly on phone during the entire ride.',
      attachments: [],
      assignedTo: 'agent-002',
      assignedAgent: 'Mike Chen',
      internalNotes: [],
      statusHistory: [],
      createdAt: new Date('2024-01-16T08:00:00Z'),
      updatedAt: new Date('2024-01-16T09:00:00Z')
    }
  ];

  // Mock data for Refund Requests
  private mockRefundRequests: RefundRequest[] = [
    {
      id: 'REF-001',
      refundNumber: 'REF-2024-001',
      passengerId: 'pass-001',
      passengerName: 'John Smith',
      rideId: 'ride-001',
      ticketId: 'TKT-001',
      originalTransactionId: 'txn_original_123',
      refundType: 'partial',
      refundReason: 'fare_overcharge',
      refundMethod: 'original_payment',
      originalAmount: 25.00,
      refundAmount: 10.00,
      status: 'pending',
      description: 'Overcharged due to route deviation',
      paymentDetails: {
        originalPaymentMethod: 'credit_card',
        originalPaymentId: 'pay_123456',
        refundPaymentMethod: 'original_payment',
        refundPaymentId: 'ref_123456',
        processingFee: 0.50,
        netRefundAmount: 9.50
      },
      approvedBy: '',
      processedAt: undefined,
      justification: 'Route deviation caused fare overcharge',
      attachments: [],
      auditTrail: [],
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z')
    },
    {
      id: 'REF-002',
      refundNumber: 'REF-2024-002',
      passengerId: 'pass-003',
      passengerName: 'Alice Brown',
      rideId: 'ride-003',
      originalTransactionId: 'txn_original_456',
      refundType: 'full',
      refundReason: 'cancellation',
      refundMethod: 'original_payment',
      originalAmount: 18.50,
      refundAmount: 18.50,
      status: 'approved',
      description: 'Driver cancelled after pickup',
      paymentDetails: {
        originalPaymentMethod: 'credit_card',
        originalPaymentId: 'pay_456789',
        refundPaymentMethod: 'original_payment',
        refundPaymentId: 'ref_456789',
        processingFee: 0.00,
        netRefundAmount: 18.50
      },
      approvedBy: 'admin-001',
      processedAt: new Date('2024-01-17T15:00:00Z'),
      justification: 'Driver cancelled after pickup - full refund warranted',
      attachments: [],
      auditTrail: [],
      createdAt: new Date('2024-01-17T14:00:00Z'),
      updatedAt: new Date('2024-01-17T15:00:00Z')
    }
  ];

  // Mock data for Safety Incidents
  private mockSafetyIncidents: SafetyIncident[] = [
    {
      id: 'INC-001',
      incidentNumber: 'SAF-2024-001',
      passengerId: 'pass-004',
      passengerName: 'David Lee',
      driverId: 'drv-003',
      driverName: 'Robert Johnson',
      rideId: 'ride-004',
      vehicleId: 'veh-003',
      incidentType: 'driver_misconduct',
      severity: 'high',
      status: 'under_investigation',
      title: 'Reckless Driving Incident',
      description: 'Driver was driving recklessly and using phone while driving',
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: '123 Main St, San Francisco, CA'
      },
      incidentTime: new Date('2024-01-18T16:30:00Z'),
      reportedTime: new Date('2024-01-18T17:00:00Z'),
      witnesses: [],
      evidence: [],
      investigationNotes: [],
      actions: [],
      outcome: undefined,
      outcomeNotes: undefined,
      followUpRequired: true,
      followUpNotes: 'Need to interview driver and review vehicle dashcam footage',
      reportedBy: 'pass-004',
      reporterName: 'David Lee',
      assignedInvestigator: 'investigator-001',
      investigatorName: 'Alex Rodriguez',
      policeReportNumber: undefined,
      insuranceClaimNumber: undefined,
      legalAction: false,
      legalNotes: undefined,
      statusHistory: [],
      createdAt: new Date('2024-01-18T17:00:00Z'),
      updatedAt: new Date('2024-01-18T18:00:00Z')
    }
  ];

  // Support Ticket Methods
  getSupportTickets(filters?: TicketFilters): Observable<SupportTicket[]> {
    let filteredTickets = [...this.mockSupportTickets];

    if (filters) {
      if (filters.type?.length) {
        filteredTickets = filteredTickets.filter(ticket =>
          filters.type!.includes(ticket.type)
        );
      }

      if (filters.priority?.length) {
        filteredTickets = filteredTickets.filter(ticket =>
          filters.priority!.includes(ticket.priority)
        );
      }

      if (filters.status?.length) {
        filteredTickets = filteredTickets.filter(ticket =>
          filters.status!.includes(ticket.status)
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket =>
          ticket.subject.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.passengerName.toLowerCase().includes(query)
        );
      }
    }

    return of(filteredTickets).pipe(delay(500));
  }

  getSupportTicketById(ticketId: string): Observable<SupportTicket | undefined> {
    const ticket = this.mockSupportTickets.find(t => t.id === ticketId);
    return of(ticket).pipe(delay(300));
  }

  assignTicket(ticketId: string, assignedTo: string, assigneeName: string): Observable<SupportTicket> {
    const ticket = this.mockSupportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.assignedTo = assignedTo;
      ticket.assignedAgent = assigneeName;
      ticket.updatedAt = new Date();
    }
    return of(ticket!).pipe(delay(300));
  }

  closeTicket(ticketId: string, resolution: string): Observable<SupportTicket> {
    const ticket = this.mockSupportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.resolution = resolution;
      ticket.resolvedAt = new Date();
      ticket.updatedAt = new Date();
    }
    return of(ticket!).pipe(delay(300));
  }

  // Refund Methods
  getRefundRequests(filters?: RefundFilters): Observable<RefundRequest[]> {
    let filteredRefunds = [...this.mockRefundRequests];

    if (filters) {
      if (filters.status?.length) {
        filteredRefunds = filteredRefunds.filter(refund =>
          filters.status!.includes(refund.status)
        );
      }

      if (filters.refundType?.length) {
        filteredRefunds = filteredRefunds.filter(refund =>
          filters.refundType!.includes(refund.refundType)
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredRefunds = filteredRefunds.filter(refund =>
          refund.passengerName.toLowerCase().includes(query) ||
          refund.description.toLowerCase().includes(query)
        );
      }
    }

    return of(filteredRefunds).pipe(delay(500));
  }

  processRefund(refundId: string, processingNotes: string): Observable<RefundRequest> {
    const refund = this.mockRefundRequests.find(r => r.id === refundId);
    if (refund) {
      refund.status = 'processing';
      refund.processedAt = new Date();
      refund.updatedAt = new Date();
    }
    return of(refund!).pipe(delay(300));
  }

  // Safety Incident Methods
  getSafetyIncidents(filters?: IncidentFilters): Observable<SafetyIncident[]> {
    let filteredIncidents = [...this.mockSafetyIncidents];

    if (filters) {
      if (filters.incidentType?.length) {
        filteredIncidents = filteredIncidents.filter(incident =>
          filters.incidentType!.includes(incident.incidentType)
        );
      }

      if (filters.severity?.length) {
        filteredIncidents = filteredIncidents.filter(incident =>
          filters.severity!.includes(incident.severity)
        );
      }

      if (filters.status?.length) {
        filteredIncidents = filteredIncidents.filter(incident =>
          filters.status!.includes(incident.status)
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredIncidents = filteredIncidents.filter(incident =>
          incident.description.toLowerCase().includes(query) ||
          incident.passengerName.toLowerCase().includes(query) ||
          incident.driverName?.toLowerCase().includes(query)
        );
      }
    }

    return of(filteredIncidents).pipe(delay(500));
  }

  takeIncidentAction(incidentId: string, actionData: Partial<IncidentAction>): Observable<SafetyIncident> {
    const incident = this.mockSafetyIncidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = 'resolved';
      incident.updatedAt = new Date();
    }
    return of(incident!).pipe(delay(300));
  }

  // Analytics Methods
  getCustomerSupportAnalytics(): Observable<CustomerSupportAnalytics> {
    const analytics: CustomerSupportAnalytics = {
      ticketSummary: {
        totalTickets: this.mockSupportTickets.length,
        openTickets: this.mockSupportTickets.filter(t => t.status === 'open').length,
        inProgressTickets: this.mockSupportTickets.filter(t => t.status === 'in_progress').length,
        resolvedTickets: this.mockSupportTickets.filter(t => t.status === 'resolved').length,
        closedTickets: this.mockSupportTickets.filter(t => t.status === 'closed').length,
        escalatedTickets: this.mockSupportTickets.filter(t => t.status === 'escalated').length,
        averageResolutionTime: 24,
        satisfactionScore: 4.2,
        ticketsByCategory: {
          billing: this.mockSupportTickets.filter(t => t.category === 'billing').length,
          service: this.mockSupportTickets.filter(t => t.category === 'service').length,
          safety: this.mockSupportTickets.filter(t => t.category === 'safety').length,
          technical: this.mockSupportTickets.filter(t => t.category === 'technical').length,
          general: this.mockSupportTickets.filter(t => t.category === 'general').length
        },
        ticketsByPriority: {
          low: this.mockSupportTickets.filter(t => t.priority === 'low').length,
          medium: this.mockSupportTickets.filter(t => t.priority === 'medium').length,
          high: this.mockSupportTickets.filter(t => t.priority === 'high').length,
          critical: this.mockSupportTickets.filter(t => t.priority === 'critical').length
        }
      },
      refundSummary: {
        totalRefunds: this.mockRefundRequests.length,
        pendingRefunds: this.mockRefundRequests.filter(r => r.status === 'pending').length,
        approvedRefunds: this.mockRefundRequests.filter(r => r.status === 'approved').length,
        completedRefunds: this.mockRefundRequests.filter(r => r.status === 'completed').length,
        rejectedRefunds: this.mockRefundRequests.filter(r => r.status === 'rejected').length,
        totalRefundAmount: this.mockRefundRequests.reduce((sum, r) => sum + r.refundAmount, 0),
        averageRefundAmount: this.mockRefundRequests.length > 0 ? 
          this.mockRefundRequests.reduce((sum, r) => sum + r.refundAmount, 0) / this.mockRefundRequests.length : 0,
        averageProcessingTime: 48,
        refundsByReason: {
          fare_overcharge: this.mockRefundRequests.filter(r => r.refundReason === 'fare_overcharge').length,
          service_failure: this.mockRefundRequests.filter(r => r.refundReason === 'service_failure').length,
          cancellation: this.mockRefundRequests.filter(r => r.refundReason === 'cancellation').length,
          duplicate_charge: this.mockRefundRequests.filter(r => r.refundReason === 'duplicate_charge').length,
          technical_error: this.mockRefundRequests.filter(r => r.refundReason === 'technical_error').length,
          other: this.mockRefundRequests.filter(r => r.refundReason === 'other').length
        },
        refundsByMethod: {
          original_payment: this.mockRefundRequests.filter(r => r.refundMethod === 'original_payment').length,
          wallet: this.mockRefundRequests.filter(r => r.refundMethod === 'wallet').length,
          bank_transfer: this.mockRefundRequests.filter(r => r.refundMethod === 'bank_transfer').length,
          check: this.mockRefundRequests.filter(r => r.refundMethod === 'check').length
        }
      },
      incidentSummary: {
        totalIncidents: this.mockSafetyIncidents.length,
        reportedIncidents: this.mockSafetyIncidents.filter(i => i.status === 'reported').length,
        underInvestigationIncidents: this.mockSafetyIncidents.filter(i => i.status === 'under_investigation').length,
        resolvedIncidents: this.mockSafetyIncidents.filter(i => i.status === 'resolved').length,
        escalatedIncidents: this.mockSafetyIncidents.filter(i => i.status === 'escalated').length,
        averageResolutionTime: 72,
        incidentsByType: {
          driver_misconduct: this.mockSafetyIncidents.filter(i => i.incidentType === 'driver_misconduct').length,
          reckless_driving: this.mockSafetyIncidents.filter(i => i.incidentType === 'reckless_driving').length,
          harassment: this.mockSafetyIncidents.filter(i => i.incidentType === 'harassment').length,
          accident: this.mockSafetyIncidents.filter(i => i.incidentType === 'accident').length,
          theft: this.mockSafetyIncidents.filter(i => i.incidentType === 'theft').length,
          violence: this.mockSafetyIncidents.filter(i => i.incidentType === 'violence').length,
          other: this.mockSafetyIncidents.filter(i => i.incidentType === 'other').length
        },
        incidentsBySeverity: {
          low: this.mockSafetyIncidents.filter(i => i.severity === 'low').length,
          medium: this.mockSafetyIncidents.filter(i => i.severity === 'medium').length,
          high: this.mockSafetyIncidents.filter(i => i.severity === 'high').length,
          critical: this.mockSafetyIncidents.filter(i => i.severity === 'critical').length
        }
      },
      passengerSatisfaction: {
        averageRating: 4.2,
        responseTime: 2.5,
        resolutionTime: 18.5,
        escalationRate: 12.5
      },
      trends: {
        ticketVolume: [
          { date: new Date('2024-01-01'), count: 15 },
          { date: new Date('2024-01-02'), count: 12 },
          { date: new Date('2024-01-03'), count: 18 }
        ],
        refundVolume: [
          { date: new Date('2024-01-01'), count: 3, amount: 150.50 },
          { date: new Date('2024-01-02'), count: 2, amount: 89.25 },
          { date: new Date('2024-01-03'), count: 4, amount: 220.75 }
        ],
        incidentVolume: [
          { date: new Date('2024-01-01'), count: 2 },
          { date: new Date('2024-01-02'), count: 1 },
          { date: new Date('2024-01-03'), count: 3 }
        ]
      }
    };

    return of(analytics).pipe(delay(500));
  }

  // Export Methods
  exportTicketsToCSV(): Observable<string> {
    const csvHeader = 'Ticket ID,Ticket Number,Passenger,Type,Priority,Status,Subject,Created Date,Resolved Date\n';
    const csvData = this.mockSupportTickets.map(ticket => 
      `${ticket.id},${ticket.ticketNumber},${ticket.passengerName},${ticket.type},${ticket.priority},${ticket.status},"${ticket.subject}",${ticket.createdAt.toISOString()},${ticket.resolvedAt?.toISOString() || ''}`
    ).join('\n');
    
    return of(csvHeader + csvData).pipe(delay(1000));
  }

  exportRefundsToCSV(): Observable<string> {
    const csvHeader = 'Refund ID,Passenger,Ride ID,Type,Reason,Original Amount,Refund Amount,Status,Request Date\n';
    const csvData = this.mockRefundRequests.map(refund => 
      `${refund.id},${refund.passengerName},${refund.rideId},${refund.refundType},${refund.refundReason},${refund.originalAmount},${refund.refundAmount},${refund.status},${refund.createdAt.toISOString()}`
    ).join('\n');
    
    return of(csvHeader + csvData).pipe(delay(1000));
  }

  exportIncidentsToCSV(): Observable<string> {
    const csvHeader = 'Incident ID,Incident Number,Passenger,Driver,Type,Severity,Status,Description,Report Date\n';
    const csvData = this.mockSafetyIncidents.map(incident => 
      `${incident.id},${incident.incidentNumber},${incident.passengerName},${incident.driverName},${incident.incidentType},${incident.severity},${incident.status},"${incident.description}",${incident.reportedTime.toISOString()}`
    ).join('\n');
    
    return of(csvHeader + csvData).pipe(delay(1000));
  }
}
