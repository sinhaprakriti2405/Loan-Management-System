import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Applyloan } from './applyloan';

describe('Applyloan', () => {
  let component: Applyloan;
  let fixture: ComponentFixture<Applyloan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Applyloan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Applyloan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
