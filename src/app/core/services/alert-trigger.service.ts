import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Alert, AlertDetail } from '../models/alert-trigger.model';
import { PaginationResponseV2 } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class AlertTriggerService {
  constructor(private http: HttpClient) {}

  getAlerts(
    pageNumber?: number,
    pageSize?: number,
    searchTerm = '',
    isFavoriteOnly = null
  ): Observable<PaginationResponseV2<Alert> | Alert[]> {
    const url = `${environment.api}/index_alert_logs/`;
    let params = new HttpParams().append('search', searchTerm);

    if (pageNumber) {
      params = params.append('page', pageNumber);
    }

    if (pageSize) {
      params = params.append('page_size', pageSize);
    }

    if (isFavoriteOnly) {
      params = params.append('is_index_favorite_by_me', isFavoriteOnly);
    }
    return this.http.get<PaginationResponseV2<Alert> | Alert[]>(url, { params });
  }

  getAlertData(alertId: string): Observable<AlertDetail> {
    const url = `${environment.api}/index_alert_logs/${alertId}/`;
    return this.http.get<AlertDetail>(url);
  }
}
