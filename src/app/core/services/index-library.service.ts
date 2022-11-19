import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HttpResponse, PaginationResponseV2 } from '../models/common.model';
import { FavoriteIndexes, IndexId, IndexPopular, IndexPrice, PeriodPopularIndex } from '../models/index.model';
import {
  HistoricalEWMAVol,
  IndexSeasonalityForecast,
  IndexStatistics,
  SarimaForecast,
  SeasonalStatistics,
  YearlySeasonality,
} from '../models/index-statistics.model';
import { EmpiricalModellingResults } from '../models/empirical-modelling.model';
import { HierarchySunburstChart } from '../models/hierarchy.model';
import { getDecimal, getPercentage } from '../utils/number.util';
import { getCurrencyAndUnit } from '../utils/index-detail.util';

@Injectable({
  providedIn: 'root',
})
export class IndexLibraryService {
  constructor(private http: HttpClient) {}

  getIndexPrices(indexId: string): Observable<IndexPrice[]> {
    const url = `${environment.api}/library/indexes/${indexId}/prices/`;
    return this.http.get<IndexPrice[]>(url);
  }

  getIndexStatistics(indexId: string): Observable<IndexStatistics> {
    const url = `${environment.api}/library/indexes/${indexId}/statistics/`;
    return this.http.get<IndexStatistics>(url);
  }

  getIndexSeasonalityForecasts(indexId: string): Observable<IndexSeasonalityForecast[]> {
    const url = `${environment.api}/library/indexes/${indexId}/seasonality_forecast/`;
    return this.http.get<IndexSeasonalityForecast[]>(url);
  }

  getSarimaForecasts(indexId: string): Observable<SarimaForecast[]> {
    const url = `${environment.api}/library/indexes/${indexId}/sarima_forecast/`;
    return this.http.get<SarimaForecast[]>(url);
  }

  getHistoricalEWMAVol(indexId: string): Observable<HistoricalEWMAVol[]> {
    const url = `${environment.api}/library/indexes/${indexId}/historical_ewma_volume/`;
    return this.http.get<HistoricalEWMAVol[]>(url);
  }

  seasonalStatistics(indexId: string): Observable<HttpResponse<SeasonalStatistics>> {
    const url = `${environment.api}/index-library/seasonal-statistics/`;
    const params = new HttpParams().append('index_details_id', indexId);
    return this.http.get<HttpResponse<SeasonalStatistics>>(url, { params });
  }

  yearlySeasonality(indexId: string): Observable<YearlySeasonality[]> {
    const url = `${environment.api}/library/indexes/${indexId}/seasonality_yearly/`;
    return this.http.get<YearlySeasonality[]>(url);
  }

  empiricalModelling(id: string, contract_config: any): Observable<HttpResponse<EmpiricalModellingResults>> {
    const url = `${environment.api}/index-library/empirical-modelling/`;
    const body = {
      index_details_id: id,
      contract_config: contract_config,
    };
    return this.http.post<HttpResponse<EmpiricalModellingResults>>(url, body);
  }

  getHierarchyData(): Observable<HierarchySunburstChart> {
    const url = `${environment.api}/library/sunburst_chart/`;

    return this.http.get<HierarchySunburstChart>(url);
  }

  postFavorite(indexId: string): Observable<null> {
    const url = `${environment.api}/indexes/${indexId}/toggle_favorite/`;
    return this.http.post<null>(url, {});
  }

  getFavoriteIndexes(
    count: number | null = null,
    page: number | null = null,
    search: string | null = null
  ): Observable<PaginationResponseV2<FavoriteIndexes>> {
    const url = `${environment.api}/user/favorite_indexes/`;
    let params = new HttpParams();
    if (count) params = params.append('page_size', count);
    if (page) params = params.append('page', page);
    if (search) params = params.append('search', search);
    return this.http.get<PaginationResponseV2<FavoriteIndexes>>(url, { params }).pipe(
      map((res) => {
        res.results = res.results.map((item) => ({
          ...item,
          product: item.product_id.name,
          index_provider: item.index_provider_id.name,
          last_index_price_units: `${getDecimal(item.last_index_price, 2)} ${getCurrencyAndUnit(item, false)}`,
          last_price_movement: `${item.last_price_change > 0 ? '+' : ''}${getDecimal(
            item.last_price_change,
            2
          )} (${getPercentage(item.last_price_percentage_change, 2, false)})`,
        }));
        return res;
      })
    );
  }

  postIndexActivity(payload: IndexId): Observable<null> {
    const url = `${environment.api}/indexes/${payload.index_detail_id}/activity_logs/`;
    return this.http.post<null>(url, payload);
  }

  getPopularIndexes(period: PeriodPopularIndex): Observable<IndexPopular[]> {
    const url = `${environment.api}/library/indexes/popular/`;
    let params = new HttpParams();
    if (period) {
      params = params.append('period', period);
    }
    return this.http.get<IndexPopular[]>(url, { params });
  }
}
