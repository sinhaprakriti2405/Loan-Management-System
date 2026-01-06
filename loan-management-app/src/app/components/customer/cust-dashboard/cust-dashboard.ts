import { ChartOptions } from './../../../../../node_modules/chart.js/dist/types/index.d';
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { LoanService } from '../../../services/loan-service';
import { ChartConfiguration } from 'chart.js'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-cust-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    NgChartsModule,
  ],
  templateUrl: './cust-dashboard.html',
  styleUrls: ['./cust-dashboard.css']
})
export class CustDashboard {

  
  loading = signal(true);

  summary = signal<any>(null);
  loans = signal<any[]>([]);

  displayedColumns = [
    'loanId',
    'loanType',
    'amount',
    'tenure',
    'status',
    'appliedDate'
  ];


  paidAmount = computed(() => {
    if (!this.summary()) return 0;
    return (
      this.summary().totalLoanAmount -
      this.summary().totalOutstandingAmount
    );
  });

  chartData() {
  return {
    labels: ['Paid Amount', 'Outstanding'],
    datasets: [
      {
        data: [
          this.paidAmount(),
          this.summary()?.totalOutstandingAmount || 0
        ],
        backgroundColor: ['#4caf50', '#c2240fff'],
        barThickness: 22
      }
    ]
  };
}

 chartOptions: ChartConfiguration<'bar'>['options'] = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `₹ ${ctx.raw?.toLocaleString()}`
      }
    }
  },

  scales: {
    x: {
      beginAtZero: true,
      grid: {
        display: false   // ❌ remove vertical grid
      },
      ticks: {
        callback: (value) => `₹ ${value}`
      }
    },
    y: {
      grid: {
        display: false   // ❌ remove horizontal grid
      }
    }
  }
};



  /* ===== INIT ===== */
  constructor(private loanService: LoanService) {
    this.loadDashboard();
  }

  /* ===== API CALLS ===== */
  loadDashboard() {
    this.loanService.getOverallAccountSummary().subscribe(res => {
      this.summary.set(res);
    });

    this.loanService.getMyLoans().subscribe(res => {
      this.loans.set(res);
      this.loading.set(false);
    });
  }

  rejectedLoans = computed(() =>
  this.loans().filter(l => l.status === 'Rejected').length
);

}
