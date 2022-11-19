import { Pipe, PipeTransform } from '@angular/core';
import { NotificationTypes } from '../../core/models/notification.model';

@Pipe({
  name: 'notificationType',
})
export class NotificationTypePipe implements PipeTransform {
  transform(type: NotificationTypes): string {
    let icon;
    switch (type) {
      case NotificationTypes.System:
        icon = 'report';
        break;
      case NotificationTypes.AlertTrigger:
        icon = 'crisis_alert';
        break;
      case NotificationTypes.RollingDeal:
        icon = 'policy';
        break;
      case NotificationTypes.IndexPriceSync:
        icon = 'sync_alt';
        break;
      case NotificationTypes.UploadHistoricalData:
        icon = 'history';
        break;
      case NotificationTypes.AddScrapeMatching:
        icon = 'file_copy';
        break;
      default:
        icon = '';
        break;
    }

    return icon;
  }
}
