import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverChartComponent } from './driver-chart.component';

describe('DriverChartComponent', () => {
  let component: DriverChartComponent;
  let fixture: ComponentFixture<DriverChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
