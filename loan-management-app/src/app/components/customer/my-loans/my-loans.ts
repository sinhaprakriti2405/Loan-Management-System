import {Component, signal,ViewChild,AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { LoanService } from '../../../services/loan-service';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './my-loans.html',
  styleUrls: ['./my-loans.css']
})
export class MyLoans implements AfterViewInit {

  loading = signal(true);

  dataSource = new MatTableDataSource<any>([]);
  allLoans: any[] = [];
  loanTypes = signal<string[]>([]);

  searchText = '';
  selectedLoanType = '';

  displayedColumns = [
    'loanId',
    'loanType',
    'amount',
    'tenure',
    'status',
    'appliedDate',
    'action'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {
    this.loadLoans();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

   
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'loanType':
          return item.loanTypeName;
        case 'appliedDate':
          return new Date(item.appliedDate);
        default:
          return item[property];
      }
    };
  }

  loadLoans() {
    this.loanService.getMyLoans().subscribe(res => {
      this.allLoans = res;
      this.dataSource.data = res;

      this.loanTypes.set([...new Set(res.map(l => l.loanTypeName))]);
      this.loading.set(false);
    });
  }

 
  applySearch(value: string) {
    this.searchText = value.toLowerCase();
    this.applyFilters();
  }


  filterByLoanType(type: string) {
    this.selectedLoanType = type;
    this.applyFilters();
  }


  applyFilters() {
    let filtered = this.allLoans;

    if (this.searchText) {
      filtered = filtered.filter(l =>
        l.loanId.toString().includes(this.searchText) ||
        l.status.toLowerCase().includes(this.searchText)
      );
    }

    if (this.selectedLoanType) {
      filtered = filtered.filter(
        l => l.loanTypeName === this.selectedLoanType
      );
    }

    this.dataSource.data = filtered;
  }

  viewDetails(loan: any) {
    this.router.navigate(['/customer/emi', loan.loanId]);
  }
}
