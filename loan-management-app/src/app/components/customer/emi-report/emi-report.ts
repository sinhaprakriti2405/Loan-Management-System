import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LoanService } from '../../../services/loan-service';

@Component({
  selector: 'app-emi-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './emi-report.html',
  styleUrls: ['./emi-report.css']
})
export class EmiReport implements OnInit {

  loanId!: number;
  loading = signal(true);

  loanStatus!: string;
  remarks: string | null = null;

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
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));

    if (!this.loanId) {
      this.loading.set(false);
      return;
    }

    this.loadAccountSummary();
  }

  private loadAccountSummary(): void {
    this.loanService.getAccountSummary(this.loanId).subscribe({
      next: (res) => {
  this.accountSummary.set(res);


  this.loanStatus = res.status ?? 'Applied';
  this.remarks = res.remarks;

  if (this.loanStatus === 'Approved' || this.loanStatus === 'Closed') {
    this.loadEmis();
  } else {
    this.loading.set(false);
  }
}

    });
  }

  private loadEmis(): void {
    this.loanService.getEmis(this.loanId).subscribe({
      next: (res) => {
        this.emis.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  goToPayEmi(emi: any): void {
    if (this.loanStatus === 'Closed') return;

    this.router.navigate(
      ['/customer/pay-emi'],
      { queryParams: { loanId: this.loanId } }
    );
  }
}
