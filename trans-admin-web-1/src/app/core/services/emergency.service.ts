import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EmergencyAlert, EmergencyResponse, EmergencyStats } from '../models/emergency.model';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private baseUrl = '/api/emergency';
  private alertsSubject = new BehaviorSubject<EmergencyAlert[]>([]);
  private statsSubject = new BehaviorSubject<EmergencyStats | null>(null);

  // Real-time updates every 30 seconds
  private alertsPolling$ = interval(30000).pipe(
    switchMap(() => this.loadAlerts())
  );

  alerts$ = this.alertsSubject.asObservable();
  stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializePolling();
  }

  private initializePolling(): void {
    // Load initial data
    this.loadAlerts().subscribe();
    this.loadStats().subscribe();

    // Start polling for updates
    this.alertsPolling$.subscribe();
  }

  private loadAlerts(): Observable<EmergencyAlert[]> {
    return this.http.get<EmergencyAlert[]>(`${this.baseUrl}/alerts`).pipe(
      map(alerts => {
        this.alertsSubject.next(alerts);
        return alerts;
      })
    );
  }

  private loadStats(): Observable<EmergencyStats> {
    return this.http.get<EmergencyStats>(`${this.baseUrl}/stats`).pipe(
      map(stats => {
        this.statsSubject.next(stats);
        return stats;
      })
    );
  }

  getAlerts(filters?: {
    status?: string;
    type?: string;
    priority?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Observable<EmergencyAlert[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.http.get<EmergencyAlert[]>(`${this.baseUrl}/alerts?${params.toString()}`);
  }

  getAlert(id: string): Observable<EmergencyAlert> {
    return this.http.get<EmergencyAlert>(`${this.baseUrl}/alerts/${id}`);
  }

  respondToAlert(alertId: string, response: Partial<EmergencyResponse>): Observable<EmergencyAlert> {
    return this.http.post<EmergencyAlert>(`${this.baseUrl}/alerts/${alertId}/respond`, response);
  }

  updateAlertStatus(alertId: string, status: EmergencyAlert['status'], notes?: string): Observable<EmergencyAlert> {
    return this.http.patch<EmergencyAlert>(`${this.baseUrl}/alerts/${alertId}/status`, {
      status,
      notes
    });
  }

  contactAuthorities(alertId: string, authorityType: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/alerts/${alertId}/contact-authorities`, {
      authorityType
    });
  }

  contactEmergencyContact(alertId: string, contactId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/alerts/${alertId}/contact-emergency`, {
      contactId
    });
  }

  escalateAlert(alertId: string, escalationReason: string): Observable<EmergencyAlert> {
    return this.http.post<EmergencyAlert>(`${this.baseUrl}/alerts/${alertId}/escalate`, {
      reason: escalationReason
    });
  }

  dismissAlert(alertId: string, reason: string): Observable<EmergencyAlert> {
    return this.http.post<EmergencyAlert>(`${this.baseUrl}/alerts/${alertId}/dismiss`, {
      reason
    });
  }

  getLocationHistory(alertId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alerts/${alertId}/location-history`);
  }

  initiateCall(phoneNumber: string, alertId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/initiate-call`, {
      phoneNumber,
      alertId
    });
  }

  sendSMS(phoneNumber: string, message: string, alertId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/send-sms`, {
      phoneNumber,
      message,
      alertId
    });
  }

  // Mock data for development
  getMockAlerts(): EmergencyAlert[] {
    return [
      {
        id: 'alert_001',
        type: 'SOS',
        status: 'ACTIVE',
        priority: 'CRITICAL',
        triggeredBy: {
          id: 'driver_001',
          name: 'John Smith',
          role: 'DRIVER',
          phone: '+1234567890',
          photo: 'assets/avatars/driver1.jpg'
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: '123 Market St, San Francisco, CA',
          timestamp: new Date()
        },
        rideDetails: {
          rideId: 'ride_001',
          driverId: 'driver_001',
          driverName: 'John Smith',
          passengerId: 'passenger_001',
          passengerName: 'Jane Doe',
          vehicleId: 'vehicle_001',
          vehicleNumber: 'ABC-123'
        },
        description: 'Driver triggered SOS alert - potential safety threat',
        timestampTriggered: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        emergencyContacts: [
          {
            name: 'Mary Smith',
            relationship: 'Spouse',
            phone: '+1234567891',
            contacted: false
          }
        ],
        authorities: [
          {
            type: 'POLICE',
            contacted: false
          }
        ]
      },
      {
        id: 'alert_002',
        type: 'ACCIDENT',
        status: 'RESPONDING',
        priority: 'HIGH',
        triggeredBy: {
          id: 'passenger_002',
          name: 'Alice Johnson',
          role: 'PASSENGER',
          phone: '+1234567892'
        },
        location: {
          latitude: 37.7849,
          longitude: -122.4094,
          address: '456 Castro St, San Francisco, CA',
          timestamp: new Date()
        },
        rideDetails: {
          rideId: 'ride_002',
          driverId: 'driver_002',
          driverName: 'Bob Wilson',
          passengerId: 'passenger_002',
          passengerName: 'Alice Johnson',
          vehicleId: 'vehicle_002',
          vehicleNumber: 'XYZ-789'
        },
        description: 'Vehicle accident reported by passenger',
        timestampTriggered: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        timestampResponded: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        respondedBy: {
          id: 'admin_001',
          name: 'Emergency Operator',
          role: 'EMERGENCY_OPERATOR'
        },
        responseNotes: 'Ambulance dispatched, ETA 5 minutes',
        authorities: [
          {
            type: 'AMBULANCE',
            contacted: true,
            contactedAt: new Date(Date.now() - 10 * 60 * 1000),
            responseTime: 5
          }
        ]
      },
      {
        id: 'alert_003',
        type: 'MEDICAL',
        status: 'RESOLVED',
        priority: 'CRITICAL',
        triggeredBy: {
          id: 'driver_003',
          name: 'Carlos Rodriguez',
          role: 'DRIVER',
          phone: '+1234567893'
        },
        location: {
          latitude: 37.7649,
          longitude: -122.4294,
          address: '789 Mission St, San Francisco, CA',
          timestamp: new Date()
        },
        description: 'Driver experiencing chest pains',
        timestampTriggered: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        timestampResponded: new Date(Date.now() - 55 * 60 * 1000),
        timestampResolved: new Date(Date.now() - 30 * 60 * 1000),
        respondedBy: {
          id: 'admin_002',
          name: 'Medical Dispatcher',
          role: 'EMERGENCY_OPERATOR'
        },
        resolution: {
          outcome: 'RESOLVED',
          notes: 'False alarm - driver experiencing anxiety, not medical emergency',
          followUpRequired: false
        }
      },
      {
        id: 'alert_004',
        type: 'PANIC',
        status: 'ACTIVE',
        priority: 'HIGH',
        triggeredBy: {
          id: 'passenger_004',
          name: 'Sarah Chen',
          role: 'PASSENGER',
          phone: '+1234567894'
        },
        location: {
          latitude: 37.7549,
          longitude: -122.4394,
          address: '321 Pine St, San Francisco, CA',
          timestamp: new Date()
        },
        description: 'Passenger feels unsafe with driver behavior',
        timestampTriggered: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        authorities: [
          {
            type: 'SECURITY',
            contacted: false
          }
        ]
      },
      {
        id: 'alert_005',
        type: 'SAFETY_CONCERN',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        triggeredBy: {
          id: 'driver_005',
          name: 'Mike Thompson',
          role: 'DRIVER',
          phone: '+1234567895'
        },
        location: {
          latitude: 37.7449,
          longitude: -122.4494,
          address: '654 Van Ness Ave, San Francisco, CA',
          timestamp: new Date()
        },
        description: 'Suspicious activity in pickup area',
        timestampTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        timestampResponded: new Date(Date.now() - 110 * 60 * 1000),
        timestampResolved: new Date(Date.now() - 90 * 60 * 1000),
        resolution: {
          outcome: 'RESOLVED',
          notes: 'Security checked area, no immediate threat found',
          followUpRequired: false
        }
      }
    ];
  }

  getMockStats(): EmergencyStats {
    return {
      totalAlerts: 47,
      activeAlerts: 3,
      resolvedToday: 12,
      averageResponseTime: 180, // seconds
      criticalAlerts: 2,
      falseAlarms: 5,
      responseRate: 95.7
    };
  }
}
