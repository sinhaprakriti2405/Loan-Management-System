import { AuthService } from './../../../services/auth-service';
import { CustomerService } from './../../../services/customer-service';
import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '../../../services/notification-service';


@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  templateUrl: './customer-layout.html',
  styleUrls: ['./customer-layout.css']
})
export class CustomerLayout implements OnInit {
  
  userName = signal('Customer');
  notifications = signal<any[]>([]);
  unreadCount = signal(0);

  constructor(private router: Router, private customerService: CustomerService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserName(); 
    this.loadNotifications();
  }

  loadUserName() {
    this.customerService.getProfile().subscribe({
      next: profile => {
        this.userName.set(profile.fullName);
      },
      error: () => {
        this.userName.set('Customer');
      }
    });
  }

  loadNotifications() {
    this.notifService.getMyNotifications().subscribe(res => {
      this.notifications.set(res);
      this.unreadCount.set(res.filter(n => !n.isRead).length);
    });
  }

  markRead(n: any) {
    this.notifService.markAsRead(n.id).subscribe(() => {
      this.notifications.set(
      this.notifications().filter(x => x.id !== n.id)
    );
      this.unreadCount.update(v => Math.max(0,v - 1));
      this.loadNotifications();
    });
  }

  markAllRead() {
    const unreadIds = this.notifications()
      .filter(n => !n.isRead)
      .map(n => n.id);

    if (!unreadIds.length) return;

    this.notifService.markAllAsRead(unreadIds).then(() => {
     this.notifications.set([]);
      this.unreadCount.set(0);
      this.loadNotifications();
    });
  }

  logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
}
