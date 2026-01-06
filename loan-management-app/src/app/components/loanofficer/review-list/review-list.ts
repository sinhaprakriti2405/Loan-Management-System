import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../../../services/loan-service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css']
})
export class ReviewList {

  loading = signal(true);
  pendingLoans = signal<any[]>([]);

  displayedColumns = [
    'loanId',
    'loanTypeName',
    'amount',
    'appliedDate',
    'status',
    'action'
  ];

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {
    this.loadPendingLoans();
  }

  loadPendingLoans() {
    this.loanService.getAllLoansForOfficer().subscribe(res => {
     
      this.pendingLoans.set(
        res.filter((l: any) => l.status === 'Applied')
      );
      this.loading.set(false);
    });
  }

  viewDetails(loan:any) {
    this.router.navigate(['/loanofficer/review-details', loan]);
  }
}
