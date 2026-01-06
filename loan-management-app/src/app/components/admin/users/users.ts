import { Component, signal , ViewChild, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../services/admin-service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements AfterViewInit {

  showCreateForm = signal(false);

  roles = ['Customer', 'LoanOfficer', 'Admin'];

  createForm = signal({
    email: '',
    password: '',
    role: ''
  });

  usersDataSource = new MatTableDataSource<any>();
  approvalDataSource = new MatTableDataSource<any>();

  approvalColumns = [
  'email',
  'requestedRole',
  'status',
  'assign'
];


userColumns = [
  'email',
  'requestedRole',
  'assignedRole',
  'status',
  'assign',
  'delete'
];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private adminService: AdminService, private router: Router
    ,private snackBar: MatSnackBar
  ) {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.usersDataSource.paginator = this.paginator;
    this.usersDataSource.sort = this.sort;

    
    this.usersDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'requestedRole':
          return item.requestedRole;
        case 'status':
          return item.isRoleApproved ? 'Approved' : 'Pending';
        default:
          return item[property];
      }
    };
  }

loadUsers() {
    this.adminService.getAllUsers().subscribe(res => {

      this.usersDataSource.data = res;

      this.approvalDataSource.data = res.filter(u =>
        u.requestedRole === 'LoanOfficer' &&
        (u.isRoleApproved === false || u.isRoleApproved == null)
      );
    });
  }

  createUser() {
    const form = this.createForm();
    if (!form.email || !form.password || !form.role) return;

    this.adminService.createUser(form).subscribe(() => {
      this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
      this.createForm.set({ email: '', password: '', role: '' });
      this.showCreateForm.set(false);
      this.loadUsers();
    });
  }

  assignRole(email: string, role: string) {
    if (!role) return;

    this.adminService.assignRole(email, role).subscribe(() => {
      this.snackBar.open('Role assigned', 'Close', { duration: 3000 });
      this.loadUsers();
    });
  }

  
  deleteUser(email: string) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  this.adminService.deleteUser(email).subscribe({
    next: () => {

     
      this.snackBar.open(
        'User deleted successfully',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-success']
        }
      );

      this.loadUsers();

      
      setTimeout(() => {
        this.router.navigate(['/admin/dashboard']);
      }, 500);
    },

    error: () => {
      this.snackBar.open(
        'Failed to delete user',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-error']
        }
      );
    }
  });
}



  toggleCreateUser() {
  this.showCreateForm.set(!this.showCreateForm());
}
}
