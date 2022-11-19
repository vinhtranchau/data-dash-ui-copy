import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HttpSuccessResponse, PaginationResponseV2 } from '../models/common.model';
import { environment } from '../../../environments/environment';
import { Notification, NotificationPayload, NotificationTypes } from '../models/notification.model';
import { CommonService } from './common.service';
import { relativePath } from '../utils/route.util';
import { standaloneModalRoute } from '../routes/standalone-modal.route';
import { dataDashRoute } from '../routes/data-dash.route';
import { AlertSubscription } from '../models/alert-trigger.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationMenu: NotificationPayload[] = [];
  unreadCount: number = 0;

  constructor(private http: HttpClient, private commonService: CommonService, private router: Router) {}

  // Browser push notifications
  registerSubscription(subscription: PushSubscription): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/push_notifications/subscribers/`;
    const payload = {
      subscription: subscription,
    };
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  removeSubscription(endpoint: string): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/push_notifications/subscribers/delete_endpoint/`;
    const payload = {
      endpoint: endpoint,
    };
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  testNotification(): Observable<null> {
    const url = `${environment.api}/push_notifications/subscribers/test/`;
    return this.http.post<null>(url, {});
  }

  // Websocket notification
  testWsNotification(): Observable<Notification> {
    const url = `${environment.api}/notifications/test/`;
    return this.http.post<Notification>(url, {});
  }

  getNotifications(
    page_number: number,
    page_size: number,
    is_read?: boolean | null,
    is_offset_read?: boolean | null
  ): Observable<PaginationResponseV2<NotificationPayload>> {
    let params = new HttpParams().append('page', page_number).append('page_size', page_size);
    if (is_read != null) {
      params = params.append('is_read', is_read);
    }
    if (is_offset_read != null) {
      params = params.append('is_offset_read', is_offset_read);
    }
    const url = `${environment.api}/notifications/`;
    return this.http.get<PaginationResponseV2<NotificationPayload>>(url, { params });
  }

  markNotificationRead(notificationId: string): Observable<null> {
    const url = `${environment.api}/notifications/${notificationId}/`;
    return this.http.patch<null>(url, { is_read: true });
  }

  markAllNotificationsRead(): Observable<null> {
    const url = `${environment.api}/notifications/mark_all_read/`;
    return this.http.post<null>(url, {});
  }

  redirectReference(notification_type: NotificationTypes, reference_id: string, navigationCommands: string[] = []) {
    switch (notification_type) {
      case NotificationTypes.IndexPriceSync:
        this.commonService.openStandaloneModal(
          relativePath([standaloneModalRoute.root, standaloneModalRoute.indexDetails, reference_id, String(0)])
        );
        break;
      case NotificationTypes.UploadHistoricalData:
        this.commonService.openStandaloneModal(
          relativePath([standaloneModalRoute.root, standaloneModalRoute.indexDetails, reference_id, String(0)])
        );
        break;
      case NotificationTypes.RollingDeal:
        // If RollingDeal type and subtype is 'Quote Received', compare manually to navigate.
        if (navigationCommands.length > 0) {
          this.router.navigate(navigationCommands);
        } else {
          this.commonService.openStandaloneModal(
            relativePath([standaloneModalRoute.root, standaloneModalRoute.rollingDealAction, reference_id])
          );
        }
        break;
      case NotificationTypes.AlertTrigger:
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/' + dataDashRoute.root, dataDashRoute.indexAlerts, reference_id]);
        });
        break;
      default:
        break;
    }
  }

  getIndexAlertSubscriptions(): Observable<AlertSubscription[]> {
    const url = `${environment.api}/user/alerts/saved_preferences/`;
    return this.http.get<AlertSubscription[]>(url);
  }

  subscribeIndexAlerts(payload: AlertSubscription[]): Observable<null> {
    const url = `${environment.api}/user/alerts/bulk_save/`;
    return this.http.post<null>(url, payload);
  }
}
