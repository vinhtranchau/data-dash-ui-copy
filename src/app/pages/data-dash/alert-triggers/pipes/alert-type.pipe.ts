import { Pipe, PipeTransform } from '@angular/core';
import { AlertType } from '../../../../core/models/alert-trigger.model';

@Pipe({
  name: 'alertType',
})
export class AlertTypePipe implements PipeTransform {
  transform(type: AlertType): string {
    let icon;
    switch (type) {
      case AlertType.ALERT_TYPE_ABNORMAL_PRICE_MOVEMENT:
        icon = 'timeline';
        break;
      case AlertType.ALERT_TYPE_HISTORICAL_PRICE_CORRECTION:
        icon = 'price_check';
        break;
      case AlertType.ALERT_TYPE_INDEX_DETAILS_CHANGED:
        icon = 'edit_note';
        break;
      case AlertType.ALERT_TYPE_MISSING_PRICE_UPDATE:
        icon = 'event_busy';
        break;
      case AlertType.ALERT_TYPE_SCRAPE_MATCHING_CHANGED:
        icon = 'crop_rotate';
        break;
      case AlertType.ALERT_TYPE_SCRAPE_MATCHING_DELETED:
        icon = 'layers_clear';
        break;
      case AlertType.ALERT_TYPE_NEW_INDEX_ONBOARDED:
        icon = 'assignment_add';
        break;
      default:
        icon = '';
        break;
    }

    return icon;
  }
}
