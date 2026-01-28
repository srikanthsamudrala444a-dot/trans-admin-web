export interface AnalyticsMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  format: 'number' | 'currency' | 'percentage';
}

export interface TrendData {
  date: Date;
  value: number;
  label?: string;
}

export interface AnalyticsTrend {
  id: string;
  title: string;
  data: TrendData[];
  color: string;
  type: 'line' | 'bar' | 'area';
}

export interface TimeRange {
  label: string;
  value: 'today' | 'yesterday' | '7days' | '30days' | '90days' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface AnalyticsDashboard {
  metrics: AnalyticsMetric[];
  trends: AnalyticsTrend[];
  lastUpdated: Date;
  timeRange: TimeRange;
}

export interface RevenueBreakdown {
  totalRevenue: number;
  rideRevenue: number;
  commissionRevenue: number;
  tipRevenue: number;
  surgePricing: number;
  cancellationFees: number;
}

export interface DriverAnalytics {
  totalDrivers: number;
  activeDrivers: number;
  newDriversToday: number;
  newDriversThisWeek: number;
  newDriversThisMonth: number;
  averageRating: number;
  topPerformers: {
    driverId: string;
    name: string;
    totalRides: number;
    rating: number;
    earnings: number;
  }[];
}

export interface PassengerAnalytics {
  totalPassengers: number;
  activePassengers: number;
  newPassengersToday: number;
  newPassengersThisWeek: number;
  newPassengersThisMonth: number;
  averageRating: number;
  repeatCustomers: number;
  repeatRate: number;
}

export interface TripAnalytics {
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  tripsToday: number;
  tripsThisWeek: number;
  tripsThisMonth: number;
  averageDistance: number;
  averageDuration: number;
  averageFare: number;
  peakHours: {
    hour: number;
    tripCount: number;
  }[];
}

export interface GeographicAnalytics {
  popularPickupLocations: {
    location: string;
    count: number;
    coordinates?: { lat: number; lng: number };
  }[];
  popularDropoffLocations: {
    location: string;
    count: number;
    coordinates?: { lat: number; lng: number };
  }[];
  cityDistribution: {
    city: string;
    tripCount: number;
    revenue: number;
  }[];
}

export interface VehicleAnalytics {
  totalVehicles: number;
  activeVehicles: number;
  vehicleTypeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  utilizationRate: number;
  maintenanceAlerts: number;
}

export interface ComprehensiveAnalytics {
  overview: AnalyticsDashboard;
  revenue: RevenueBreakdown;
  drivers: DriverAnalytics;
  passengers: PassengerAnalytics;
  trips: TripAnalytics;
  geographic: GeographicAnalytics;
  vehicles: VehicleAnalytics;
}

export interface AnalyticsFilters {
  timeRange: TimeRange;
  vehicleType?: string;
  city?: string;
  driverId?: string;
  customDateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
