import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,Validators,FormGroup,ReactiveFormsModule
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../../../services/loan-service';
import { PaymentService } from '../../../services/payment-service';

@Component({
  selector: 'app-pay-emi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './pay-emi.html',
  styleUrls: ['./pay-emi.css']
})
export class PayEmi {

  loading = signal(false);
  message = signal<string | null>(null);

  receipt = signal<any | null>(null);

  form!: FormGroup;

  nextEmi: any = null;
  outstandingAmount = 0;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private paymentService: PaymentService
  ) {
    this.form = this.fb.group({
      loanId: ['', Validators.required],
      paymentType: ['emi', Validators.required],
      paymentMethod: ['upi', Validators.required]
    });
  }

  fetchLoan() {
  if (this.form.get('loanId')?.invalid) return;

  const loanId = Number(this.form.value.loanId);

  this.loading.set(true);
  this.message.set(null);
  this.receipt.set(null);
  this.nextEmi = null;
  this.outstandingAmount = 0;

  this.loanService.getAccountSummary(loanId).subscribe({
    next: summary => {
      this.outstandingAmount = summary.outstandingAmount;

      this.loanService.getEmis(loanId).subscribe({
        next: emis => {
          this.nextEmi = emis.find(e => !e.paidStatus);

          if (!this.nextEmi && this.outstandingAmount > 0) {
            this.form.patchValue({ paymentType: 'full' });
          }

          if (!this.nextEmi && this.outstandingAmount === 0) {
            this.message.set('Nothing to pay. Loan already closed.');
          }

          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.message.set('Loan is under review, rejected, or not approved yet.');
        }
      });
    },
    error: () => {
      this.loading.set(false);
      this.message.set('Invalid Loan ID');
    }
  });
}


  
  pay() {
    const loanId = Number(this.form.value.loanId);

    this.loading.set(true);
    this.message.set(null);


    if (this.form.value.paymentType === 'emi') {
      if (!this.nextEmi) {
        this.loading.set(false);
        return;
      }

      this.paymentService
        .payEmi(loanId, this.nextEmi.installmentNumber)
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.message.set('EMI paid successfully');

            
            this.receipt.set({
              loanId,
              paymentType: 'EMI',
              emiNo: this.nextEmi.installmentNumber,
              amount: this.nextEmi.amount,
              paymentMethod: this.form.value.paymentMethod,
              paymentDate: new Date()
            });

           
            this.form.reset({ paymentType: 'emi' });
            this.nextEmi = null;
            this.outstandingAmount = 0;
          },
          error: () => {
            this.loading.set(false);
            this.message.set('Payment failed. Please try again.');
          }
        });

    } 
    
    else {
      this.paymentService
        .closeLoan(loanId)
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.message.set('Loan closed successfully');

          
            this.receipt.set({
              loanId,
              paymentType: 'Full Closure',
              emiNo: 'N/A',
              amount: this.outstandingAmount,
              paymentDate: new Date()
            });

            
            this.form.reset({ paymentType: 'emi' });
            this.nextEmi = null;
            this.outstandingAmount = 0;
          },
          error: () => {
            this.loading.set(false);
            this.message.set('Payment failed. Please try again.');
          }
        });
    }
  }
}
