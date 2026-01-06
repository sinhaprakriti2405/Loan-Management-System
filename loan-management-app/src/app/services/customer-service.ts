import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  private api = 'http://localhost:5267/api/customers';

  constructor(private http: HttpClient) {}


  getProfile() {
    return this.http.get<any>(`${this.api}/me`);
  }


  createProfile(data: any) {
    return this.http.post<any>(`${this.api}/me`, data);
  }


  updateProfile(data: any) {
    return this.http.put<any>(`${this.api}/me`, data);
  }
}
