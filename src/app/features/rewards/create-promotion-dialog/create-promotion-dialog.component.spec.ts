import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreatePromotionDialogComponent } from './create-promotion-dialog.component';

describe('CreatePromotionDialogComponent', () => {
  let component: CreatePromotionDialogComponent;
  let fixture: ComponentFixture<CreatePromotionDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CreatePromotionDialogComponent>>;

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CreatePromotionDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePromotionDialogComponent);
    component = fixture.componentInstance;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreatePromotionDialogComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.promotionForm.get('discountType')?.value).toBe('percentage');
    expect(component.promotionForm.valid).toBeFalsy();
  });

  it('should require code field for discount-code type', () => {
    component.promotionForm.patchValue({ type: 'discount-code' });
    expect(component.promotionForm.get('code')?.hasError('required')).toBeTruthy();
  });

  it('should not require code field for referral-bonus type', () => {
    component.promotionForm.patchValue({ type: 'referral-bonus' });
    expect(component.promotionForm.get('code')?.hasError('required')).toBeFalsy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should return correct discount label', () => {
    component.promotionForm.patchValue({ discountType: 'percentage' });
    expect(component.getDiscountLabel()).toBe('%');
    
    component.promotionForm.patchValue({ discountType: 'fixed' });
    expect(component.getDiscountLabel()).toBe('₹');
  });
});
