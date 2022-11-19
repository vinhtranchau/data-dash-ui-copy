import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

import { HttpSuccessResponse } from '../models/common.model';
import { environment } from '../../../environments/environment';
import { HistoricalDataIndexes, HistoricalDataPayload } from '../models/historical-data.model';

@Injectable({
  providedIn: 'root',
})
export class HistoricalDataService {
  constructor(private http: HttpClient) {}

  getHistoricalDataIndexes(): Observable<HistoricalDataIndexes[]> {
    const url = `${environment.api}/index_historical_data/`;
    return this.http.get<HistoricalDataIndexes[]>(url).pipe(
      map((res) => {
        return res.map((item) => ({
          ...item,
          created_at: item.created_at ? new Date(item.created_at) : null,
        }));
      })
    );
  }

  updateHistoricalData(payload: HistoricalDataPayload): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/indexes/${payload.index_details_id}/update_historical_data/`;
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  downloadHistoricalData(id: string, name: string | null): any {
    const url = `${environment.api}/indexes/${id}/download_historical_data/`;
    const file_name = name || `${id}.csv`;
    return this.http.post<string>(url, null).pipe(
      map((res) => new Blob([res], { type: 'text/csv' })),
      map((blob) => {
        saveAs(blob, file_name);
      })
    );
  }

  deleteHistoricalDataIndexes(indexId: string): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/indexes/${indexId}/delete_historical_data/`;
    return this.http.delete<HttpSuccessResponse>(url);
  }
}
