import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Promotion {
  id: string;
  name: string;
  type: 'discount-code' | 'referral-bonus' | 'offer';
  code?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUsage: number;
  currentUsage: number;
  validFrom: Date;
  validTo: Date;
  status: 'Active' | 'Expired' | 'Inactive';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionStats {
  activePromotions: number;
  totalRedemptions: number;
  conversionRate: string;
  totalRevenueImpact: string;
}

export interface PaginatedPromotions {
  data: Promotion[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private promotionsSubject = new BehaviorSubject<Promotion[]>([]);
  public promotions$ = this.promotionsSubject.asObservable();

  private mockPromotions: Promotion[] = [
    {
      id: '1',
      name: 'FESTIVE50',
      type: 'discount-code',
      code: 'FEST50',
      discountType: 'percentage',
      discountValue: 50,
      maxUsage: 1000,
      currentUsage: 234,
      validFrom: new Date('2024-10-01'),
      validTo: new Date('2024-10-31'),
      status: 'Active',
      description: 'Festive season discount',
      createdAt: new Date('2024-09-15'),
      updatedAt: new Date('2024-09-15')
    },
    {
      id: '2',
      name: 'REFER100',
      type: 'referral-bonus',
      discountType: 'fixed',
      discountValue: 100,
      maxUsage: 5000,
      currentUsage: 450,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      status: 'Active',
      description: 'Referral bonus for new users',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'SUMMER10',
      type: 'offer',
      code: 'SUM10',
      discountType: 'percentage',
      discountValue: 10,
      maxUsage: 500,
      currentUsage: 78,
      validFrom: new Date('2024-06-01'),
      validTo: new Date('2024-08-31'),
      status: 'Expired',
      description: 'Summer special offer',
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-05-15')
    },
    {
      id: '4',
      name: 'WINTER25',
      type: 'discount-code',
      code: 'WIN25',
      discountType: 'percentage',
      discountValue: 25,
      maxUsage: 2000,
      currentUsage: 156,
      validFrom: new Date('2024-12-01'),
      validTo: new Date('2025-02-28'),
      status: 'Active',
      description: 'Winter season discount',
      createdAt: new Date('2024-11-15'),
      updatedAt: new Date('2024-11-15')
    },
    {
      id: '5',
      name: 'NEWUSER50',
      type: 'offer',
      code: 'NEW50',
      discountType: 'fixed',
      discountValue: 50,
      maxUsage: 10000,
      currentUsage: 1234,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      status: 'Active',
      description: 'New user welcome offer',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '6',
      name: 'FLASH20',
      type: 'discount-code',
      code: 'FLASH20',
      discountType: 'percentage',
      discountValue: 20,
      maxUsage: 100,
      currentUsage: 95,
      validFrom: new Date('2024-10-01'),
      validTo: new Date('2024-10-07'),
      status: 'Expired',
      description: 'Flash sale offer',
      createdAt: new Date('2024-09-30'),
      updatedAt: new Date('2024-09-30')
    },
    {
      id: '7',
      name: 'LOYALTY15',
      type: 'offer',
      code: 'LOY15',
      discountType: 'percentage',
      discountValue: 15,
      maxUsage: 5000,
      currentUsage: 789,
      validFrom: new Date('2024-06-01'),
      validTo: new Date('2024-12-31'),
      status: 'Active',
      description: 'Loyalty program reward',
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-05-15')
    },
    {
      id: '8',
      name: 'WEEKEND30',
      type: 'discount-code',
      code: 'WE30',
      discountType: 'percentage',
      discountValue: 30,
      maxUsage: 500,
      currentUsage: 234,
      validFrom: new Date('2024-10-05'),
      validTo: new Date('2024-10-27'),
      status: 'Active',
      description: 'Weekend special discount',
      createdAt: new Date('2024-10-04'),
      updatedAt: new Date('2024-10-04')
    },
    {
      id: '9',
      name: 'BIRTHDAY100',
      type: 'referral-bonus',
      discountType: 'fixed',
      discountValue: 100,
      maxUsage: 1000,
      currentUsage: 67,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      status: 'Active',
      description: 'Birthday month special',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '10',
      name: 'STUDENT20',
      type: 'offer',
      code: 'STU20',
      discountType: 'percentage',
      discountValue: 20,
      maxUsage: 3000,
      currentUsage: 456,
      validFrom: new Date('2024-08-01'),
      validTo: new Date('2024-12-31'),
      status: 'Active',
      description: 'Student discount program',
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15')
    },
    {
      id: '11',
      name: 'EARLY75',
      type: 'discount-code',
      code: 'EARLY75',
      discountType: 'fixed',
      discountValue: 75,
      maxUsage: 200,
      currentUsage: 189,
      validFrom: new Date('2024-05-01'),
      validTo: new Date('2024-05-31'),
      status: 'Expired',
      description: 'Early bird special',
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-04-15')
    },
    {
      id: '12',
      name: 'PREMIUM40',
      type: 'offer',
      code: 'PREM40',
      discountType: 'percentage',
      discountValue: 40,
      maxUsage: 1500,
      currentUsage: 678,
      validFrom: new Date('2024-09-01'),
      validTo: new Date('2024-11-30'),
      status: 'Active',
      description: 'Premium member exclusive',
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-08-15')
    }
  ];

  constructor() {
    this.promotionsSubject.next(this.mockPromotions);
  }

  getPromotions(page: number = 1, itemsPerPage: number = 10, searchText: string = '', statusFilter: string = ''): Observable<PaginatedPromotions> {
    return this.promotions$.pipe(
      map(promotions => {
        // Apply filters
        let filteredPromotions = promotions;
        
        // Apply search filter
        if (searchText) {
          const searchLower = searchText.toLowerCase();
          filteredPromotions = filteredPromotions.filter(promotion => 
            promotion.name.toLowerCase().includes(searchLower) ||
            (promotion.code && promotion.code.toLowerCase().includes(searchLower)) ||
            (promotion.description && promotion.description.toLowerCase().includes(searchLower))
          );
        }
        
        // Apply status filter
        if (statusFilter) {
          filteredPromotions = filteredPromotions.filter(promotion => 
            promotion.status === statusFilter
          );
        }
        
        // Apply pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredPromotions.slice(startIndex, endIndex);
        
        return {
          data: paginatedData,
          totalItems: filteredPromotions.length,
          totalPages: Math.ceil(filteredPromotions.length / itemsPerPage),
          currentPage: page,
          itemsPerPage: itemsPerPage
        };
      }),
      delay(500) // Simulate API delay
    );
  }

  getAllPromotions(): Observable<Promotion[]> {
    return this.promotions$.pipe(delay(500)); // For non-paginated requests
  }

  getPromotionById(id: string): Observable<Promotion | undefined> {
    return this.promotions$.pipe(
      map(promotions => promotions.find(p => p.id === id))
    );
  }

  createPromotion(promotionData: Partial<Promotion>): Observable<Promotion> {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      name: promotionData.name || '',
      type: promotionData.type || 'discount-code',
      code: promotionData.code,
      discountType: promotionData.discountType || 'percentage',
      discountValue: promotionData.discountValue || 0,
      maxUsage: promotionData.maxUsage || 0,
      currentUsage: 0,
      validFrom: promotionData.validFrom || new Date(),
      validTo: promotionData.validTo || new Date(),
      status: 'Active',
      description: promotionData.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentPromotions = this.promotionsSubject.value;
    this.promotionsSubject.next([...currentPromotions, newPromotion]);

    return of(newPromotion).pipe(delay(500));
  }

  updatePromotion(id: string, updates: Partial<Promotion>): Observable<Promotion> {
    const currentPromotions = this.promotionsSubject.value;
    const index = currentPromotions.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Promotion not found');
    }

    const updatedPromotion = {
      ...currentPromotions[index],
      ...updates,
      updatedAt: new Date()
    };

    const updatedPromotions = [...currentPromotions];
    updatedPromotions[index] = updatedPromotion;
    this.promotionsSubject.next(updatedPromotions);

    return of(updatedPromotion).pipe(delay(500));
  }

  deletePromotion(id: string): Observable<boolean> {
    const currentPromotions = this.promotionsSubject.value;
    const filteredPromotions = currentPromotions.filter(p => p.id !== id);
    this.promotionsSubject.next(filteredPromotions);

    return of(true).pipe(delay(500));
  }

  getPromotionStats(): Observable<PromotionStats> {
    const promotions = this.promotionsSubject.value;
    
    const stats: PromotionStats = {
      activePromotions: promotions.filter(p => p.status === 'Active').length,
      totalRedemptions: promotions.reduce((sum, p) => sum + p.currentUsage, 0),
      conversionRate: '18%', // This would be calculated from actual data
      totalRevenueImpact: '₹1.2L' // This would be calculated from actual data
    };

    return of(stats).pipe(delay(300));
  }

  validatePromotionCode(code: string): Observable<{ valid: boolean; promotion?: Promotion }> {
    const promotion = this.promotionsSubject.value.find(p => 
      p.code?.toUpperCase() === code.toUpperCase() && 
      p.status === 'Active' &&
      new Date() >= p.validFrom &&
      new Date() <= p.validTo &&
      p.currentUsage < p.maxUsage
    );

    return of({
      valid: !!promotion,
      promotion
    }).pipe(delay(300));
  }

  redeemPromotion(id: string): Observable<boolean> {
    const currentPromotions = this.promotionsSubject.value;
    const promotionIndex = currentPromotions.findIndex(p => p.id === id);
    
    if (promotionIndex === -1) {
      return of(false);
    }

    const promotion = currentPromotions[promotionIndex];
    if (promotion.currentUsage >= promotion.maxUsage) {
      return of(false);
    }

    const updatedPromotions = [...currentPromotions];
    updatedPromotions[promotionIndex] = {
      ...promotion,
      currentUsage: promotion.currentUsage + 1,
      updatedAt: new Date()
    };

    this.promotionsSubject.next(updatedPromotions);
    return of(true).pipe(delay(300));
  }
}
