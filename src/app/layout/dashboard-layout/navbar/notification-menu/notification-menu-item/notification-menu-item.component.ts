import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { NotificationPayload } from '../../../../../core/models/notification.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { dataDashRoute } from '../../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-notification-menu-item',
  templateUrl: './notification-menu-item.component.html',
  styleUrls: ['./notification-menu-item.component.scss'],
})
export class NotificationMenuItemComponent implements OnInit {
  @Input() notification: NotificationPayload;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {}

  clickNotification() {
    // Redirect based on reference id
    if (this.notification.reference_id) {
      let navigationCommands: any[] = [];
      // There is no way to recognize notification subtype, manually compared.
      if (this.notification.title.includes('Quote Received')) {
        navigationCommands = [dataDashRoute.root, dataDashRoute.quoteReview, this.notification.reference_id];
      }
      this.notificationService.redirectReference(
        this.notification.notification_type,
        this.notification.reference_id,
        navigationCommands
      );
    }
  }

  async clearNotification() {
    if (!this.notification.is_read) {
      await firstValueFrom(this.notificationService.markNotificationRead(this.notification.id));
      this.notification.is_read = true;
      this.notificationService.unreadCount -= 1;
    }
  }
}
