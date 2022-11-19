import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IndexFilter } from '../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.form';
import { IndexSort } from '../models/index.model';
import { HttpResponse, PaginationResponse } from '../models/common.model';
import { ComparisonChartsData, IndexCorrelationSummary } from '../models/index-correlation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndexCorrelationService {
  constructor(private http: HttpClient) {}

  getIndexesCorrelation(
    id: string,
    count: number,
    page: number,
    search: string,
    indexFilter: IndexFilter,
    indexSort: IndexSort
  ): Observable<HttpResponse<PaginationResponse<IndexCorrelationSummary>>> {
    const url = `${environment.api}/index-library/correlation-statistics/`;
    const order: any = {
      orders: [],
    };
    if (indexSort.field && indexSort.order_by) order.orders.push(indexSort);
    if (indexFilter.filters.length) {
      // FE uses id but BE uses index_details_id
      indexFilter.filters = indexFilter.filters.map((data) => {
        if (data.field === 'id') data.field = 'index_details_id';
        return data;
      });
    }
    const payload = {
      index_details_id: id,
      pagination: count,
      page_number: page + 1,
      search_term: search,
      index_filter: indexFilter,
      index_order: order,
    };
    return this.http.post<HttpResponse<PaginationResponse<IndexCorrelationSummary>>>(url, payload);
  }

  getComparisonChartData(indexId1: string, indexId2: string): Observable<HttpResponse<ComparisonChartsData>> {
    const url = `${environment.api}/index-library/comparison-chart-data/`;
    return this.http.post<HttpResponse<ComparisonChartsData>>(url, { indexId1, indexId2 });
  }
}
