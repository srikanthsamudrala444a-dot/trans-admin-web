import { Injectable } from '@angular/core';
import { Observable, of, delay, map, timer, switchMap } from 'rxjs';
import { 
  AnalyticsMetric, 
  AnalyticsTrend, 
  AnalyticsDashboard, 
  ComprehensiveAnalytics,
  AnalyticsFilters,
  TimeRange,
  TrendData,
  RevenueBreakdown,
  DriverAnalytics,
  PassengerAnalytics,
  TripAnalytics,
  GeographicAnalytics,
  VehicleAnalytics
} from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  constructor() {}

  // Real-time analytics data that updates every 30 seconds
  getRealTimeAnalytics(filters: AnalyticsFilters): Observable<ComprehensiveAnalytics> {
    return timer(0, 30000).pipe(
      switchMap(() => this.fetchAnalyticsData(filters))
    );
  }

  private fetchAnalyticsData(filters: AnalyticsFilters): Observable<ComprehensiveAnalytics> {
    return of(null).pipe(
      delay(800),
      map(() => {
        // Generate real-time data with some randomness to simulate live updates
        const now = new Date();
        const randomFactor = () => 0.95 + (Math.random() * 0.1); // 95-105% variation

        return {
          overview: this.generateOverviewMetrics(filters, randomFactor),
          revenue: this.generateRevenueBreakdown(randomFactor),
          drivers: this.generateDriverAnalytics(randomFactor),
          passengers: this.generatePassengerAnalytics(randomFactor),
          trips: this.generateTripAnalytics(randomFactor),
          geographic: this.generateGeographicAnalytics(),
          vehicles: this.generateVehicleAnalytics(randomFactor)
        };
      })
    );
  }

  private generateOverviewMetrics(filters: AnalyticsFilters, randomFactor: () => number): AnalyticsDashboard {
    const baseMetrics: AnalyticsMetric[] = [
      {
        label: 'Total Trips',
        value: Math.floor(12547 * randomFactor()),
        change: Math.floor((Math.random() - 0.5) * 20),
        changeType: Math.random() > 0.3 ? 'increase' : 'decrease',
        icon: 'directions_car',
        color: '#2196f3',
        format: 'number'
      },
      {
        label: 'Active Drivers',
        value: Math.floor(1847 * randomFactor()),
        change: Math.floor((Math.random() - 0.5) * 10),
        changeType: Math.random() > 0.4 ? 'increase' : 'decrease',
        icon: 'person',
        color: '#4caf50',
        format: 'number'
      },
      {
        label: 'Total Revenue',
        value: Math.floor(2456750 * randomFactor()),
        change: Math.floor((Math.random() - 0.5) * 15),
        changeType: Math.random() > 0.2 ? 'increase' : 'decrease',
        icon: 'attach_money',
        color: '#ff9800',
        format: 'currency'
      },
      {
        label: 'New Passengers',
        value: Math.floor(287 * randomFactor()),
        change: Math.floor((Math.random() - 0.5) * 25),
        changeType: Math.random() > 0.3 ? 'increase' : 'decrease',
        icon: 'person_add',
        color: '#9c27b0',
        format: 'number'
      },
      {
        label: 'New Drivers',
        value: Math.floor(42 * randomFactor()),
        change: Math.floor((Math.random() - 0.5) * 30),
        changeType: Math.random() > 0.4 ? 'increase' : 'decrease',
        icon: 'add_circle',
        color: '#673ab7',
        format: 'number'
      },
      {
        label: 'Average Rating',
        value: Number((4.2 + Math.random() * 0.6).toFixed(1)),
        change: Number(((Math.random() - 0.5) * 0.2).toFixed(1)),
        changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
        icon: 'star',
        color: '#ffc107',
        format: 'number'
      }
    ];

    // Update change types based on actual change values
    baseMetrics.forEach(metric => {
      metric.changeType = metric.change > 0 ? 'increase' : metric.change < 0 ? 'decrease' : 'neutral';
    });

    const trends: AnalyticsTrend[] = [
      {
        id: 'daily-trips',
        title: 'Daily Trips',
        color: '#2196f3',
        type: 'line',
        data: this.generateTrendData(30, 800, 1200)
      },
      {
        id: 'revenue-trend',
        title: 'Revenue Trend',
        color: '#ff9800',
        type: 'area',
        data: this.generateTrendData(30, 80000, 120000)
      },
      {
        id: 'driver-signups',
        title: 'New Driver Signups',
        color: '#4caf50',
        type: 'bar',
        data: this.generateTrendData(30, 5, 15)
      }
    ];

    return {
      metrics: baseMetrics,
      trends,
      lastUpdated: new Date(),
      timeRange: filters.timeRange
    };
  }

  private generateRevenueBreakdown(randomFactor: () => number): RevenueBreakdown {
    const totalRevenue = Math.floor(2456750 * randomFactor());
    return {
      totalRevenue,
      rideRevenue: Math.floor(totalRevenue * 0.75),
      commissionRevenue: Math.floor(totalRevenue * 0.15),
      tipRevenue: Math.floor(totalRevenue * 0.05),
      surgePricing: Math.floor(totalRevenue * 0.03),
      cancellationFees: Math.floor(totalRevenue * 0.02)
    };
  }

  private generateDriverAnalytics(randomFactor: () => number): DriverAnalytics {
    const totalDrivers = Math.floor(5647 * randomFactor());
    const activeDrivers = Math.floor(totalDrivers * 0.75);
    
    return {
      totalDrivers,
      activeDrivers,
      newDriversToday: Math.floor(12 * randomFactor()),
      newDriversThisWeek: Math.floor(87 * randomFactor()),
      newDriversThisMonth: Math.floor(342 * randomFactor()),
      averageRating: Number((4.3 + Math.random() * 0.4).toFixed(1)),
      topPerformers: [
        {
          driverId: 'drv-001',
          name: 'Rajesh Kumar',
          totalRides: Math.floor(245 * randomFactor()),
          rating: 4.9,
          earnings: Math.floor(125000 * randomFactor())
        },
        {
          driverId: 'drv-002',
          name: 'Suresh Singh',
          totalRides: Math.floor(221 * randomFactor()),
          rating: 4.8,
          earnings: Math.floor(118000 * randomFactor())
        },
        {
          driverId: 'drv-003',
          name: 'Amit Patel',
          totalRides: Math.floor(198 * randomFactor()),
          rating: 4.7,
          earnings: Math.floor(102000 * randomFactor())
        }
      ]
    };
  }

  private generatePassengerAnalytics(randomFactor: () => number): PassengerAnalytics {
    const totalPassengers = Math.floor(25847 * randomFactor());
    const activePassengers = Math.floor(totalPassengers * 0.45);
    const repeatCustomers = Math.floor(activePassengers * 0.65);
    
    return {
      totalPassengers,
      activePassengers,
      newPassengersToday: Math.floor(127 * randomFactor()),
      newPassengersThisWeek: Math.floor(892 * randomFactor()),
      newPassengersThisMonth: Math.floor(3247 * randomFactor()),
      averageRating: Number((4.1 + Math.random() * 0.6).toFixed(1)),
      repeatCustomers,
      repeatRate: Number(((repeatCustomers / activePassengers) * 100).toFixed(1))
    };
  }

  private generateTripAnalytics(randomFactor: () => number): TripAnalytics {
    const totalTrips = Math.floor(125847 * randomFactor());
    const completedTrips = Math.floor(totalTrips * 0.92);
    const cancelledTrips = totalTrips - completedTrips;
    
    return {
      totalTrips,
      completedTrips,
      cancelledTrips,
      tripsToday: Math.floor(1247 * randomFactor()),
      tripsThisWeek: Math.floor(8734 * randomFactor()),
      tripsThisMonth: Math.floor(34829 * randomFactor()),
      averageDistance: Number((12.4 + Math.random() * 5).toFixed(1)),
      averageDuration: Math.floor(28 + Math.random() * 15),
      averageFare: Math.floor(245 + Math.random() * 100),
      peakHours: [
        { hour: 8, tripCount: Math.floor(450 * randomFactor()) },
        { hour: 9, tripCount: Math.floor(520 * randomFactor()) },
        { hour: 17, tripCount: Math.floor(480 * randomFactor()) },
        { hour: 18, tripCount: Math.floor(540 * randomFactor()) },
        { hour: 19, tripCount: Math.floor(465 * randomFactor()) }
      ]
    };
  }

  private generateGeographicAnalytics(): GeographicAnalytics {
    return {
      popularPickupLocations: [
        { location: 'Koramangala', count: 2847 },
        { location: 'Indiranagar', count: 2456 },
        { location: 'Whitefield', count: 2234 },
        { location: 'Electronic City', count: 1987 },
        { location: 'Marathahalli', count: 1756 }
      ],
      popularDropoffLocations: [
        { location: 'Kempegowda Airport', count: 3456 },
        { location: 'MG Road', count: 2891 },
        { location: 'Banashankari', count: 2567 },
        { location: 'Jayanagar', count: 2234 },
        { location: 'HSR Layout', count: 1998 }
      ],
      cityDistribution: [
        { city: 'Bangalore', tripCount: 45678, revenue: 1234567 },
        { city: 'Mumbai', tripCount: 38456, revenue: 987654 },
        { city: 'Delhi', tripCount: 32145, revenue: 876543 },
        { city: 'Chennai', tripCount: 28765, revenue: 654321 },
        { city: 'Hyderabad', tripCount: 24567, revenue: 543210 }
      ]
    };
  }

  private generateVehicleAnalytics(randomFactor: () => number): VehicleAnalytics {
    const totalVehicles = Math.floor(6847 * randomFactor());
    const activeVehicles = Math.floor(totalVehicles * 0.82);
    
    return {
      totalVehicles,
      activeVehicles,
      vehicleTypeDistribution: [
        { type: 'Economy', count: Math.floor(totalVehicles * 0.45), percentage: 45 },
        { type: 'Premium', count: Math.floor(totalVehicles * 0.30), percentage: 30 },
        { type: 'SUV', count: Math.floor(totalVehicles * 0.15), percentage: 15 },
        { type: 'Motorbike', count: Math.floor(totalVehicles * 0.10), percentage: 10 }
      ],
      utilizationRate: Number((78 + Math.random() * 15).toFixed(1)),
      maintenanceAlerts: Math.floor(47 * randomFactor())
    };
  }

  private generateTrendData(days: number, min: number, max: number): TrendData[] {
    const data: TrendData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const value = min + Math.random() * (max - min);
      data.push({
        date,
        value: Math.floor(value),
        label: date.toLocaleDateString()
      });
    }
    
    return data;
  }

  // Get specific metric trends
  getMetricTrend(metricId: string, timeRange: TimeRange): Observable<AnalyticsTrend> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const days = this.getDaysFromTimeRange(timeRange);
        
        switch (metricId) {
          case 'trips':
            return {
              id: 'trips',
              title: 'Trip Trends',
              color: '#2196f3',
              type: 'line',
              data: this.generateTrendData(days, 800, 1200)
            };
          case 'revenue':
            return {
              id: 'revenue',
              title: 'Revenue Trends',
              color: '#ff9800',
              type: 'area',
              data: this.generateTrendData(days, 80000, 120000)
            };
          case 'drivers':
            return {
              id: 'drivers',
              title: 'Driver Growth',
              color: '#4caf50',
              type: 'bar',
              data: this.generateTrendData(days, 1800, 2000)
            };
          default:
            return {
              id: metricId,
              title: 'Metric Trend',
              color: '#9c27b0',
              type: 'line',
              data: this.generateTrendData(days, 100, 500)
            };
        }
      })
    );
  }

  private getDaysFromTimeRange(timeRange: TimeRange): number {
    switch (timeRange.value) {
      case 'today':
      case 'yesterday':
        return 1;
      case '7days':
        return 7;
      case '30days':
        return 30;
      case '90days':
        return 90;
      default:
        return 30;
    }
  }

  // Export analytics data
  exportAnalytics(filters: AnalyticsFilters): Observable<Blob> {
    return of(null).pipe(
      delay(2000),
      map(() => {
        const csvContent = `Analytics Report - ${new Date().toLocaleDateString()}\n\n` +
          `Metric,Value,Change\n` +
          `Total Trips,12547,+5.2%\n` +
          `Active Drivers,1847,+2.1%\n` +
          `Total Revenue,₹24,56,750,+8.7%\n` +
          `New Passengers,287,+12.3%\n` +
          `New Drivers,42,+18.5%\n` +
          `Average Rating,4.6,+0.2\n`;
        
        return new Blob([csvContent], { type: 'text/csv' });
      })
    );
  }
}
