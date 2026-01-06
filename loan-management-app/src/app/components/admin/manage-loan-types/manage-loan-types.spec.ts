import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoanTypes } from './manage-loan-types';

describe('ManageLoanTypes', () => {
  let component: ManageLoanTypes;
  let fixture: ComponentFixture<ManageLoanTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLoanTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLoanTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
