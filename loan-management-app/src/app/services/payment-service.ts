import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private api = 'http://localhost:5267/api/payments';

  constructor(private http: HttpClient) {}

  // 🔹 Pay EMI (LoanId + InstallmentNumber)
  payEmi(loanId: number, installmentNumber: number) {
    return this.http.post<any>(`${this.api}/pay-emi`, {
      loanId,
      installmentNumber
    });
  }

  closeLoan(loanId: number) {
  return this.http.post(
    `http://localhost:5267/api/payments/close-loan/${loanId}`,
    {}
  );
}
}
