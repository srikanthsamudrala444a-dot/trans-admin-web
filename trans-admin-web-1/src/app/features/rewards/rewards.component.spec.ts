import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { RewardsService } from '../../core/services/rewards.service';
import { of } from 'rxjs';
import { RewardsComponent } from './rewards.component';

describe('RewardsComponent', () => {
  let component: RewardsComponent;
  let fixture: ComponentFixture<RewardsComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRewardsService: jasmine.SpyObj<RewardsService>;

  const mockPaginatedResponse = {
    data: [
      {
        id: '1',
        name: 'FESTIVE50',
        type: 'discount-code' as const,
        code: 'FEST50',
        discountType: 'percentage' as const,
        discountValue: 50,
        maxUsage: 1000,
        currentUsage: 234,
        validFrom: new Date('2024-10-01'),
        validTo: new Date('2024-10-31'),
        status: 'Active' as const,
        description: 'Festive season discount',
        createdAt: new Date('2024-09-15'),
        updatedAt: new Date('2024-09-15')
      }
    ],
    totalItems: 3,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  };

  const mockStats = {
    activePromotions: 12,
    totalRedemptions: 2431,
    conversionRate: '18%',
    totalRevenueImpact: '₹1.2L'
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const rewardsServiceSpy = jasmine.createSpyObj('RewardsService', [
      'getPromotions', 
      'getPromotionStats',
      'createPromotion',
      'updatePromotion',
      'deletePromotion'
    ]);

    rewardsServiceSpy.getPromotions.and.returnValue(of(mockPaginatedResponse));
    rewardsServiceSpy.getPromotionStats.and.returnValue(of(mockStats));

    await TestBed.configureTestingModule({
      imports: [RewardsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: RewardsService, useValue: rewardsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RewardsComponent);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockRewardsService = TestBed.inject(RewardsService) as jasmine.SpyObj<RewardsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load promotions with pagination', () => {
    expect(mockRewardsService.getPromotions).toHaveBeenCalledWith(1, 10);
    expect(component.promotions.length).toBe(1);
    expect(component.promotions[0].name).toBe('FESTIVE50');
    expect(component.totalItems).toBe(3);
  });

  it('should load stats data', () => {
    expect(mockRewardsService.getPromotionStats).toHaveBeenCalled();
    expect(component.stats.activePromotions).toBe(12);
    expect(component.stats.totalRedemptions).toBe(2431);
  });

  it('should open create promotion dialog', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue({ subscribe: () => {} });
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.createNewPromotion();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('Active')).toBe('status-active');
    expect(component.getStatusClass('Expired')).toBe('status-expired');
    expect(component.getStatusClass('Inactive')).toBe('status-inactive');
  });
});
