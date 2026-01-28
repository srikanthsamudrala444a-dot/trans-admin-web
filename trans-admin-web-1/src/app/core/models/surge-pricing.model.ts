export interface SurgeZone {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  city: string;
  isActive: boolean;
  currentMultiplier: number;
  baseMultiplier: number;
  maxMultiplier: number;
  minMultiplier: number;
  lastUpdated: Date;
  createdAt: Date;
}

export interface SurgePricingRule {
  id: string;
  name: string;
  description: string;
  zoneId: string;
  zoneName: string;
  triggerConditions: {
    demandThreshold: number;
    supplyThreshold: number;
    waitTimeThreshold: number; // minutes
    requestToDriverRatio: number;
  };
  pricingTiers: {
    level: number;
    multiplier: number;
    triggerRatio: number;
    description: string;
  }[];
  schedule?: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  };
  isActive: boolean;
  priority: number;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
}

export interface SurgeMetrics {
  zoneId: string;
  zoneName: string;
  timestamp: Date;
  activeRiders: number;
  availableDrivers: number;
  pendingRequests: number;
  averageWaitTime: number;
  demandSupplyRatio: number;
  currentMultiplier: number;
  estimatedRevenue: number;
  completedRides: number;
  cancelledRides: number;
}

export interface SurgeAnalytics {
  totalRevenue: number;
  surgeRevenue: number;
  surgePercentage: number;
  averageMultiplier: number;
  peakZones: string[];
  topPerformingZones: {
    zoneId: string;
    zoneName: string;
    revenue: number;
    multiplier: number;
    rides: number;
  }[];
  hourlyTrends: {
    hour: number;
    averageMultiplier: number;
    revenue: number;
    rides: number;
  }[];
  demandPrediction: {
    zoneId: string;
    zoneName: string;
    predictedDemand: number;
    recommendedMultiplier: number;
    confidence: number;
  }[];
}

export interface PricingHistory {
  id: string;
  zoneId: string;
  zoneName: string;
  multiplier: number;
  reason: 'AUTO' | 'MANUAL' | 'SCHEDULED' | 'OVERRIDE';
  triggeredBy: string;
  triggerReason: string;
  startTime: Date;
  endTime?: Date;
  metricsAtTrigger: {
    demand: number;
    supply: number;
    waitTime: number;
    ratio: number;
  };
  impact: {
    ridesCompleted: number;
    revenue: number;
    averageWaitTime: number;
    customerSatisfaction?: number;
  };
}
