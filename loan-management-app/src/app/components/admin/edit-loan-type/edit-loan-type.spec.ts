import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoanType } from './edit-loan-type';

describe('EditLoanType', () => {
  let component: EditLoanType;
  let fixture: ComponentFixture<EditLoanType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLoanType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoanType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
