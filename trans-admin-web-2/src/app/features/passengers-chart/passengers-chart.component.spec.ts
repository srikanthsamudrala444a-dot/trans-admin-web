import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengersChartComponent } from './passengers-chart.component';

describe('PassengersChartComponent', () => {
  let component: PassengersChartComponent;
  let fixture: ComponentFixture<PassengersChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengersChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
