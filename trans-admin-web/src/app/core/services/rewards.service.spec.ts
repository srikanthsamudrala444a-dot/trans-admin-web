import { TestBed } from '@angular/core/testing';
import { RewardsService, Promotion } from './rewards.service';
import { of } from 'rxjs';

describe('RewardsService', () => {
  let service: RewardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return paginated promotions', (done) => {
    service.getPromotions(1, 10).subscribe(result => {
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.totalItems).toBeGreaterThan(0);
      expect(result.currentPage).toBe(1);
      expect(result.itemsPerPage).toBe(10);
      done();
    });
  });

  it('should return all promotions without pagination', (done) => {
    service.getAllPromotions().subscribe(promotions => {
      expect(promotions).toBeDefined();
      expect(promotions.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should create a new promotion', (done) => {
    const newPromotionData = {
      name: 'TEST50',
      type: 'discount-code' as const,
      code: 'TEST50',
      discountType: 'percentage' as const,
      discountValue: 50,
      maxUsage: 100
    };

    service.createPromotion(newPromotionData).subscribe(promotion => {
      expect(promotion).toBeDefined();
      expect(promotion.name).toBe('TEST50');
      expect(promotion.currentUsage).toBe(0);
      done();
    });
  });

  it('should validate promotion code', (done) => {
    service.validatePromotionCode('FEST50').subscribe(result => {
      expect(result.valid).toBeTruthy();
      expect(result.promotion).toBeDefined();
      done();
    });
  });

  it('should return stats', (done) => {
    service.getPromotionStats().subscribe(stats => {
      expect(stats).toBeDefined();
      expect(stats.activePromotions).toBeGreaterThan(0);
      expect(stats.totalRedemptions).toBeGreaterThan(0);
      done();
    });
  });

  it('should redeem promotion', (done) => {
    service.redeemPromotion('1').subscribe(success => {
      expect(success).toBeTruthy();
      done();
    });
  });
});
