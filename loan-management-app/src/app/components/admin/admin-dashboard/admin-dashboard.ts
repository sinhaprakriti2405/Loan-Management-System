import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '../../../services/admin-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {

  users = signal<any[]>([]);
  loanTypes = signal<any[]>([]);

  totalUsers = signal(0);
  approvedUsers = signal(0);
  pendingUsers = signal(0);
  totalLoanTypes = signal(0);

  displayedColumns = [
    'loanTypeId',
    'name',
    'interestRate',
    'maxTenure',
    'minAmount',
    'maxAmount'
  ];

  constructor(private adminService: AdminService) {
    this.loadUsers();
    this.loadLoanTypes();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe(res => {
      this.users.set(res);

      this.totalUsers.set(res.length);
      this.approvedUsers.set(res.filter((u: any) => u.isRoleApproved).length);
      this.pendingUsers.set(
        res.filter(
        (u: any) => !u.isRoleApproved && u.requestedRole === 'LoanOfficer'
        ).length
);
    });
  }

  loadLoanTypes() {
    this.adminService.getLoanTypes().subscribe(res => {
      this.loanTypes.set(res);
      this.totalLoanTypes.set(res.length);
    });
  }

  

}
