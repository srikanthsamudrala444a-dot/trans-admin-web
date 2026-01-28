export interface VehicleCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  capacity: number;
  features: string[];
}

export interface FareStructure {
  id: string;
  vehicleCategoryId: string;
  vehicleCategory: VehicleCategory;
  baseFare: number;
  perKilometerCharge: number;
  perMinuteCharge: number;
  minimumFare: number;
  waitingChargePerMinute: number;
  cancellationCharge: number;
  nightSurcharge: number; // percentage
  peakHourSurcharge: number; // percentage
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface FareRule {
  id: string;
  name: string;
  description: string;
  ruleType: FareRuleType;
  conditions: FareCondition[];
  actions: FareAction[];
  priority: number;
  isActive: boolean;
  applicableVehicleCategories: string[];
  validFrom: Date;
  validTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum FareRuleType {
  TIME_BASED = 'TIME_BASED',
  DISTANCE_BASED = 'DISTANCE_BASED',
  LOCATION_BASED = 'LOCATION_BASED',
  DEMAND_BASED = 'DEMAND_BASED',
  SPECIAL_EVENT = 'SPECIAL_EVENT'
}

export interface FareCondition {
  id: string;
  type: ConditionType;
  operator: ConditionOperator;
  value: any;
  unit?: string;
}

export enum ConditionType {
  TIME_OF_DAY = 'TIME_OF_DAY',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  DISTANCE = 'DISTANCE',
  DURATION = 'DURATION',
  LOCATION = 'LOCATION',
  DEMAND_RATIO = 'DEMAND_RATIO'
}

export enum ConditionOperator {
  EQUALS = 'EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN'
}

export interface FareAction {
  id: string;
  type: ActionType;
  value: number;
  unit: ActionUnit;
}

export enum ActionType {
  ADD_AMOUNT = 'ADD_AMOUNT',
  MULTIPLY_BY = 'MULTIPLY_BY',
  SET_MINIMUM = 'SET_MINIMUM',
  SET_MAXIMUM = 'SET_MAXIMUM',
  PERCENTAGE_INCREASE = 'PERCENTAGE_INCREASE',
  PERCENTAGE_DECREASE = 'PERCENTAGE_DECREASE'
}

export enum ActionUnit {
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  MULTIPLIER = 'MULTIPLIER'
}

export interface FareCalculationResult {
  baseFare: number;
  distanceCharge: number;
  timeCharge: number;
  waitingCharge: number;
  surcharges: FareSurcharge[];
  discounts: FareDiscount[];
  totalBeforeAdjustments: number;
  totalAdjustments: number;
  finalFare: number;
  minimumFareApplied: boolean;
  breakdown: FareBreakdown[];
}

export interface FareSurcharge {
  id: string;
  name: string;
  amount: number;
  type: 'FIXED' | 'PERCENTAGE';
  reason: string;
}

export interface FareDiscount {
  id: string;
  name: string;
  amount: number;
  type: 'FIXED' | 'PERCENTAGE';
  reason: string;
}

export interface FareBreakdown {
  component: string;
  amount: number;
  unit: string;
  description: string;
}

export interface TariffTemplate {
  id: string;
  name: string;
  description: string;
  vehicleCategories: string[];
  fareStructures: FareStructure[];
  fareRules: FareRule[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FareAuditLog {
  id: string;
  action: string;
  entityType: 'FARE_STRUCTURE' | 'FARE_RULE' | 'TARIFF_TEMPLATE';
  entityId: string;
  oldValues: any;
  newValues: any;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface FareAnalytics {
  averageFareByCategory: { [categoryId: string]: number };
  totalRevenue: number;
  totalTrips: number;
  fareDistribution: FareDistributionData[];
  revenueTrends: RevenueTrendData[];
  popularCategories: CategoryPopularityData[];
}

export interface FareDistributionData {
  fareRange: string;
  count: number;
  percentage: number;
}

export interface RevenueTrendData {
  date: string;
  revenue: number;
  trips: number;
  averageFare: number;
}

export interface CategoryPopularityData {
  categoryId: string;
  categoryName: string;
  trips: number;
  revenue: number;
  percentage: number;
}
