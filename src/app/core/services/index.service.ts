import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

import { environment } from '../../../environments/environment';
import { HttpResponse, HttpSuccessResponse, PaginationResponse } from '../models/common.model';
import { Index, IndexProviderStatus, IndexUUID } from '../models/index.model';
import { sortObjectArray } from '../utils/array.util';
import { IndexFilter } from '../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.form';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  constructor(private http: HttpClient) {}

  indexSearch(
    count: number,
    page: number,
    search: string,
    indexFilter: IndexFilter
  ): Observable<HttpResponse<PaginationResponse<Index>>> {
    const url = `${environment.api}/indexes/bulk-details`;
    const body = {
      pagination: count,
      page_number: page,
      search_term: search,
      index_filter: indexFilter,
    };
    return this.http.post<HttpResponse<PaginationResponse<Index>>>(url, body).pipe(
      map((res) => {
        res.data.results = res.data.results.map((item) => ({
          ...item,
          product: item.product_id.name,
          index_provider: item.index_provider_id.name,
          index_provider_status: item.index_provider_id.status as IndexProviderStatus,
          icon: item.product_id.class_hierarchy_id.icon,
          image: item.image ? item.image : item.product_id.class_hierarchy_id.image,
          class: item.product_id.class_hierarchy_id.name,
          group: item.product_id.class_hierarchy_id.group_hierarchy_id.name,
          kingdom: item.product_id.class_hierarchy_id.group_hierarchy_id.kingdom_hierarchy_id.name,
          nation: item.nation_id.code,
          currency: item.currency_id.code,
          unit: item.unit_id.units,
          last_updated_by_name: item.last_updated_by ? item.last_updated_by.name : null,
          created_by_name: item.created_by ? item.created_by.name : null,
          proxy_index_id_name: item.proxy_index_id.map((obj) => {
            return obj.stable_index_code;
          }),
          last_updated_at: item.last_updated_at ? new Date(item.last_updated_at) : null,
          created_at: item.created_at ? new Date(item.created_at) : null,
        }));
        return res;
      })
    );
  }

  getIndex(id: string): Observable<Index> {
    const url = `${environment.api}/indexes/${id}/`;
    return this.http.get<Index>(url);
  }

  // TODO: Define payload type
  postIndex(payload: any): Observable<HttpSuccessResponse> {
    // IMPORTANT: When you send ID with this payload, this will edit that entry
    //   If ID is null, then this endpoint will create a new entry.
    const url = `${environment.api}/indexes/update-details/`;
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  getIndexUUIDs(): Observable<IndexUUID[]> {
    const url = `${environment.api}/indexes/uuids/`;
    return this.http.get<IndexUUID[]>(url).pipe(map((res) => sortObjectArray(res, 'stable_index_code')));
  }

  downloadIndexes(): any {
    const url = `${environment.api}/indexes/download/`;
    return this.http.post<string>(url, null).pipe(
      map((res) => new Blob([res], { type: 'text/csv' })),
      map((blob) => {
        saveAs(blob, 'Index_Details.csv');
      })
    );
  }

  downloadIndexData(id: string, name: string | null): any {
    const url = `${environment.api}/indexes/${id}/download/`;
    const file_name = name || `${id}.csv`;
    return this.http.post<string>(url, null).pipe(
      map((res) => new Blob([res], { type: 'text/csv' })),
      map((blob) => {
        saveAs(blob, file_name);
      })
    );
  }

  syncIndexPrice(id: string): Observable<any> {
    const url = `${environment.api}/indexes/${id}/sync_index_prices/`;
    return this.http.post<any>(url, null);
  }
}
