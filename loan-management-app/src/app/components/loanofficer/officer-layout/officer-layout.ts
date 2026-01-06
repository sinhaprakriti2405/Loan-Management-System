import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationService } from '../../../services/notification-service';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-officer-layout',
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
  templateUrl: './officer-layout.html',
  styleUrls: ['./officer-layout.css']
})
export class OfficerLayout implements OnInit{

  notifications = signal<any[]>([]);
  unreadCount = signal(0);

  constructor(private router: Router, private notifService: NotificationService ) {}

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
    
    if (!n.isRead) {
      this.notifications.set(
      this.notifications().filter(x => x.id !== n.id)
    );
      this.unreadCount.update(v => Math.max(v - 1, 0));
    }
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
