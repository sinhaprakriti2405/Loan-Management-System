import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffLoanDetails } from './off-loan-details';

describe('OffLoanDetails', () => {
  let component: OffLoanDetails;
  let fixture: ComponentFixture<OffLoanDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffLoanDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffLoanDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
