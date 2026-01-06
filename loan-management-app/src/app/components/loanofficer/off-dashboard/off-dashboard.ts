import {
  Component,
  signal,
  ViewChild,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';

import { LoanService } from '../../../services/loan-service';

@Component({
  selector: 'app-off-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule
  ],
  templateUrl: './off-dashboard.html',
  styleUrls: ['./off-dashboard.css']
})
export class OffDashboard implements OnInit, AfterViewInit {

  loading = signal(true);

  activeLoans = signal(0);
  closedLoans = signal(0);
  pendingLoans = signal(0);

  loanTypes = signal<string[]>([]);

  displayedColumns = [
    'loanId',
    'customerId',
    'loanType',
    'amount',
    'appliedDate',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLoans();
  }

  ngAfterViewInit() {
  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'amount':
          return Number(item.amount);
        case 'appliedDate':
          return new Date(item.appliedDate).getTime();
        case 'status':
          return item.status;
        default:
          return item[property];
      }
    };
  }

  loadLoans() {
    this.loanService.getAllLoansForOfficer().subscribe(res => {

      this.activeLoans.set(res.filter(l => l.status === 'Approved').length);
      this.closedLoans.set(res.filter(l => l.status === 'Closed').length);
      this.pendingLoans.set(res.filter(l => l.status === 'Applied').length);

      const processedLoans = res.filter(l =>
        ['Approved', 'Rejected', 'Closed'].includes(l.status)
      );

    
      this.dataSource.data = processedLoans;

   
      this.loanTypes.set([...new Set(processedLoans.map(l => l.loanTypeName))]);

      this.dataSource.filterPredicate = (data, filter) =>
        !filter || data.loanTypeName === filter;

      this.loading.set(false);
    });
  }

  filterByLoanType(type: string) {
    this.dataSource.filter = type;
    this.paginator.firstPage();
  }

  viewDetails(loan: any) {
    this.router.navigate(
      ['/loanofficer/loan-details', loan.loanId],
      { queryParams: { status: loan.status } }
    );
  }
}
