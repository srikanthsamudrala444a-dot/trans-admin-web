// Time periods enumeration for performance reports
export enum TimePeriodsEnum {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_QUARTER = 'this_quarter',
  LAST_QUARTER = 'last_quarter',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year'
}

// Rating distribution interface
export interface RatingDistribution {
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

// Route statistics interface
export interface RouteStats {
  routeName: string;
  rideCount: number;
  percentage: number;
}

// Hourly ride volume interface
export interface HourlyRideVolume {
  hour: number;
  rideCount: number;
}

// Conversion funnel data interface
export interface ConversionFunnelData {
  appVisits: number;
  rideRequests: number;
  completedRides: number;
  visitToRequestRate: number;
  requestToCompletionRate: number;
  overallConversionRate: number;
}

// Main performance data interface
export interface PerformanceData {
  // Key metrics
  averageDriverRating: number;
  busiestRoute: string;
  peakHours: string;
  conversionRate: number;
  
  // Detailed data
  ratingDistribution: RatingDistribution;
  topRoutes: RouteStats[];
  hourlyRideVolume: HourlyRideVolume[];
  conversionFunnel: ConversionFunnelData;
  
  // Additional metrics
  totalDrivers: number;
  totalRides: number;
  totalRevenue: number;
  averageRideDistance: number;
  averageRideDuration: number;
  
  // Time period info
  timePeriod: TimePeriodsEnum;
  startDate: string;
  endDate: string;
}

// API response wrapper
export interface PerformanceReportsResponse {
  success: boolean;
  data: PerformanceData;
  message?: string;
}
