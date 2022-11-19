import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { NotificationPayload } from '../../../../core/models/notification.model';
import { dataDashRoute } from '../../../../core/routes/data-dash.route';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'dd-notification-component',
  templateUrl: './notification-component.component.html',
  styleUrls: ['./notification-component.component.scss'],
})
export class NotificationComponentComponent implements OnInit {
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
