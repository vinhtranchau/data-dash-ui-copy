import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { HttpSuccessResponse, PaginationResponseV2 } from '../models/common.model';
import { environment } from '../../../environments/environment';
import { HierarchyType, PostHierarchy } from '../models/hierarchy.model';
import { TradeIndexType } from '../models/trading-center.model';

@Injectable({
  providedIn: 'root',
})
export class HierarchyService {
  constructor(private http: HttpClient) {}

  // NOTE: T can be ProductHierarchy, GroupHierarchy, ClassHierarchy or KingdomHierarchy
  getHierarchies<T>(
    hierarchyType: HierarchyType | undefined,
    count: number | null = null,
    page: number | null = null,
    search: string | null = null,
    filter_deals: TradeIndexType | null = null,
    ignore_null_indexes: boolean | null = null
  ): Observable<PaginationResponseV2<T>> {
    const url = `${environment.api}/hierarchy/${this.getCategory(hierarchyType)}/`;
    let params = new HttpParams();
    if (count) {
      params = params.append('page_size', count);
    }
    if (page) {
      params = params.append('page', page);
    }
    if (search) {
      params = params.append('search', search);
    }
    if (filter_deals) {
      switch (filter_deals) {
        case TradeIndexType.All:
          params = params.append('is_rolling_deal_or_in_hedging_book', true);
          break;
        case TradeIndexType.HedgingBook:
          params = params.append('in_hedging_book', true);
          break;
        case TradeIndexType.RollingDeal:
          params = params.append('is_rolling_deal', true);
          break;
        default:
          break;
      }
    }
    if (ignore_null_indexes) {
      params = params.append('ignore_null_indexes', ignore_null_indexes);
    }

    return this.http.get<PaginationResponseV2<T>>(url, { params }).pipe(
      map((res) => {
        if (!count && !page) {
          // When we are not sending any pagination parameter, it returns only array
          const data: any = res;
          return { count: 0, next: '', results: data, previous: '' };
        } else {
          return res;
        }
      })
    );
  }

  createHierarchy(payload: PostHierarchy): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/hierarchy/${this.getCategory(payload.hierarchy)}/`;
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  updateHierarchy(payload: PostHierarchy): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/hierarchy/${this.getCategory(payload.hierarchy)}/${payload.id}/`;
    return this.http.patch<HttpSuccessResponse>(url, payload);
  }

  private getCategory(type: HierarchyType | undefined): string {
    if (type === HierarchyType.Product) {
      return 'products';
    } else if (type === HierarchyType.Class) {
      return 'classes';
    } else if (type === HierarchyType.Group) {
      return 'groups';
    } else if (type === HierarchyType.Kingdom) {
      return 'kingdoms';
    } else {
      return 'all';
    }
  }
}
