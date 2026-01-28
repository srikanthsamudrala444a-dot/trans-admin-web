import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRejectDialogComponent } from './document-reject-dialog.component';

describe('DocumentRejectDialogComponent', () => {
  let component: DocumentRejectDialogComponent;
  let fixture: ComponentFixture<DocumentRejectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRejectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRejectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
