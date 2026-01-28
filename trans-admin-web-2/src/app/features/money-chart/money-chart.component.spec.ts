import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyChartComponent } from './money-chart.component';

describe('MoneyChartComponent', () => {
  let component: MoneyChartComponent;
  let fixture: ComponentFixture<MoneyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
