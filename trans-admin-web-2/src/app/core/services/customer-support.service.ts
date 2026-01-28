import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  SupportTicket, 
  RefundRequest, 
  SafetyIncident,
  CustomerSupportAnalytics,
  SupportFilters,
  RefundFilters,
  IncidentFilters
} from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerSupportService {

  // Mock data for support tickets
  private mockTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      ticketNumber: 'SUP-2024-001',
      passengerId: 'P001',
      passengerName: 'John Smith',
      passengerEmail: 'john.smith@email.com',
      passengerPhone: '+1234567890',
      rideId: 'R001',
      type: 'fare_dispute',
      category: 'billing',
      priority: 'high',
      status: 'open',
      subject: 'Overcharged for ride',
      description: 'I was charged $50 for a ride that should have been $25 according to the app estimate.',
      attachments: [],
      resolution: '',
      resolutionNotes: '',
      assignedTo: 'ADMIN001',
      assignedAgent: 'Admin User',
      internalNotes: [],
      statusHistory: [],
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 'TKT-002',
      ticketNumber: 'SUP-2024-002',
      passengerId: 'P002',
      passengerName: 'Jane Doe',
      passengerEmail: 'jane.doe@email.com',
      passengerPhone: '+1987654321',
      type: 'service_complaint',
      category: 'service',
      priority: 'medium',
      status: 'in_progress',
      subject: 'Driver arrived late',
      description: 'Driver was 15 minutes late without any notification.',
      attachments: [],
      internalNotes: [],
      statusHistory: [],
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
    }
  ];

  getSupportTickets(filters?: SupportFilters): Observable<SupportTicket[]> {
    let filteredTickets = [...this.mockTickets];
    
    if (filters) {
      if (filters.status?.length) {
        filteredTickets = filteredTickets.filter(ticket => filters.status!.includes(ticket.status));
      }
      if (filters.type?.length) {
        filteredTickets = filteredTickets.filter(ticket => filters.type!.includes(ticket.type));
      }
      if (filters.priority?.length) {
        filteredTickets = filteredTickets.filter(ticket => filters.priority!.includes(ticket.priority));
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.subject.toLowerCase().includes(query) ||
          ticket.passengerName.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query)
        );
      }
    }
    
    return of(filteredTickets).pipe(delay(300));
  }

  assignTicket(ticketId: string, assignedTo: string, assigneeName: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  closeTicket(ticketId: string, resolution: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  // Mock data for refund requests
  private mockRefunds: RefundRequest[] = [
    {
      id: 'REF-001',
      refundNumber: 'REF-2024-001',
      passengerId: 'P001',
      passengerName: 'John Smith',
      rideId: 'R001',
      originalTransactionId: 'TXN-001',
      refundType: 'partial',
      refundMethod: 'original_payment',
      originalAmount: 25.00,
      refundAmount: 10.00,
      refundReason: 'fare_overcharge',
      description: 'Overcharged due to surge pricing error',
      justification: 'Customer was charged surge pricing incorrectly during non-peak hours.',
      status: 'pending',
      paymentDetails: {
        originalPaymentMethod: 'credit_card',
        originalPaymentId: 'PAY-001',
        refundPaymentMethod: 'original_payment',
        processingFee: 0,
        netRefundAmount: 10.00
      },
      attachments: [],
      auditTrail: [],
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 'REF-002',
      refundNumber: 'REF-2024-002',
      passengerId: 'P003',
      passengerName: 'Mike Johnson',
      originalTransactionId: 'TXN-002',
      refundType: 'full',
      refundMethod: 'wallet',
      originalAmount: 35.00,
      refundAmount: 35.00,
      refundReason: 'service_failure',
      description: 'Driver cancelled after passenger wait time',
      justification: 'Driver cancelled ride after customer waited 10 minutes.',
      status: 'approved',
      approvedBy: 'ADMIN001',
      approverName: 'Admin User',
      paymentDetails: {
        originalPaymentMethod: 'wallet',
        originalPaymentId: 'PAY-002',
        refundPaymentMethod: 'wallet',
        walletId: 'W003',
        processingFee: 0,
        netRefundAmount: 35.00
      },
      attachments: [],
      auditTrail: [],
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
      approvedAt: new Date(Date.now() - 3600000), // 1 hour ago
    }
  ];

  getRefundRequests(filters?: RefundFilters): Observable<RefundRequest[]> {
    let filteredRefunds = [...this.mockRefunds];
    
    if (filters) {
      if (filters.status?.length) {
        filteredRefunds = filteredRefunds.filter(refund => filters.status!.includes(refund.status));
      }
      if (filters.refundType?.length) {
        filteredRefunds = filteredRefunds.filter(refund => filters.refundType!.includes(refund.refundType));
      }
      if (filters.refundReason?.length) {
        filteredRefunds = filteredRefunds.filter(refund => filters.refundReason!.includes(refund.refundReason));
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredRefunds = filteredRefunds.filter(refund => 
          refund.passengerName.toLowerCase().includes(query) ||
          refund.description.toLowerCase().includes(query)
        );
      }
    }
    
    return of(filteredRefunds).pipe(delay(300));
  }

  processRefund(refundId: string, processingNotes: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  // Mock data for safety incidents
  private mockIncidents: SafetyIncident[] = [
    {
      id: 'INC-001',
      incidentNumber: 'SAF-2024-001',
      passengerId: 'P004',
      passengerName: 'David Lee',
      driverId: 'D001',
      driverName: 'Robert Johnson',
      rideId: 'R003',
      vehicleId: 'V001',
      incidentType: 'driver_misconduct',
      severity: 'high',
      status: 'under_investigation',
      title: 'Reckless driving complaint',
      description: 'Driver was speeding and making unsafe lane changes during the ride.',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY 10001'
      },
      incidentTime: new Date(Date.now() - 259200000), // 3 days ago
      reportedTime: new Date(Date.now() - 172800000), // 2 days ago
      witnesses: [],
      evidence: [],
      investigationNotes: [],
      actions: [],
      followUpRequired: true,
      reportedBy: 'P004',
      reporterName: 'David Lee',
      assignedInvestigator: 'ADMIN001',
      investigatorName: 'Admin User',
      legalAction: false,
      statusHistory: [],
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: 'INC-002',
      incidentNumber: 'SAF-2024-002',
      passengerId: 'P005',
      passengerName: 'Sarah Wilson',
      driverId: 'D002',
      driverName: 'Tom Anderson',
      incidentType: 'harassment',
      severity: 'medium',
      status: 'resolved',
      title: 'Inappropriate behavior',
      description: 'Driver made inappropriate comments during the ride.',
      location: {
        latitude: 40.7580,
        longitude: -73.9855,
        address: '456 Broadway, New York, NY 10013'
      },
      incidentTime: new Date(Date.now() - 432000000), // 5 days ago
      reportedTime: new Date(Date.now() - 345600000), // 4 days ago
      witnesses: [],
      evidence: [],
      investigationNotes: [],
      actions: [{
        id: 'ACT-001',
        action: 'Driver warning issued',
        actionType: 'warning',
        targetType: 'driver',
        targetId: 'D002',
        description: 'Formal warning issued for inappropriate behavior',
        takenBy: 'ADMIN001',
        takenByName: 'Admin User',
        completedAt: new Date(Date.now() - 86400000),
        createdAt: new Date(Date.now() - 86400000)
      }],
      outcome: 'Driver received formal warning and completed sensitivity training',
      followUpRequired: false,
      reportedBy: 'P005',
      reporterName: 'Sarah Wilson',
      legalAction: false,
      statusHistory: [],
      createdAt: new Date(Date.now() - 345600000), // 4 days ago
      updatedAt: new Date(Date.now() - 86400000), // 1 day ago
      resolvedAt: new Date(Date.now() - 86400000), // 1 day ago
    }
  ];

  getSafetyIncidents(filters?: IncidentFilters): Observable<SafetyIncident[]> {
    let filteredIncidents = [...this.mockIncidents];
    
    if (filters) {
      if (filters.status?.length) {
        filteredIncidents = filteredIncidents.filter(incident => filters.status!.includes(incident.status));
      }
      if (filters.incidentType?.length) {
        filteredIncidents = filteredIncidents.filter(incident => filters.incidentType!.includes(incident.incidentType));
      }
      if (filters.severity?.length) {
        filteredIncidents = filteredIncidents.filter(incident => filters.severity!.includes(incident.severity));
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredIncidents = filteredIncidents.filter(incident => 
          incident.title.toLowerCase().includes(query) ||
          incident.passengerName.toLowerCase().includes(query) ||
          incident.driverName?.toLowerCase().includes(query) ||
          incident.description.toLowerCase().includes(query)
        );
      }
    }
    
    return of(filteredIncidents).pipe(delay(300));
  }

  takeIncidentAction(incidentId: string, actionData: any): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  getCustomerSupportAnalytics(): Observable<CustomerSupportAnalytics> {
    return of({
      ticketSummary: {
        totalTickets: this.mockTickets.length,
        openTickets: this.mockTickets.filter(t => t.status === 'open').length,
        inProgressTickets: this.mockTickets.filter(t => t.status === 'in_progress').length,
        resolvedTickets: this.mockTickets.filter(t => t.status === 'resolved').length,
        closedTickets: this.mockTickets.filter(t => t.status === 'closed').length,
        escalatedTickets: this.mockTickets.filter(t => t.status === 'escalated').length,
        averageResolutionTime: 24,
        satisfactionScore: 4.2,
        ticketsByCategory: {
          billing: this.mockTickets.filter(t => t.category === 'billing').length,
          service: this.mockTickets.filter(t => t.category === 'service').length,
          safety: this.mockTickets.filter(t => t.category === 'safety').length,
          technical: this.mockTickets.filter(t => t.category === 'technical').length,
          general: this.mockTickets.filter(t => t.category === 'general').length
        },
        ticketsByPriority: {
          low: this.mockTickets.filter(t => t.priority === 'low').length,
          medium: this.mockTickets.filter(t => t.priority === 'medium').length,
          high: this.mockTickets.filter(t => t.priority === 'high').length,
          critical: this.mockTickets.filter(t => t.priority === 'critical').length
        }
      },
      refundSummary: {
        totalRefunds: this.mockRefunds.length,
        pendingRefunds: this.mockRefunds.filter(r => r.status === 'pending').length,
        approvedRefunds: this.mockRefunds.filter(r => r.status === 'approved').length,
        completedRefunds: this.mockRefunds.filter(r => r.status === 'completed').length,
        rejectedRefunds: this.mockRefunds.filter(r => r.status === 'rejected').length,
        totalRefundAmount: this.mockRefunds.reduce((sum, r) => sum + r.refundAmount, 0),
        averageRefundAmount: this.mockRefunds.length > 0 ? 
          this.mockRefunds.reduce((sum, r) => sum + r.refundAmount, 0) / this.mockRefunds.length : 0,
        averageProcessingTime: 48,
        refundsByReason: {
          fare_overcharge: this.mockRefunds.filter(r => r.refundReason === 'fare_overcharge').length,
          service_failure: this.mockRefunds.filter(r => r.refundReason === 'service_failure').length,
          cancellation: this.mockRefunds.filter(r => r.refundReason === 'cancellation').length,
          duplicate_charge: this.mockRefunds.filter(r => r.refundReason === 'duplicate_charge').length,
          technical_error: this.mockRefunds.filter(r => r.refundReason === 'technical_error').length,
          other: this.mockRefunds.filter(r => r.refundReason === 'other').length
        },
        refundsByMethod: {
          original_payment: this.mockRefunds.filter(r => r.refundMethod === 'original_payment').length,
          wallet: this.mockRefunds.filter(r => r.refundMethod === 'wallet').length,
          bank_transfer: this.mockRefunds.filter(r => r.refundMethod === 'bank_transfer').length,
          check: this.mockRefunds.filter(r => r.refundMethod === 'check').length
        }
      },
      incidentSummary: {
        totalIncidents: this.mockIncidents.length,
        reportedIncidents: this.mockIncidents.filter(i => i.status === 'reported').length,
        underInvestigationIncidents: this.mockIncidents.filter(i => i.status === 'under_investigation').length,
        resolvedIncidents: this.mockIncidents.filter(i => i.status === 'resolved').length,
        escalatedIncidents: this.mockIncidents.filter(i => i.status === 'escalated').length,
        averageResolutionTime: 72,
        incidentsByType: {
          driver_misconduct: this.mockIncidents.filter(i => i.incidentType === 'driver_misconduct').length,
          reckless_driving: this.mockIncidents.filter(i => i.incidentType === 'reckless_driving').length,
          harassment: this.mockIncidents.filter(i => i.incidentType === 'harassment').length,
          accident: this.mockIncidents.filter(i => i.incidentType === 'accident').length,
          theft: this.mockIncidents.filter(i => i.incidentType === 'theft').length,
          violence: this.mockIncidents.filter(i => i.incidentType === 'violence').length,
          other: this.mockIncidents.filter(i => i.incidentType === 'other').length
        },
        incidentsBySeverity: {
          low: this.mockIncidents.filter(i => i.severity === 'low').length,
          medium: this.mockIncidents.filter(i => i.severity === 'medium').length,
          high: this.mockIncidents.filter(i => i.severity === 'high').length,
          critical: this.mockIncidents.filter(i => i.severity === 'critical').length
        }
      },
      passengerSatisfaction: {
        averageRating: 4.2,
        responseTime: 2.5,
        resolutionTime: 24,
        escalationRate: 5.2
      },
      trends: {
        ticketVolume: [
          { date: new Date(Date.now() - 604800000), count: 15 },
          { date: new Date(Date.now() - 518400000), count: 18 },
          { date: new Date(Date.now() - 432000000), count: 12 },
          { date: new Date(Date.now() - 345600000), count: 20 },
          { date: new Date(Date.now() - 259200000), count: 16 },
          { date: new Date(Date.now() - 172800000), count: 14 },
          { date: new Date(Date.now() - 86400000), count: 22 }
        ],
        refundVolume: [
          { date: new Date(Date.now() - 604800000), count: 5, amount: 125.50 },
          { date: new Date(Date.now() - 518400000), count: 7, amount: 185.25 },
          { date: new Date(Date.now() - 432000000), count: 3, amount: 75.00 },
          { date: new Date(Date.now() - 345600000), count: 8, amount: 220.75 },
          { date: new Date(Date.now() - 259200000), count: 4, amount: 95.50 },
          { date: new Date(Date.now() - 172800000), count: 6, amount: 150.00 },
          { date: new Date(Date.now() - 86400000), count: 9, amount: 245.25 }
        ],
        incidentVolume: [
          { date: new Date(Date.now() - 604800000), count: 2 },
          { date: new Date(Date.now() - 518400000), count: 1 },
          { date: new Date(Date.now() - 432000000), count: 3 },
          { date: new Date(Date.now() - 345600000), count: 1 },
          { date: new Date(Date.now() - 259200000), count: 2 },
          { date: new Date(Date.now() - 172800000), count: 1 },
          { date: new Date(Date.now() - 86400000), count: 0 }
        ]
      }
    }).pipe(delay(500));
  }

  exportTicketsToCSV(): Observable<string> {
    return of('Ticket ID,Subject,Status\nTKT-001,Sample Ticket,Open\n').pipe(delay(1000));
  }

  exportRefundsToCSV(): Observable<string> {
    return of('Refund ID,Amount,Status\nREF-001,10.00,Pending\n').pipe(delay(1000));
  }

  exportIncidentsToCSV(): Observable<string> {
    return of('Incident ID,Type,Status\nINC-001,Sample,Open\n').pipe(delay(1000));
  }
}
