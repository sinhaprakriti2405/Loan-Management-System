import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerLayout } from './officer-layout';

describe('OfficerLayout', () => {
  let component: OfficerLayout;
  let fixture: ComponentFixture<OfficerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
