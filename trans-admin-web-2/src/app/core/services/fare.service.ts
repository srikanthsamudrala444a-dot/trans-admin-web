import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  VehicleCategory, 
  FareStructure, 
  FareRule, 
  TariffTemplate, 
  FareAnalytics,
  FareCalculationResult,
  FareAuditLog
} from '../models/fare.model';

@Injectable({
  providedIn: 'root'
})
export class FareService {
  private vehicleCategoriesSubject = new BehaviorSubject<VehicleCategory[]>([]);
  private fareStructuresSubject = new BehaviorSubject<FareStructure[]>([]);
  private fareRulesSubject = new BehaviorSubject<FareRule[]>([]);
  private tariffTemplatesSubject = new BehaviorSubject<TariffTemplate[]>([]);

  vehicleCategories$ = this.vehicleCategoriesSubject.asObservable();
  fareStructures$ = this.fareStructuresSubject.asObservable();
  fareRules$ = this.fareRulesSubject.asObservable();
  tariffTemplates$ = this.tariffTemplatesSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  // Vehicle Categories
  getVehicleCategories(): Observable<VehicleCategory[]> {
    return this.vehicleCategories$;
  }

  createVehicleCategory(category: Omit<VehicleCategory, 'id'>): Observable<VehicleCategory> {
    const newCategory: VehicleCategory = {
      ...category,
      id: this.generateId()
    };
    
    const current = this.vehicleCategoriesSubject.value;
    this.vehicleCategoriesSubject.next([...current, newCategory]);
    
    return of(newCategory).pipe(delay(500));
  }

  updateVehicleCategory(id: string, updates: Partial<VehicleCategory>): Observable<VehicleCategory> {
    const current = this.vehicleCategoriesSubject.value;
    const index = current.findIndex(c => c.id === id);
    
    if (index !== -1) {
      const updated = { ...current[index], ...updates };
      current[index] = updated;
      this.vehicleCategoriesSubject.next([...current]);
      return of(updated).pipe(delay(500));
    }
    
    throw new Error('Category not found');
  }

  deleteVehicleCategory(id: string): Observable<boolean> {
    const current = this.vehicleCategoriesSubject.value;
    const filtered = current.filter(c => c.id !== id);
    this.vehicleCategoriesSubject.next(filtered);
    return of(true).pipe(delay(500));
  }

  // Fare Structures
  getFareStructures(): Observable<FareStructure[]> {
    return this.fareStructures$;
  }

  getFareStructuresByCategory(categoryId: string): Observable<FareStructure[]> {
    return this.fareStructures$.pipe(
      map(structures => structures.filter(s => s.vehicleCategoryId === categoryId))
    );
  }

  createFareStructure(structure: Omit<FareStructure, 'id' | 'createdAt' | 'updatedAt'>): Observable<FareStructure> {
    const newStructure: FareStructure = {
      ...structure,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const current = this.fareStructuresSubject.value;
    this.fareStructuresSubject.next([...current, newStructure]);
    
    return of(newStructure).pipe(delay(500));
  }

  updateFareStructure(id: string, updates: Partial<FareStructure>): Observable<FareStructure> {
    const current = this.fareStructuresSubject.value;
    const index = current.findIndex(s => s.id === id);
    
    if (index !== -1) {
      const updated = { ...current[index], ...updates, updatedAt: new Date() };
      current[index] = updated;
      this.fareStructuresSubject.next([...current]);
      return of(updated).pipe(delay(500));
    }
    
    throw new Error('Fare structure not found');
  }

  deleteFareStructure(id: string): Observable<boolean> {
    const current = this.fareStructuresSubject.value;
    const filtered = current.filter(s => s.id !== id);
    this.fareStructuresSubject.next(filtered);
    return of(true).pipe(delay(500));
  }

  // Fare Rules
  getFareRules(): Observable<FareRule[]> {
    return this.fareRules$;
  }

  createFareRule(rule: Omit<FareRule, 'id' | 'createdAt' | 'updatedAt'>): Observable<FareRule> {
    const newRule: FareRule = {
      ...rule,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const current = this.fareRulesSubject.value;
    this.fareRulesSubject.next([...current, newRule]);
    
    return of(newRule).pipe(delay(500));
  }

  updateFareRule(id: string, updates: Partial<FareRule>): Observable<FareRule> {
    const current = this.fareRulesSubject.value;
    const index = current.findIndex(r => r.id === id);
    
    if (index !== -1) {
      const updated = { ...current[index], ...updates, updatedAt: new Date() };
      current[index] = updated;
      this.fareRulesSubject.next([...current]);
      return of(updated).pipe(delay(500));
    }
    
    throw new Error('Fare rule not found');
  }

  deleteFareRule(id: string): Observable<boolean> {
    const current = this.fareRulesSubject.value;
    const filtered = current.filter(r => r.id !== id);
    this.fareRulesSubject.next(filtered);
    return of(true).pipe(delay(500));
  }

  // Tariff Templates
  getTariffTemplates(): Observable<TariffTemplate[]> {
    return this.tariffTemplates$;
  }

  createTariffTemplate(template: Omit<TariffTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<TariffTemplate> {
    const newTemplate: TariffTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const current = this.tariffTemplatesSubject.value;
    this.tariffTemplatesSubject.next([...current, newTemplate]);
    
    return of(newTemplate).pipe(delay(500));
  }

  // Analytics
  getFareAnalytics(dateRange?: { from: Date; to: Date }): Observable<FareAnalytics> {
    const mockAnalytics: FareAnalytics = {
      averageFareByCategory: {
        'cat-1': 12.50,
        'cat-2': 18.75,
        'cat-3': 25.30,
        'cat-4': 35.80
      },
      totalRevenue: 158750.40,
      totalTrips: 8420,
      fareDistribution: [
        { fareRange: '$0-10', count: 2105, percentage: 25 },
        { fareRange: '$10-20', count: 3368, percentage: 40 },
        { fareRange: '$20-30', count: 1684, percentage: 20 },
        { fareRange: '$30-50', count: 842, percentage: 10 },
        { fareRange: '$50+', count: 421, percentage: 5 }
      ],
      revenueTrends: this.generateRevenueTrends(),
      popularCategories: [
        { categoryId: 'cat-1', categoryName: 'Economy', trips: 3368, revenue: 42100, percentage: 40 },
        { categoryId: 'cat-2', categoryName: 'Comfort', trips: 2526, revenue: 47362.5, percentage: 30 },
        { categoryId: 'cat-3', categoryName: 'Premium', trips: 1684, revenue: 42601.2, percentage: 20 },
        { categoryId: 'cat-4', categoryName: 'Luxury', trips: 842, revenue: 30140.8, percentage: 10 }
      ]
    };

    return of(mockAnalytics).pipe(delay(1000));
  }

  // Fare Calculation
  calculateFare(params: {
    vehicleCategoryId: string;
    distance: number;
    duration: number;
    waitingTime?: number;
    isNightTime?: boolean;
    isPeakHour?: boolean;
  }): Observable<FareCalculationResult> {
    const fareStructure = this.fareStructuresSubject.value.find(s => 
      s.vehicleCategoryId === params.vehicleCategoryId && s.isActive
    );

    if (!fareStructure) {
      throw new Error('No active fare structure found for this vehicle category');
    }

    const baseFare = fareStructure.baseFare;
    const distanceCharge = params.distance * fareStructure.perKilometerCharge;
    const timeCharge = params.duration * fareStructure.perMinuteCharge;
    const waitingCharge = (params.waitingTime || 0) * fareStructure.waitingChargePerMinute;

    let totalBeforeAdjustments = baseFare + distanceCharge + timeCharge + waitingCharge;

    const surcharges = [];
    if (params.isNightTime && fareStructure.nightSurcharge > 0) {
      const nightSurcharge = totalBeforeAdjustments * (fareStructure.nightSurcharge / 100);
      surcharges.push({
        id: 'night',
        name: 'Night Surcharge',
        amount: nightSurcharge,
        type: 'PERCENTAGE' as const,
        reason: 'Applied for rides between 10 PM and 6 AM'
      });
    }

    if (params.isPeakHour && fareStructure.peakHourSurcharge > 0) {
      const peakSurcharge = totalBeforeAdjustments * (fareStructure.peakHourSurcharge / 100);
      surcharges.push({
        id: 'peak',
        name: 'Peak Hour Surcharge',
        amount: peakSurcharge,
        type: 'PERCENTAGE' as const,
        reason: 'Applied during peak hours'
      });
    }

    const totalAdjustments = surcharges.reduce((sum, s) => sum + s.amount, 0);
    let finalFare = totalBeforeAdjustments + totalAdjustments;
    
    const minimumFareApplied = finalFare < fareStructure.minimumFare;
    if (minimumFareApplied) {
      finalFare = fareStructure.minimumFare;
    }

    const result: FareCalculationResult = {
      baseFare,
      distanceCharge,
      timeCharge,
      waitingCharge,
      surcharges,
      discounts: [],
      totalBeforeAdjustments,
      totalAdjustments,
      finalFare,
      minimumFareApplied,
      breakdown: [
        { component: 'Base Fare', amount: baseFare, unit: '$', description: 'Fixed base fare' },
        { component: 'Distance', amount: distanceCharge, unit: '$', description: `${params.distance} km × $${fareStructure.perKilometerCharge}/km` },
        { component: 'Time', amount: timeCharge, unit: '$', description: `${params.duration} min × $${fareStructure.perMinuteCharge}/min` },
        { component: 'Waiting', amount: waitingCharge, unit: '$', description: `${params.waitingTime || 0} min × $${fareStructure.waitingChargePerMinute}/min` }
      ]
    };

    return of(result).pipe(delay(500));
  }

  // Audit Logs
  getAuditLogs(entityId?: string, entityType?: string): Observable<FareAuditLog[]> {
    const mockLogs: FareAuditLog[] = [
      {
        id: 'log-1',
        action: 'UPDATE',
        entityType: 'FARE_STRUCTURE',
        entityId: 'fare-1',
        oldValues: { baseFare: 2.50 },
        newValues: { baseFare: 3.00 },
        userId: 'admin-1',
        timestamp: new Date(Date.now() - 86400000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: 'log-2',
        action: 'CREATE',
        entityType: 'FARE_RULE',
        entityId: 'rule-1',
        oldValues: null,
        newValues: { name: 'Peak Hour Rule', isActive: true },
        userId: 'admin-1',
        timestamp: new Date(Date.now() - 172800000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...'
      }
    ];

    let filteredLogs = mockLogs;
    if (entityId) {
      filteredLogs = filteredLogs.filter(log => log.entityId === entityId);
    }
    if (entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === entityType);
    }

    return of(filteredLogs).pipe(delay(500));
  }

  private initializeMockData(): void {
    // Initialize Vehicle Categories
    const categories: VehicleCategory[] = [
      {
        id: 'cat-1',
        name: 'Economy',
        description: 'Standard vehicles for everyday rides',
        icon: 'directions_car',
        isActive: true,
        capacity: 4,
        features: ['Air Conditioning', 'Music System']
      },
      {
        id: 'cat-2',
        name: 'Premium',
        description: 'High-end vehicles for premium experience',
        icon: 'local_taxi',
        isActive: true,
        capacity: 4,
        features: ['Climate Control', 'Premium Audio', 'WiFi', 'Leather Seats']
      },
      {
        id: 'cat-3',
        name: 'SUV',
        description: 'Large SUV vehicles for group travel',
        icon: 'airport_shuttle',
        isActive: true,
        capacity: 6,
        features: ['Climate Control', 'Premium Sound System', 'Extra Space', 'WiFi']
      },
      {
        id: 'cat-4',
        name: 'Motorbike',
        description: 'Quick and efficient motorbike rides',
        icon: 'two_wheeler',
        isActive: true,
        capacity: 2,
        features: ['Helmet Provided', 'Quick Service']
      }
    ];

    // Initialize Fare Structures
    const fareStructures: FareStructure[] = [
      {
        id: 'fare-cat-1',
        vehicleCategoryId: 'cat-1',
        vehicleCategory: categories[0],
        baseFare: 50,
        perKilometerCharge: 10,
        perMinuteCharge: 1,
        minimumFare: 60,
        waitingChargePerMinute: 0.5,
        cancellationCharge: 20,
        nightSurcharge: 15,
        peakHourSurcharge: 25,
        isActive: true,
        effectiveFrom: new Date(Date.now() - 86400000 * 30),
        createdAt: new Date(Date.now() - 86400000 * 30),
        updatedAt: new Date(),
        createdBy: 'admin-1',
        updatedBy: 'admin-1'
      },
      {
        id: 'fare-cat-2',
        vehicleCategoryId: 'cat-2',
        vehicleCategory: categories[1],
        baseFare: 100,
        perKilometerCharge: 15,
        perMinuteCharge: 2,
        minimumFare: 120,
        waitingChargePerMinute: 1,
        cancellationCharge: 30,
        nightSurcharge: 15,
        peakHourSurcharge: 25,
        isActive: true,
        effectiveFrom: new Date(Date.now() - 86400000 * 30),
        createdAt: new Date(Date.now() - 86400000 * 30),
        updatedAt: new Date(),
        createdBy: 'admin-1',
        updatedBy: 'admin-1'
      },
      {
        id: 'fare-cat-3',
        vehicleCategoryId: 'cat-3',
        vehicleCategory: categories[2],
        baseFare: 150,
        perKilometerCharge: 18,
        perMinuteCharge: 2.5,
        minimumFare: 180,
        waitingChargePerMinute: 1.2,
        cancellationCharge: 50,
        nightSurcharge: 15,
        peakHourSurcharge: 25,
        isActive: true,
        effectiveFrom: new Date(Date.now() - 86400000 * 30),
        createdAt: new Date(Date.now() - 86400000 * 30),
        updatedAt: new Date(),
        createdBy: 'admin-1',
        updatedBy: 'admin-1'
      },
      {
        id: 'fare-cat-4',
        vehicleCategoryId: 'cat-4',
        vehicleCategory: categories[3],
        baseFare: 30,
        perKilometerCharge: 5,
        perMinuteCharge: 0.5,
        minimumFare: 35,
        waitingChargePerMinute: 0.2,
        cancellationCharge: 10,
        nightSurcharge: 15,
        peakHourSurcharge: 25,
        isActive: true,
        effectiveFrom: new Date(Date.now() - 86400000 * 30),
        createdAt: new Date(Date.now() - 86400000 * 30),
        updatedAt: new Date(),
        createdBy: 'admin-1',
        updatedBy: 'admin-1'
      }
    ];

    this.vehicleCategoriesSubject.next(categories);
    this.fareStructuresSubject.next(fareStructures);
  }

  private generateRevenueTrends() {
    const trends = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 10000) + 5000,
        trips: Math.floor(Math.random() * 500) + 200,
        averageFare: Math.floor(Math.random() * 20) + 10
      });
    }
    return trends;
  }

  private generateId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }
}
