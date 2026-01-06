import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustDashboard } from './cust-dashboard';

describe('CustDashboard', () => {
  let component: CustDashboard;
  let fixture: ComponentFixture<CustDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
