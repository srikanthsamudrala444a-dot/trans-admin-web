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
export class CustomerSupportSimpleService {

  getSupportTickets(filters?: TicketFilters): Observable<SupportTicket[]> {
    const mockTickets: SupportTicket[] = [
      {
        id: 'TKT-001',
        ticketNumber: 'SUP-2024-001',
        passengerId: 'P001',
        passengerName: 'John Smith',
        passengerEmail: 'john.smith@example.com',
        passengerPhone: '+1234567890',
        type: 'fare_dispute',
        category: 'billing',
        priority: 'high',
        status: 'open',
        subject: 'Overcharged for ride',
        description: 'I was charged more than expected for my recent ride.',
        attachments: [],
        internalNotes: [],
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return of(mockTickets).pipe(delay(300));
  }

  getRefundRequests(filters?: RefundFilters): Observable<RefundRequest[]> {
    const mockRefunds: RefundRequest[] = [
      {
        id: 'REF-001',
        refundNumber: 'REF-2024-001',
        passengerId: 'P001',
        passengerName: 'John Smith',
        originalTransactionId: 'TXN-001',
        refundType: 'partial',
        refundMethod: 'original_payment',
        originalAmount: 50,
        refundAmount: 10,
        refundReason: 'fare_overcharge',
        description: 'Partial refund for overcharge',
        justification: 'Driver took longer route',
        status: 'pending',
        paymentDetails: {
          originalPaymentMethod: 'Credit Card',
          originalPaymentId: 'PAY-001',
          refundPaymentMethod: 'original_payment',
          processingFee: 0,
          netRefundAmount: 10
        },
        attachments: [],
        auditTrail: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return of(mockRefunds).pipe(delay(300));
  }

  getSafetyIncidents(filters?: IncidentFilters): Observable<SafetyIncident[]> {
    const mockIncidents: SafetyIncident[] = [
      {
        id: 'INC-001',
        incidentNumber: 'SAF-2024-001',
        passengerId: 'P001',
        passengerName: 'John Smith',
        driverId: 'D001',
        driverName: 'Driver Name',
        incidentType: 'driver_misconduct',
        severity: 'medium',
        status: 'reported',
        title: 'Driver Misconduct Report',
        description: 'Driver was rude and unprofessional during the ride.',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: '123 Main St, New York, NY'
        },
        incidentTime: new Date(),
        reportedTime: new Date(),
        witnesses: [],
        evidence: [],
        investigationNotes: [],
        actions: [],
        followUpRequired: false,
        reportedBy: 'P001',
        reporterName: 'John Smith',
        legalAction: false,
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return of(mockIncidents).pipe(delay(300));
  }

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
        totalRefunds: 1,
        pendingRefunds: 1,
        approvedRefunds: 0,
        completedRefunds: 0,
        rejectedRefunds: 0,
        totalRefundAmount: 10,
        averageRefundAmount: 10,
        averageProcessingTime: 48,
        refundsByReason: {
          fare_overcharge: 1,
          service_failure: 0,
          cancellation: 0,
          duplicate_charge: 0,
          technical_error: 0,
          other: 0
        },
        refundsByMethod: {
          original_payment: 1,
          wallet: 0,
          bank_transfer: 0,
          check: 0
        }
      },
      incidentSummary: {
        totalIncidents: 1,
        reportedIncidents: 1,
        underInvestigationIncidents: 0,
        resolvedIncidents: 0,
        escalatedIncidents: 0,
        averageResolutionTime: 72,
        incidentsByType: {
          driver_misconduct: 1,
          reckless_driving: 0,
          harassment: 0,
          accident: 0,
          theft: 0,
          violence: 0,
          other: 0
        },
        incidentsBySeverity: {
          low: 0,
          medium: 1,
          high: 0,
          critical: 0
        }
      },
      passengerSatisfaction: {
        averageRating: 4.2,
        responseTime: 2.5,
        resolutionTime: 24,
        escalationRate: 5.2
      },
      trends: {
        ticketVolume: [],
        refundVolume: [],
        incidentVolume: []
      }
    };

    return of(analytics).pipe(delay(500));
  }

  assignTicket(ticketId: string, assignedTo: string, assigneeName: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  closeTicket(ticketId: string, resolution: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  processRefund(refundId: string, processingNotes: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  takeIncidentAction(incidentId: string, actionData: any): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  exportTicketsToCSV(): Observable<string> {
    return of('ID,Subject,Status\nTKT-001,Sample,Open\n').pipe(delay(1000));
  }

  exportRefundsToCSV(): Observable<string> {
    return of('ID,Amount,Status\nREF-001,10.00,Pending\n').pipe(delay(1000));
  }

  exportIncidentsToCSV(): Observable<string> {
    return of('ID,Type,Status\nINC-001,Misconduct,Reported\n').pipe(delay(1000));
  }
}
