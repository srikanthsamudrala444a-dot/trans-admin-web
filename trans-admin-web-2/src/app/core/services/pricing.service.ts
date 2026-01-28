import { Injectable } from '@angular/core';
import { Observable, of, delay, map, BehaviorSubject } from 'rxjs';
import { 
  Zone, 
  SurgePricingRule, 
  SurgeEvent, 
  ZoneMetrics, 
  PricingAnalytics, 
  DynamicPricingSettings,
  SurgeStatus,
  ZoneType,
  TriggerConditions,
  PricingMultiplier,
  TimeRestriction
} from '../models/pricing.model';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private realTimeMetricsSubject = new BehaviorSubject<ZoneMetrics[]>([]);
  public realTimeMetrics$ = this.realTimeMetricsSubject.asObservable();

  private mockZones: Zone[] = [
    {
      id: 'ZONE001',
      name: 'Downtown Core',
      description: 'Central business district with high demand during business hours',
      coordinates: [
        { lat: 28.6139, lng: 77.2090 },
        { lat: 28.6200, lng: 77.2090 },
        { lat: 28.6200, lng: 77.2200 },
        { lat: 28.6139, lng: 77.2200 }
      ],
      isActive: true,
      createdAt: new Date('2024-01-15T10:00:00'),
      updatedAt: new Date('2024-10-20T15:30:00')
    },
    {
      id: 'ZONE002',
      name: 'Airport Terminal',
      description: 'Main airport terminal area with consistent high demand',
      coordinates: [
        { lat: 28.5562, lng: 77.1000 },
        { lat: 28.5600, lng: 77.1000 },
        { lat: 28.5600, lng: 77.1100 },
        { lat: 28.5562, lng: 77.1100 }
      ],
      isActive: true,
      createdAt: new Date('2024-01-10T08:00:00'),
      updatedAt: new Date('2024-10-19T12:00:00')
    },
    {
      id: 'ZONE003',
      name: 'Tech Park District',
      description: 'Technology park with peak hours during office times',
      coordinates: [
        { lat: 28.4595, lng: 77.0266 },
        { lat: 28.4650, lng: 77.0266 },
        { lat: 28.4650, lng: 77.0350 },
        { lat: 28.4595, lng: 77.0350 }
      ],
      isActive: true,
      createdAt: new Date('2024-02-01T09:00:00'),
      updatedAt: new Date('2024-10-18T14:45:00')
    },
    {
      id: 'ZONE004',
      name: 'Entertainment District',
      description: 'Mall and entertainment area with evening and weekend peaks',
      coordinates: [
        { lat: 28.5245, lng: 77.2066 },
        { lat: 28.5300, lng: 77.2066 },
        { lat: 28.5300, lng: 77.2150 },
        { lat: 28.5245, lng: 77.2150 }
      ],
      isActive: true,
      createdAt: new Date('2024-02-15T11:00:00'),
      updatedAt: new Date('2024-10-17T16:20:00')
    },
    {
      id: 'ZONE005',
      name: 'Railway Station',
      description: 'Main railway station with consistent demand',
      coordinates: [
        { lat: 28.6431, lng: 77.2194 },
        { lat: 28.6480, lng: 77.2194 },
        { lat: 28.6480, lng: 77.2250 },
        { lat: 28.6431, lng: 77.2250 }
      ],
      isActive: false,
      createdAt: new Date('2024-03-01T07:00:00'),
      updatedAt: new Date('2024-10-16T10:30:00')
    }
  ];

  private mockSurgeRules: SurgePricingRule[] = [
    {
      id: 'RULE001',
      name: 'Downtown Peak Hours',
      zoneId: 'ZONE001',
      zoneName: 'Downtown Core',
      isActive: true,
      triggerConditions: {
        demandThreshold: 20,
        supplyThreshold: 5,
        demandToSupplyRatio: 3.0,
        waitTimeThreshold: 8,
        bookingVolumeThreshold: 15
      },
      pricingMultiplier: {
        baseMultiplier: 1.2,
        maxMultiplier: 2.5,
        incrementStep: 0.1,
        decrementStep: 0.05,
        evaluationInterval: 5
      },
      timeRestrictions: [
        {
          dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
          startTime: '08:00',
          endTime: '10:00'
        },
        {
          dayOfWeek: [1, 2, 3, 4, 5],
          startTime: '17:00',
          endTime: '20:00'
        }
      ],
      maxDuration: 60,
      cooldownPeriod: 30,
      createdAt: new Date('2024-01-15T10:00:00'),
      updatedAt: new Date('2024-10-20T15:30:00')
    },
    {
      id: 'RULE002',
      name: 'Airport Surge',
      zoneId: 'ZONE002',
      zoneName: 'Airport Terminal',
      isActive: true,
      triggerConditions: {
        demandThreshold: 15,
        supplyThreshold: 3,
        demandToSupplyRatio: 4.0,
        waitTimeThreshold: 12,
        bookingVolumeThreshold: 10
      },
      pricingMultiplier: {
        baseMultiplier: 1.5,
        maxMultiplier: 3.0,
        incrementStep: 0.15,
        decrementStep: 0.1,
        evaluationInterval: 3
      },
      maxDuration: 90,
      cooldownPeriod: 15,
      createdAt: new Date('2024-01-10T08:00:00'),
      updatedAt: new Date('2024-10-19T12:00:00')
    },
    {
      id: 'RULE003',
      name: 'Weekend Entertainment',
      zoneId: 'ZONE004',
      zoneName: 'Entertainment District',
      isActive: true,
      triggerConditions: {
        demandThreshold: 25,
        supplyThreshold: 8,
        demandToSupplyRatio: 2.5,
        waitTimeThreshold: 10,
        bookingVolumeThreshold: 20
      },
      pricingMultiplier: {
        baseMultiplier: 1.3,
        maxMultiplier: 2.2,
        incrementStep: 0.1,
        decrementStep: 0.05,
        evaluationInterval: 10
      },
      timeRestrictions: [
        {
          dayOfWeek: [5, 6, 0], // Friday, Saturday, Sunday
          startTime: '18:00',
          endTime: '02:00'
        }
      ],
      maxDuration: 120,
      cooldownPeriod: 45,
      createdAt: new Date('2024-02-15T11:00:00'),
      updatedAt: new Date('2024-10-17T16:20:00')
    }
  ];

  private mockSurgeEvents: SurgeEvent[] = [
    {
      id: 'SURGE001',
      zoneId: 'ZONE001',
      zoneName: 'Downtown Core',
      ruleId: 'RULE001',
      ruleName: 'Downtown Peak Hours',
      startTime: new Date('2024-10-23T08:15:00'),
      endTime: new Date('2024-10-23T09:30:00'),
      currentMultiplier: 1.8,
      maxMultiplierReached: 2.1,
      isActive: false,
      triggerReason: 'High demand-to-supply ratio during morning peak',
      demandCount: 35,
      supplyCount: 8,
      demandToSupplyRatio: 4.4,
      totalBookings: 28,
      totalRevenue: 4200,
      averageWaitTime: 12,
      createdAt: new Date('2024-10-23T08:15:00')
    },
    {
      id: 'SURGE002',
      zoneId: 'ZONE002',
      zoneName: 'Airport Terminal',
      ruleId: 'RULE002',
      ruleName: 'Airport Surge',
      startTime: new Date('2024-10-23T14:30:00'),
      currentMultiplier: 2.4,
      maxMultiplierReached: 2.4,
      isActive: true,
      triggerReason: 'Flight arrival congestion causing high demand',
      demandCount: 42,
      supplyCount: 6,
      demandToSupplyRatio: 7.0,
      totalBookings: 18,
      totalRevenue: 2850,
      averageWaitTime: 18,
      createdAt: new Date('2024-10-23T14:30:00')
    },
    {
      id: 'SURGE003',
      zoneId: 'ZONE004',
      zoneName: 'Entertainment District',
      ruleId: 'RULE003',
      ruleName: 'Weekend Entertainment',
      startTime: new Date('2024-10-22T20:00:00'),
      endTime: new Date('2024-10-22T23:45:00'),
      currentMultiplier: 1.6,
      maxMultiplierReached: 1.9,
      isActive: false,
      triggerReason: 'High weekend entertainment district demand',
      demandCount: 31,
      supplyCount: 12,
      demandToSupplyRatio: 2.6,
      totalBookings: 24,
      totalRevenue: 3600,
      averageWaitTime: 8,
      createdAt: new Date('2024-10-22T20:00:00')
    }
  ];

  private mockZoneMetrics: ZoneMetrics[] = [
    {
      zoneId: 'ZONE001',
      zoneName: 'Downtown Core',
      timestamp: new Date(),
      activeDrivers: 12,
      pendingBookings: 8,
      completedRides: 45,
      averageWaitTime: 6,
      demandScore: 75,
      supplyScore: 60,
      demandToSupplyRatio: 1.25,
      currentSurgeMultiplier: 1.0,
      estimatedRevenue: 6750
    },
    {
      zoneId: 'ZONE002',
      zoneName: 'Airport Terminal',
      timestamp: new Date(),
      activeDrivers: 8,
      pendingBookings: 15,
      completedRides: 32,
      averageWaitTime: 12,
      demandScore: 90,
      supplyScore: 40,
      demandToSupplyRatio: 2.25,
      currentSurgeMultiplier: 1.8,
      estimatedRevenue: 8940
    },
    {
      zoneId: 'ZONE003',
      zoneName: 'Tech Park District',
      timestamp: new Date(),
      activeDrivers: 15,
      pendingBookings: 5,
      completedRides: 28,
      averageWaitTime: 4,
      demandScore: 45,
      supplyScore: 85,
      demandToSupplyRatio: 0.53,
      currentSurgeMultiplier: 1.0,
      estimatedRevenue: 4200
    },
    {
      zoneId: 'ZONE004',
      zoneName: 'Entertainment District',
      timestamp: new Date(),
      activeDrivers: 10,
      pendingBookings: 12,
      completedRides: 38,
      averageWaitTime: 8,
      demandScore: 68,
      supplyScore: 55,
      demandToSupplyRatio: 1.24,
      currentSurgeMultiplier: 1.2,
      estimatedRevenue: 5700
    }
  ];

  private mockSettings: DynamicPricingSettings = {
    isGloballyEnabled: true,
    maxGlobalMultiplier: 3.0,
    defaultEvaluationInterval: 5,
    emergencyOverride: {
      isEnabled: true,
      maxMultiplier: 5.0,
      authorizedUsers: ['admin', 'pricing_manager'],
      requiresApproval: true
    },
    notificationSettings: {
      surgeStartNotifications: true,
      surgeEndNotifications: true,
      highMultiplierAlerts: true,
      multiplierThreshold: 2.0,
      notificationChannels: ['email', 'sms', 'push']
    },
    analyticsRetentionDays: 90
  };

  constructor() {
    // Simulate real-time metrics updates
    this.startRealTimeMetrics();
  }

  // Zone Management
  getZones(): Observable<Zone[]> {
    return of(this.mockZones).pipe(delay(500));
  }

  getZoneById(id: string): Observable<Zone | null> {
    const zone = this.mockZones.find(z => z.id === id);
    return of(zone || null).pipe(delay(300));
  }

  createZone(zone: Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>): Observable<Zone> {
    const newZone: Zone = {
      ...zone,
      id: 'ZONE' + String(this.mockZones.length + 1).padStart(3, '0'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockZones.push(newZone);
    return of(newZone).pipe(delay(800));
  }

  updateZone(id: string, updates: Partial<Zone>): Observable<Zone | null> {
    const index = this.mockZones.findIndex(z => z.id === id);
    if (index === -1) return of(null);
    
    this.mockZones[index] = {
      ...this.mockZones[index],
      ...updates,
      updatedAt: new Date()
    };
    return of(this.mockZones[index]).pipe(delay(600));
  }

  deleteZone(id: string): Observable<boolean> {
    const index = this.mockZones.findIndex(z => z.id === id);
    if (index === -1) return of(false);
    
    this.mockZones.splice(index, 1);
    return of(true).pipe(delay(400));
  }

  // Surge Pricing Rules
  getSurgeRules(): Observable<SurgePricingRule[]> {
    return of(this.mockSurgeRules).pipe(delay(600));
  }

  getSurgeRuleById(id: string): Observable<SurgePricingRule | null> {
    const rule = this.mockSurgeRules.find(r => r.id === id);
    return of(rule || null).pipe(delay(300));
  }

  createSurgeRule(rule: Omit<SurgePricingRule, 'id' | 'createdAt' | 'updatedAt'>): Observable<SurgePricingRule> {
    const newRule: SurgePricingRule = {
      ...rule,
      id: 'RULE' + String(this.mockSurgeRules.length + 1).padStart(3, '0'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockSurgeRules.push(newRule);
    return of(newRule).pipe(delay(800));
  }

  updateSurgeRule(id: string, updates: Partial<SurgePricingRule>): Observable<SurgePricingRule | null> {
    const index = this.mockSurgeRules.findIndex(r => r.id === id);
    if (index === -1) return of(null);
    
    this.mockSurgeRules[index] = {
      ...this.mockSurgeRules[index],
      ...updates,
      updatedAt: new Date()
    };
    return of(this.mockSurgeRules[index]).pipe(delay(600));
  }

  deleteSurgeRule(id: string): Observable<boolean> {
    const index = this.mockSurgeRules.findIndex(r => r.id === id);
    if (index === -1) return of(false);
    
    this.mockSurgeRules.splice(index, 1);
    return of(true).pipe(delay(400));
  }

  toggleSurgeRule(id: string, isActive: boolean): Observable<boolean> {
    const rule = this.mockSurgeRules.find(r => r.id === id);
    if (!rule) return of(false);
    
    rule.isActive = isActive;
    rule.updatedAt = new Date();
    return of(true).pipe(delay(300));
  }

  // Surge Events
  getSurgeEvents(zoneId?: string, isActive?: boolean): Observable<SurgeEvent[]> {
    let events = [...this.mockSurgeEvents];
    
    if (zoneId) {
      events = events.filter(e => e.zoneId === zoneId);
    }
    
    if (isActive !== undefined) {
      events = events.filter(e => e.isActive === isActive);
    }
    
    return of(events).pipe(delay(500));
  }

  getActiveSurgeEvents(): Observable<SurgeEvent[]> {
    return this.getSurgeEvents(undefined, true);
  }

  manuallyActivateSurge(zoneId: string, multiplier: number, reason: string): Observable<SurgeEvent> {
    const zone = this.mockZones.find(z => z.id === zoneId);
    if (!zone) throw new Error('Zone not found');

    const newSurgeEvent: SurgeEvent = {
      id: 'SURGE' + String(this.mockSurgeEvents.length + 1).padStart(3, '0'),
      zoneId,
      zoneName: zone.name,
      ruleId: 'MANUAL',
      ruleName: 'Manual Override',
      startTime: new Date(),
      currentMultiplier: multiplier,
      maxMultiplierReached: multiplier,
      isActive: true,
      triggerReason: `Manual activation: ${reason}`,
      demandCount: 0,
      supplyCount: 0,
      demandToSupplyRatio: 0,
      totalBookings: 0,
      totalRevenue: 0,
      averageWaitTime: 0,
      createdAt: new Date()
    };

    this.mockSurgeEvents.push(newSurgeEvent);
    return of(newSurgeEvent).pipe(delay(500));
  }

  deactivateSurge(surgeId: string): Observable<boolean> {
    const surge = this.mockSurgeEvents.find(s => s.id === surgeId);
    if (!surge) return of(false);
    
    surge.isActive = false;
    surge.endTime = new Date();
    return of(true).pipe(delay(300));
  }

  // Zone Metrics and Monitoring
  getZoneMetrics(zoneId?: string): Observable<ZoneMetrics[]> {
    let metrics = [...this.mockZoneMetrics];
    
    if (zoneId) {
      metrics = metrics.filter(m => m.zoneId === zoneId);
    }
    
    return of(metrics).pipe(delay(400));
  }

  getRealTimeMetrics(): Observable<ZoneMetrics[]> {
    return this.realTimeMetrics$;
  }

  // Analytics
  getPricingAnalytics(startDate: Date, endDate: Date): Observable<PricingAnalytics> {
    const analytics: PricingAnalytics = {
      totalSurgeEvents: 15,
      activeSurgeZones: 2,
      averageSurgeMultiplier: 1.6,
      surgeRevenue: 45000,
      surgeRevenuePercentage: 28.5,
      customerSatisfactionImpact: -5.2,
      driverEarningsIncrease: 18.7,
      peakHoursData: [
        { hour: 8, surgeFrequency: 85, averageMultiplier: 1.8, revenue: 5200 },
        { hour: 9, surgeFrequency: 92, averageMultiplier: 1.9, revenue: 5800 },
        { hour: 17, surgeFrequency: 78, averageMultiplier: 1.6, revenue: 4200 },
        { hour: 18, surgeFrequency: 88, averageMultiplier: 1.7, revenue: 4800 },
        { hour: 19, surgeFrequency: 65, averageMultiplier: 1.4, revenue: 3400 }
      ],
      zonePerformance: [
        {
          zoneId: 'ZONE001',
          zoneName: 'Downtown Core',
          surgeEventsCount: 8,
          averageMultiplier: 1.7,
          totalRevenue: 18500,
          customerRetention: 92.3
        },
        {
          zoneId: 'ZONE002',
          zoneName: 'Airport Terminal',
          surgeEventsCount: 12,
          averageMultiplier: 2.1,
          totalRevenue: 24500,
          customerRetention: 88.7
        }
      ]
    };
    
    return of(analytics).pipe(delay(800));
  }

  // Settings
  getDynamicPricingSettings(): Observable<DynamicPricingSettings> {
    return of(this.mockSettings).pipe(delay(300));
  }

  updateDynamicPricingSettings(settings: DynamicPricingSettings): Observable<DynamicPricingSettings> {
    this.mockSettings = { ...settings };
    return of(this.mockSettings).pipe(delay(500));
  }

  // Private methods
  private startRealTimeMetrics(): void {
    setInterval(() => {
      // Simulate real-time updates
      const updatedMetrics = this.mockZoneMetrics.map(metric => ({
        ...metric,
        timestamp: new Date(),
        activeDrivers: this.randomBetween(metric.activeDrivers - 3, metric.activeDrivers + 3),
        pendingBookings: this.randomBetween(0, 20),
        averageWaitTime: this.randomBetween(2, 15),
        demandScore: this.randomBetween(20, 100),
        supplyScore: this.randomBetween(20, 100),
        demandToSupplyRatio: Math.round((Math.random() * 3 + 0.5) * 100) / 100,
        currentSurgeMultiplier: Math.round((Math.random() * 1.5 + 1) * 10) / 10
      }));
      
      this.realTimeMetricsSubject.next(updatedMetrics);
    }, 10000); // Update every 10 seconds
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
