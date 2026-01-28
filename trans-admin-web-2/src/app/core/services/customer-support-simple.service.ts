import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  SupportTicket,
  RefundRequest,
  SafetyIncident,
  CustomerSupportAnalytics,
  TicketFilters,
  IncidentFilters,
  RefundFilters
} from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerSupportService {

  // Simplified mock data 
  private mockSupportTickets: SupportTicket[] = [];
  private mockRefundRequests: RefundRequest[] = [];
  private mockSafetyIncidents: SafetyIncident[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with minimal valid data
    this.mockSupportTickets = [
      {
        id: 'TKT-001',
        ticketNumber: 'SUP-2024-001',
        passengerId: 'pass-001',
        passengerName: 'John Smith',
        passengerEmail: 'john.smith@email.com',
        passengerPhone: '+1234567890',
        type: 'fare_dispute',
        category: 'billing',
        priority: 'high',
        status: 'open',
        subject: 'Overcharged for ride',
        description: 'I was charged more than expected',
        attachments: [],
        internalNotes: [],
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Support Ticket Methods
  getSupportTickets(filters?: TicketFilters): Observable<SupportTicket[]> {
    return of(this.mockSupportTickets).pipe(delay(300));
  }

  assignTicket(ticketId: string, assignedTo: string, assigneeName: string): Observable<SupportTicket> {
    const ticket = this.mockSupportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.assignedTo = assignedTo;
      ticket.assignedAgent = assigneeName;
      ticket.updatedAt = new Date();
    }
    return of(ticket || this.mockSupportTickets[0]).pipe(delay(300));
  }

  closeTicket(ticketId: string, resolution: string): Observable<SupportTicket> {
    const ticket = this.mockSupportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.resolution = resolution;
      ticket.resolvedAt = new Date();
      ticket.updatedAt = new Date();
    }
    return of(ticket || this.mockSupportTickets[0]).pipe(delay(300));
  }

  // Refund Methods
  getRefundRequests(filters?: RefundFilters): Observable<RefundRequest[]> {
    return of(this.mockRefundRequests).pipe(delay(300));
  }

  processRefund(refundId: string, processingNotes: string): Observable<RefundRequest> {
    // Return empty array first element or create a minimal mock
    const mockRefund: RefundRequest = {
      id: refundId,
      refundNumber: 'REF-001',
      passengerId: 'pass-001',
      passengerName: 'Mock User',
      originalTransactionId: 'txn-001',
      refundType: 'partial',
      refundMethod: 'original_payment',
      originalAmount: 25.00,
      refundAmount: 10.00,
      refundReason: 'fare_overcharge',
      description: 'Mock refund',
      justification: 'Mock justification',
      status: 'processing',
      paymentDetails: {
        originalPaymentMethod: 'credit_card',
        originalPaymentId: 'pay_123',
        refundPaymentMethod: 'credit_card',
        processingFee: 0,
        netRefundAmount: 10.00
      },
      attachments: [],
      auditTrail: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return of(mockRefund).pipe(delay(300));
  }

  // Safety Incident Methods
  getSafetyIncidents(filters?: IncidentFilters): Observable<SafetyIncident[]> {
    return of(this.mockSafetyIncidents).pipe(delay(300));
  }

  takeIncidentAction(incidentId: string, actionData: any): Observable<SafetyIncident> {
    const mockIncident: SafetyIncident = {
      id: incidentId,
      incidentNumber: 'INC-001',
      passengerId: 'pass-001',
      passengerName: 'Mock User',
      driverId: 'drv-001',
      driverName: 'Mock Driver',
      rideId: 'ride-001',
      vehicleId: 'veh-001',
      incidentType: 'driver_misconduct',
      severity: 'medium',
      status: 'resolved',
      title: 'Mock Incident Title',
      description: 'Mock incident',
      location: {
        latitude: 0,
        longitude: 0,
        address: 'Mock Address'
      },
      incidentTime: new Date(),
      reportedTime: new Date(),
      witnesses: [],
      evidence: [],
      investigationNotes: [],
      actions: [],
      outcome: 'Resolved',
      outcomeNotes: 'Issue resolved satisfactorily',
      followUpRequired: false,
      followUpNotes: undefined,
      reportedBy: 'pass-001',
      reporterName: 'Mock User',
      assignedInvestigator: 'inv-001',
      investigatorName: 'Mock Investigator',
      policeReportNumber: undefined,
      insuranceClaimNumber: undefined,
      legalAction: false,
      legalNotes: undefined,
      statusHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return of(mockIncident).pipe(delay(300));
  }

  // Analytics Methods
  getCustomerSupportAnalytics(): Observable<CustomerSupportAnalytics> {
    const analytics: CustomerSupportAnalytics = {
      ticketSummary: {
        totalTickets: 1,
        openTickets: 1,
        inProgressTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
        escalatedTickets: 0,
        averageResolutionTime: 24,
        satisfactionScore: 4.2,
        ticketsByCategory: {
          billing: 1,
          service: 0,
          safety: 0,
          technical: 0,
          general: 0
        },
        ticketsByPriority: {
          low: 0,
          medium: 0,
          high: 1,
          critical: 0
        }
      },
      refundSummary: {
        totalRefunds: 0,
        pendingRefunds: 0,
        approvedRefunds: 0,
        completedRefunds: 0,
        rejectedRefunds: 0,
        totalRefundAmount: 0,
        averageRefundAmount: 0,
        averageProcessingTime: 48,
        refundsByReason: {
          fare_overcharge: 0,
          service_failure: 0,
          cancellation: 0,
          duplicate_charge: 0,
          technical_error: 0,
          other: 0
        },
        refundsByMethod: {
          original_payment: 0,
          wallet: 0,
          bank_transfer: 0,
          check: 0
        }
      },
      incidentSummary: {
        totalIncidents: 0,
        reportedIncidents: 0,
        underInvestigationIncidents: 0,
        resolvedIncidents: 0,
        escalatedIncidents: 0,
        averageResolutionTime: 72,
        incidentsByType: {
          driver_misconduct: 0,
          reckless_driving: 0,
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
          critical: 0
        }
      },
      passengerSatisfaction: {
        averageRating: 4.0,
        responseTime: 2.0,
        resolutionTime: 24.0,
        escalationRate: 10.0
      },
      trends: {
        ticketVolume: [],
        refundVolume: [],
        incidentVolume: []
      }
    };

    return of(analytics).pipe(delay(500));
  }

  // Export Methods
  exportTicketsToCSV(): Observable<string> {
    const csvData = 'Ticket ID,Subject,Status\nTKT-001,Sample Ticket,Open\n';
    return of(csvData).pipe(delay(1000));
  }

  exportRefundsToCSV(): Observable<string> {
    const csvData = 'Refund ID,Amount,Status\nREF-001,10.00,Pending\n';
    return of(csvData).pipe(delay(1000));
  }

  exportIncidentsToCSV(): Observable<string> {
    const csvData = 'Incident ID,Type,Status\nINC-001,Sample,Open\n';
    return of(csvData).pipe(delay(1000));
  }
}
