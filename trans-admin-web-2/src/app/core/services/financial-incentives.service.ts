import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import {
  FinancialIncentive,
  IncentiveType,
  IncentiveStatus,
  LoyaltyProgram,
  ReferralProgram,
  UserIncentiveHistory,
  IncentiveAnalytics,
  IncentiveFilters,
  PaginatedIncentives,
  IncentiveConfiguration,
  IncentiveReward,
  IncentiveRules,
  EligibilityCriteria,
  IncentiveBudget,
  IncentivePerformance
} from '../models/incentive.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialIncentivesService {
  private incentivesSubject = new BehaviorSubject<FinancialIncentive[]>([]);
  public incentives$ = this.incentivesSubject.asObservable();

  private loyaltyProgramsSubject = new BehaviorSubject<LoyaltyProgram[]>([]);
  public loyaltyPrograms$ = this.loyaltyProgramsSubject.asObservable();

  private referralProgramsSubject = new BehaviorSubject<ReferralProgram[]>([]);
  public referralPrograms$ = this.referralProgramsSubject.asObservable();

  private mockIncentives: FinancialIncentive[] = [
    {
      id: 'inc-001',
      name: 'New User Signup Bonus',
      type: 'signup_bonus',
      status: 'active',
      description: 'Welcome bonus for new users completing their first ride',
      rules: {
        triggerEvent: 'ride_completion',
        frequency: 'one_time',
        conditions: [
          {
            field: 'user_type',
            operator: 'equals',
            value: 'new_user',
            description: 'User must be new to the platform'
          },
          {
            field: 'ride_count',
            operator: 'equals',
            value: 1,
            description: 'Must be users first completed ride'
          }
        ],
        limitations: {
          maxRedemptionsPerUser: 1,
          maxRedemptionsTotal: 10000,
          minimumRideAmount: 5.00,
          applicableUserTiers: ['bronze', 'silver', 'gold', 'platinum'],
          applicableRegions: ['US', 'CA', 'UK']
        }
      },
      rewards: {
        rewardType: 'fixed_amount',
        value: 10.00,
        currency: 'USD'
      },
      eligibility: {
        userTypes: ['new_user'],
        minRideCount: 0,
        registrationDateRange: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        },
        excludedUsers: [],
        requiredUserTags: ['eligible_for_bonus']
      },
      budget: {
        totalBudget: 100000,
        spentAmount: 25000,
        remainingBudget: 75000,
        budgetType: 'fixed',
        costPerRedemption: 10.00
      },
      performance: {
        totalRedemptions: 2500,
        uniqueUsers: 2500,
        totalCost: 25000,
        conversionRate: 85.5,
        roi: 245.8,
        averageRewardValue: 10.00,
        revenueGenerated: 61450
      },
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-10-30'),
      createdBy: 'admin-001'
    },
    {
      id: 'inc-002',
      name: 'Loyalty Points Program',
      type: 'loyalty_points',
      status: 'active',
      description: 'Earn points for every ride to redeem for discounts',
      rules: {
        triggerEvent: 'ride_completion',
        frequency: 'per_ride',
        conditions: [
          {
            field: 'ride_amount',
            operator: 'greater_than',
            value: 5.00,
            description: 'Minimum ride amount required'
          }
        ],
        limitations: {
          applicableUserTiers: ['bronze', 'silver', 'gold', 'platinum'],
          applicableRegions: ['US', 'CA', 'UK', 'AU']
        }
      },
      rewards: {
        rewardType: 'points',
        value: 1,
        pointsMultiplier: 1
      },
      eligibility: {
        userTypes: ['existing_user', 'premium_user'],
        minRideCount: 1,
        requiredUserTags: ['loyalty_eligible']
      },
      budget: {
        totalBudget: 500000,
        spentAmount: 125000,
        remainingBudget: 375000,
        budgetType: 'fixed',
        costPerRedemption: 0.05
      },
      performance: {
        totalRedemptions: 150000,
        uniqueUsers: 15000,
        totalCost: 125000,
        conversionRate: 92.3,
        roi: 312.4,
        averageRewardValue: 0.83,
        revenueGenerated: 390500
      },
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2025-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-10-30'),
      createdBy: 'admin-002'
    },
    {
      id: 'inc-003',
      name: 'Weekend Cashback',
      type: 'cashback',
      status: 'active',
      description: '5% cashback on all weekend rides',
      rules: {
        triggerEvent: 'ride_completion',
        frequency: 'per_ride',
        conditions: [
          {
            field: 'day_of_week',
            operator: 'in',
            value: ['Saturday', 'Sunday'],
            description: 'Ride must be on weekend'
          },
          {
            field: 'ride_amount',
            operator: 'greater_than',
            value: 10.00,
            description: 'Minimum ride amount'
          }
        ],
        limitations: {
          maxRedemptionsPerUser: 4,
          applicableUserTiers: ['silver', 'gold', 'platinum'],
          cooldownPeriod: 0
        }
      },
      rewards: {
        rewardType: 'percentage',
        value: 5,
        currency: 'USD'
      },
      eligibility: {
        userTypes: ['existing_user', 'premium_user'],
        minRideCount: 5,
        minSpendAmount: 50.00
      },
      budget: {
        totalBudget: 50000,
        spentAmount: 18500,
        remainingBudget: 31500,
        budgetType: 'fixed',
        costPerRedemption: 2.50
      },
      performance: {
        totalRedemptions: 7400,
        uniqueUsers: 3200,
        totalCost: 18500,
        conversionRate: 68.2,
        roi: 189.7,
        averageRewardValue: 2.50,
        revenueGenerated: 53592
      },
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-10-30'),
      createdBy: 'admin-003'
    }
  ];

  private mockLoyaltyPrograms: LoyaltyProgram[] = [
    {
      id: 'loyalty-001',
      name: 'RideRewards Program',
      description: 'Earn points and unlock exclusive benefits with every ride',
      tiers: [
        {
          id: 'tier-bronze',
          name: 'Bronze',
          level: 1,
          minPoints: 0,
          maxPoints: 999,
          pointsRequired: 0,
          color: '#CD7F32',
          icon: 'bronze-medal',
          benefits: [
            {
              type: 'points_multiplier',
              value: 1,
              description: 'Earn 1x points on rides'
            }
          ],
          requirements: [
            {
              type: 'rides_count',
              value: 0,
              timeframe: 'monthly'
            }
          ]
        },
        {
          id: 'tier-silver',
          name: 'Silver',
          level: 2,
          minPoints: 1000,
          maxPoints: 4999,
          pointsRequired: 1000,
          color: '#C0C0C0',
          icon: 'silver-medal',
          benefits: [
            {
              type: 'points_multiplier',
              value: 1.2,
              description: 'Earn 1.2x points on rides'
            },
            {
              type: 'discount',
              value: 5,
              description: '5% discount on rides'
            }
          ],
          requirements: [
            {
              type: 'points_earned',
              value: 1000,
              timeframe: 'yearly'
            }
          ]
        },
        {
          id: 'tier-gold',
          name: 'Gold',
          level: 3,
          minPoints: 5000,
          maxPoints: 14999,
          pointsRequired: 5000,
          color: '#FFD700',
          icon: 'gold-medal',
          benefits: [
            {
              type: 'points_multiplier',
              value: 1.5,
              description: 'Earn 1.5x points on rides'
            },
            {
              type: 'discount',
              value: 10,
              description: '10% discount on rides'
            },
            {
              type: 'priority_booking',
              value: 1,
              description: 'Priority booking access'
            }
          ],
          requirements: [
            {
              type: 'points_earned',
              value: 5000,
              timeframe: 'yearly'
            }
          ]
        },
        {
          id: 'tier-platinum',
          name: 'Platinum',
          level: 4,
          minPoints: 15000,
          pointsRequired: 15000,
          color: '#E5E4E2',
          icon: 'platinum-medal',
          benefits: [
            {
              type: 'points_multiplier',
              value: 2,
              description: 'Earn 2x points on rides'
            },
            {
              type: 'discount',
              value: 15,
              description: '15% discount on rides'
            },
            {
              type: 'priority_booking',
              value: 1,
              description: 'Priority booking access'
            },
            {
              type: 'free_cancellation',
              value: 1,
              description: 'Free ride cancellations'
            }
          ],
          requirements: [
            {
              type: 'points_earned',
              value: 15000,
              timeframe: 'yearly'
            }
          ]
        }
      ],
      pointsSystem: {
        pointsPerRide: 10,
        pointsPerDollar: 1,
        bonusMultipliers: [
          {
            condition: 'weekend_ride',
            multiplier: 1.5,
            description: '1.5x points on weekend rides'
          },
          {
            condition: 'peak_hours',
            multiplier: 1.25,
            description: '1.25x points during peak hours'
          }
        ],
        redemptionRates: [
          {
            pointsRequired: 100,
            rewardValue: 5,
            rewardType: 'ride_credit'
          },
          {
            pointsRequired: 500,
            rewardValue: 25,
            rewardType: 'ride_credit'
          },
          {
            pointsRequired: 1000,
            rewardValue: 50,
            rewardType: 'ride_credit'
          }
        ],
        expirationPolicy: {
          enabled: true,
          expirationPeriod: 24,
          warningPeriod: 30
        }
      },
      benefits: [
        {
          id: 'benefit-001',
          name: 'Birthday Bonus',
          type: 'points_bonus',
          value: 500,
          applicableTiers: ['silver', 'gold', 'platinum'],
          description: '500 bonus points on your birthday month'
        }
      ],
      status: 'active',
      activeMembers: 15420,
      totalPointsEarned: 2450000,
      totalPointsRedeemed: 850000,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-10-30')
    }
  ];

  private mockReferralPrograms: ReferralProgram[] = [
    {
      id: 'ref-001',
      name: 'Refer a Friend Program',
      description: 'Earn rewards by referring new users to our platform',
      referrerReward: {
        rewardType: 'fixed_amount',
        value: 15,
        currency: 'USD'
      },
      refereeReward: {
        rewardType: 'fixed_amount',
        value: 10,
        currency: 'USD'
      },
      conditions: [
        {
          type: 'first_ride_completion',
          value: 1,
          timeframe: 30
        },
        {
          type: 'minimum_spend',
          value: 10,
          timeframe: 30
        }
      ],
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-12-31'),
      status: 'active',
      totalReferrals: 5200,
      successfulReferrals: 3640,
      conversionRate: 70.0,
      performance: {
        totalReferrals: 5200,
        successfulReferrals: 3640,
        conversionRate: 70.0,
        totalRewardsPaid: 91000,
        averageReferralValue: 25
      }
    }
  ];

  private mockUserIncentiveHistory: UserIncentiveHistory[] = [
    {
      id: 'hist-001',
      userId: 'user-001',
      userName: 'John Doe',
      incentiveId: 'inc-001',
      incentiveName: 'New User Signup Bonus',
      rewardType: 'fixed_amount',
      rewardValue: 10.00,
      redemptionDate: new Date('2024-10-15'),
      status: 'completed',
      transactionId: 'txn-001',
      rideId: 'ride-001'
    },
    {
      id: 'hist-002',
      userId: 'user-002',
      userName: 'Jane Smith',
      incentiveId: 'inc-002',
      incentiveName: 'Loyalty Points Program',
      rewardType: 'points',
      rewardValue: 15,
      pointsEarned: 15,
      redemptionDate: new Date('2024-10-20'),
      status: 'completed',
      rideId: 'ride-002'
    }
  ];

  constructor() {
    this.incentivesSubject.next(this.mockIncentives);
    this.loyaltyProgramsSubject.next(this.mockLoyaltyPrograms);
    this.referralProgramsSubject.next(this.mockReferralPrograms);
  }

  // Financial Incentives CRUD Operations
  getIncentives(filters?: IncentiveFilters, page?: number, pageSize?: number): Observable<PaginatedIncentives> {
    let filteredIncentives = [...this.mockIncentives];

    // Apply filters
    if (filters) {
      if (filters.status?.length) {
        filteredIncentives = filteredIncentives.filter(incentive =>
          filters.status!.includes(incentive.status)
        );
      }

      if (filters.type?.length) {
        filteredIncentives = filteredIncentives.filter(incentive =>
          filters.type!.includes(incentive.type)
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredIncentives = filteredIncentives.filter(incentive =>
          incentive.name.toLowerCase().includes(query) ||
          incentive.description.toLowerCase().includes(query)
        );
      }

      if (filters.dateRange) {
        filteredIncentives = filteredIncentives.filter(incentive =>
          incentive.validFrom >= filters.dateRange!.startDate &&
          incentive.validTo <= filters.dateRange!.endDate
        );
      }

      if (filters.budgetRange) {
        filteredIncentives = filteredIncentives.filter(incentive =>
          incentive.budget.totalBudget >= filters.budgetRange!.min &&
          incentive.budget.totalBudget <= filters.budgetRange!.max
        );
      }
    }

    // Apply pagination
    const totalItems = filteredIncentives.length;
    const currentPage = page || 1;
    const itemsPerPage = pageSize || 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredIncentives.slice(startIndex, startIndex + itemsPerPage);

    const result: PaginatedIncentives = {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage
    };

    return of(result).pipe(delay(500));
  }

  getIncentiveById(id: string): Observable<FinancialIncentive | undefined> {
    const incentive = this.mockIncentives.find(i => i.id === id);
    return of(incentive).pipe(delay(300));
  }

  createIncentive(incentive: Omit<FinancialIncentive, 'id' | 'createdAt' | 'updatedAt'>): Observable<FinancialIncentive> {
    const newIncentive: FinancialIncentive = {
      ...incentive,
      id: `inc-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockIncentives.push(newIncentive);
    this.incentivesSubject.next(this.mockIncentives);

    return of(newIncentive).pipe(delay(300));
  }

  updateIncentive(id: string, updates: Partial<FinancialIncentive>): Observable<FinancialIncentive> {
    const index = this.mockIncentives.findIndex(i => i.id === id);
    if (index === -1) {
      return throwError(() => new Error('Incentive not found'));
    }

    const updatedIncentive = {
      ...this.mockIncentives[index],
      ...updates,
      updatedAt: new Date()
    };

    this.mockIncentives[index] = updatedIncentive;
    this.incentivesSubject.next(this.mockIncentives);

    return of(updatedIncentive).pipe(delay(300));
  }

  deleteIncentive(id: string): Observable<boolean> {
    const index = this.mockIncentives.findIndex(i => i.id === id);
    if (index === -1) {
      return throwError(() => new Error('Incentive not found'));
    }

    this.mockIncentives.splice(index, 1);
    this.incentivesSubject.next(this.mockIncentives);

    return of(true).pipe(delay(300));
  }

  // Loyalty Program Operations
  getLoyaltyPrograms(): Observable<LoyaltyProgram[]> {
    return of(this.mockLoyaltyPrograms).pipe(delay(300));
  }

  getLoyaltyProgramById(id: string): Observable<LoyaltyProgram | undefined> {
    const program = this.mockLoyaltyPrograms.find(p => p.id === id);
    return of(program).pipe(delay(300));
  }

  // Referral Program Operations
  getReferralPrograms(): Observable<ReferralProgram[]> {
    return of(this.mockReferralPrograms).pipe(delay(300));
  }

  getReferralProgramById(id: string): Observable<ReferralProgram | undefined> {
    const program = this.mockReferralPrograms.find(p => p.id === id);
    return of(program).pipe(delay(300));
  }

  // User Incentive History
  getUserIncentiveHistory(userId?: string, page?: number, pageSize?: number): Observable<UserIncentiveHistory[]> {
    let history = [...this.mockUserIncentiveHistory];

    if (userId) {
      history = history.filter(h => h.userId === userId);
    }

    return of(history).pipe(delay(300));
  }

  // Analytics and Reporting
  getIncentiveAnalytics(dateRange?: { startDate: Date; endDate: Date }): Observable<IncentiveAnalytics> {
    const analytics: IncentiveAnalytics = {
      overview: {
        totalActiveIncentives: this.mockIncentives.filter(i => i.status === 'active').length,
        totalRedemptions: this.mockIncentives.reduce((sum, i) => sum + i.performance.totalRedemptions, 0),
        totalCost: this.mockIncentives.reduce((sum, i) => sum + i.performance.totalCost, 0),
        averageRedemptionValue: this.mockIncentives.reduce((sum, i) => sum + i.performance.averageRewardValue, 0) / this.mockIncentives.length,
        uniqueParticipants: this.mockIncentives.reduce((sum, i) => sum + i.performance.uniqueUsers, 0)
      },
      performanceByType: [
        {
          type: 'signup_bonus',
          count: 1,
          redemptions: 2500,
          cost: 25000,
          conversionRate: 85.5
        },
        {
          type: 'loyalty_points',
          count: 1,
          redemptions: 150000,
          cost: 125000,
          conversionRate: 92.3
        },
        {
          type: 'cashback',
          count: 1,
          redemptions: 7400,
          cost: 18500,
          conversionRate: 68.2
        }
      ],
      userEngagement: {
        newUserParticipation: 85.5,
        returningUserParticipation: 92.3,
        averageIncentivesPerUser: 2.3,
        topPerformingUserSegments: [
          {
            segment: 'Premium Users',
            userCount: 5000,
            redemptionRate: 95.2,
            averageValue: 25.50
          },
          {
            segment: 'Regular Users',
            userCount: 15000,
            redemptionRate: 78.4,
            averageValue: 12.75
          }
        ]
      },
      financialImpact: {
        totalIncentiveCost: 168500,
        revenueGenerated: 505542,
        roi: 200.1,
        costPerAcquisition: 15.25,
        lifetimeValueImpact: 45.8
      },
      trends: {
        redemptionTrends: [
          { date: new Date('2024-10-01'), value: 1250 },
          { date: new Date('2024-10-15'), value: 1450 },
          { date: new Date('2024-10-30'), value: 1680 }
        ],
        costTrends: [
          { date: new Date('2024-10-01'), value: 15000 },
          { date: new Date('2024-10-15'), value: 17250 },
          { date: new Date('2024-10-30'), value: 19800 }
        ],
        participationTrends: [
          { date: new Date('2024-10-01'), value: 850 },
          { date: new Date('2024-10-15'), value: 920 },
          { date: new Date('2024-10-30'), value: 1050 }
        ]
      },
      // Additional dashboard properties
      totalRedemptions: this.mockIncentives.reduce((sum, i) => sum + i.performance.totalRedemptions, 0),
      totalCost: this.mockIncentives.reduce((sum, i) => sum + i.performance.totalCost, 0),
      averageROI: this.mockIncentives.reduce((sum, i) => sum + i.performance.roi, 0) / this.mockIncentives.length,
      activePrograms: this.mockIncentives.filter(i => i.status === 'active').length,
      totalRevenueImpact: this.mockIncentives.reduce((sum, i) => sum + i.performance.revenueGenerated, 0),
      userEngagementRate: 87.5,
      retentionRate: 92.3,
      topPerformers: this.mockIncentives
        .sort((a, b) => b.performance.roi - a.performance.roi)
        .slice(0, 5)
        .map(incentive => ({
          id: incentive.id,
          name: incentive.name,
          type: incentive.type,
          roi: incentive.performance.roi,
          redemptions: incentive.performance.totalRedemptions
        }))
    };

    return of(analytics).pipe(delay(800));
  }

  // Configuration Management
  getIncentiveConfiguration(): Observable<IncentiveConfiguration> {
    const config: IncentiveConfiguration = {
      defaultPointsPerRide: 10,
      defaultPointsPerDollar: 1,
      maxBudgetPerIncentive: 1000000,
      maxRedemptionsPerUser: 10,
      approvalRequired: true,
      autoActivation: false,
      defaultValidityPeriod: 365
    };

    return of(config).pipe(delay(300));
  }

  updateIncentiveConfiguration(config: IncentiveConfiguration): Observable<IncentiveConfiguration> {
    // In a real implementation, this would save to backend
    return of(config).pipe(delay(300));
  }

  // Utility Methods
  activateIncentive(id: string): Observable<FinancialIncentive> {
    return this.updateIncentive(id, { status: 'active' });
  }

  pauseIncentive(id: string): Observable<FinancialIncentive> {
    return this.updateIncentive(id, { status: 'paused' });
  }

  expireIncentive(id: string): Observable<FinancialIncentive> {
    return this.updateIncentive(id, { status: 'expired' });
  }

  duplicateIncentive(id: string): Observable<FinancialIncentive> {
    return this.getIncentiveById(id).pipe(
      map(incentive => {
        if (!incentive) throw new Error('Incentive not found');
        
        const duplicated = {
          ...incentive,
          name: `${incentive.name} (Copy)`,
          status: 'draft' as IncentiveStatus,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          performance: {
            totalRedemptions: 0,
            uniqueUsers: 0,
            totalCost: 0,
            conversionRate: 0,
            roi: 0,
            averageRewardValue: incentive.performance.averageRewardValue,
            revenueGenerated: 0
          },
          budget: {
            ...incentive.budget,
            spentAmount: 0,
            remainingBudget: incentive.budget.totalBudget
          }
        };

        delete (duplicated as any).id;
        delete (duplicated as any).createdAt;
        delete (duplicated as any).updatedAt;

        return duplicated;
      }),
      delay(300)
    );
  }

  // Export functionality
  exportIncentivesData(filters?: IncentiveFilters): Observable<Blob> {
    return this.getIncentives(filters).pipe(
      map(result => {
        const csvData = this.convertToCSV(result.data, [
          'name', 'type', 'status', 'totalRedemptions', 'totalCost', 
          'conversionRate', 'roi', 'validFrom', 'validTo'
        ]);
        return new Blob([csvData], { type: 'text/csv' });
      }),
      delay(1000)
    );
  }

  private convertToCSV(data: any[], columns: string[]): string {
    const headers = columns.join(',');
    const rows = data.map(item => {
      return columns.map(col => {
        let value = this.getNestedProperty(item, col);
        if (value instanceof Date) {
          value = value.toISOString().split('T')[0];
        } else if (typeof value === 'string') {
          value = `"${value.replace(/"/g, '""')}"`;
        } else if (value === null || value === undefined) {
          value = '';
        }
        return value;
      }).join(',');
    }).join('\n');

    return `${headers}\n${rows}`;
  }

  private getNestedProperty(obj: any, path: string): any {
    if (path === 'totalRedemptions') return obj.performance?.totalRedemptions || 0;
    if (path === 'totalCost') return obj.performance?.totalCost || 0;
    if (path === 'conversionRate') return obj.performance?.conversionRate || 0;
    if (path === 'roi') return obj.performance?.roi || 0;
    
    return obj[path];
  }
}
