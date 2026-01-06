import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffDashboard } from './off-dashboard';

describe('OffDashboard', () => {
  let component: OffDashboard;
  let fixture: ComponentFixture<OffDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
