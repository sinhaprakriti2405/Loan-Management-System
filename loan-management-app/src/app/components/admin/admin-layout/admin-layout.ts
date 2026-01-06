import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationService } from '../../../services/notification-service';
import { MatMenuModule } from '@angular/material/menu';



@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
   
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {

  notifications = signal<any[]>([]);
  unreadCount = signal(0);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void { 
      this.loadNotifications();

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
      this.unreadCount.update(v => Math.max(0, v - 1));
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
