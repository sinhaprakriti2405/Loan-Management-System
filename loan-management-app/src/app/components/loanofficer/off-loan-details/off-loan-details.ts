import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { LoanService } from '../../../services/loan-service';

@Component({
  selector: 'app-off-loan-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule
  ],
  templateUrl: './off-loan-details.html',
  styleUrls: ['./off-loan-details.css']
})
export class OffLoanDetails {

  loanId!: number;
  loanStatus!: string;

  loading = signal(true);
  accountSummary = signal<any>(null);
  emis = signal<any[]>([]);

  displayedColumns = [
    'installmentNumber',
    'dueDate',
    'amount',
    'paidStatus'
  ];

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService
  ) {
    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));

    this.route.queryParams.subscribe(params => {
      this.loanStatus = params['status'] ?? '';
    });

    this.loadData();
  }

  loadData() {
    this.loanService.getAccountSummary(this.loanId).subscribe(res => {
      this.accountSummary.set(res);
    });

    if (this.loanStatus === 'Approved' || this.loanStatus === 'Closed') {
      this.loanService.getEmis(this.loanId).subscribe(res => {
        this.emis.set(res);
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }
}
