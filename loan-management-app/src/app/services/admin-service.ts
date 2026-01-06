import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private api = 'http://localhost:5267/api/admin';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any[]>(`${this.api}/users`);
  }

  getLoanTypes() {
    return this.http.get<any[]>(`${this.api}/loan-types`);
  }

  updateLoanType(id: number, data: any) {
    return this.http.put(`${this.api}/loan-types/${id}`, data);
  }

  getUsers() {
    return this.http.get<any[]>(`${this.api}/users`);
  }

  assignRole(email: string, role: string) {
    return this.http.put(
      `${this.api}/assign-role?email=${email}&role=${role}`,
      {}
    );
  }

  deleteUser(email: string) {
    return this.http.delete(`${this.api}/users/${email}`);
  }

  createUser(payload:any)
  {
    return this.http.post(`${this.api}/create-user`, payload);
  }


}
