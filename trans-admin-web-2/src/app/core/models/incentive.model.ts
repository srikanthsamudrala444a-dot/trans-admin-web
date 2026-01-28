// Financial Incentives Management Models

export interface FinancialIncentive {
  id: string;
  name: string;
  type: IncentiveType;
  status: IncentiveStatus;
  description: string;
  rules: IncentiveRules;
  rewards: IncentiveReward;
  eligibility: EligibilityCriteria;
  budget: IncentiveBudget;
  performance: IncentivePerformance;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type IncentiveType = 
  | 'loyalty_points'
  | 'cashback'
  | 'referral_bonus'
  | 'ride_discount'
  | 'signup_bonus'
  | 'milestone_reward'
  | 'seasonal_offer'
  | 'tier_benefit';

export type IncentiveStatus = 
  | 'draft'
  | 'active'
  | 'paused'
  | 'expired'
  | 'cancelled';

export interface IncentiveRules {
  triggerEvent: TriggerEvent;
  frequency: IncentiveFrequency;
  conditions: IncentiveCondition[];
  limitations: IncentiveLimitations;
}

export type TriggerEvent =
  | 'ride_completion'
  | 'user_registration'
  | 'referral_success'
  | 'spending_milestone'
  | 'ride_frequency'
  | 'time_based';

export type IncentiveFrequency =
  | 'one_time'
  | 'per_ride'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'milestone_based';

export interface IncentiveCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  description: string;
}

export interface IncentiveLimitations {
  maxRedemptionsPerUser?: number;
  maxRedemptionsTotal?: number;
  minimumRideAmount?: number;
  maximumRideAmount?: number;
  applicableUserTiers?: UserTier[];
  applicableRegions?: string[];
  cooldownPeriod?: number; // in hours
}

export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface IncentiveReward {
  rewardType: RewardType;
  value: number;
  currency?: string;
  pointsMultiplier?: number;
  customReward?: CustomReward;
}

export type RewardType =
  | 'fixed_amount'
  | 'percentage'
  | 'points'
  | 'free_rides'
  | 'upgrade'
  | 'custom';

export interface CustomReward {
  title: string;
  description: string;
  value: string;
  imageUrl?: string;
}

export interface EligibilityCriteria {
  userTypes: UserType[];
  minRideCount?: number;
  minSpendAmount?: number;
  registrationDateRange?: DateRange;
  excludedUsers?: string[];
  requiredUserTags?: string[];
}

export type UserType = 'new_user' | 'existing_user' | 'premium_user' | 'all_users';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface IncentiveBudget {
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  budgetType: 'fixed' | 'unlimited';
  costPerRedemption?: number;
}

export interface IncentivePerformance {
  totalRedemptions: number;
  uniqueUsers: number;
  totalCost: number;
  conversionRate: number; // percentage
  roi: number; // return on investment percentage
  averageRewardValue: number;
  revenueGenerated: number;
}

// Passenger Loyalty Program Models
export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  tiers: LoyaltyTier[];
  pointsSystem: PointsSystem;
  benefits: LoyaltyBenefit[];
  status: 'active' | 'inactive';
  activeMembers: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  minPoints: number;
  maxPoints?: number;
  pointsRequired: number;
  color: string;
  icon: string;
  benefits: TierBenefit[];
  requirements: TierRequirement[];
}

export interface TierBenefit {
  type: 'discount' | 'priority_booking' | 'free_cancellation' | 'points_multiplier' | 'custom';
  value: number;
  description: string;
}

export interface TierRequirement {
  type: 'rides_count' | 'spend_amount' | 'points_earned' | 'time_period';
  value: number;
  timeframe?: 'monthly' | 'quarterly' | 'yearly';
}

export interface PointsSystem {
  pointsPerRide: number;
  pointsPerDollar: number;
  bonusMultipliers: BonusMultiplier[];
  redemptionRates: RedemptionRate[];
  expirationPolicy: ExpirationPolicy;
}

export interface BonusMultiplier {
  condition: string;
  multiplier: number;
  description: string;
}

export interface RedemptionRate {
  pointsRequired: number;
  rewardValue: number;
  rewardType: 'cash' | 'ride_credit' | 'discount';
}

export interface ExpirationPolicy {
  enabled: boolean;
  expirationPeriod: number; // in months
  warningPeriod: number; // in days
}

export interface LoyaltyBenefit {
  id: string;
  name: string;
  type: 'discount' | 'cashback' | 'points_bonus' | 'free_service';
  value: number;
  applicableTiers: string[];
  description: string;
}

// User Incentive History
export interface UserIncentiveHistory {
  id: string;
  userId: string;
  userName: string;
  incentiveId: string;
  incentiveName: string;
  rewardType: RewardType;
  rewardValue: number;
  pointsEarned?: number;
  redemptionDate: Date;
  expirationDate?: Date;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  transactionId?: string;
  rideId?: string;
}

// Referral Program Models
export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  referrerReward: IncentiveReward;
  refereeReward: IncentiveReward;
  conditions: ReferralCondition[];
  validFrom: Date;
  validTo: Date;
  status: IncentiveStatus;
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  performance: ReferralPerformance;
}

export interface ReferralCondition {
  type: 'first_ride_completion' | 'minimum_spend' | 'ride_count';
  value: number;
  timeframe?: number; // in days
}

export interface ReferralPerformance {
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  totalRewardsPaid: number;
  averageReferralValue: number;
}

// Analytics and Reporting Models
export interface IncentiveAnalytics {
  overview: IncentiveOverview;
  performanceByType: PerformanceByType[];
  userEngagement: UserEngagement;
  financialImpact: FinancialImpact;
  trends: IncentiveTrends;
  // Additional properties for dashboard display
  totalRedemptions: number;
  totalCost: number;
  averageROI: number;
  activePrograms: number;
  totalRevenueImpact: number;
  userEngagementRate: number;
  retentionRate: number;
  topPerformers: TopPerformerIncentive[];
}

export interface TopPerformerIncentive {
  id: string;
  name: string;
  type: IncentiveType;
  roi: number;
  redemptions: number;
}

export interface IncentiveOverview {
  totalActiveIncentives: number;
  totalRedemptions: number;
  totalCost: number;
  averageRedemptionValue: number;
  uniqueParticipants: number;
}

export interface PerformanceByType {
  type: IncentiveType;
  count: number;
  redemptions: number;
  cost: number;
  conversionRate: number;
}

export interface UserEngagement {
  newUserParticipation: number;
  returningUserParticipation: number;
  averageIncentivesPerUser: number;
  topPerformingUserSegments: UserSegment[];
}

export interface UserSegment {
  segment: string;
  userCount: number;
  redemptionRate: number;
  averageValue: number;
}

export interface FinancialImpact {
  totalIncentiveCost: number;
  revenueGenerated: number;
  roi: number;
  costPerAcquisition: number;
  lifetimeValueImpact: number;
}

export interface IncentiveTrends {
  redemptionTrends: TrendData[];
  costTrends: TrendData[];
  participationTrends: TrendData[];
}

export interface TrendData {
  date: Date;
  value: number;
  label?: string;
}

// Filter and Search Models
export interface IncentiveFilters {
  status?: IncentiveStatus[];
  type?: IncentiveType[];
  dateRange?: DateRange;
  budgetRange?: {
    min: number;
    max: number;
  };
  performance?: {
    minRedemptions?: number;
    minROI?: number;
  };
  searchQuery?: string;
}

export interface PaginatedIncentives {
  data: FinancialIncentive[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Configuration Models
export interface IncentiveConfiguration {
  defaultPointsPerRide: number;
  defaultPointsPerDollar: number;
  maxBudgetPerIncentive: number;
  maxRedemptionsPerUser: number;
  approvalRequired: boolean;
  autoActivation: boolean;
  defaultValidityPeriod: number; // in days
}
