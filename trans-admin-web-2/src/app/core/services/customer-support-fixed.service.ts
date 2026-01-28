import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
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
export class CustomerSupportFixedService {

  // Mock data for comprehensive testing
  private mockSupportTickets: SupportTicket[] = [
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
      description: 'I was charged ₹850 for a ride that should have cost ₹650. The driver took a longer route without my consent.',
      attachments: [
        {
          id: 'att-001',
          filename: 'fare_receipt.png',
          url: '/assets/evidence/fare_receipt.png',
          fileType: 'image/png',
          fileSize: 256000,
          uploadedBy: 'pass-001',
          uploadedAt: new Date('2024-10-25T10:30:00')
        }
      ],
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
      description: 'I accidentally left my iPhone in the car after my ride yesterday evening. The driver is not responding to calls.',
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
      description: 'The driver was continuously using his phone throughout the journey, ignoring traffic signals and driving recklessly.',
      attachments: [
        {
          id: 'att-002',
          filename: 'driver_phone_usage.mp4',
          url: '/assets/evidence/driver_phone_usage.mp4',
          fileType: 'video/mp4',
          fileSize: 5120000,
          uploadedBy: 'pass-003',
          uploadedAt: new Date('2024-10-23T16:45:00')
        }
      ],
      assignedTo: 'admin-003',
      assignedAgent: 'Jennifer Lee',
      internalNotes: [],
      statusHistory: [],
      createdAt: new Date('2024-10-23T16:30:00'),
      updatedAt: new Date('2024-10-25T09:15:00')
    }
  ];

  private mockRefundRequests: RefundRequest[] = [
    {
      id: 'refund-001',
      refundNumber: 'REF-2024-001',
      passengerId: 'pass-001',
      passengerName: 'John Smith',
      rideId: 'ride-001',
      originalTransactionId: 'TXN-001',
      refundType: 'partial',
      originalAmount: 850,
      refundAmount: 150,
      refundReason: 'fare_overcharge',
      description: 'Overcharged due to surge pricing error',
      justification: 'Driver took longer route, partial refund approved for difference',
      refundMethod: 'original_payment',
      status: 'processing',
      processedBy: 'admin-001',
      processingNotes: 'Approved after investigation, processing refund to original card',
      paymentDetails: {
        originalPaymentMethod: 'Visa **** 4532',
        originalPaymentId: 'PAY-001',
        refundPaymentMethod: 'original_payment',
        refundPaymentId: 'REF-PAY-001',
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
      originalTransactionId: 'TXN-002',
      refundType: 'full',
      originalAmount: 420,
      refundAmount: 420,
      refundReason: 'cancellation',
      description: 'Emergency cancellation due to family emergency',
      justification: 'Full refund approved due to emergency circumstances',
      refundMethod: 'wallet',
      status: 'completed',
      processedBy: 'admin-002',
      processingNotes: 'Emergency cancellation case, full refund approved',
      paymentDetails: {
        originalPaymentMethod: 'Wallet Balance',
        originalPaymentId: 'WALLET-001',
        refundPaymentMethod: 'wallet',
        walletId: 'WALLET-004',
        processingFee: 0,
        netRefundAmount: 420
      },
      attachments: [],
      auditTrail: [],
      createdAt: new Date('2024-10-24T12:15:00'),
      updatedAt: new Date('2024-10-24T14:20:00'),
      completedAt: new Date('2024-10-24T14:20:00')
    }
  ];

  private mockSafetyIncidents: SafetyIncident[] = [
    {
      id: 'incident-001',
      incidentNumber: 'INC-2024-001',
      passengerId: 'pass-003',
      passengerName: 'David Wilson',
      driverId: 'drv-003',
      driverName: 'Raj Kumar',
      rideId: 'ride-003',
      vehicleId: 'veh-003',
      incidentType: 'reckless_driving',
      severity: 'critical',
      status: 'under_investigation',
      title: 'Reckless driving incident on MG Road',
      description: 'Driver was using phone while driving and ran a red light, endangering passenger safety',
      location: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'MG Road, Bangalore'
      },
      incidentTime: new Date('2024-10-23T16:30:00'),
      reportedTime: new Date('2024-10-23T17:00:00'),
      witnesses: [
        {
          id: 'witness-001',
          name: 'Traffic Police Constable Sharma',
          contactNumber: '+91-9876543210',
          statement: 'Observed the vehicle running red light at MG Road junction at 16:35.',
          contactedAt: new Date('2024-10-23T17:00:00'),
          contactedBy: 'admin-003'
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
          action: 'Driver suspended for 7 days',
          actionType: 'suspension',
          targetType: 'driver',
          targetId: 'drv-003',
          description: 'Driver suspended for 7 days pending investigation completion',
          takenBy: 'admin-003',
          takenByName: 'Jennifer Lee',
          effectiveDate: new Date('2024-10-23T18:00:00'),
          completedAt: new Date('2024-10-23T18:15:00'),
          createdAt: new Date('2024-10-23T18:00:00')
        }
      ],
      followUpRequired: true,
      followUpNotes: 'Follow up scheduled for driver training completion verification',
      reportedBy: 'pass-003',
      reporterName: 'Michael Brown',
      assignedInvestigator: 'admin-003',
      investigatorName: 'Jennifer Lee',
      legalAction: false,
      statusHistory: [],
      createdAt: new Date('2024-10-23T16:45:00'),
      updatedAt: new Date('2024-10-25T10:30:00')
    }
  ];

  constructor() { }

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

      if (filters.dateRange) {
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.createdAt >= filters.dateRange!.startDate && 
          ticket.createdAt <= filters.dateRange!.endDate
        );
      }
    }

    return of(filteredTickets).pipe(delay(500));
  }

  getSupportTicketById(ticketId: string): Observable<SupportTicket> {
    const ticket = this.mockSupportTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return of(ticket).pipe(delay(300));
  }

  createSupportTicket(ticket: Partial<SupportTicket>): Observable<SupportTicket> {
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT-2024-${String(this.mockSupportTickets.length + 1).padStart(3, '0')}`,
      passengerId: ticket.passengerId!,
      passengerName: ticket.passengerName!,
      passengerEmail: ticket.passengerEmail!,
      passengerPhone: ticket.passengerPhone!,
      rideId: ticket.rideId,
      type: ticket.type!,
      category: ticket.category!,
      priority: ticket.priority || 'medium',
      status: 'open',
      subject: ticket.subject!,
      description: ticket.description!,
      attachments: ticket.attachments || [],
      internalNotes: [],
      statusHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockSupportTickets.push(newTicket);
    return of(newTicket).pipe(delay(500));
  }

  updateSupportTicket(ticketId: string, updates: Partial<SupportTicket>): Observable<SupportTicket> {
    const ticketIndex = this.mockSupportTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    this.mockSupportTickets[ticketIndex] = {
      ...this.mockSupportTickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.mockSupportTickets[ticketIndex]).pipe(delay(300));
  }

  assignTicket(ticketId: string, assigneeId: string, assigneeName: string): Observable<SupportTicket> {
    return this.updateSupportTicket(ticketId, {
      assignedTo: assigneeId,
      assignedAgent: assigneeName,
      status: 'in_progress'
    });
  }

  closeTicket(ticketId: string, resolution: string): Observable<SupportTicket> {
    return this.updateSupportTicket(ticketId, {
      status: 'resolved',
      resolution: resolution,
      resolvedAt: new Date()
    });
  }

  // Refund Processing Methods
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

      if (filters.amountRange) {
        filteredRefunds = filteredRefunds.filter(refund => 
          refund.refundAmount >= filters.amountRange!.min && 
          refund.refundAmount <= filters.amountRange!.max
        );
      }
    }

    return of(filteredRefunds).pipe(delay(500));
  }

  createRefundRequest(refundData: Partial<RefundRequest>): Observable<RefundRequest> {
    const newRefund: RefundRequest = {
      id: `refund-${Date.now()}`,
      refundNumber: `REF-2024-${Date.now()}`,
      passengerId: refundData.passengerId!,
      passengerName: refundData.passengerName!,
      rideId: refundData.rideId,
      originalTransactionId: `TXN-${Date.now()}`,
      refundType: refundData.refundType!,
      originalAmount: refundData.originalAmount!,
      refundAmount: refundData.refundAmount!,
      refundReason: refundData.refundReason!,
      description: refundData.description || 'Refund request',
      justification: refundData.justification || 'Customer requested refund',
      refundMethod: refundData.refundMethod!,
      status: 'pending',
      paymentDetails: refundData.paymentDetails!,
      attachments: [],
      auditTrail: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockRefundRequests.push(newRefund);
    return of(newRefund).pipe(delay(500));
  }

  processRefund(refundId: string, processingNotes?: string): Observable<RefundRequest> {
    const refundIndex = this.mockRefundRequests.findIndex(r => r.id === refundId);
    if (refundIndex === -1) {
      throw new Error('Refund request not found');
    }

    this.mockRefundRequests[refundIndex] = {
      ...this.mockRefundRequests[refundIndex],
      status: 'processing',
      processingNotes: processingNotes,
      updatedAt: new Date()
    };

    return of(this.mockRefundRequests[refundIndex]).pipe(delay(1000));
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
    }

    return of(filteredIncidents).pipe(delay(500));
  }

  getSafetyIncidentById(incidentId: string): Observable<SafetyIncident> {
    const incident = this.mockSafetyIncidents.find(i => i.id === incidentId);
    if (!incident) {
      throw new Error('Safety incident not found');
    }
    return of(incident).pipe(delay(300));
  }

  createSafetyIncident(incidentData: Partial<SafetyIncident>): Observable<SafetyIncident> {
    const newIncident: SafetyIncident = {
      id: `incident-${Date.now()}`,
      incidentNumber: `INC-2024-${String(this.mockSafetyIncidents.length + 1).padStart(3, '0')}`,
      passengerId: incidentData.passengerId!,
      passengerName: incidentData.passengerName!,
      driverId: incidentData.driverId,
      driverName: incidentData.driverName,
      rideId: incidentData.rideId,
      vehicleId: incidentData.vehicleId,
      incidentType: incidentData.incidentType!,
      severity: incidentData.severity!,
      status: 'reported',
      title: incidentData.title || 'Safety Incident Report',
      description: incidentData.description!,
      location: incidentData.location!,
      incidentTime: incidentData.incidentTime!,
      reportedTime: new Date(),
      evidence: incidentData.evidence || [],
      witnesses: incidentData.witnesses || [],
      investigationNotes: [],
      actions: [],
      followUpRequired: true,
      reportedBy: incidentData.reportedBy!,
      reporterName: incidentData.reporterName || 'Unknown',
      assignedInvestigator: 'admin-001',
      investigatorName: 'Admin User',
      legalAction: false,
      statusHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockSafetyIncidents.push(newIncident);
    return of(newIncident).pipe(delay(500));
  }

  updateSafetyIncident(incidentId: string, updates: Partial<SafetyIncident>): Observable<SafetyIncident> {
    const incidentIndex = this.mockSafetyIncidents.findIndex(i => i.id === incidentId);
    if (incidentIndex === -1) {
      throw new Error('Safety incident not found');
    }

    this.mockSafetyIncidents[incidentIndex] = {
      ...this.mockSafetyIncidents[incidentIndex],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.mockSafetyIncidents[incidentIndex]).pipe(delay(300));
  }

  addIncidentAction(
    incidentId: string, 
    actionData: Partial<IncidentAction>
  ): Observable<SafetyIncident> {
    const incidentIndex = this.mockSafetyIncidents.findIndex(i => i.id === incidentId);
    if (incidentIndex === -1) {
      throw new Error('Safety incident not found');
    }

    const newAction: IncidentAction = {
      id: `action-${Date.now()}`,
      action: actionData.description || 'Action taken',
      actionType: actionData.actionType!,
      targetType: 'driver',
      targetId: actionData.targetId,
      description: actionData.description!,
      takenBy: 'admin-001',
      takenByName: 'Admin User',
      effectiveDate: actionData.effectiveDate || new Date(),
      completedAt: new Date(),
      createdAt: new Date()
    };

    this.mockSafetyIncidents[incidentIndex].actions.push(newAction);
    this.mockSafetyIncidents[incidentIndex].updatedAt = new Date();

    return of(this.mockSafetyIncidents[incidentIndex]).pipe(delay(300));
  }

  // Analytics and Reporting
  getSupportAnalytics(dateRange?: { startDate: Date; endDate: Date }): Observable<CustomerSupportAnalytics> {
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

    return of(analytics).pipe(delay(800));
  }

  // Export Functions
  exportTicketsData(filters?: TicketFilters): Observable<Blob> {
    return this.getSupportTickets(filters).pipe(
      map(tickets => {
        const csvData = this.convertToCSV(tickets, [
          'ticketNumber', 'passengerName', 'type', 'category', 'priority', 
          'status', 'subject', 'assignedAgent', 'createdAt', 'updatedAt'
        ]);
        return new Blob([csvData], { type: 'text/csv' });
      }),
      delay(1000)
    );
  }

  exportRefundsData(filters?: RefundFilters): Observable<Blob> {
    return this.getRefundRequests(filters).pipe(
      map(refunds => {
        const csvData = this.convertToCSV(refunds, [
          'passengerName', 'refundType', 'originalAmount', 'refundAmount', 
          'refundReason', 'refundMethod', 'status', 'createdAt'
        ]);
        return new Blob([csvData], { type: 'text/csv' });
      }),
      delay(1000)
    );
  }

  exportIncidentsData(filters?: IncidentFilters): Observable<Blob> {
    return this.getSafetyIncidents(filters).pipe(
      map(incidents => {
        const csvData = this.convertToCSV(incidents, [
          'incidentNumber', 'passengerName', 'driverName', 'incidentType', 
          'severity', 'status', 'description', 'incidentTime', 'createdAt'
        ]);
        return new Blob([csvData], { type: 'text/csv' });
      }),
      delay(1000)
    );
  }

  private convertToCSV(data: any[], columns: string[]): string {
    const headers = columns.join(',');
    const rows = data.map(item => {
      return columns.map(col => {
        let value = item[col];
        if (value instanceof Date) {
          value = value.toISOString();
        } else if (typeof value === 'string') {
          value = `"${value.replace(/"/g, '""')}"`;
        } else if (value === null || value === undefined) {
          value = '';
        }
        return value;
      }).join(',');
    });
    return [headers, ...rows].join('\n');
  }
}
