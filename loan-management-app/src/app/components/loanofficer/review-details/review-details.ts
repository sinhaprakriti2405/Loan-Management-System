import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LoanService } from '../../../services/loan-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-review-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './review-details.html',
  styleUrls: ['./review-details.css']
})
export class ReviewDetails {

  loanId!: number;
  loading = signal(true);

  loan = signal<any>(null);
  reviewForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router
  ) {
    this.reviewForm = this.fb.group({
      remarks: ['']
    });

    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));
    this.loadLoanDetails();
  }

  loadLoanDetails() {
    this.loanService.getLoanDetailsForOfficer(this.loanId).subscribe(res => {
      this.loan.set(res);
      this.loading.set(false);
    });
  }

  markUnderReview() {
    this.process('UnderReview', false);
  }

  approve() {
    this.process('Approved', true);
  }

  reject() {
    this.process('Rejected', false);
  }

  private process(status: string, isApproved: boolean) {
    const payload = {
      status,
      isApproved,
      remarks: this.reviewForm.value.remarks
    };

    this.loanService.processLoan(this.loanId, payload).subscribe({
    next: (res) => {

      if (status === 'Approved') {
        alert('Loan approved. EMI schedule generated.');
        this.router.navigate(['/loanofficer/dashboard']);
      } else {
        
        this.router.navigate(['/loanofficer/review-list']);
      }
    },
    error: () => {
      alert('Something went wrong while processing the loan');
    }
  });
  }
}
