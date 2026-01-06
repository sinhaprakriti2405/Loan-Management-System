import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEmi } from './pay-emi';

describe('PayEmi', () => {
  let component: PayEmi;
  let fixture: ComponentFixture<PayEmi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayEmi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayEmi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
