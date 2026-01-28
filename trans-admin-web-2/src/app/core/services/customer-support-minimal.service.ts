import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerSupportService {

  // Simple methods that return minimal data for demo purposes
  getSupportTickets(filters?: any): Observable<any[]> {
    return of([
      {
        id: 'TKT-001',
        ticketNumber: 'SUP-2024-001',
        passengerName: 'John Smith',
        type: 'fare_dispute',
        priority: 'high',
        status: 'open',
        subject: 'Overcharged for ride',
        createdAt: new Date()
      }
    ]).pipe(delay(300));
  }

  assignTicket(ticketId: string, assignedTo: string, assigneeName: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  closeTicket(ticketId: string, resolution: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  getRefundRequests(filters?: any): Observable<any[]> {
    return of([
      {
        id: 'REF-001',
        passengerName: 'John Smith',
        refundType: 'partial',
        originalAmount: 25.00,
        refundAmount: 10.00,
        status: 'pending',
        createdAt: new Date()
      }
    ]).pipe(delay(300));
  }

  processRefund(refundId: string, processingNotes: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  getSafetyIncidents(filters?: any): Observable<any[]> {
    return of([
      {
        id: 'INC-001',
        incidentNumber: 'SAF-2024-001',
        passengerName: 'David Lee',
        driverName: 'Robert Johnson',
        incidentType: 'driver_misconduct',
        severity: 'high',
        status: 'under_investigation',
        description: 'Reckless driving incident',
        createdAt: new Date()
      }
    ]).pipe(delay(300));
  }

  takeIncidentAction(incidentId: string, actionData: any): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  getCustomerSupportAnalytics(): Observable<any> {
    return of({
      ticketSummary: {
        totalTickets: 1,
        openTickets: 1,
        inProgressTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
        escalatedTickets: 0,
        averageResolutionTime: 24,
        responseTimeMetrics: {
          averageFirstResponse: 2.5,
          averageFullResolution: 24,
          slaCompliance: 85
        }
      },
      refundSummary: {
        totalRefunds: 1,
        pendingRefunds: 1,
        approvedRefunds: 0,
        completedRefunds: 0,
        rejectedRefunds: 0,
        totalRefundAmount: 10.00,
        averageRefundAmount: 10.00,
        processingTimeMetrics: {
          averageApprovalTime: 4,
          averageProcessingTime: 48,
          autoApprovalRate: 60
        }
      },
      incidentSummary: {
        totalIncidents: 1,
        reportedIncidents: 0,
        underInvestigationIncidents: 1,
        resolvedIncidents: 0,
        escalatedIncidents: 0,
        averageResolutionTime: 72,
        incidentsBySeverity: {
          low: 0,
          medium: 0,
          high: 1,
          critical: 0
        }
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
