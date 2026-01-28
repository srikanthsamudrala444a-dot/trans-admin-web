export interface EmergencyAlert {
  id: string;
  type: 'SOS' | 'PANIC' | 'ACCIDENT' | 'MEDICAL' | 'SAFETY_CONCERN';
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED' | 'FALSE_ALARM';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  triggeredBy: {
    id: string;
    name: string;
    role: 'DRIVER' | 'PASSENGER';
    phone: string;
    photo?: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: Date;
  };
  rideDetails?: {
    rideId: string;
    driverId?: string;
    driverName?: string;
    passengerId?: string;
    passengerName?: string;
    vehicleId?: string;
    vehicleNumber?: string;
  };
  description?: string;
  audioRecording?: string;
  images?: string[];
  timestampTriggered: Date;
  timestampResponded?: Date;
  timestampResolved?: Date;
  respondedBy?: {
    id: string;
    name: string;
    role: string;
  };
  responseNotes?: string;
  emergencyContacts?: {
    name: string;
    relationship: string;
    phone: string;
    contacted: boolean;
    contactedAt?: Date;
  }[];
  authorities?: {
    type: 'POLICE' | 'AMBULANCE' | 'FIRE' | 'SECURITY';
    contacted: boolean;
    contactedAt?: Date;
    responseTime?: number;
    caseNumber?: string;
  }[];
  resolution?: {
    outcome: 'RESOLVED' | 'FALSE_ALARM' | 'ESCALATED' | 'NO_RESPONSE';
    notes: string;
    followUpRequired: boolean;
    followUpDate?: Date;
  };
}

export interface EmergencyResponse {
  alertId: string;
  responseType: 'CALL_USER' | 'CONTACT_EMERGENCY' | 'DISPATCH_SECURITY' | 'SEND_MESSAGE' | 'ESCALATE';
  notes: string;
  responderId: string;
  responderName: string;
  timestamp: Date;
}

export interface EmergencyStats {
  totalAlerts: number;
  activeAlerts: number;
  resolvedToday: number;
  averageResponseTime: number;
  criticalAlerts: number;
  falseAlarms: number;
  responseRate: number;
}
