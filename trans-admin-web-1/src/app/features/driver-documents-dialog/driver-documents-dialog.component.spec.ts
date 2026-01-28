import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDocumentsDialogComponent } from './driver-documents-dialog.component';

describe('DriverDocumentsDialogComponent', () => {
  let component: DriverDocumentsDialogComponent;
  let fixture: ComponentFixture<DriverDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverDocumentsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
