import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { HttpSuccessResponse, PaginationResponseV2 } from '../models/common.model';
import { environment } from '../../../environments/environment';
import { ScrapeMatching } from '../models/scrapes.model';

@Injectable({
  providedIn: 'root',
})
export class ScrapeMatchingService {
  constructor(private http: HttpClient) {}

  getScrapeMatchings(count: number, page: number, search: string): Observable<PaginationResponseV2<ScrapeMatching>> {
    const url = `${environment.api}/scrape_matchings/`;
    const params = new HttpParams().append('page', page).append('page_size', count).append('search', search);
    return this.http
      .get<PaginationResponseV2<ScrapeMatching>>(url, {
        params,
      })
      .pipe(
        map((res) => {
          res.results = res.results.map((item) => ({
            ...item,
            stable_index_code: item.index_details_id.stable_index_code,
            index_details_id__id: item.index_details_id.id,
            scrape_description: item.scrape_details_id.description,
            created_by_name: item.created_by ? item.created_by.name : null,
            effective_date: item.effective_date ? new Date(item.effective_date) : null,
          }));
          return res;
        })
      );
  }

  // TODO: Define payload type
  uploadScrapeMatching(payload: any): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/scrape_matchings/upload/`;
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  deleteScrapeMatching(index_details_id: string, scrape_details_id: string, chain_index: number): Observable<null> {
    const url = `${environment.api}/indexes/${index_details_id}/delete_matching_scrape/`;
    const payload = {
      scrape_details_id,
      chain_index,
    };
    return this.http.delete<null>(url, { body: payload });
  }
}
