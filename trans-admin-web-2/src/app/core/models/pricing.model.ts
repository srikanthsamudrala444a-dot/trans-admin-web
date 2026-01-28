export interface Zone {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinate[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface SurgePricingRule {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  isActive: boolean;
  triggerConditions: TriggerConditions;
  pricingMultiplier: PricingMultiplier;
  timeRestrictions?: TimeRestriction[];
  maxDuration?: number; // in minutes
  cooldownPeriod?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface TriggerConditions {
  demandThreshold: number; // minimum demand to trigger surge
  supplyThreshold: number; // maximum supply to trigger surge
  demandToSupplyRatio: number; // minimum ratio to trigger surge
  waitTimeThreshold?: number; // in minutes
  bookingVolumeThreshold?: number; // bookings per hour
}

export interface PricingMultiplier {
  baseMultiplier: number;
  maxMultiplier: number;
  incrementStep: number;
  decrementStep: number;
  evaluationInterval: number; // in minutes
}

export interface TimeRestriction {
  dayOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface SurgeEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  ruleId: string;
  ruleName: string;
  startTime: Date;
  endTime?: Date;
  currentMultiplier: number;
  maxMultiplierReached: number;
  isActive: boolean;
  triggerReason: string;
  demandCount: number;
  supplyCount: number;
  demandToSupplyRatio: number;
  totalBookings: number;
  totalRevenue: number;
  averageWaitTime: number;
  createdAt: Date;
}

export interface ZoneMetrics {
  zoneId: string;
  zoneName: string;
  timestamp: Date;
  activeDrivers: number;
  pendingBookings: number;
  completedRides: number;
  averageWaitTime: number;
  demandScore: number;
  supplyScore: number;
  demandToSupplyRatio: number;
  currentSurgeMultiplier: number;
  estimatedRevenue: number;
}

export interface PricingAnalytics {
  totalSurgeEvents: number;
  activeSurgeZones: number;
  averageSurgeMultiplier: number;
  surgeRevenue: number;
  surgeRevenuePercentage: number;
  customerSatisfactionImpact: number;
  driverEarningsIncrease: number;
  peakHoursData: PeakHourData[];
  zonePerformance: ZonePerformanceData[];
}

export interface PeakHourData {
  hour: number;
  surgeFrequency: number;
  averageMultiplier: number;
  revenue: number;
}

export interface ZonePerformanceData {
  zoneId: string;
  zoneName: string;
  surgeEventsCount: number;
  averageMultiplier: number;
  totalRevenue: number;
  customerRetention: number;
}

export interface DynamicPricingSettings {
  isGloballyEnabled: boolean;
  maxGlobalMultiplier: number;
  defaultEvaluationInterval: number;
  emergencyOverride: EmergencyOverride;
  notificationSettings: NotificationSettings;
  analyticsRetentionDays: number;
}

export interface EmergencyOverride {
  isEnabled: boolean;
  maxMultiplier: number;
  authorizedUsers: string[];
  requiresApproval: boolean;
}

export interface NotificationSettings {
  surgeStartNotifications: boolean;
  surgeEndNotifications: boolean;
  highMultiplierAlerts: boolean;
  multiplierThreshold: number;
  notificationChannels: string[];
}

export type SurgeStatus = 'Active' | 'Inactive' | 'Scheduled' | 'Paused' | 'Expired';
export type ZoneType = 'City Center' | 'Airport' | 'Business District' | 'Residential' | 'Tourist Area' | 'Transport Hub' | 'Custom';
export type PricingStrategy = 'Demand-Based' | 'Time-Based' | 'Event-Based' | 'Hybrid';
