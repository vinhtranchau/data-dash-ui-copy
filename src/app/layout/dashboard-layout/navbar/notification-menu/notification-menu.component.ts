import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { userRoute } from '../../../../core/routes/user.route';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'dd-notification-menu',
  templateUrl: './notification-menu.component.html',
  styleUrls: ['./notification-menu.component.scss'],
})
export class NotificationMenuComponent implements OnInit {
  userRoute = userRoute;

  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  async fetchNotifications() {
    const { results } = await firstValueFrom(this.notificationService.getNotifications(1, 5, null, true));
    this.notificationService.notificationMenu = results;
    const { count } = await firstValueFrom(this.notificationService.getNotifications(1, 1, false));
    this.notificationService.unreadCount = count;
  }

  async readAll() {
    await firstValueFrom(this.notificationService.markAllNotificationsRead());
    this.notificationService.unreadCount = 0;
  }
}
