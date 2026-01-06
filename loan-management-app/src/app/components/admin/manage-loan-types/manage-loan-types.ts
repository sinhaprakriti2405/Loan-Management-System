import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-manage-loan-types',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './manage-loan-types.html',
  styleUrls: ['./manage-loan-types.css']
})
export class ManageLoanTypes {

  loading = signal(true);
  loanTypes = signal<any[]>([]);

  displayedColumns = [
    'loanTypeId',
    'name',
    'interestRate',
    'minAmount',
    'maxAmount',
    'maxTenure',
    'action'
  ];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
    this.loadLoanTypes();
  }

  loadLoanTypes() {
    this.adminService.getLoanTypes().subscribe(res => {
      this.loanTypes.set(res);
      this.loading.set(false);
    });
  }

  editLoanType(id: number) {
    this.router.navigate(['/admin/edit-loan-types', id]);
  }
}
