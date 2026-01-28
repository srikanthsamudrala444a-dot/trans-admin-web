import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverRidesHistoryComponent } from './driver-rides-history.component';

describe('DriverRidesHistoryComponent', () => {
  let component: DriverRidesHistoryComponent;
  let fixture: ComponentFixture<DriverRidesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverRidesHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverRidesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
