import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private api = 'http://localhost:5267/api/loans';

  constructor(private http: HttpClient, private router: Router) {}

  getLoanTypesForCustomer() {
  return this.http.get<any[]>( `${this.api}/seeloantypes`);
  }

  // 🔹 Apply for loan
  applyLoan(data: any) {
    return this.http.post<any>(`${this.api}/apply`, data);
  }

  // 🔹 Get logged-in customer's loans
  getMyLoans() {
    return this.http.get<any[]>(`${this.api}/my-loans`);
  }

  // 🔹 Get overall account summary (dashboard top)
  getOverallAccountSummary() {
    return this.http.get<any>(`${this.api}/account-summary`);
  }

  // 🔹 Get account summary for a specific loan
  getAccountSummary(loanId: number) {
    return this.http.get<any>(`${this.api}/account-summary/${loanId}`);
  }

  // 🔹 Get EMI schedule for a loan
  getEmis(loanId: number) {
    return this.http.get<any[]>(`${this.api}/emis/${loanId}`);
  }

  // ================= LOAN OFFICER =================

  // 🔹 Officer dashboard – all approved/rejected loans
  getAllLoansForOfficer() {
    return this.http.get<any[]>(`${this.api}/applications`);
  }

  processLoan(loanId: number, data: any) {
  return this.http.put(
    `${this.api}/process/${loanId}`,
    data,
    { responseType: 'text' } 
  );
  }

  getLoanDetailsForOfficer(loanId: number) {
  return this.http.get<any>(`${this.api}/details/${loanId}`);
}

}
