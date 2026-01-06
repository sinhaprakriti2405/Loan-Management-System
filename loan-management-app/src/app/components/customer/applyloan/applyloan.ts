import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanService } from '../../../services/loan-service';
import { CustomerService } from '../../../services/customer-service';


@Component({
  selector: 'app-applyloan',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './applyloan.html',
  styleUrls: ['./applyloan.css']
})
export class Applyloan {

  loading = signal(false);
  loanTypes = signal<any[]>([]);
  selectedLoanType = signal<any | null>(null);
  message = signal<string | null>(null);

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private customerService: CustomerService
  ) {
    this.form = this.fb.group({
    loanTypeId: ['', Validators.required],
    amount: ['', Validators.required],
    tenure: ['', Validators.required],
    annualIncome: [{ value: '', disabled: true }, Validators.required]
  });


    this.loadLoanTypes();
  }

  ngOnInit() {
  this.customerService.getProfile().subscribe(profile => {
    this.form.patchValue({
      annualIncome: profile.annualIncome
    });
  });
}


  loadLoanTypes() {
    this.loanService.getLoanTypesForCustomer().subscribe(res => {
      this.loanTypes.set(res);
    });
  }

  selectLoanType(loan: any) {
  this.selectedLoanType.set(loan);

  this.form.patchValue({
    loanTypeId: loan.loanTypeId
  });


  this.form.get('amount')?.setValidators([
    Validators.required,
    Validators.min(loan.minAmount),
    Validators.max(loan.maxAmount)
  ]);

  this.form.get('tenure')?.setValidators([
    Validators.required,
    Validators.max(loan.maxTenure)
  ]);

  this.form.get('amount')?.updateValueAndValidity();
  this.form.get('tenure')?.updateValueAndValidity();
}


  applyLoan() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.message.set(null);

    this.loanService.applyLoan(this.form.getRawValue()).subscribe({
      next: () => {
        this.message.set('Loan applied successfully');
        this.form.reset();
        this.selectedLoanType.set(null);
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Loan application failed');
        this.loading.set(false);
      }
    });
  }
}
