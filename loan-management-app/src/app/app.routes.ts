import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

// public
import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

// customer
import { CustDashboard } from './components/customer/cust-dashboard/cust-dashboard';
import { Applyloan } from './components/customer/applyloan/applyloan';
import { MyLoans } from './components/customer/my-loans/my-loans';
import { EmiReport } from './components/customer/emi-report/emi-report';
import { MyProfile } from './components/customer/my-profile/my-profile';
import { PayEmi } from './components/customer/pay-emi/pay-emi';
import { CustomerLayout } from './components/customer/customer-layout/customer-layout';


// loan officer
import { OffDashboard } from './components/loanofficer/off-dashboard/off-dashboard';
import { OffLoanDetails } from './components/loanofficer/off-loan-details/off-loan-details';
import { ReviewList } from './components/loanofficer/review-list/review-list';
import { ReviewDetails } from './components/loanofficer/review-details/review-details';
import { OfficerLayout } from './components/loanofficer/officer-layout/officer-layout';


// admin
import { AdminDashboard} from './components/admin/admin-dashboard/admin-dashboard';
import { Users } from './components/admin/users/users';
import { ManageLoanTypes } from './components/admin/manage-loan-types/manage-loan-types';
import { EditLoanType } from './components/admin/edit-loan-type/edit-loan-type';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';


export const routes: Routes = [

  // ---------- PUBLIC ----------
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // ---------- CUSTOMER ----------
  {
    path: 'customer',
    component: CustomerLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Customer'] },
    children: [
      { path: 'dashboard', component: CustDashboard },
      { path: 'apply-loan', component: Applyloan },
      { path: 'my-loans', component: MyLoans },
      { path: 'emi/:loanId', component: EmiReport },
      { path: 'pay-emi', component: PayEmi },
      { path: 'profile', component: MyProfile },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ---------- LOAN OFFICER ----------
  {
    path: 'loanofficer',
    component:OfficerLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['LoanOfficer'] },
    children: [
      { path: 'dashboard', component: OffDashboard },
      { path: 'loan-details/:loanId', component: OffLoanDetails },
      { path: 'review-list', component: ReviewList },
      { path: 'review-details', component: ReviewDetails },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ---------- ADMIN ----------
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: Users },
      { path: 'edit-loan-types/:id', component: EditLoanType },
      { path: 'manage-loan-types', component: ManageLoanTypes},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ---------- FALLBACK ----------
  { path: '**', redirectTo: '' }
];
