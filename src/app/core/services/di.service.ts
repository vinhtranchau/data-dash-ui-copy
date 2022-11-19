import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ManualScrapeIdUpload } from '../models/scrapes.model';

@Injectable({
  providedIn: 'root',
})
export class DiService {
  constructor(private http: HttpClient) {}

  getDISpiders(): Observable<string[]> {
    const url = `${environment.api}/di_spiders/`;
    return this.http.get<string[]>(url);
  }

  getDIScrapeIds(spider: string): Observable<string[]> {
    const url = `${environment.api}/di_spiders/${spider}/`;
    return this.http.get<string[]>(url);
  }

  getDIMatchedScrapeId(id: string): Observable<string> {
    const url = `${environment.api}/indexes/${id}/di_matched_scrape_id/`;
    return this.http.get<string>(url);
  }

  postManualScrape(payload: ManualScrapeIdUpload): Observable<string[]> {
    const url = `${environment.api}/indexes/${payload.index_details_id}/upload_scrape_on_di/`;
    return this.http.post<string[]>(url, payload);
  }
}
