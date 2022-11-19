import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationFilter, NotificationPayload } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'dd-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notificationFilter = NotificationFilter;

  filter = NotificationFilter.All;
  notifications: NotificationPayload[] = [];
  isLoading = false;

  private page = 1;
  private pageSize = Math.ceil((window.innerHeight - 200) / 72) + 2;
  private total = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  changeFilter(filter: NotificationFilter) {
    this.filter = filter;
    this.page = 1;
    this.total = 0;
    this.notifications = [];
    this.loadNotifications();
  }

  onScroll() {
    // Load new alerts
    if (this.page * this.pageSize < this.total) {
      this.page += 1;
      this.loadNotifications().then();
    } else {
      // Fully loaded
    }
  }

  async loadNotifications() {
    let filterRead = null;
    switch (this.filter) {
      case NotificationFilter.All:
        filterRead = null;
        break;
      case NotificationFilter.Read:
        filterRead = true;
        break;
      case NotificationFilter.Unread:
        filterRead = false;
    }
    this.isLoading = true;
    const { count, results } = await firstValueFrom(
      this.notificationService.getNotifications(this.page, this.pageSize, filterRead)
    );
    this.total = count;
    this.notifications.push(...results);
    this.isLoading = false;
  }

  async readAll() {
    await firstValueFrom(this.notificationService.markAllNotificationsRead());
    this.notificationService.unreadCount = 0;
    this.page = 1;
    this.total = 0;
    this.notifications = [];
    this.loadNotifications();
  }
}
