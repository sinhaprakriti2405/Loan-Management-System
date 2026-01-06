import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private api = 'http://localhost:5267/api/notifications';

  constructor(private http: HttpClient) {}

  getMyNotifications() {
    return this.http.get<any[]>(`${this.api}/my`);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.api}/read/${id}`, {});
  }

  markAllAsRead(ids: number[]) {
    return Promise.all(
      ids.map(id => this.markAsRead(id).toPromise())
    );
  }
}
