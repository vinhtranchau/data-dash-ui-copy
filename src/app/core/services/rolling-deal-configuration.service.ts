import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RollingDealConfiguration, RollingDealConfigurationData } from '../models/rolling-deal-configuration.model';
import { PaginationResponseV2 } from '../models/common.model';
import { ClientIndex } from '../models/trading-center.model';

@Injectable({
  providedIn: 'root',
})
export class RollingDealConfigurationService {
  constructor(private readonly http: HttpClient) {}

  getDefaultRollingDealConfiguration(): RollingDealConfiguration {
    return {
      minimum_call_strike_ratio: 100,
      maximum_put_strike_ratio: 100,
      minimum_spread_ratio: 1,
      maximum_spread_ratio: 100,
      maximum_delay: 6,
      maximum_duration: 9,
      minimum_fixations: 0,
      minimum_coverage_length: 9,
      maximum_contract_length: 12,
      last_available_expiration_length: 18,
      minimum_volume: 0,
      maximum_volume: 0,
      minimum_risk_capital_per_deal: 240000,
      maximum_risk_capital_per_deal: 360000,
      maximum_risk_capital_per_index: 15000000,
    };
  }

  getRollingDealIndexes(
    count: number,
    page: number,
    search: string
  ): Observable<PaginationResponseV2<RollingDealConfigurationData>> {
    const params = new HttpParams()
      .append('page', page)
      .append('page_size', count)
      .append('is_rolling_deal', true)
      .append('fields', 'rolling_deal_config,id,stable_index_code')
      .append('search', search);
    const url = `${environment.api}/trading_center/indexes/`;
    return this.http.get<PaginationResponseV2<ClientIndex>>(url, { params }).pipe(
      map((res) => {
        const results = res.results.map((x) => ({
          ...x.rolling_deal_config,
          index: { id: x.id, stable_index_code: x.stable_index_code } as any,
        }));
        return { ...res, results };
      })
    );
  }

  getRollingDealConfigurations(
    count: number,
    page: number,
    search: string
  ): Observable<PaginationResponseV2<RollingDealConfigurationData>> {
    const url = `${environment.api}/trading_center/rolling_deal_configuration/`;
    const params = new HttpParams().append('page', page).append('page_size', count).append('search', search);
    return this.http.get<PaginationResponseV2<RollingDealConfigurationData>>(url, { params });
  }

  createRollingDealConfiguration(id: string): Observable<RollingDealConfigurationData> {
    const url = `${environment.api}/trading_center/indexes/${id}/parameter_config/`;
    return this.http.post<RollingDealConfigurationData>(url, null);
  }

  updateRollingDealConfiguration(
    id: string,
    request: RollingDealConfiguration
  ): Observable<RollingDealConfigurationData> {
    const url = `${environment.api}/trading_center/rolling_deal_configuration/${id}/`;
    return this.http.patch<RollingDealConfigurationData>(url, request);
  }
}
