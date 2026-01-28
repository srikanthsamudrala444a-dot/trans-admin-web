export interface Ride {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  vehicleId: string;
  status: 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';
  pickupLocation: Location;
  dropLocation: Location;
  pickupTime?: Date;
  dropoffTime?: Date;
  fare: number;
  distance: number;
  duration: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Passenger {
  id: string;
  firstName: string;
  LastName: string;
  email: string;
  contactNumber: string;
  totalRides: number;
  rating: number;
  isBanned: boolean;
  isActive?: boolean;
  isOnHold?: boolean;
  holdReason?: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  driverId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
}

export interface RideOptions {
  id: string;
  type: VehicleCategory;
  baseFare: number;
  perKm: number;
  perMin: number;
  seatCapacity: number;
  iconUrl: string;
}

export enum VehicleCategory {
  BIKE = 'BIKE',
  CAB = 'CAB',
  AUTO = 'AUTO',
  BUS = 'BUS',
  TRACTOR = 'TRACTOR',
  TRUCK = 'TRUCK',
}

// Trip Analysis Models
export interface TripLog {
  id: string;
  rideId: string;
  passengerId: string;
  driverId: string;
  status: 'completed' | 'cancelled' | 'scheduled' | 'no-show';
  pickupLocation: Location;
  dropLocation: Location;
  scheduledTime?: Date;
  actualPickupTime?: Date;
  actualDropoffTime?: Date;
  fare: number;
  paymentMethod: 'cash' | 'card' | 'wallet' | 'upi';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  distance: number;
  duration?: number;
  vehicleType: VehicleCategory;
  driverName: string;
  driverRating: number;
  passengerRating?: number;
  cancellationReason?: string;
  noShowReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripAnalytics {
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  scheduledTrips: number;
  noShowTrips: number;
  totalSpent: number;
  averageFare: number;
  averageRating: number;
  favoriteVehicleType: VehicleCategory;
  mostUsedPaymentMethod: string;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
}

// Financial/Wallet History Models
export interface WalletTransaction {
  id: string;
  passengerId: string;
  type: 'credit' | 'debit' | 'refund' | 'topup';
  amount: number;
  description: string;
  referenceId?: string; // ride ID, payment ID, etc.
  paymentMethod?: 'card' | 'upi' | 'net_banking' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  balanceAfter: number;
  createdAt: Date;
  processedAt?: Date;
}

export interface WalletSummary {
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  totalRefunds: number;
  totalTopups: number;
  lastTransactionDate: Date;
  transactionCount: number;
}

export interface PaymentHistory {
  id: string;
  passengerId: string;
  rideId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'wallet' | 'upi';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  gatewayResponse?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  processedAt?: Date;
}

// Driver Feedback Models
export interface DriverFeedback {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  driverName: string;
  passengerName: string;
  rating: number; // 1-5 stars
  feedback: string;
  categories: FeedbackCategory[];
  isAnonymous: boolean;
  adminNotes?: string;
  createdAt: Date;
  rideDate: Date;
}

export interface FeedbackCategory {
  category: 'punctuality' | 'behavior' | 'cleanliness' | 'communication' | 'payment' | 'other';
  rating: number;
  comments?: string;
}

export interface FeedbackSummary {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages: {
    punctuality: number;
    behavior: number;
    cleanliness: number;
    communication: number;
    payment: number;
  };
  commonIssues: string[];
  positiveHighlights: string[];
}

// Combined Activity Analysis
export interface PassengerActivity {
  passengerId: string;
  passengerName: string;
  tripAnalytics: TripAnalytics;
  walletSummary: WalletSummary;
  feedbackSummary: FeedbackSummary;
  recentTrips: TripLog[];
  recentTransactions: WalletTransaction[];
  recentFeedbacks: DriverFeedback[];
}

export interface ActivityFilters {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  status?: string[];
  paymentMethod?: string[];
  vehicleType?: VehicleCategory[];
  ratingRange?: {
    min: number;
    max: number;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

// Customer Support and Issue Resolution Models

// Dispute Resolution Console Models
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  passengerId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  rideId?: string;
  type: 'fare_dispute' | 'lost_item' | 'service_complaint' | 'refund_request' | 'safety_incident' | 'other';
  category: 'billing' | 'service' | 'safety' | 'technical' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  subject: string;
  description: string;
  attachments: TicketAttachment[];
  resolution?: string;
  resolutionNotes?: string;
  assignedTo?: string;
  assignedAgent?: string;
  estimatedResolutionTime?: Date;
  actualResolutionTime?: Date;
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  internalNotes: TicketNote[];
  statusHistory: TicketStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TicketNote {
  id: string;
  note: string;
  addedBy: string;
  addedByName: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface TicketStatusHistory {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedByName: string;
  reason?: string;
  timestamp: Date;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  commentText: string;
  commentedBy: string;
  commentedByName: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface DisputeCase {
  id: string;
  ticketId?: string;
  disputeNumber: string;
  passengerId: string;
  passengerName: string;
  rideId: string;
  disputeType: 'fare_overcharge' | 'service_failure' | 'refund_request' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  amount: number;
  description: string;
  evidence: DisputeEvidence[];
  resolution?: string;
  resolvedBy?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DisputeEvidence {
  id: string;
  type: 'document' | 'image' | 'video' | 'audio';
  filename: string;
  url: string;
  description: string;
  uploadedAt: Date;
}

export interface SupportFilters {
  status?: string[];
  type?: string[];
  priority?: string[];
  assignedTo?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  searchQuery?: string;
}

export interface TicketFilters {
  status?: string[];
  type?: string[];
  priority?: string[];
  category?: string[];
  assignedTo?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  searchQuery?: string;
}

export interface TicketSummary {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  escalatedTickets: number;
  averageResolutionTime: number;
  satisfactionScore: number;
  ticketsByCategory: {
    billing: number;
    service: number;
    safety: number;
    technical: number;
    general: number;
  };
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// Manual Refund Processing Models
export interface RefundRequest {
  id: string;
  refundNumber: string;
  passengerId: string;
  passengerName: string;
  rideId?: string;
  ticketId?: string;
  originalTransactionId: string;
  refundType: 'full' | 'partial';
  refundMethod: 'original_payment' | 'wallet' | 'bank_transfer' | 'check';
  originalAmount: number;
  refundAmount: number;
  refundReason: 'fare_overcharge' | 'service_failure' | 'cancellation' | 'duplicate_charge' | 'technical_error' | 'other';
  description: string;
  justification: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'failed';
  approvedBy?: string;
  approverName?: string;
  processedBy?: string;
  processorName?: string;
  approvalNotes?: string;
  processingNotes?: string;
  rejectionReason?: string;
  paymentDetails: RefundPaymentDetails;
  attachments: RefundAttachment[];
  auditTrail: RefundAuditEntry[];
  createdAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export interface RefundPaymentDetails {
  originalPaymentMethod: string;
  originalPaymentId: string;
  refundPaymentMethod: string;
  refundPaymentId?: string;
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
  walletId?: string;
  processingFee: number;
  netRefundAmount: number;
}

export interface RefundAttachment {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  description: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface RefundAuditEntry {
  id: string;
  action: string;
  performedBy: string;
  performedByName: string;
  details: string;
  timestamp: Date;
}

export interface RefundFilters {
  status?: string[];
  refundType?: string[];
  refundMethod?: string[];
  refundReason?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

export interface RefundSummary {
  totalRefunds: number;
  pendingRefunds: number;
  approvedRefunds: number;
  completedRefunds: number;
  rejectedRefunds: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
  averageProcessingTime: number;
  refundsByReason: {
    fare_overcharge: number;
    service_failure: number;
    cancellation: number;
    duplicate_charge: number;
    technical_error: number;
    other: number;
  };
  refundsByMethod: {
    original_payment: number;
    wallet: number;
    bank_transfer: number;
    check: number;
  };
}

// Safety Incident Logging Models
export interface SafetyIncident {
  id: string;
  incidentNumber: string;
  passengerId: string;
  passengerName: string;
  driverId?: string;
  driverName?: string;
  rideId?: string;
  vehicleId?: string;
  incidentType: 'driver_misconduct' | 'reckless_driving' | 'harassment' | 'accident' | 'theft' | 'violence' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'under_investigation' | 'resolved' | 'closed' | 'escalated';
  title: string;
  description: string;
  location: Location;
  incidentTime: Date;
  reportedTime: Date;
  witnesses: IncidentWitness[];
  evidence: IncidentEvidence[];
  investigationNotes: IncidentNote[];
  actions: IncidentAction[];
  outcome?: string;
  outcomeNotes?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  reportedBy: string;
  reporterName: string;
  assignedInvestigator?: string;
  investigatorName?: string;
  policeReportNumber?: string;
  insuranceClaimNumber?: string;
  legalAction: boolean;
  legalNotes?: string;
  statusHistory: IncidentStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface IncidentWitness {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  statement: string;
  contactedAt?: Date;
  contactedBy?: string;
}

export interface IncidentEvidence {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'document' | 'other';
  filename: string;
  url: string;
  description: string;
  collectedBy: string;
  collectedAt: Date;
}

export interface IncidentNote {
  id: string;
  note: string;
  noteType: 'investigation' | 'follow_up' | 'legal' | 'general';
  addedBy: string;
  addedByName: string;
  isConfidential: boolean;
  createdAt: Date;
}

export interface IncidentAction {
  id: string;
  action: string;
  actionType: 'disciplinary' | 'training' | 'suspension' | 'termination' | 'warning' | 'other';
  targetType: 'driver' | 'passenger' | 'system' | 'process';
  targetId?: string;
  description: string;
  takenBy: string;
  takenByName: string;
  completedAt?: Date;
  effectiveDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
}

export interface IncidentStatusHistory {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedByName: string;
  reason?: string;
  timestamp: Date;
}

export interface IncidentFilters {
  status?: string[];
  incidentType?: string[];
  severity?: string[];
  assignedInvestigator?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  searchQuery?: string;
}

export interface IncidentSummary {
  totalIncidents: number;
  reportedIncidents: number;
  underInvestigationIncidents: number;
  resolvedIncidents: number;
  escalatedIncidents: number;
  averageResolutionTime: number;
  incidentsByType: {
    driver_misconduct: number;
    reckless_driving: number;
    harassment: number;
    accident: number;
    theft: number;
    violence: number;
    other: number;
  };
  incidentsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// Combined Customer Support Analytics
export interface CustomerSupportAnalytics {
  ticketSummary: TicketSummary;
  refundSummary: RefundSummary;
  incidentSummary: IncidentSummary;
  passengerSatisfaction: {
    averageRating: number;
    responseTime: number;
    resolutionTime: number;
    escalationRate: number;
  };
  trends: {
    ticketVolume: Array<{ date: Date; count: number }>;
    refundVolume: Array<{ date: Date; count: number; amount: number }>;
    incidentVolume: Array<{ date: Date; count: number }>;
  };
}
